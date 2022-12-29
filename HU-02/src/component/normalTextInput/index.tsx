import React from 'react';
import {StyleSheet, View, Text, TextInput, TextInputProps} from 'react-native';
import {Colors, normalize} from '../../theme';
import {Divider} from 'react-native-paper';

type Props = {
  label: string;
  ref?: React.LegacyRef<TextInput>;
} & TextInputProps;

export const NormalTextInput = React.forwardRef<TextInput, Props>(
  (props, ref) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{props.label}</Text>
        <TextInput
          autoCorrect={false}
          underlineColorAndroid="transparent"
          style={styles.textInput}
          selectTextOnFocus={true}
          ref={ref}
          {...props}
        />
        <Divider />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  label: {
    fontSize: normalize(16),
    color: Colors.caption,
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: 'white',
    elevation: 1,
    //borderWidth: 1,
  },
});
