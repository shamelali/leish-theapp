import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MUAProfileScreen from '../screens/MUAProfileScreen';
import BookingScreen from '../screens/BookingScreen';
import PaymentScreen from '../screens/PaymentScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#e91e63' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Stack.Screen 
          name=\"Home\" 
          component={HomeScreen}
          options={{ title: 'Leish MUA' }}
        />
        <Stack.Screen 
          name=\"MUAProfile\" 
          component={MUAProfileScreen}
          options={{ title: 'MUA Profile' }}
        />
        <Stack.Screen 
          name=\"Booking\" 
          component={BookingScreen}
          options={{ title: 'Book Appointment' }}
        />
        <Stack.Screen 
          name=\"Payment\" 
          component={PaymentScreen}
          options={{ title: 'Payment' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
