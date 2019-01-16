/** @format */

import {AppRegistry} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import Second from "./sample";
import App from './App';

import {name as appName} from './app.json';

const AppNavigator = createStackNavigator(
  {
    Home: {
        screen: App
    },
    Second:{
        screen: Second
    }
  },
  {
    initialRouteName: "Home",
    headerMode: 'none',
    defaultNavigationOptions: {
        gesturesEnabled: false,
    },
  }
);

const mainApp = createAppContainer(AppNavigator);

AppRegistry.registerComponent(appName, () => mainApp);
