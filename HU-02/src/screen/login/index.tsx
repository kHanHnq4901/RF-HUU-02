import React from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import LoginSC from 'react-native-login-screen';
import { version as ver } from '../../shared';

import { GetHookProps, onInit } from './controller';
import { onLoginPress } from './handleButton';

const TAG = 'LoginScreen:';

const version = 'HU-02 Version ' + ver;

let pass = '';

export const LoginScreen = () => {
  GetHookProps();

  React.useLayoutEffect(() => {
    onInit();
  }, []);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={{ backgroundColor: 'pink' }}>My nae is Tan</Text> */}
      <StatusBar backgroundColor="transparent" />
      <LoginSC
        style={{ backgroundColor: 'white' }}
        disableSocialButtons={true}
        haveAccountText={version}
        logoImageSource={require('../../asset/images/logo/logo.png')}
        onLoginPress={() => {
          onLoginPress(pass);
        }}
        onHaveAccountPress={() => {}}
        onEmailChange={(email: string) => {}}
        onPasswordChange={(password: string) => {
          pass = password;
        }}
      />
      {/* <SCLAlert
        show={showAlert}
        onRequestClose={() => {}}
        slideAnimationDuration={0}
        theme="danger"
        title="Lỗi"
        subtitle="Mật khẩu không chính xác"
        headerIconComponent={
          <MaterialIcons name="error" size={32} color="white" />
        }>
        <SCLAlertButton
          theme="danger"
          onPress={() => {
            setShowAlert(false);
          }}>
          OK
        </SCLAlertButton>
      </SCLAlert> */}
    </View>
    //<Text>Helllo</Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
