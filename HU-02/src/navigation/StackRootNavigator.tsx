import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackRootParamsList } from './model/model';
import { LoginScreen } from '../screen/login';
import { Text } from 'react-native';
import { DrawerNavigator } from './DrawerNavigator';
import { SetUpBleScreen } from '../screen/ble';

const Stack = createNativeStackNavigator<StackRootParamsList>();
export function StackRootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Drawer"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen
        name="BleScreen"
        component={SetUpBleScreen}
        options={{ headerShown: true, title: 'Bluetooth' }}
      />
    </Stack.Navigator>
  );
}
