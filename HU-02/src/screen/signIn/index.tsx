import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import {onFingerPress, onLoginPress} from './handle';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function SignInScreen() {
  UpdateHook();
  React.useEffect(() => {
    onInit();
    return onDeInit;
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        placeholder="Số điện thoại"
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

      <TouchableOpacity style={styles.finger} onPress={onFingerPress}>
        <Text style={styles.navButtonText}>{'Đăng nhập bằng vân tay '}</Text>
        <Ionicons name="finger-print" color={Colors.secondary} size={25} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.navButtonText}>Không có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
});
