import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Fonts, normalize } from '../../theme';

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
      {props.checked !== true && (
        <View
          style={{
            // position: 'absolute',
            // top: 0,
            // left: 0,
            backgroundColor: 'transparent',
            width: 20,
            height: 20,
            borderRadius: 30,
            marginRight: 5,
            borderWidth: 1,
            borderColor:
              props.checked === true ? Colors.purple : Colors.colorIcon,
            // marginLeft: -10,
          }}
        />
      )}
      {props.checked === true && (
        <Ionicons name="checkmark" size={25} color={theme.colors.primary} />
      )}

      {/* <RP_Paper
        value={props.value}
        color={theme.colors.primary}
        onPress={props.onPress}
        status={props.checked === true ? 'checked' : 'unchecked'}
      /> */}

      <Text style={styles.text}>{props.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    marginVertical: 3,
    height: 25,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlignVertical: 'center',
    fontFamily: Fonts,
    fontSize: normalize(17),
    color: Colors.text,
  },
});
