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
} from 'react-native';
import {Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
// import Geolocation from '@react-native-community/geolocation';
import stylesMain from './scanStyle';
import axios from 'axios';

const Products = prop => {
  const [finalProducts, setFinalProducts] = useState([]);
  const [customerNumber, setCustomerNumber] = useState(0);
  const [verifyNUmber, setVerifyNumber] = useState(false);

  // if (prop.route.params !== undefined) {
  //   addr = 1;
  // }

  // console.log('prop ::', prop);
  // console.log('params-addr ::', prop.route.params);
  // console.log('customerData prop  ::- ', prop.route.params.customerData);

  useEffect(() => {
    setFinalProducts(prop.route.params.products);

    prop.navigation.setOptions({
      title: 'Product Details',
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
  }, []);

  let sum = 0;
  if (finalProducts !== undefined) {
    sum = finalProducts.reduce(function (prev, current) {
      return prev + +(current.price * current.qty);
    }, 0);
  }

  // let addr = '';
  // if (prop.route.params.addr !== undefined) {
  //   addr = prop.route.params.addr.formattedAddress;
  // }
  // console.log('test : ',addr)

  const deleteItem = id => {
    let prod = [...finalProducts];
    let index = prod.findIndex(c => c.id === id);
    if (index !== -1) {
      prod.splice(index, 1);
    }
    setFinalProducts(prod);
    prop.route.params.products = finalProducts;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          borderWidth: 1,
          borderColor: 'grey',
          flex: 0.9,
          marginBottom: 10,
          backgroundColor: '#FFF',
          borderRadius: 10,
          margin: 20,
        }}>
        <FlatList
          data={finalProducts}
          keyExtractor={(item, index) => item.prodId.toString()}
          // keyExtractor={(item, index) => index}
          // keyExtractor={item => console.log('key test : ', item.id)}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <View style={styles.insideViewProduct}>
                <Text style={styles.headerText}>Product</Text>
              </View>
              <View style={styles.insideView}>
                <Text style={styles.headerText}>Qty</Text>
              </View>
              <View style={styles.insideView}>
                <Text style={styles.headerText}>Price</Text>
              </View>
              <View style={styles.insideView}>
                <Text style={styles.headerText}></Text>
              </View>
            </View>
          )}
          stickyHeaderIndices={[0]}
          extraData={finalProducts}
          renderItem={({item, index}) => {
            return (
              <View style={styles.item}>
                <View style={styles.insideViewProduct}>
                  <Text style={styles.title}>{item.name}</Text>
                </View>
                <View style={styles.insideView}>
                  <Text style={styles.title}>{item.qty}</Text>
                </View>
                <View style={styles.insideView}>
                  <Text style={styles.title}>
                    {(Math.round(item.price * item.qty * 100) / 100).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.insideView}>
                  <TouchableOpacity
                    onPress={() => {
                      deleteItem(item.id);
                    }}>
                    <Icon
                      style={{color: 'blue'}}
                      name="trash-outline"
                      size={20}></Icon>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
        <View style={styles.footer}>
          <View style={styles.insideViewProduct}>
            <Text style={styles.footerText}>Total :</Text>
          </View>
          <View style={styles.insideView}>
            <Text style={styles.footerText}></Text>
          </View>
          <View style={styles.insideView}>
            <Text style={styles.footerText}>
              {(Math.round(sum * 100) / 100).toFixed(2)}
            </Text>
          </View>
          <View style={styles.insideView}>
            <Text style={styles.footerText}></Text>
          </View>
        </View>
      </View>
      {/* <View style={{flexDirection: 'row'}}>
        <View
          style={{
            // justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#D3D3D3',
            width: '20%',
            borderRadius: 10,
            padding: 5,
            backgroundColor: 'white',
            marginLeft: 20,
          }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
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
        </View>
        <View
          style={{
            width: '70%',
            marginLeft: 10,
          }}>
          <Text
            style={{
              // marginTop: 15,
              fontSize: 15,
              color: '#A0522D',
            }}>
            {addr}
          </Text>
        </View>
      </View> */}
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            ...styles.buttonProd,
            width: '40%',
            alignItems: 'center',
          }}
          onPress={() => {
            prop.navigation.push('Print', {
              userId: prop.route.params.userId,
              name: prop.route.params.name,
              username: prop.route.params.username,
              customerData: prop.route.params.customerData,
              finalProducts: finalProducts,
              productTotal: sum,
              screenName: 'product',
            });
          }}>
          <Text
            style={{
              ...styles.buttonTextStyle,
              color: 'white',
              marginLeft: 15,
            }}>
            Finalize Order
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#F5FFFA',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#8D918D',
    padding: 8,
    // marginVertical: 8,
    MarginBottom: 0,
    marginHorizontal: 16,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#C0C0C0',
    padding: 8,
    marginHorizontal: 16,
  },
  headerText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#E3F9A6',
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    // justifyContent: 'space-around',
  },
  title: {
    fontSize: 15,
    color: 'black',
  },
  insideViewProduct: {
    flex: 2,
  },
  insideView: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    height: 40,
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 12,
    // margin: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    // width: '50%',
    fontSize: 15,
  },
  buttonProd: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'gray',
    padding: 10,
    marginTop: 25,
    backgroundColor: '#3A3B3C',
  },
});

export default Products;
