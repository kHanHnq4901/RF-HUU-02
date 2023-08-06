import TouchID from 'react-native-touch-id';
import * as Keychain from 'react-native-keychain';
import { showAlert, showToast } from '../../util';
import { hook, store } from './controller';
import axios from 'axios';

export async function onbtnAllowSigninByFingerPress() {
  let isSupport: any;
  try {
    isSupport = await TouchID.isSupported();
  } catch (err: any) {
    console.log('err:', err);
    showAlert('Thiết bị lỗi Touch ID hoặc không hỗ trợ');
    return;
  }
  hook.setState(state => {
    state.showModalEnterPass = true;
    return { ...state };
  });
}

export async function onModalOkEnterPasswordPress(password: string) {
  hook.setState(state => {
    state.showModalEnterPass = false;
    return { ...state };
  });
  try {
    const url =
      'http://' +
      store.state.appSetting.server.host +
      ':' +
      store.state.appSetting.server.port +
      '/api' +
      '/Login';

    const result = await axios.get(url, {
      params: {
        UserAccount: store.state.userInfo.USER_ACCOUNT,
        Password: password,
      },
    });

    if (result.data.CODE === '1') {
      console.log('Đăng nhập thành công');

      store.state.isCredential = true;

      const save = await Keychain.setGenericPassword(
        store.state.userInfo.USER_ACCOUNT,
        password,
      );

      if (save) {
        showAlert('Thêm thành công');
      } else {
        showAlert('Lỗi');
      }
    } else {
      showAlert('Tài khoản hoặc mật khẩu không chính xác');
    }
  } catch (e: any) {
    showAlert('Lỗi: ' + e.message);
  } finally {
  }
}
export function onModalCancelPress() {
  hook.setState(state => {
    state.showModalEnterPass = false;
    return { ...state };
  });
}

export function onClearFingerPress() {
  Keychain.resetGenericPassword();
  if (store.state.isCredential !== false) {
    store.setState(state => {
      state.isCredential = false;
      return { ...state };
    });
  }
  showToast('Xóa thành công');
}
