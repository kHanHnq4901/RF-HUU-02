import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {WriteDataByHandScreen} from '../screen/writeDataByHand';
import {StackWriteDataByStationCodeList as StackWriteDataByStationCodeList} from './model/model';
import {WriteStationCodeScreen} from '../screen/writeDataByStationCode';
import {SelectStationCodeScreen} from '../screen/selectStationCode';

const Stack = createNativeStackNavigator<StackWriteDataByStationCodeList>();
export function StackWriteStationCodeNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SelectStation"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="SelectStation" component={SelectStationCodeScreen} />
      <Stack.Screen name="WriteStation" component={WriteStationCodeScreen} />
      <Stack.Screen name="WriteByHand" component={WriteDataByHandScreen} />
    </Stack.Navigator>
  );
}
