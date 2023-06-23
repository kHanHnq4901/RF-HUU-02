import React from 'react';
import {StyleSheet, View, Text, TextInput, TextInputProps} from 'react-native';
import {Colors, normalize, scale} from '../../theme';
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
          style={styles.textInput}
          selectTextOnFocus={true}
          underlineColorAndroid="transparent"
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
    marginBottom: 5,
  },
  label: {
    fontSize: normalize(16),
    color: Colors.caption,
    fontFamily: 'Lato-Regular',
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: 'white',
    elevation: 1,
    fontFamily: 'Lato-Regular',
    fontSize: normalize(18),
    padding: 10 * scale,
    color: Colors.text,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    //borderWidth: 1,
  },
});
