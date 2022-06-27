import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Keyboard, Image
} from 'react-native';
// import styles from './scanStyle';
import axios from 'axios';

const UserLogin = prop => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const verifyUser = async (user, paswd) => {
    setLoading(true);
    try {
      const configurationObject = {
        method: 'POST',
        url: `https://admin.aepplast.com/api/users/view`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: '9827b720-bbbf-1a95-51d7-b77434011970',
        },
        data: {username: user, password: paswd},
      };

      const response = await axios(configurationObject);

      Keyboard.dismiss();

      setLoading(false);

      // console.log(response.data.length);

      prop.navigation.navigate('Customer', {
        userId: response.data.id,
        username: response.data.username,
        name: response.data.name,
      });
    } catch (error) {
      // if (error.response.status === 403) {
      //   console.log(error.response.data);
      //   console.log(error.response.status);
      //   console.log(error.response.headers);
      //   alert('User not found');
      // }

      //console.log(error.response.data);

      setLoading(false);
      if(error.response.data !== undefined){
        alert(error.response.data.message);
      }else {
        alert(`Network error. Please check!!`);
      }
      
      // console.log(error.response.data);
      //alert('User not found');
      // alert(error.message);
    }
  };

  return (
    <View style={{flex:1, backgroundColor:"#ADD8E6"}}>
      <Text style={{alignSelf: 'center', marginTop: 50, 
        backgroundColor:"#ADD8E6", fontSize: 35, color:'#330066'}}>Veneshell</Text>
      <Text style={{alignSelf: 'center', fontSize: 12, color:'#330066'}}>BLENDING QUALITY</Text>
      <View style={userStyle.container}>
        <StatusBar backgroundColor="#ADD8E6" barStyle="light-content" />
        {/* <Image
          source={{
            uri: 'https://aepplast.sgp1.cdn.digitaloceanspaces.com/aep/logo/logo.png',
          }}
          style={{
            width: '100%',
            height: 50,
          }}
        /> */}
        <Text style={userStyle.welcome}>Login</Text>
        <TextInput
          style={userStyle.input}
          autoCapitalize="none"
          placeholder="Username"
          onChangeText={usr => setUserName(usr)}
          value={userName.toString()}
        />
        <TextInput
          style={userStyle.input}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={pas => setPassword(pas)}
          value={password.toString()}
          secureTextEntry
        />
        <View>
          <TouchableOpacity
            style={userStyle.userBtn}
            onPress={() => verifyUser(userName, password)}
            >
            <Text style={userStyle.btnTxt}>Login</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View
            style={{
              alignItems: 'center',
              marginTop: 10,
            }}>
            <ActivityIndicator size="large" color="grey" />
          </View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

const userStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#1e90ff',
    backgroundColor: '#ADD8E6',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 20,
    color: '#fff',
    fontFamily: 'DancingScript-Bold',
  },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  btnContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  userBtn: {
    backgroundColor: '#FFD700',
    padding: 14,
    width: '45%',
    borderRadius: 5,
    marginTop: 15,
    fontFamily: 'OpenSans-Regular',
  },
  btnTxt: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },
});

export default UserLogin;
