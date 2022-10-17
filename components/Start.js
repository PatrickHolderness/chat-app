import React, { Component } from 'react';
import { View,
         Text,
         Button,
         ImageBackground,
         StyleSheet,
         TextInput,
        //  Image,
     } from 'react-native';
     import { TouchableOpacity } from 'react-native-gesture-handler';
     import BackgroundImage from "../public/BackgroundImage.png";
    //  import UserIcon from "../public/UserIcon.png";
     
     export default class Start extends Component {
      constructor(props) {
          super(props);
          this.state = {
              name: '',
              color: '#090C08'
          };

          
      }
     // Update background color for chatscreen
     changecolor = (newColor) => {
     this.setState({ color: newColor });
      };


       render() {
        
        

         return (
           <View style={styles.container}>
             <ImageBackground
               source={BackgroundImage}
               style={styles.imageBackground}
             >
               
                 <Text style={styles.titleText}>Chat App</Text>
               
     
               <View style={styles.box1}>
                
                   
               {/* <Image style={styles.userIcon} source={UserIcon} /> */}
               <TextInput style={[styles.input, styles.colorText]}
                            placeholder='Your Name'
                            value={this.state.name}
                            onChangeText={(name) => this.setState({ name })} />
                        <View style={styles.colorWrapper}>
                            <Text style={[styles.colorText, styles.label]}>Select Background Color:</Text>
                            <View style={styles.colors}>
                                <TouchableOpacity style={[styles.color, styles.color1]} onPress={() => this.setState({ bgColor: '#090C08' })} 
                                    accessible={true}
                                    accessibilityLabel="color option: black (default)"
                                    accessibilityHint="choose this to be the background color of your chat screen"
                                    accessibilityRole="button" />
                                <TouchableOpacity style={[styles.color, styles.color2]} onPress={() => this.setState({ bgColor: '#474056' })}
                                    accessible={true}
                                    accessibilityLabel="color option: purple"
                                    accessibilityHint="choose this to be the background color of your chat screen"
                                    accessibilityRole="button" /> 
                                <TouchableOpacity style={[styles.color, styles.color3]} onPress={() => this.setState({ bgColor: '#8A95A5' })}
                                    accessible={true}
                                    accessibilityLabel="color option: blue"
                                    accessibilityHint="choose this to be the background color of your chat screen"
                                    accessibilityRole="button" /> 
                                <TouchableOpacity style={[styles.color, styles.color4]} onPress={() => this.setState({ bgColor: '#B9C6AE' })}
                                    accessible={true}
                                    accessibilityLabel="color option: green"
                                    accessibilityHint="choose this to be the background color of your chat screen"
                                    accessibilityRole="button" />
                            </View>
                        </View>
                        </View>
                        {/* <View style={styles.buttonWrapper}>
                            <TouchableOpacity 
                            style={styles.button}
                             onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}>
                                <Text style={styles.buttonText}>Start Chatting</Text>
                            </TouchableOpacity>
                            
                          </View> */}
                            
                            
                            
               
                 <View style={styles.buttonWrapper}>
                   <Button style={styles.button}
                     title="Start Chatting!"
                     color="#FFFFFF"
                     backgroundColor="rgba(117, 112, 131, .8)"
                     onPress={() =>
                       this.props.navigation.navigate("Chat", {
                         name: this.state.name,
                         bgColor: this.state.color,
                       })
                     }
                   />
                 </View>
                 </ImageBackground>
               </View>
             
           
         );
       }
     }
     
     const styles = StyleSheet.create({
      container: {
        flex: 1,
    },
    imageBackground: {
        flex: 1,
        resizeMode: 'fill',
        flexDirection: 'column',
        alignItems: 'center',
    },
    titleText: {
        flex: 1,
        padding: '20%',
        fontSize: 45,
        color: '#FFFFFF',
    },
    box1: {
        flex: 1,
        width: '77%',
        paddingTop: 6,
        alignItems: 'center',
    },
    input: {
        width: '88%',
        padding: 2,
        height: 50,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 2,
    },

    // userIcon: {
    //     position: "absolute",
    //     left: 20,
    // },

    colorWrapper: {
        width: '88%',
        height: '60%',
        justifyContent: 'center',
        marginLeft: 6,
    },
    label: {
        marginBottom: 8,
    },
    colors: {
        flexDirection: 'row',
        marginBottom: 1,
    },
    color: {
        borderRadius: '50%',
        width: 40,
        height: 40,
        marginRight: 30,
    },
    color1: {
        backgroundColor: '#090C08',
    },
    color2: {
        backgroundColor: '#474056',
    },
    color3: {
        backgroundColor: '#8A95A5',
    },
    color4: {
        backgroundColor: '#B9C6AE',
    },
    buttonWrapper: {
        width: '88%',
        flex: 1,
        justifyContent: 'end',
    },
    button: {
        height: '50%',
        width: '100%',
        backgroundColor: '#757083',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 600,
    },
    colorText: {
        fontSize: 16,
        fontWeight: 'normal',
        fontColor: '#757083',
    },
});
