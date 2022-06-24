// import React from 'react';
// import Scan from './src/screens/Scan';
// import Scan_1 from './src/screens/Scan_1';
// import ScanScreen from './src/screens/ScanScreen';
// // import {MessageBar} from 'react-native-messages';
// const App = () => {
//   return <Scan />;
//   // return <Scan_1 />;
//   // return <ScanScreen />;
// };

// export default App;

import * as React from 'react';
import {View, Text, Button, BackHandler} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Scan from './src/screens/Scan';
import Products from './src/screens/Products';
// import Print from './src/screens/Print';
import Customer from './src/screens/Customer';
// import GeoLocation from './src/screens/GeoLocation';
// import Summary from './src/screens/Summary';
import UserLogin from './src/screens/UserLogin';

// const Stack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="UserLogin"
        // screenOptions={{headerShown: false}}
      >
        <Stack.Screen
          name="UserLogin"
          component={UserLogin}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Customer"
          component={Customer}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Scan"
          component={Scan}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Products"
          component={Products}
          options={{
            headerShown: true,
          }}
        />
        {/* <Stack.Screen name="GeoLocation" component={GeoLocation} />
        <Stack.Screen name="Print" component={Print} />
        <Stack.Screen name="Summary" component={Summary} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
