import {View, Text, Button} from 'react-native';
import React, {Component, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './src/Screens/Login/Login';
import {Header} from 'react-native-elements';
import {screensEnabled, ScreenStackHeaderConfig} from 'react-native-screens';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
