import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ProjectDetailsScreen from '../screens/ProjectDetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import AuthWebView from '../screens/AuthWebView';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          title: 'Connexion',
          headerShown: false,
          headerStyle: {
            backgroundColor: '#000',
            height: 45,
          },
        }}
      />
      <Stack.Screen
        name="AuthWebView"
        component={AuthWebView}
        options={{
          title: 'Authentification',
          headerStyle: {
            backgroundColor: '#000',
            height: 45,
          },
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
    </Stack.Navigator>
  );
}
