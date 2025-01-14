import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Theme from '../../theme';
import {GetHookProps, onDeInit, onInit} from './controller';

export const ExampleScreen = () => {
  GetHookProps();
  useEffect(() => {
    onInit();
    return onDeInit;
  }, []);
  return (
    <View style={styles.container}>
      <Text>Example</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.backgroundColor,
  },
  title: {
    fontSize: 24,
    margin: 10,
    alignSelf: 'center',
  },
});
