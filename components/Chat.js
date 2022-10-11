import React from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat, Bubble, SystemMessage, Day, Time, InputToolbar } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
    
    // custom methods

    onSend(messages = []) {
        // requires connection 
        const newMessage = messages[0]
        this.referenceChatMessages.add({
            _id: newMessage._id,
            text: newMessage.text,
            createdAt: newMessage.createdAt,
            user: newMessage.user,
            system: false,
        })
    }

    //chat bubble customisation
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#90EE90'
                    }
                }}
            />
        )
    }

    renderDay(props) {
        return <Day {...props} textStyle={{ color: 'black' }} />
    }

    renderTime(props) {
        return (
            <Time
                {...props}
                timeTextStyle={{
                    left: {
                        color: 'black',
                    },
                    right: {
                        color: 'white',
                    },
                }}
            />
        );
    };

    renderSystemMessage(props) {
        return (
            <SystemMessage {...props} textStyle={{ color: 'black' }} />
        )
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user,
                system: data.system,
            });
        });
        this.setState({
            messages,
        });

        // Sync  messages with asyncStorage (local)
        this.saveMessages();
    }


    // LIFECYCLE 

    constructor() {
        super();
        this.state = {
            messages: [],
            uid: '',
            isConnected: false,
        }
    

    const firebaseConfig = {
        apiKey: "AIzaSyD1OBLe5ChopSlfaGp4DuFpQWKHw41tryM",
        authDomain: "chat-app-a40a8.firebaseapp.com",
        projectId: "chat-app-a40a8",
        storageBucket: "chat-app-a40a8.appspot.com",
        messagingSenderId: "804169844736",
        appId: "1:804169844736:web:8f8751c98ea604d8d230e5",
        measurementId: "G-BPPPG8T2DM"
      };

      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    this.referenceChatMessages = firebase.firestore().collection('messages');
    }


    render() {
        const { color } = this.props.route.params;
        const { uid } = this.state;
        return (
           
            <View style={[styles.container, { backgroundColor: color }]}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    renderDay={this.renderDay.bind(this)}
                    renderTime={this.renderTime.bind(this)}
                    renderSystemMessage={this.renderSystemMessage.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: uid,
                    }}
                />

                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>

        );
    }

    componentDidMount() {
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });

//saving for reference
        //         this.setState({
//             messages: [
//                 {
//                     _id: 1,
//                     text: 'Hello developer',
//                     createdAt: new Date(),
//                     user: {
//                         _id: 2,
//                         name: 'React Native',
//                         avatar: 'https://placeimg.com/140/140/any',
//                     },
//                 },
//                 {
//                     _id: 2,
//                     text: 'This is a system message',
//                     createdAt: new Date(),
//                     system: true,
//                 },
//             ],
//         })
//     }
// }


// Check anon user auth through firebase
this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
        await firebase.auth().signInAnonymously();
    }

    //update user state with current user data
    this.setState({
        uid: user.uid,
    });

    this.referenceChatMessages = firebase.firestore().collection('messages');

            if (this.referenceChatMessages) {
                this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
            } else {
                this.setState({
                    messages: [
                        {
                            _id: 1,
                            text: `Unable to connect to chat`,
                            createdAt: new Date(),
                            system: true,
                        },
                    ]
                });
            }
        });


    }
    componentWillUnmount() {
        this.unsubscribe();
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
       
    },
    text: {
        color: '#FFFFFF',
    },
})