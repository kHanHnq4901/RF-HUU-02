import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Theme from '../../theme';
import {GetHookProps, onDeInit, onInit} from './controller';

export const WriteOpticalScreen = () => {
  GetHookProps();
  useEffect(() => {
    onInit();
    return onDeInit;
  }, []);
  return (
    <View style={styles.container}>
      <Text>Example Write Optical</Text>
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
