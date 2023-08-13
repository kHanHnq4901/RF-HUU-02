import { createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SetUpBleScreen } from '../screen/ble';
import { SettingAndAlarmScreen } from '../screen/settingAndAlarm';
import { SignInScreen } from '../screen/signIn';
import { SignUpScreen } from '../screen/signUp';
import { DrawerNavigator } from './DrawerNavigator';
import { StackRootList } from './model/model';

export const navigationRef = createNavigationContainerRef<StackRootList>();

const Stack = createNativeStackNavigator<StackRootList>();
export function StackRootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen
        name="BleScreen"
        component={SetUpBleScreen}
        options={{ headerShown: true, title: 'Bluetooth' }}
      />
      <Stack.Screen
        name="Setting"
        component={SettingAndAlarmScreen}
        options={{ headerShown: true, title: 'Cài đặt địa chỉ host' }}
      />
    </Stack.Navigator>
  );
}
