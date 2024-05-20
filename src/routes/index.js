import { StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from '../screens/Signup';
import React from 'react';
import Home from '../screens/Home';
import BarcodeScanner from '../screens/BarcodeScanner';
import MyVoucher from '../screens/MyVoucer';
import MyCard from '../screens/MyCard';
import Profile from '../screens/Profile';

const Stack = createStackNavigator()


const Routes = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
            {/* <Stack.Screen name= 'Signup' component ={Signup} options={{ headerShown: false }}/> */}
            {/* <Stack.Screen name= 'Home' component ={Home} options={{ headerShown: false }}/> */}
            {/* <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} options={{ headerShown: false }}/> */}
            {/* <Stack.Screen name= 'MyVoucher' component ={MyVoucher} options={{ headerShown: false }}/> */}
            <Stack.Screen name= 'MyCard' component ={MyCard} options={{ headerShown: false }}/>
            {/* <Stack.Screen name= 'Profile' component ={Profile} options={{ headerShown: false }}/> */}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    marginTop: StatusBar.currentHeight,
  },
});

export default Routes;
