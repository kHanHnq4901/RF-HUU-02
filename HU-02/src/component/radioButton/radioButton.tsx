import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { RadioButton as RP_Paper, useTheme } from 'react-native-paper';
import { Colors, CommonFontSize, Fonts, normalize } from '../../theme';

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
      {Platform.OS === 'ios' && props.checked !== true && (
        <View
          style={{
            position: 'absolute',
            // top: 0,
            left: 0,
            backgroundColor: 'transparent',
            width: 20,
            height: 20,
            borderRadius: 30,
            marginLeft: 5,
            borderWidth: 1,
            borderColor:
              props.checked === true ? Colors.purple : Colors.colorIcon,
            // marginLeft: -10,
          }}
        />
      )}
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
    marginVertical: 3,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlignVertical: 'center',
    fontFamily: Fonts,
    fontSize: normalize(17),
    color: Colors.text,
    marginLeft: Platform.OS === 'ios' ? -8 : 0,
  },
});
