import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SetUpBleScreen} from '../screen/ble';
import {LoginScreen} from '../screen/login';
import {DrawerNavigator} from './DrawerNavigator';
import {StackRootList} from './model/model';

const Stack = createNativeStackNavigator<StackRootList>();
export function StackRootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen
        name="BleScreen"
        component={SetUpBleScreen}
        options={{headerShown: true, title: 'Bluetooth'}}
      />
    </Stack.Navigator>
  );
}
