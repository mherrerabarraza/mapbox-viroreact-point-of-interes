import React from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import _ from 'lodash';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import ArScreen from './screens/ArScreen';
const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Map: MapScreen,
    Ar: ArScreen,
  },
  {
    initialRouteName: 'Home',
  }
);
export const requestPermissions = async () => {
	if(Platform.OS === 'android') { 
			const cameraResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
			const gpsResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
			if(cameraResult === PermissionsAndroid.RESULTS.GRANTED && gpsResult === PermissionsAndroid.RESULTS.GRANTED){
				cameraResult === true;
				gpsResult === true;
			}
	}
	return true;
}

async function requestGpsPermission() {
	try {
	  const granted = await PermissionsAndroid.request(
		  
		  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
		  {
			title: 'GPS ACCESS',
			message:
				'Ask permission for GPS access',
			buttonNeutral: 'Ask Me Later',
			buttonNegative: 'Cancel',
			buttonPositive: 'OK',
		  },
	  );
	  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
		console.log('testAnything = ********* You can use the GPS *********');
	  } else {
		console.log('testAnything = GPS permission denied');
	  }
	} catch (err) {
	  console.warn(err);
	}
  }
  function onPress(){
	watchId = navigator.geolocation.watchPosition(
		(position) => console.log("testAnything =  POSICION  OBTENIDA ",position.coords.latitude,position.coords.longitude)),
		(err) => console.log("testAnything =  Errror obteniendo posicion GPS" + err);
	console.log("testAnything = watchID :  "+watchId);
}
const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  constructor (props) {
    super(props)
		//requestGpsPermission();
		//requestCameraPermission();
		requestPermissions();
		
  }
  render() {
    return <AppContainer />;
  }
}