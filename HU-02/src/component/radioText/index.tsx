import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {Colors, normalize, scale} from '../../theme';
import {CheckboxButton} from '../checkbox/checkbox';

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
        styleLabel={styles.label}
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
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: normalize(18),
    color: Colors.caption,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.border,
    fontSize: normalize(18),
    fontFamily: 'Lato-Regular',
    paddingHorizontal: 10,
    elevation: 1,
    backgroundColor: 'white',
    color: Colors.text,
    height:40 * scale,
  },
});
