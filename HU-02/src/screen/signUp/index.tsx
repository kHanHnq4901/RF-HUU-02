import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FormButton from '../../component/formButton';
import {FormInput} from '../../component/formInput';
import {normalize} from '../../theme';
import {showAlert} from '../../util/index';
import {hook, UpdateHook, navigation, onInit, onDeInit} from './controller';
import {onSignupPress} from './handle';

export function SignUpScreen() {
  UpdateHook();

  React.useEffect(() => {
    onInit();
    return onDeInit;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tạo tài khoản</Text>

      <FormInput
        value={hook.state.signupInfo.userName}
        onChangeText={text => {
          hook.setState(state => {
            state.signupInfo.userName = text;
            return {...state};
          });
        }}
        placeholder="Họ tên"
        iconType="user"
        autoCapitalize="none"
        autoCorrect={false}
        // onSubmitEditing={({nativeEvent}) => {
        //   hook.setState(state => {
        //     state.signupInfo.userName = nativeEvent.text.trim();
        //     // console.log(state.signupInfo.userName);

        //     return {...state};
        //   });
        // }}
      />

      <FormInput
        value={hook.state.signupInfo.address}
        onChangeText={text => {
          hook.setState(state => {
            state.signupInfo.address = text;
            return {...state};
          });
        }}
        placeholder="Địa chỉ"
        iconType="enviromento"
        //keyboardType="twitter"
        autoCapitalize="none"
        autoCorrect={false}
        // onSubmitEditing={({nativeEvent}) => {
        //   hook.setState(state => {
        //     state.signupInfo.address = nativeEvent.text.trim();
        //     // console.log(state.signupInfo.userName);

        //     return {...state};
        //   });
        // }}
      />

      <FormInput
        value={hook.state.signupInfo.tel}
        onChangeText={text => {
          hook.setState(state => {
            state.signupInfo.tel = text;
            state.signupInfo.userAccount = text;
            return {...state};
          });
        }}
        placeholder="Số điện thoại"
        iconType="mobile1"
        keyboardType="phone-pad"
        autoCapitalize="none"
        autoCorrect={false}
        // onSubmitEditing={({nativeEvent}) => {
        //   hook.setState(state => {
        //     state.signupInfo.tel = nativeEvent.text.trim();
        //     // console.log(state.signupInfo.userName);

        //     return {...state};
        //   });
        // }}
      />

      <FormInput
        value={hook.state.signupInfo.password}
        onChangeText={text => {
          hook.setState(state => {
            state.signupInfo.password = text;
            return {...state};
          });
        }}
        placeholder="Mật khẩu"
        iconType="lock"
        secureTextEntry={true}
        // onSubmitEditing={({nativeEvent}) => {
        //   hook.setState(state => {
        //     state.signupInfo.address = nativeEvent.text.trim();
        //     // console.log(state.signupInfo.userName);

        //     return {...state};
        //   });
        // }}
      />

      <FormInput
        value={hook.state.signupInfo.rePassword}
        onChangeText={text => {
          hook.setState(state => {
            state.signupInfo.rePassword = text;
            return {...state};
          });
        }}
        placeholder="Nhập lại mật khẩu"
        iconType="lock"
        secureTextEntry={true}
        onSubmitEditing={({nativeEvent}) => {
          if (nativeEvent.text !== hook.state.signupInfo.password) {
            showAlert('Mật khẩu không khớp');
            hook.setState(state => {
              state.signupInfo.rePassword = '';
              return {...state};
            });
          }
        }}
      />

      <FormInput
        value={hook.state.signupInfo.email}
        onChangeText={text => {
          hook.setState(state => {
            state.signupInfo.email = text;
            return {...state};
          });
        }}
        placeholder="Email (Không bắt buộc)"
        iconType="contacts"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        // onSubmitEditing={({nativeEvent}) => {
        //   hook.setState(state => {
        //     state.signupInfo.email = nativeEvent.text.trim();
        //     // console.log(state.signupInfo.userName);

        //     return {...state};
        //   });
        // }}
      />

      <FormButton
        buttonTitle="Đăng ký"
        isBusy={hook.state.btnSignupBusy}
        onPress={onSignupPress}
      />

      {/* <View style={styles.textPrivate}>
        <Text style={styles.color_textPrivate}>
          By registering, you confirm that you accept our{' '}
        </Text>
        <TouchableOpacity onPress={() => showAlert('Terms Clicked!')}>
          <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
            Terms of service
          </Text>
        </TouchableOpacity>
        <Text style={styles.color_textPrivate}> and </Text>
        <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
          Privacy Policy
        </Text>
      </View> */}

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.navButtonText}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: normalize(28),
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: normalize(18),
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
});
