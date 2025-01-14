import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconFaceID } from '../../component/faceID';
import FormButton from '../../component/formButton';
import { FormInput } from '../../component/formInput';
import { version } from '../../shared';
import { Colors, normalize, scale } from '../../theme';
import { UpdateHook, hook, onDeInit, onInit, store } from './controller';
import {
  onBtnForgotPassword,
  onBtnSettingPress,
  onFingerPress,
  onLoginPress,
} from './handle';

export function SignInScreen() {
  UpdateHook();
  React.useEffect(() => {
    onInit();
    return onDeInit;
  }, []);
  const safeAreaInsets = useSafeAreaInsets();
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.areaSetting}
          onPress={onBtnSettingPress}>
          <Ionicons name="settings" size={25 * scale} color="#76777a" />
        </TouchableOpacity>

        <Image
          source={require('../../asset/images/logo/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.text}>HU-02</Text>

        <FormInput
          onChangeText={email =>
            store.setState(state => {
              state.userInfo.USER_ACCOUNT = email;
              return { ...state };
            })
          }
          value={store.state.userInfo.USER_ACCOUNT}
          iconType="mobile1"
          // keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Tài khoản"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            this.refPassword?.focus();
          }}
        />

        <FormInput
          onChangeText={password =>
            hook.setState(state => {
              state.password = password;
              return { ...state };
            })
          }
          ref={ref => {
            this.refPassword = ref;
          }}
          value={hook.state.password}
          placeholder="Mật khẩu"
          iconType={hook.state.showPassword ? 'unlock' : 'lock'}
          onLeftIconPress={() => {
            hook.setState(state => {
              state.showPassword = !state.showPassword;
              return { ...state };
            });
          }}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!hook.state.showPassword}
          rightChildren={
            store.state.typeTouchID !== 'NoSupport' && (
              <TouchableOpacity
                // style={styles.finger}
                onPress={() => onFingerPress(true)}>
                {store.state.typeTouchID === 'TouchID' ? (
                  <Ionicons
                    name="finger-print"
                    color={Colors.secondary}
                    size={25}
                  />
                ) : (
                  <IconFaceID size={25} color="#2e64e5" />
                )}
              </TouchableOpacity>
            )
          }
          blurOnSubmit={false}
          onSubmitEditing={() => onLoginPress()}
        />

        <FormButton
          buttonTitle="Đăng nhập"
          isBusy={hook.state.btnSignInBusy}
          onPress={() => onLoginPress()}
        />

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={onBtnForgotPassword}>
          <Text style={styles.navButtonText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={{ ...styles.footer, paddingBottom: safeAreaInsets.bottom }}>
        <Text style={styles.version}>Version: {version}</Text>
        <Text style={styles.hostPortInfoContainer}>
          {store.state.appSetting.server.host}:
          {store.state.appSetting.server.port}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundColor,
    padding: 3,
  },
  hostPortInfoContainer: {
    color: Colors.caption,
    fontSize: normalize(16),
    fontFamily: 'Lato-Regular',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  logo: {
    height: 200 * scale,
    width: 200 * scale,
  },
  text: {
    fontFamily: Platform.OS === 'android' ? 'kufam-semi-bold-italic' : 'Kufam',
    fontSize: normalize(45),
    marginBottom: 10,
    color: '#f3688f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginTop: 50,
  },
  version: {
    color: Colors.caption,
    fontSize: normalize(16),
    fontFamily: 'Lato-Regular',
  },
  finger: {
    //marginVertical: 20,
    flexDirection: 'row',
    marginTop: 50,
  },
  navButtonText: {
    fontSize: normalize(18),
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
  areaSetting: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 10,
    padding: 10,
  },
});
