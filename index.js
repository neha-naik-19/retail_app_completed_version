/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {YellowBox, Logbox} from 'react-native';
import {LogBox} from 'react-native';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

// YellowBox.ignoreWarnings(['Warning: ...']);
// LogBox.ignoreLogs();
// console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
