import {isEmailFormat, isInputValid, isNumeric} from '../../util';
import {hook, store} from './controller';
import {showAlert} from '../../util/index';
import axios from 'axios';
import {Keyboard} from 'react-native';

function checkCondition(): boolean {
  if (
    hook.state.signupInfo.userName.trim().length <= 0
    // ||
    // isInputValid(hook.state.signupInfo.userName) === false
  ) {
    showAlert('Họ tên không hợp lệ');
    return false;
  }

  if (
    hook.state.signupInfo.address.trim().length <= 0 ||
    isInputValid(hook.state.signupInfo.address) === false
  ) {
    showAlert('Địa chỉ không hợp lệ');
    return false;
  }

  if (
    hook.state.signupInfo.userAccount.trim().length <= 0 ||
    isNumeric(hook.state.signupInfo.userAccount) === false
  ) {
    showAlert('Số điện thoại không hợp lệ');
    return false;
  }
  if (
    hook.state.signupInfo.password.trim().length <= 0 ||
    isInputValid(hook.state.signupInfo.password) === false
  ) {
    showAlert('Mật khẩu không hợp lệ');
    return false;
  }

  if (hook.state.signupInfo.email.trim().length > 0) {
    if (isEmailFormat(hook.state.signupInfo.email.trim()) !== true) {
      showAlert('Email không hợp lệ');
      return false;
    }
  }

  return true;
}

export async function onSignupPress() {
  if (checkCondition() === false) {
    console.log('ta day');

    return;
  }

  Keyboard.dismiss();

  hook.setState(state => {
    state.btnSignupBusy = true;
    return {...state};
  });

  try {
    const url =
      'http://' +
      store.state.appSetting.server.host +
      ':' +
      store.state.appSetting.server.port +
      '/api' +
      '/CreateUser';
    const ret = await axios.get(url, {
      params: {
        UserAccount: hook.state.signupInfo.userAccount,
        Password: hook.state.signupInfo.password,
        UserName: hook.state.signupInfo.userName,
        Address: hook.state.signupInfo.address,
        Email: hook.state.signupInfo.email,
        Tel: hook.state.signupInfo.tel,
        Note: '',
      },
    });
    const response = ret.data as {
      CODE: string;
      MESSAGE: string;
    };
    console.log(response);

    if (response.CODE === '1') {
      showAlert('Đăng kí thành công');
    } else {
      showAlert(response.MESSAGE);
    }
  } catch (e: any) {
    showAlert('Lỗi:' + e.message);
  } finally {
    hook.setState(state => {
      state.btnSignupBusy = false;
      return {...state};
    });
  }
}
