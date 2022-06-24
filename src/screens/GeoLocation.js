import React, {Component, useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  platform,
  image,
  Button,
  TouchableOpacity,
  SafeAreaView,
  Image,
  PermissionsAndroid,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Geocoder from 'react-native-geocoder';
import Geocoder1 from 'react-native-geocoding';

const GeoLocation = prop => {
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [locationStatus, setLocationStatus] = useState('');
  Geocoder.fallbackToGoogle('AIzaSyDl4WjiXse1SS-UWOiLcSrHfxdmwBZgURA');
  Geocoder1.init('AIzaSyDl4WjiXse1SS-UWOiLcSrHfxdmwBZgURA');

  prop.navigation.setOptions({
    headerShown: false,
  });

  // console.log('routeparams ::- ', prop.route.params);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
            // geoAddress();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestLocationPermission();

    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        //console.log(position);

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 0,
      },
    );
  };

  const navigateBack = async () => {
    if (currentLatitude > 0 && currentLongitude > 0) {
      var NY = {
        lat: parseFloat(currentLatitude),
        lng: parseFloat(currentLongitude),
      };

      const addr = await Geocoder.geocodePosition(NY);

      // const addr1 = Geocoder1.from({NY});

      prop.navigation.navigate('Print', {
        latitude: currentLatitude,
        longitude: currentLongitude,
        addr: addr[0],
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          zoomLevel={18}
          loadingEnabled
          scrollEnabled
          zoomEnabled
          pitchEnabled
          rotateEnabled
          region={{
            latitude: parseFloat(currentLatitude),
            longitude: parseFloat(currentLongitude),
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}>
          <Marker
            coordinate={{
              latitude: parseFloat(currentLatitude),
              longitude: parseFloat(currentLongitude),
            }}
            draggable
            tracksViewChanges={true}
            onDragEnd={e => {
              console.log('dragEnd', e.nativeEvent.coordinate);
            }}
            pinColor="#CD5C5C"
          />
        </MapView>
        <View style={styles.btnView}>
          <TouchableOpacity
            style={styles.touchableButton}
            onPress={navigateBack}>
            <Text style={{fontWeight: 'bold', fontSize: 15, color: '#191970'}}>
              Use current location
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.container, }> */}
        <View style={{display: 'none'}}>
          <Image
            source={{
              uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/location.png',
            }}
            style={{width: 100, height: 100}}
          />
          <Text style={styles.boldText}>{locationStatus}</Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Longitude: {currentLongitude}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Latitude: {currentLatitude}
          </Text>
          <View style={{marginTop: 20}}>
            <Button title="Button" onPress={getOneTimeLocation} />
          </View>
        </View>
        <View style={{display: 'none'}}>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              color: 'grey',
            }}>
            React Native Geolocation
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              color: 'grey',
            }}>
            www.aboutreact.com
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldText: {
    fontSize: 25,
    color: 'red',
    marginVertical: 16,
  },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 1.1,
  },
  btnView: {
    posiotion: 'absolute',
    elevation: 10,
  },
  touchableButton: {
    alignItems: 'center',
    backgroundColor: '#E0FFFF',
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#00008B',
  },
});

export default GeoLocation;

// let {width, height} = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE = 15.2941957;
// const LONGITUDE = 73.9690292;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = 0.0421;
// let addr = [];
// // const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// Geocoder.fallbackToGoogle('AIzaSyDl4WjiXse1SS-UWOiLcSrHfxdmwBZgURA');

// class GeoLocation extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {latitude: 0, longitude: 0, error: null};
//   }
//   //   state = {  }

//   componentDidMount() {
//     Geolocation.getCurrentPosition(
//       posiotion => {
//         this.setState({
//           latitude: posiotion.coords.latitude,
//           longitude: posiotion.coords.longitude,
//           error: null,
//         });
//       },
//       error => this.setState({error: error.message}),
//       {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000},
//       // {showLocationDialog: true, enableHighAccuracy: true},
//     );
//   }

//   handleRegionChange = () => {
//     Geolocation.getCurrentPosition(
//       posiotion => {
//         this.setState({
//           latitude: posiotion.coords.latitude,
//           longitude: posiotion.coords.longitude,
//           error: null,
//         });
//       },
//       error => this.setState({error: error.message}),
//       {timeout: 30000, maximumAge: 0, forceRequestLocation: true},
//       // {showLocationDialog: true, enableHighAccuracy: true},
//     );
//   };

//   geoAddress = async () => {
//     if (this.state.latitude > 0 && this.state.longitude > 0) {
//       var NY = {
//         lat: this.state.latitude,
//         lng: this.state.longitude,
//       };

//       addr = await Geocoder.geocodePosition(NY);
//       // console.log('address 1122: ', addr);
//     }
//   };

//   render() {
//     console.log('latitude : ', this.state.latitude);
//     console.log('longitude : ', this.state.longitude);
//     // console.log(this.props);

//     this.geoAddress();
//     console.log('addr 1122: ', addr);

//     return (
//       <View style={styles.container}>
//         <MapView
//           style={styles.map}
//           showsUserLocation={true}
//           followsUserLocation={true}
//           showsMyLocationButton={true}
//           initialRegion={{
//             latitude: this.state.latitude,
//             longitude: this.state.longitude,
//             latitudeDelta: 0.005,
//             longitudeDelta: 0.005,
//           }}
//           onRegionChangeComplete={this.handleRegionChange}>
//           {/* <Marker
//             coordinate={{
//               latitude: this.state.latitude,
//               longitude: this.state.longitude,
//             }}
//             draggable
//             tracksViewChanges={true}
//             onDragEnd={e => {
//               console.log('dragEnd', e.nativeEvent.coordinate);
//             }}
//             // onPress={() => console.log('test marker')}
//             pinColor="#CD5C5C"
//             // title={'title'}
//             // image={require('./japaneseFlag.png')}
//           /> */}
//         </MapView>
//         <View style={styles.btnView}>
//           <TouchableOpacity
//             style={styles.touchableButton}
//             onPress={() => {
//               this.props.navigation.navigate('Scan', {
//                 location: this.state,
//                 addr: addr,
//               });
//             }}>
//             <Text style={{fontWeight: 'bold', fontSize: 15, color: '#191970'}}>
//               Use current location
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   map: {
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height / 1.1,
//   },
//   btnView: {
//     posiotion: 'absolute',
//     elevation: 10,
//   },
//   touchableButton: {
//     alignItems: 'center',
//     backgroundColor: '#E0FFFF',
//     padding: 10,
//     borderWidth: 2,
//     borderRadius: 10,
//     borderColor: '#00008B',
//   },
// });

// export default GeoLocation;
