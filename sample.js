import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class SecondScreen extends Component <{}> {
    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.message}>Received : {this.props.navigation.getParam('pin','ERROR!')}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000"
    },
    message: {
        fontSize: 20,
        fontFamily: Platform.OS === "android" ? "monospace" : "American Typewriter",
        color: "white",
        textAlign: "center",
        margin: 30
    }
});