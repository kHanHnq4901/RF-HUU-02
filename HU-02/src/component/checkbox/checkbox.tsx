import React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Checkbox as CB_Paper, useTheme } from 'react-native-paper';
import { normalize } from '../../theme';
import { Colors } from '../../theme/index';
import { Text } from '../Text';

type Props = {
  checked: boolean;
  label?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  uncheckedColor?: string;
};

export const CheckboxButton = (props: Props) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{ ...styles.conatiner, ...props.style }}>
      {Platform.OS === 'ios' && props.checked !== true && (
        <View
          style={{
            position: 'absolute',
            // top: 0,
            left: 0,
            backgroundColor: 'transparent',
            width: 20,
            height: 20,
            borderRadius: 5,
            marginLeft: 12,
            borderWidth: 1,
            borderColor:
              props.checked === true
                ? Colors.purple
                : props.uncheckedColor ?? Colors.colorIcon,
            // marginLeft: -10,
          }}
        />
      )}
      <CB_Paper
        color={theme.colors.primary}
        onPress={props.onPress}
        status={props.checked === true ? 'checked' : 'unchecked'}
        uncheckedColor={props.uncheckedColor}
      />
      {props.label && <Text style={styles.text}>{props.label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    marginVertical: 2,
    //justifyContent: 'center',
    alignItems: 'center',
    // height: 35,
  },
  text: {
    textAlignVertical: 'center',
    fontSize: normalize(18),
    color: Colors.text,
  },
});
