import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectColumnCodeScreen } from '../screen/selectColumnCode';
import { WriteColumnCodeScreen } from '../screen/writeDataByColumnCode';
import { WriteDataByHandScreen } from '../screen/writeDataByHand';
import { StackWriteDataByColumnCodeList } from './model/model';

const Stack = createNativeStackNavigator<StackWriteDataByColumnCodeList>();
export function StackWriteColumnCodeNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SelectColumn"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SelectColumn" component={SelectColumnCodeScreen} />
      <Stack.Screen name="WriteColumn" component={WriteColumnCodeScreen} />
      <Stack.Screen name="WriteByHand" component={WriteDataByHandScreen} />
    </Stack.Navigator>
  );
}
