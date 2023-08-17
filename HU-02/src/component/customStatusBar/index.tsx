import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

type Props = {
  backgroundColor?: string;
  barStyle?: 'dark-content' | 'light-content';
};

export function CustomStatusBar(props: Props) {
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: props.backgroundColor ?? 'white',
      }}>
      <StatusBar
        translucent
        barStyle={props.barStyle ?? 'dark-content'}
        backgroundColor={props.backgroundColor}
      />
    </View>
  );
}

export const STATUS_BAR_HEIGHT =
  (Platform.OS === 'android' ? StatusBar.currentHeight : 40) ?? 40;

console.log('STATUS_BAR_HEIGHT:' + Platform.OS + ': ', STATUS_BAR_HEIGHT);

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    height: STATUS_BAR_HEIGHT,
    backgroundColor: 'white',
  },
});
