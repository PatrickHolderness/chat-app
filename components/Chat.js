import React from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat, Bubble, SystemMessage, Day, Time, InputToolbar } from 'react-native-gifted-chat';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
// import { initializeApp } from 'firebase/app';

import MapView from 'react-native-maps';

import CustomActions from './CustomActions';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
    
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

      
    // Only display input toolbar if user online
    renderInputToolbar(props) {
        if (this.state.isConnected) {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }

     // Renders action button to send images and location
     renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };

    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }


    //add message to firestore on send
    onSend(messages = []) {
        // requires connection 
        const newMessage = messages[0]
        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: newMessage._id,
            text: newMessage.text || '',
            createdAt: newMessage.createdAt,
            user: newMessage.user,
            image: newMessage.image || null,
            location: newMessage.location || null,
            system: false,
        })
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text || '' ,
                createdAt: data.createdAt.toDate(),
                user: data.user,
                image: data.image || null,
                location: data.location || null,
                system: data.system,
            });
        });
        this.setState({
            messages,
        });

        // Sync  messages with asyncStorage (local)
        this.saveMessages();
    }

    // Saves userID in asyncStorage (local)
    async saveUser() {
        let uid = this.state.uid;

        try {
            await AsyncStorage.setItem('uid', uid);
        } catch (error) {
            console.log(error.message);
        }
    }

    // Fetches uid from asyncStorage (local)
    async getUser() {
        let user = '';
        try {
            user = await AsyncStorage.getItem('uid') || [];
            this.setState({
                uid: user
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    // Saves messages in asyncStorage (local)
    async saveMessages() {
        let messages = this.state.messages;

        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    // Fetches messages from asyncStorage (local)
    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    // deletes chat messages in asyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }


    // LIFECYCLE 

    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: '',
                name: '',
                avatar: '',
              },
            isConnected: false,
        }
    

    const firebaseConfig = {
        apiKey: 'AIzaSyD1OBLe5ChopSlfaGp4DuFpQWKHw41tryM',
        authDomain: 'chat-app-a40a8.firebaseapp.com',
        projectId: 'chat-app-a40a8',
        storageBucket: 'chat-app-a40a8.appspot.com',
        messagingSenderId: '804169844736',
        appId: '1:804169844736:web:8f8751c98ea604d8d230e5',
        measurementId: 'G-BPPPG8T2DM'
      };

      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    this.referenceChatMessages = firebase.firestore().collection('messages');
    }


    render() {
        let { bgColor } = this.props.route.params;
        let { uid } = this.state;
        return (
           
            <View style={[styles.container, { backgroundColor: bgColor }]}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    renderDay={this.renderDay.bind(this)}
                    renderTime={this.renderTime.bind(this)}
                    renderSystemMessage={this.renderSystemMessage.bind(this)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: uid,
                        name: this.state.user.name,
                    }}
                />
                {/*//ensures correct view on android*/}
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
            </View>

        );
    }

    componentDidMount() {
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });

        // load messages from asyncStorage
        this.getMessages();

        // check if online to sync with firestore and retrieve any new messages
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                this.setState({ isConnected: true });

                // Check anon auser auth through firebase
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                    if (!user) {
                        await firebase.auth().signInAnonymously();
                    }
                    // update user state with current user data
                    this.setState({
                        uid: user.uid,
                    });

                    // save userID to local storage
                    this.saveUser();

                    // get messages from firestore
                    this.referenceChatMessages = firebase.firestore().collection('messages');
                    this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
                });
            } else {
                // If offline, get userID from local storage
                this.getUser();
            }
        });
    }

    componentWillUnmount() {
        if (this.state.isConnected) {
            this.unsubscribe();
            this.authUnsubscribe();
        }
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