import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BackButton} from '../../component/backButton';
import {ButtonList} from '../../component/buttonList';
import FormButton from '../../component/formButton';
import {ModalTextInput} from '../../component/modalTextInput';
import {Colors} from '../../theme';
import {hook, UpdateHook} from './controller';
import {
  onbtnAllowSigninByFingerPress,
  onClearFingerPress,
  onModalCancelPress,
  onModalOkEnterPasswordPress,
} from './handle';

export function SettingUserScreen() {
  UpdateHook();
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <BackButton onPress={navigation.goBack} />
      <ModalTextInput
        label="Nhập lại mật khẩu"
        onOkPress={onModalOkEnterPasswordPress}
        onDissmiss={onModalCancelPress}
        secureTextEntry
        textAlign="center"
        show={hook.state.showModalEnterPass}
      />
      <ButtonList
        label="Cho phép đăng nhập bằng vân tay"
        icon="fingerprint"
        onPress={onbtnAllowSigninByFingerPress}
      />
      <ButtonList
        label="Xóa vân tay đăng nhập"
        icon="fingerprint-off"
        onPress={onClearFingerPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    justifyContent: 'center',
    flex: 1,
  },
  btn: {
    color: Colors.primary,
  },
});
