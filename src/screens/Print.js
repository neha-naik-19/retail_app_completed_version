import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import {
  USBPrinter,
  NetPrinter,
  BLEPrinter,
} from 'react-native-thermal-receipt-printer';
import CheckBox from '@react-native-community/checkbox';
import styles from './scanStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import moment from 'moment';

// interface IBLEPrinter {
//   device_name: string;
//   inner_mac_address: string;
//   device_image: string;
// }

const Print = prop => {
  const [printers, setPrinters] = useState([]);
  const [options, setOptions] = useState([]);
  const [currentPrinter, setCurrentPrinter] = useState();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [connect, setConnect] = useState(false);
  const [data, setData] = useState([]);

  // console.log('Print print ::- ', prop.route.params);
  // console.log('customerData print geo  ::- ', prop.route.params);
  // console.log('finalProducts ::- ', prop.route.params.finalProducts);

  useEffect(() => {
    prop.navigation.setOptions({
      title: 'Print',
      // headerLeft: () => <></>,
      gestureEnabled: false,
      // headerShadowVisible: false,
      headerTintColor: 'grey',
      headerStyle: {
        backgroundColor: '#F5FFFA',
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
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

    if (
      prop.route.params.screenName !== undefined &&
      prop.route.params.screenName === 'product'
    ) {
      setData(prop.route.params);
    }

    BLEPrinter.init().then(() => {
      BLEPrinter.getDeviceList().then(setPrinters);
    });
  }, []);

  const _connectPrinter = printer => {
    //connect printer
    setConnect(true);
    BLEPrinter.connectPrinter(printer).then(setCurrentPrinter, error =>
      //console.warn(error),
      {
        console.warn(error);
        if (error !== null) {
          setConnect(false);
          Alert.alert('Printer not availabe.');
        } else {
        }
      },
    );
  };

  let addr = '';
  if (prop.route.params.addr !== undefined) {
    addr = prop.route.params.addr.formattedAddress;
  }

  setTimeout(() => {
    setConnect(false);
  }, 1000);

  //console.log('connect :: ', connect);

  // printTextTest = () => {
  //   currentPrinter && BLEPrinter.printText('<C>sample text</C>\n');
  // };

  const test = 'Vedh';

  const printResult = async () => {
    try {
      let latitude = 0;
      let longitude = 0;

      if (prop.route.params.latitude !== undefined) {
        latitude = prop.route.params.latitude;
      }

      if (prop.route.params.longitude !== undefined) {
        longitude = prop.route.params.longitude;
      }

      //console.log(data.finalProducts);
      const prod = data.finalProducts.map(p => {
        return {
          product_id: p.id,
          product_name: p.name,
          quantity: p.qty,
          regular_price: p.price,
        };
      });

      const printObj = {
        // user: {id: prop.route.params.userId},
        // customer: {
        // id: prop.route.params.customerData[0].id,
        // name: prop.route.params.customerData[0].name,
        // mobile_number: prop.route.params.customerData[0].mobile_number,
        // email: prop.route.params.customerData[0].email_address,
        // address_line_1: prop.route.params.customerData[0].address_line_1,
        // address_line_2: prop.route.params.customerData[0].address_line_2,
        // city: prop.route.params.customerData[0].city,
        // state: prop.route.params.customerData[0].state,
        // postcode: prop.route.params.customerData[0].postcode,
        // gps_tag: `${prop.route.params.latitude}, ${prop.route.params.longitude}`,
        user: {id: data.userId},
        customer: {
          id: data.customerData[0].id,
          name: data.customerData[0].name,
          mobile_number: data.customerData[0].mobile_number,
          email: data.customerData[0].email_address,
          address_line_1: data.customerData[0].address_line_1,
          address_line_2: data.customerData[0].address_line_2,
          city: data.customerData[0].city,
          state: data.customerData[0].state,
          postcode: data.customerData[0].postcode,
          gps_tag: `${latitude}, ${longitude}`,
        },
        products: prod,
      };

      console.log('printObj :- ', printObj);

      // Print Text
      // Print Title
      // Print Unicode
      // Print Icon

      const configurationObject = {
        method: 'POST',
        // url: `https://admin.aepplast.com/api/orders/save`,
        url: `https://master.test.aepplast.com/api/orders/save`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: '9827b720-bbbf-1a95-51d7-b77434011970',
        },
        data: printObj,
      };

      const response = await axios(configurationObject);

      console.log('response :- ', response.data['receipt_print_text']);

      currentPrinter &&
        BLEPrinter.printText(response.data['receipt_print_text']);

      // currentPrinter &&
      //   BLEPrinter.printText(
      //     // `<C>sample text</C>\n<C>Thank You! ${test}</C>\n<C>pasdkashfkjsekwjqekldwalek</C>`,
      //     `test this print`,
      //   );

      // const currentDate =
      //   new Date().getDate() +
      //   '/' +
      //   (new Date().getMonth() + 1) +
      //   '/' +
      //   new Date().getFullYear();

      // var date = moment().utcOffset('+05:30').format('DD-MM-YYYY hh:mm:ss A');

      // let prodDetails = '';

      // for (let i in prod) {
      //   prodDetails =
      //     prodDetails +
      //     `${prod[i]['product_name'].substring(0, 10)}        ${
      //       prod[i]['quantity']
      //     }       ${prod[i]['regular_price']}\n`;
      // }

      // currentPrinter &&
      //   BLEPrinter.printBill(
      //     `<CB>BILLING</CB>\n\n<C>${date}</C>\n\nBill No : 1234\nCustomer :
      //     ${printObj.customer.id}/${printObj.customer.name}\n<C>--------------------------------</C>\n
      //     Product          Qty        Price\n<C>${prodDetails}</C>
      //     <C>----------------------</C><C>Total Amount :              ${data.productTotal}</C>`,
      //   );
    } catch (error) {
      console.log('Error : ', error.message, error.status);
    }
  };

  // printBillTest = () => {
  //   currentPrinter && BLEPrinter.printBill('<C>sample bill</C>');
  // };

  return (
    //console.log(printers)
    <View style={printStyle.container}>
      <View style={{flex: 1, margin: 25}}>
        <Text style={{fontSize: 15}}>Paired Devices</Text>
        <Text style={{marginBottom: 10}}>________________________________</Text>
        <View style={{height: '45%'}}>
          <FlatList
            style={{
              borderWidth: 1,
              padding: 10,
              borderColor: 'grey',
              borderRadius: 10,
              backgroundColor: '#FFF',
            }}
            data={printers}
            keyExtractor={(item, index) => item.device_name}
            renderItem={({item, index}) => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => _connectPrinter(item.inner_mac_address)}>
                    <Text style={printStyle.blueToothEntry}>
                      {item.device_name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
        {!connect ? (
          <Text style={printStyle.connect}></Text>
        ) : (
          <Text style={printStyle.connect}>Connecting....</Text>
        )}

        <View
          style={{
            marginTop: 25,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => prop.navigation.navigate('GeoLocation')}>
            <Image
              source={{
                uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/location.png',
              }}
              style={{
                width: 50,
                height: 50,
              }}
            />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                // marginTop: 15,
                fontSize: 15,
                color: '#A0522D',
              }}>
              {addr}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            ...styles.buttonProd,
            width: '40%',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 50,
          }}
          onPress={printResult}>
          <Text style={{...styles.buttonTextStyle, color: '#FFF'}}>Print</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const printStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FFFA',
  },
  blueToothEntry: {fontSize: 20, marginBottom: 15, color: 'black'},
  connect: {textAlign: 'center'},
});

export default Print;
