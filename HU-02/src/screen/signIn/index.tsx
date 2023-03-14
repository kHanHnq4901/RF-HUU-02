import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FormButton from '../../component/formButton';
import {FormInput} from '../../component/formInput';
import {Colors, normalize, scale} from '../../theme';
import {
  hook,
  navigation,
  onDeInit,
  onInit,
  store,
  UpdateHook,
} from './controller';
import {onBtnSettingPress, onFingerPress, onLoginPress} from './handle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {version} from '../../shared';

export function SignInScreen() {
  UpdateHook();
  React.useEffect(() => {
    onInit();
    return onDeInit;
  }, []);
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.areaSetting}
          onPress={onBtnSettingPress}>
          <Ionicons name="settings" size={25 * scale} color="#76777a" />
        </TouchableOpacity>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
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
              return {...state};
            })
          }
          value={store.state.userInfo.USER_ACCOUNT}
          iconType="mobile1"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Tài khoản"
        />

        <FormInput
          onChangeText={password =>
            hook.setState(state => {
              state.password = password;
              return {...state};
            })
          }
          value={hook.state.password}
          placeholder="Mật khẩu"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormButton
          buttonTitle="Đăng nhập"
          isBusy={hook.state.btnSignInBusy}
          onPress={onLoginPress}
        />

        <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
          <Text style={styles.navButtonText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        {/* {Platform.OS === 'android' ? (
        <View>
          <SocialButton
            buttonTitle="Sign In with Facebook"
            btnType="facebook"
            color="#4867aa"
            backgroundColor="#e6eaf4"
            onPress={() => fbLogin()}
          />

          <SocialButton
            buttonTitle="Sign In with Google"
            btnType="google"
            color="#de4d41"
            backgroundColor="#f5e7ea"
            onPress={() => googleLogin()}
          />
        </View>
      ) : null} */}

        <TouchableOpacity
          style={styles.finger}
          onPress={() => onFingerPress(true)}>
          <Text style={styles.navButtonText}>{'Đăng nhập bằng vân tay '}</Text>
          <Ionicons name="finger-print" color={Colors.secondary} size={25} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
          <Text style={styles.version}>Version: {version}</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.navButtonText}>Không có tài khoản? Đăng ký</Text>
      </TouchableOpacity> */}
      </ScrollView>
      <View style={styles.footer}>
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
    fontFamily: 'Lato-Regular',
    //width: '100%',
    // textAlign: 'right',
    // padding: 3,
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
    fontFamily: 'kufam-semi-bold-italic',
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
