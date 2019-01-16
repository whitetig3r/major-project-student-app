import React, { Component } from 'react';
import Permissions from 'react-native-permissions';
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
        } else if (event.status === ChirpConnect.CHIRP_CONNECT_STATE_SENDING) {
          this.setState({ status: 'Sending' });
        } else if (event.status === ChirpConnect.CHIRP_CONNECT_STATE_RECEIVING) {
          this.setState({ status: 'Receiving Link...' });
        }
      }
    );

    this.onReceived = ChirpConnectEmitter.addListener(
      'onReceived',
      (event) => {
        console.log("EVENT");
        if (event.data.length) {
          console.log(event.data);
          this.setState({ data: event.data });
          this.props.navigation.navigate('Second', {pin:event.data});
          setTimeout((() => { this.setState({ data: '----------' }) }), 5000);
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

  onPress() {
    ChirpConnect.send([0, 1, 2, 3, 4]);
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
        <TouchableOpacity onPress={this.onPress} style={styles.button} disabled={!this.state.initialised}>
          <Text style={styles.buttonText}>SEND</Text>
        </TouchableOpacity>
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
  },
  button: {
    padding: 10,
    textAlign: "center",
    backgroundColor: "green"
  },
  buttonText: {
    letterSpacing: 2,
    color: "white",
    fontFamily: Platform.OS === "android" ? "monospace" : "American Typewriter"
  }
});


