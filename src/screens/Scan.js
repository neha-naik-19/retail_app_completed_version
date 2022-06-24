import React, {Fragment, useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  Linking,
  View,
  Image,
  ImageBackground,
  BackHandler,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styles from './scanStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const Scan = prop => {
  const [scan, setScan] = useState(false);
  const [scanResult, setScanResult] = useState(false);
  let [result, setResult] = useState([]);
  const [isProd, setIsProd] = useState(false);
  const [scanner, setScanner] = useState('');
  const [count, setCount] = useState(0);
  const [prodId, setProdId] = useState(1);
  const [hideBtn, setHideBtn] = useState(false);
  let [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dupVal, setDupVal] = useState(false);
  const [cancel, setCancel] = useState(false);
  let product = [];
  let product1 = [];
  let cnt = 0;
  let data = [...result];
  let objectData = [...products];
  let deleteItem = [];
  let addr = 0;
  let uniqueProducts = [];

  const navigation = useNavigation();
  // console.log('navigation  :: ', navigation);
  // console.log('prop :: ', prop);
  // console.log('customerData  :: ', prop.route.params.customerData);

  //if (prop.route.params !== undefined) {
  //  addr = 1;
  //}

  // console.log('prop :: ', prop.route.params);

  useEffect(() => {
    prop.navigation.setOptions({
      title: 'Scan QR Code',
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
  });

  const onSuccess = e => {
    const check = e.data.substring(0, 4);
    // console.log('scanned data' + check);
    // console.log('scanned data ' + e.data);
    // setResult(e);

    // addr = 0;
    fetchData(e.data);

    setScanResult(true);
    setScan(false);
    setLoading(true);

    if (check === 'http') {
      Linking.openURL(e.data).catch(err =>
        console.error('An error occured', err),
      );
    }
  };

  const fetchData = async productId => {
    try {
      // const configurationObject = {
      //   method: 'get',
      //   url: `https://admin.aepplast.com/api/products/view/${productId}.json`,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-api-key': 'A359fgdfgdfgdfgdfgdfcf7',
      //   },
      // };

      let duplicate = false;

      const configurationObject = {
        method: 'POST',
        url: `https://admin.aepplast.com/api/products/view`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: '9827b720-bbbf-1a95-51d7-b77434011970',
        },
        data: {id: productId},
      };

      const response = await axios(configurationObject);

      setLoading(false);

      for (const i in result) {
        // console.log(result[i].id, '   ', response.data.id);
        if (response.data.id === result[i].id) {
          // console.log('prod :: ', result[i].id);
          duplicate = true;
          break;
        }
      }

      // console.log('duplicate :: ', duplicate);

      if (!dupVal && !cancel) {
        if (data.length == 0) {
          data.push({
            brand: response.data.brand,
            id: response.data.id,
            name: response.data.name,
            price: response.data.regular_price,
            unit: response.data.unit_of_measurement,
            stock: response.data.stock_available,
          });
        } else {
          data.unshift({
            brand: response.data.brand,
            id: response.data.id,
            name: response.data.name,
            price: response.data.regular_price,
            unit: response.data.unit_of_measurement,
            stock: response.data.stock_available,
          });
        }

        // if (cancel) {
        //   data = data.shift();
        // }

        if (data.length > 0) {
          product = [...data];
        }

        setResult(product);

        if (!duplicate) {
          setHideBtn(true);
        } else {
          setHideBtn(false);
        }

        setDupVal(duplicate);
      }
    } catch (error) {
      // console.log('request error : ', error.request);
      // console.log('response error : ', error.response);
      console.log('Error : ', error.message, error.status);
      setLoading(false);
      Alert.alert('Invalid Scan.\nPlease check.');
    }
  };

  const addToList = () => {
    setProdId(prodId + 1);
    setCancel(false);

    //  if (addr === 0) {
    //   Alert.alert('Please add current location.');
    //  }

    if (count === 0) {
      Alert.alert("Quantity can't be zero.\nPlease check.");
    } else {
      // console.log(result);
      setHideBtn(false);

      if (objectData.length == 0) {
        objectData.push({
          prodId: prodId.toString(),
          id: result[0].id,
          name: result[0].name,
          unit: result[0].unit,
          stock: result[0].stock,
          price: result[0].price,
          qty: count,
        });
      } else {
        objectData.unshift({
          prodId: prodId.toString(),
          id: result[0].id,
          name: result[0].name,
          unit: result[0].unit,
          stock: result[0].stock,
          price: result[0].price,
          qty: count,
        });
      }

      product1 = [...objectData];
      setProducts([...product1]);

      // console.log('products :-> ', products);
    }
  };

  const cancelAdd = () => {
    console.log('result 1 : ', result);
    result.shift();
    console.log('result 2 : ', result);
    setHideBtn(false);
    setCancel(true);
  };

  const increamentQty = stock => {
    // console.log(count, stock);
    if (count + 1 <= stock) {
      setCount(count + 1);
    } else {
      Alert.alert('Stock limit exceeded.\nPlease check.');
    }
  };

  const decrementQty = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  // deleteItem = id => {
  //   let prod = products;
  //   let index = prod.findIndex(c => c.id === id);
  //   if (index !== -1) {
  //     prod.splice(index, 1);
  //   }
  //   objectData = prod;
  //   setProducts(prod);

  //   // console.log(id);
  //   console.log('products :: ', products);
  //   console.log('objectData :: ', objectData);
  // };

  const activeQR = () => {
    setScan(true);
    setIsProd(false);
  };

  const scanAgain = () => {
    setScan(true);
    setScanResult(false);
    setCount(0);
    setDupVal(false);
    setCancel(false); //comment
    setHideBtn(true);
  };

  function Message({message, hideMessage}) {
    if (message instanceof Error) {
      return <Text>Stock not available</Text>;
    } else {
      return <Text>ABC-1</Text>;
    }
  }

  return (
    <View style={styles.scrollViewStyle}>
      <Fragment>
        {/* <View style={styles.header}>
          <TouchableOpacity onPress={() => BackHandler.exitApp()}>
            <Icon name="arrow-back-outline" size={30}></Icon>
          </TouchableOpacity>
          <Text style={styles.textTitle}>Scan QR Code</Text>
        </View> */}
        {!scan && !scanResult && (
          <View style={styles.cardView}>
            <Text numberOfLines={8} style={styles.descText}>
              Please move your camera {'\n'} over the QR Code
            </Text>
            <Image
              source={require('../assets/qr-code.jpg')}
              style={{margin: 20}}></Image>
            <TouchableOpacity
              onPress={activeQR}
              style={[styles.buttonScan, {backgroundColor: '#000'}]}>
              <View style={styles.buttonWrapper}>
                <Icon
                  name="camera-outline"
                  style={{color: '#FFF'}}
                  size={30}></Icon>
                <Text
                  style={{
                    ...styles.buttonTextStyle,
                    color: '#FFF',
                    marginLeft: 15,
                  }}>
                  Scan QR Code
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {scanResult && (
          <Fragment>
            <View style={scanResult ? styles.scanCardView : styles.cardView}>
              {loading ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size="large" color="#0000ff" />
                  <Text style={styles.textfiled}>Please wait..</Text>
                </View>
              ) : (
                <View style={{flex: 1}}>
                  {result.length > 0 && !cancel && (
                    <View
                      style={{
                        flex: 7,
                      }}>
                      <View style={!dupVal ? styles.outerView : styles.hide}>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'space-evenly',
                            marginRight: 2,
                          }}>
                          <View
                            style={{
                              flex: 1,
                            }}>
                            <Text style={styles.dataLabel}>Product :</Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                            }}>
                            <Text style={styles.dataLabel}>Rate :</Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                            }}>
                            <Text style={styles.dataLabel}>Price :</Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                            }}>
                            <Text style={styles.dataLabel}>Quantity :</Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                            }}>
                            <Text style={styles.dataLabel}>Unit :</Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 2,
                            justifyContent: 'space-evenly',
                          }}>
                          <View
                            style={{
                              flex: 1,
                            }}>
                            <Text style={styles.dataText}>
                              {result[0].name}
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                            }}>
                            <Text style={styles.dataText}>{`Rs. ${(
                              Math.round(result[0].price * 100) / 100
                            ).toFixed(2)}`}</Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                            }}>
                            <Text style={styles.dataText}>{`Rs. ${(
                              Math.round(result[0].price * count * 100) / 100
                            ).toFixed(2)}`}</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              flex: 1,
                            }}>
                            <View
                              style={{
                                flex: 1,
                              }}>
                              <Text style={styles.dataText}>{count}</Text>
                            </View>
                            <View
                              style={{
                                flex: 4,
                              }}>
                              <View style={{flex: 1, flexDirection: 'row'}}>
                                <TouchableOpacity
                                  onPress={() => {
                                    increamentQty(result[0].stock);
                                  }}>
                                  <Icon
                                    name="add-circle"
                                    size={35}
                                    style={{color: 'green'}}></Icon>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={decrementQty}>
                                  <Icon
                                    name="remove-circle"
                                    size={35}
                                    style={{color: 'darkred'}}></Icon>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                          <View style={{flex: 1}}>
                            <Text style={styles.dataText}>
                              {result[0].unit}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={dupVal ? styles.outerView : styles.hide}>
                        <Text
                          style={{
                            fontSize: 20,
                            textAlign: 'center',
                            color: '#C70039',
                          }}>
                          Duplicate product entry.{'\n\n'}Please check.
                        </Text>
                      </View>
                      {/* <View style={cancel ? styles.outerView : styles.hide}>
                        <Text
                          style={{
                            fontSize: 20,
                            textAlign: 'center',
                            color: '#C70039',
                          }}>
                          Please scan again or continue.
                        </Text>
                      </View> */}
                    </View>
                  )}
                  <View style={cancel ? styles.outerView : styles.hide}>
                    <Text
                      style={{
                        fontSize: 20,
                        textAlign: 'center',
                        color: '#C70039',
                      }}>
                      Scan cancelled. {'\n'} Please scan again or continue.
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={addToList}
                        style={!hideBtn ? styles.hide : styles.buttonProd}>
                        <View style={styles.buttonWrapper}>
                          <Icon
                            name="cart"
                            size={30}
                            style={{color: '#FFF'}}></Icon>
                          <Text
                            style={{
                              ...styles.buttonTextStyle,
                              color: '#FFF',
                              marginLeft: 10,
                            }}>
                            Add
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={scanAgain}
                        style={hideBtn ? styles.hide : styles.buttonProd}>
                        <View style={styles.buttonWrapper}>
                          <Icon
                            name="camera-outline"
                            size={30}
                            style={{color: '#FFF'}}></Icon>
                          <Text
                            style={{
                              ...styles.buttonTextStyle,
                              color: '#FFF',
                              marginLeft: 15,
                            }}>
                            scan again
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={cancelAdd}
                        style={!hideBtn ? styles.hide : styles.buttonProd}>
                        <View style={styles.buttonWrapper}>
                          <Icon
                            name="archive-outline"
                            size={30}
                            style={{color: '#FFF'}}></Icon>
                          <Text
                            style={{
                              ...styles.buttonTextStyle,
                              color: '#FFF',
                              marginLeft: 10,
                            }}>
                            Cancel
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.push('Products', {
                            userId: prop.route.params.userId,
                            name: prop.route.params.name,
                            username: prop.route.params.username,
                            customerData: prop.route.params.customerData,
                            products: objectData,
                          });
                        }}
                        style={hideBtn ? styles.hide : styles.buttonProd}>
                        <View style={styles.buttonWrapper}>
                          <Text
                            style={{
                              ...styles.buttonTextStyle,
                              color: '#FFF',
                              marginLeft: 15,
                            }}>
                            Continue
                          </Text>
                          <Icon
                            name="chevron-forward"
                            size={30}
                            style={{
                              color: '#FFF',
                            }}></Icon>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </Fragment>
        )}
        {scan && (
          <QRCodeScanner
            reactivate={true}
            showMarker={true}
            // ref={node => {
            //   setScanner(node);
            // }}
            onRead={onSuccess}
            topContent={
              <Text style={styles.centerText}>
                Please move your camera {'\n'} over the QR Code
              </Text>
            }
          />
        )}
      </Fragment>
    </View>
  );
};

export default Scan;
