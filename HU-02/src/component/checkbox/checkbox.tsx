import React from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import {Text} from '../Text';
import {Checkbox as CB_Paper, useTheme} from 'react-native-paper';
import {CommonFontSize} from '../../theme';
import {Colors} from '../../theme/index';

type Props = {
  checked: boolean;
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  styleLabel?: StyleProp<TextStyle>;
};

export const CheckboxButton = (props: Props) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{...styles.conatiner, ...props.style}}>
      <CB_Paper
        color={theme.colors.primary}
        onPress={props.onPress}
        status={props.checked === true ? 'checked' : 'unchecked'}
      />
      <Text style={{...styles.text, ...props.styleLabel}}>{props.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    marginVertical: 5,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlignVertical: 'center',
    fontSize: CommonFontSize,
    color: Colors.text,
  },
});
