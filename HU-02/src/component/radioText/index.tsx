import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { Colors, normalize, scale } from '../../theme';
import { CheckboxButton } from '../checkbox/checkbox';
import { NormalTextInput } from '../normalTextInput';

type Props = {
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
  containerStyle?: StyleProp<ViewStyle>;
} & TextInputProps;

export const RadioText = React.forwardRef<TextInput, Props>((props, ref) => {
  return (
    <View style={styles.container}>
      {/* <Text>{props.label}</Text> */}
      <CheckboxButton
        label={props.label}
        checked={props.checked}
        // styleLabel={styles.label}
        onPress={props.onCheckedChange}
      />

      <TextInput
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        textAlignVertical="center"
        underlineColorAndroid="transparent"
        style={styles.textInput}
        {...props}
        ref={ref}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: normalize(18),
    color: Colors.caption,
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: 'white',

    fontFamily: 'Lato-Regular',
    fontSize: normalize(18),
    padding: 10 * scale,
    color: Colors.text,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
