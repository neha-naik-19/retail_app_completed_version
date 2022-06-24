import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SelectedLayout,
  TextInput,
  Button,
  Alert,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import styles from './scanStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Reinput from 'reinput';

const Customer = prop => {
  let [customerNumber, setCustomerNumber] = useState('');
  const [verifyNUmber, setVerifyNumber] = useState(false);
  const [add, setAdd] = useState(true);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);

  const [custName, setCustName] = useState('');
  const [custContact, setCustContact] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custAdr1, setCustAdr1] = useState('');
  const [custAdr2, setCustAdr2] = useState('');
  const [custCity, setCustCity] = useState('');
  const [custState, setCustState] = useState('');
  const [custPinCode, setCustPinCode] = useState('');

  // console.log('prop :: ', prop);

  useEffect(() => {
    prop.navigation.setOptions({
      title: 'Customer Details',
      headerLeft: () => <></>,
      gestureEnabled: false,
      // headerShadowVisible: false,
      headerTintColor: 'grey',
      headerStyle: {
        backgroundColor: '#F5FFFA',
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            clearText();
            prop.navigation.push('UserLogin');
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{justifyContent: 'center'}}>
              <Text style={{marginRight: 5, color: '#2554C7'}}>
                {prop.route.params.name}
              </Text>
            </View>

            <Icon
              name="person-circle"
              size={30}
              style={{color: '#2554C7'}}></Icon>
          </View>
        </TouchableOpacity>
      ),
    });
  });

  const name = 'Name :';
  const contactno = 'Contact No. :';
  const phone = 'Phone :';
  const address = 'Address :';
  const pincode = 'Pin Code :';

  let customerObj = [];

  const verifyCustomer = async num => {
    setAdd(false);
    setLoading(true);

    try {
      if (customerNumber.length > 0) {
        const configurationObject = {
          method: 'POST',
          url: `https://admin.aepplast.com/api/customers/view`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            token: '9827b720-bbbf-1a95-51d7-b77434011970',
          },
          data: {'contact-number': customerNumber},
        };

        const response = await axios(configurationObject);

        setResult(response.data);
        setLoading(false);

        if (customerNumber === response.data.mobile_number) {
          setVerifyNumber(true);
        } else {
          setVerifyNumber(false);
        }
      } else {
        setVerifyNumber(false);
        setLoading(false);
        setResult([]);
        Alert.alert('Enter correct customer contact No.');
      }

      setAdd(false);
      Keyboard.dismiss();

      //console.log('loading :: ', loading);
    } catch (error) {
      setVerifyNumber(false);
      setLoading(false);
      setResult([]);
      console.log('Error : ', error.message);
    }
  };

  const clearText = () => {
    setCustomerNumber('');
    setAdd(true);
    setVerifyNumber(false);
  };

  const addText = () => {
    setVerifyNumber(false);
    setAdd(true);
    setResult([]);
    setCustomerNumber('');

    clearInput();
  };

  const clearInput = () => {
    //setCustomerNumber('');
    setCustName('');
    setCustContact('');
    setCustEmail('');
    setCustAdr1('');
    setCustAdr2('');
    setCustCity('');
    setCustState('');
    setCustPinCode('');
  };

  const moveToScan = () => {
    if (add) {
      if (
        custName === '' ||
        custContact === '' ||
        custAdr1 === '' ||
        custAdr2 === ''
      ) {
        Alert.alert('Please enter required customer details.');
        return;
      } else {
        customerObj = [
          {
            address_line_1: custAdr1,
            address_line_2: custAdr2,
            city: custCity,
            country: '',
            email_address: custEmail,
            id: null,
            land_line_number: '',
            mobile_number: custContact,
            name: custName,
            postcode: custPinCode,
            state: custState,
          },
        ];
      }
    } else {
      // console.log('result :- ', result, result.length);
      if (result !== []) {
        customerObj = [{...result}];
      } else {
        Alert.alert('Please enter required customer details.');
        return;
      }
    }

    prop.navigation.navigate('Scan', {
      userId: prop.route.params.userId,
      name: prop.route.params.name,
      username: prop.route.params.username,
      customerData: customerObj,
    });
    clearText();
  };

  return (
    <View style={styles.viewStyle}>
      <StatusBar backgroundColor="#ADD8E6" barStyle="light-content" />
      <View style={{margin: 10, flex: 1}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: '80%'}}>
            <TextInput
              style={styleCustomer.input}
              onChangeText={num => setCustomerNumber(num)}
              value={customerNumber.toString()}
              placeholder="Customer Contact No."
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <TouchableOpacity style={{marginTop: 11}} onPress={clearText}>
              <View>
                <Icon name="close-circle" size={35}></Icon>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styleCustomer.btnView}>
          <View style={{width: '50%'}}>
            <TouchableOpacity
              style={styleCustomer.buttonCust}
              onPress={verifyCustomer}>
              <Text
                style={{
                  ...styles.buttonTextStyle,
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 15,
                }}>
                Verify
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '15%',
              marginLeft: 10,
            }}>
            <TouchableOpacity
              style={{
                width: '100%',
                height: 45,
                borderWidth: 1,
                borderRadius: 5,
                alignItems: 'center',
                backgroundColor: '#E5E4E2',
              }}
              onPress={addText}>
              <View>
                <Icon
                  name="person-add"
                  style={{color: 'green', fontWeight: 'bold'}}
                  size={35}></Icon>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '10%',
              marginLeft: 10,
            }}>
            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={clearInput}>
              <View>
                <Icon name="close-circle" size={35}></Icon>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {!add ? (
          <View style={{flex: 3}}>
            {loading ? (
              <View style={styleCustomer.custView}>
                <ActivityIndicator size="large" color="#454545" />
                <Text style={styles.textfiled}>Please wait..</Text>
              </View>
            ) : (
              <View>
                <View
                  style={verifyNUmber ? styleCustomer.custView : styles.hide}>
                  <ScrollView showsHorizontalScrollIndicator={false}>
                    <View style={styleCustomer.textBottomBorder}>
                      <Text style={styleCustomer.dataLabel}>{name}</Text>
                      <Text style={styleCustomer.dataText}>{result.name}</Text>
                    </View>
                    <View style={styleCustomer.textBottomBorder}>
                      <Text style={styleCustomer.dataLabel}>{contactno}</Text>
                      <Text style={styleCustomer.dataText}>
                        {result.mobile_number}
                      </Text>
                    </View>
                    <View style={styleCustomer.textBottomBorder}>
                      <Text style={styleCustomer.dataLabel}>{address}</Text>
                      <Text style={styleCustomer.dataText}>
                        {result.address_line_1 !== undefined
                          ? `${result.address_line_1} \n ${result.address_line_2} \n ${result.city} , ${result.state} \n ${result.country}`
                          : ''}
                      </Text>
                    </View>
                    <View style={styleCustomer.textBottomBorder}>
                      <Text style={styleCustomer.dataLabel}>{pincode}</Text>
                      <Text style={styleCustomer.dataText}>
                        {result.postcode === undefined
                          ? `-`
                          : result.postcode.length > 0
                          ? result.postcode.length
                          : `-`}
                      </Text>
                    </View>
                  </ScrollView>
                </View>
                <View
                  style={
                    !verifyNUmber
                      ? styleCustomer.custViewNotVerify
                      : styles.hide
                  }>
                  <Text style={{fontSize: 20}}>
                    Enter correct customer contact No.
                  </Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={{margin: 10, height: '70%'}}>
            <ScrollView>
              <View style={{width: '90%'}}>
                <Reinput
                  label="Name"
                  onChangeText={nam => setCustName(nam)}
                  value={custName.toString()}
                />
                <Reinput
                  label="Contact No."
                  onChangeText={con => setCustContact(con)}
                  value={custContact.toString()}
                />
                <Reinput
                  label="Email"
                  onChangeText={email => setCustEmail(email)}
                  value={custEmail.toString()}
                />
                <Reinput
                  label="Address 1"
                  onChangeText={addr1 => setCustAdr1(addr1)}
                  value={custAdr1.toString()}
                />
                <Reinput
                  label="Address 2"
                  onChangeText={addr2 => setCustAdr2(addr2)}
                  value={custAdr2.toString()}
                />
                <Reinput
                  label="City"
                  onChangeText={city => setCustCity(city)}
                  value={custCity.toString()}
                />
                <Reinput
                  label="State"
                  onChangeText={state => setCustState(state)}
                  value={custState.toString()}
                />
                <Reinput
                  label="Pin Code"
                  onChangeText={pin => setCustPinCode(pin)}
                  value={custPinCode.toString()}
                />
              </View>
            </ScrollView>
          </View>
        )}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            style={{
              ...styleCustomer.buttonCust,
              width: '50%',
              alignItems: 'center',
            }}
            onPress={moveToScan}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{justifyContent: 'center', marginRight: 10}}>
                <Text
                  style={{
                    ...styles.buttonTextStyle,
                    color: 'white',
                    marginLeft: 15,
                  }}>
                  continue
                </Text>
              </View>
              <Icon
                name="arrow-forward-outline"
                size={30}
                style={{color: 'white'}}></Icon>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styleCustomer = StyleSheet.create({
  input: {
    height: 40,
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    fontSize: 19,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  custInput: {
    height: 40,
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 12,
    borderBottom: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    fontSize: 19,
    textAlign: 'center',
  },
  buttonCust: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'gray',
    padding: 10,
    // marginTop: 25,
    backgroundColor: '#3A3B3C',
  },
  btnView: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 15,
    // borderWidth: 2,
    // borderColor: 'green'
  },
  dataLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 5,
    color: '#154360',
  },
  dataText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 1,
    marginBottom: 2,
  },
  custScrollView: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  textBottomBorder: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
    marginBottom: 30,
  },
  custViewNotVerify: {
    margin: 10,
    height: '70%',
    width: '90%',
    alignItems: 'center',
    paddingTop: 100,
  },
  custView: {
    marginTop: 55,
    marginLeft: 10,
    marginRight: 10,
    height: '95%',
    width: '90%',
  },
});

export default Customer;
