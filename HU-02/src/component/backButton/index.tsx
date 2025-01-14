import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, scale } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  onPress?: () => void;
};

export function BackButton(props: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Ionicons name="chevron-back" size={35} color={Colors.secondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 5,
    left: 15,
    height: 45 * scale,
    width: 40 * scale,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
});
