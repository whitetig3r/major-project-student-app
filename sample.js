import React, { Component } from 'react';
import {
    TouchableOpacity,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    NativeEventEmitter,
    NativeModules
} from 'react-native';

export default class SecondScreen extends Component <{}> {
    render(){
        return(
            <View>
                <Text>{this.props.navigation.getParam('pin','ERROR!')}</Text>
            </View>
        )
    }
}