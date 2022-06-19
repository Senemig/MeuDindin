import {View, Text, Button} from 'react-native';
import React, {Component, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './src/Screens/Login/Login';
import Home from './src/Screens/Home/Home';
import Conta from './src/Screens/Conta';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          options={{headerShown: false}}
          component={Login}
        />
        <Stack.Screen
          name="Home"
          options={{headerShown: false}}
          component={Home}
        />
        <Stack.Screen
          name="Conta"
          options={{headerShown: false}}
          component={Conta}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
