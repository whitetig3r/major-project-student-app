import React, { Component } from '../../../Library/Caches/typescript/2.9/node_modules/@types/react';
import Permissions from 'react-native-permissions';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  NativeEventEmitter,
  NativeModules
} from 'react-native';
import firebase from "react-native-firebase";

const ChirpConnect = NativeModules.ChirpConnect;
const ChirpConnectEmitter = new NativeEventEmitter(ChirpConnect);

const key = 'FA3baAfbDBc9E2E9a8A352536';
const secret = 'F90A1CEA4aEa6edc6cDAFE2FE0Dc2ffF94d4aB9B4bC0Dad338';

export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      'initialised': false,
      'status': 'Sleeping',
      'data': '----------'
    }
  }

  validatePIN( receivedPIN ){
    return true;
  }

  async FBMarkAttendance ( ID ) {
    const ref = firebase
      .firestore()
      .collection("courses")
      .doc(ID[1]);

    firebase
      .firestore()
      .runTransaction(async transaction => {
        const doc = await transaction.get(ref);

      
        const studentIndex = doc.data().students.reduce( (reqIndex, student, currIndex, list) => {
            if(student.register === ID[0]){
              return reqIndex + currIndex;
            }
            return reqIndex+0;
        },0)

        const dateObjParam = new Date();

        const dayIndex = Math.floor(((new Date(dateObjParam.getFullYear(), dateObjParam.getMonth(), dateObjParam.getDate()).getTime() - new Date(2019, 0, 29).getTime()) / (24 * 60 * 60 * 1000)));

        const modifiedStudentList = doc.data().students.map( (student, index) => {
            if(index === studentIndex){
                const newStudent = student;
                newStudent.present[dayIndex] = true;
                return newStudent;
            }
            return student
        })

        transaction.update(ref, {
            ...doc.data(),
            students: modifiedStudentList
        });

        return modifiedStudentList;
      })
      .then(modifiedStudentList => {
        console.log(
          `Transaction successfully committed.`
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  async componentDidMount() {
    const response = await Permissions.check('microphone')
    if (response !== 'authorized') {
      await Permissions.request('microphone')
    }

    this.onStateChanged = ChirpConnectEmitter.addListener(
      'onStateChanged',
      (event) => {
        if (event.status === ChirpConnect.CHIRP_CONNECT_STATE_STOPPED) {
          this.setState({ status: 'Stopped' });
        } else if (event.status === ChirpConnect.CHIRP_CONNECT_STATE_PAUSED) {
          this.setState({ status: 'Paused' });
        } else if (event.status === ChirpConnect.CHIRP_CONNECT_STATE_RUNNING) {
          this.setState({ status: 'Waiting for Link...' });
        } else if (event.status === ChirpConnect.CHIRP_CONNECT_STATE_RECEIVING) {
          this.setState({ status: 'Receiving Link...' });
        }
      }
    );

    this.onReceived = ChirpConnectEmitter.addListener(
      'onReceived',
      async (event) => {
        if (event.data.length) {
          if(this.validatePIN(event.data)){
            const ID = ['RA1511008010136','IT303J_A']; // will get this from ID[0] from student and ID[1] from teacher
            await this.FBMarkAttendance(ID);
            this.props.navigation.navigate('Second');
          }
          else {
            this.setState({
              ...this.state,
              data:'ERROR: Invalid PIN'
            });
            setTimeout(() => {
              this.setState({
                ...this.state,
                data:'Retrying...'
              })
            }, 5000);
          }
        }
      }
    )

    this.onError = ChirpConnectEmitter.addListener(
      'onError', (event) => { console.warn(event.message) }
    )

    try {
      ChirpConnect.init(key, secret);
      await ChirpConnect.setConfigFromNetwork();
      ChirpConnect.start();
      this.setState({ initialised: true })
    } catch (e) {
      console.warn(e.message);
    }
  }

  componentWillUnmount() {
    this.onStateChanged.remove();
    this.onReceived.remove();
    this.onError.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Sound Shinobi
        </Text>
        <Text style={styles.instructions}>
          {this.state.status}
        </Text>
        <Text style={styles.instructions}>
          {this.state.data}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  },
  welcome: {
    fontSize: 20,
    fontFamily: Platform.OS === "android" ? "monospace" : "American Typewriter",
    color: "white",
    textAlign: "center",
    margin: 30
  },
  instructions: {
    padding: 10,
    textAlign: "center",
    color: "white",
    marginBottom: 5
  }
});


