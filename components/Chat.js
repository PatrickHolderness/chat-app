import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, Button } from 'react-native';

export default class Chat extends Component {
  componentDidMount() {

    //Username defined
    let name = this.props.route.params.name
    this.props.navigation.setOptions({ title: name });
  }
    
    render()

    // Sets selected background color from start page
    { const { color } = this.props.route.params;

    return (
      <ScrollView style ={{ backgroundColor: color }}>
        <View style={styles.container}>
          <Text style={styles.text}>Chat</Text>
          <Button title ="Return to start screen"
          onPress={() => this.props.navigation.navigate("Start")}
          />
          </View>
          </ScrollView>
        );
      }
    }

    const styles = StyleSheet.create({
      container: {
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
      },
      text: {
        fontSize: 30,
          color: '#FFFFFF',
      },
  })