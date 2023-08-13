import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { LogReadOpticalScreenScreen } from '../screen/logReadOptical';
import { ReadOpticalScreen } from '../screen/readOptical/index';
import { StackReadOpticalList } from './model/model';

const Stack = createNativeStackNavigator<StackReadOpticalList>();
export function StackReadOptical() {
  return (
    <Stack.Navigator
      initialRouteName="ReadOptical"
      screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="ReadOptical" component={ReadOpticalScreen} />
      <Stack.Screen
        name="LogReadOptical"
        options={{
          title: 'Log',
        }}
        component={LogReadOpticalScreenScreen}
      />
    </Stack.Navigator>
  );
}
