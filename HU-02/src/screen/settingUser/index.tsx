import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BackButton } from '../../component/backButton';
import { ButtonList } from '../../component/buttonList';
import FormButton from '../../component/formButton';
import { ModalTextInput } from '../../component/modalTextInput';
import { Colors, normalize, scale } from '../../theme';
import { hook, store, UpdateHook } from './controller';
import { IconFaceID } from '../../component/faceID/index';
import {
  onbtnAllowSigninByFingerPress,
  onClearAccountPress,
  onClearFingerPress,
  onModalCancelPress,
  onModalOkEnterPasswordPress,
  onModalOkPress,
} from './handle';
import { Button } from '../../component/button/button';

export function SettingUserScreen() {
  UpdateHook();
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <BackButton onPress={navigation.goBack} />
      <ModalTextInput
        label="Nhập lại mật khẩu"
        onOkPress={onModalOkPress}
        onDissmiss={onModalCancelPress}
        secureTextEntry
        textAlign="center"
        show={hook.state.showModalEnterPass}
      />
      {store.state.typeTouchID === 'FaceID' ? (
        <>
          {store.state.isCredential !== true ? (
            <ButtonList
              label="Cho phép đăng nhập bằng Face ID"
              icon="fingerprint"
              leftChildren={<IconFaceID size={30} color={Colors.secondary} />}
              onPress={onbtnAllowSigninByFingerPress}
            />
          ) : (
            <ButtonList
              label="Xóa đăng nhập bằng Face ID"
              icon="fingerprint-off"
              leftChildren={<IconFaceID size={30} color={Colors.secondary} />}
              onPress={onClearFingerPress}
            />
          )}
        </>
      ) : (
        <>
          {store.state.isCredential !== true ? (
            <ButtonList
              label="Cho phép đăng nhập bằng vân tay"
              icon="fingerprint"
              onPress={onbtnAllowSigninByFingerPress}
            />
          ) : (
            <ButtonList
              label="Xóa đăng nhập bằng vân tay"
              icon="fingerprint-off"
              onPress={onClearFingerPress}
            />
          )}
        </>
      )}
      <Button
        textStyle={styles.textUpdateMeterVersion}
        style={styles.btnClearAllData}
        label="Xoá tài khoản"
        onPress={onClearAccountPress}
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
  btnClearAllData: {
    marginVertical: 15,
    backgroundColor: '#f3d20d',
    maxWidth: 200 * scale,
    height: 25 * scale,
    alignSelf: 'flex-end',
    //justifyContent:borderWidth: 1,
  },
  textUpdateMeterVersion: {
    color: 'black',
    fontWeight: 'normal',
    fontSize: normalize(14),
  },
});
