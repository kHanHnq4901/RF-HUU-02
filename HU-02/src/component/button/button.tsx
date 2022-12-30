import React from 'react';
import {
  Omit,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StyleProp,
  TextStyle,
} from 'react-native';
import {Button as Btn, useTheme} from 'react-native-paper';
import Theme, {Fonts, normalize, scale} from '../../theme';

type Props = {
  label: string;
  onPress: () => void;
  labelStyle?: StyleProp<TextStyle>;
} & Omit<React.ComponentProps<typeof Btn>, 'children'>;

export const Button = (props: Props) => {
  //const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        ...styles.container,
        ...styles.button,
        ...props.style,
      }}>
      {/* <Btn
        labelStyle={styles.label}
        {...props}
        style={{ ...styles.button, ...props.style }}
        mode="contained">
        {props.label}
      </Btn> */}
      <Text style={{...styles.label, ...props.labelStyle}}>{props.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    marginHorizontal: 15,
  },
  button: {
    backgroundColor: Theme.Colors.primary,
    borderRadius: 35,
    elevation: 10,
    height: 40 * scale,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
    fontSize: normalize(18),
    textAlignVertical: 'center',
    fontFamily: Fonts,
    color: 'white',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});
