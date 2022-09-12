import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { RadioButton as RP_Paper, useTheme } from 'react-native-paper';
import { Colors, CommonFontSize, Fonts } from '../../theme';

type Props = {
  checked: boolean;
  label: string;
  value: string;
  onPress: () => void;
};

export const RadioButton = (props: Props) => {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.conatiner}>
      <RP_Paper
        value={props.value}
        color={theme.colors.primary}
        onPress={props.onPress}
        status={props.checked === true ? 'checked' : 'unchecked'}
      />
      <Text style={styles.text}>{props.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlignVertical: 'center',
    fontFamily: Fonts,
    fontSize: CommonFontSize,
    color: Colors.text,
  },
});
