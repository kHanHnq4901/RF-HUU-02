import TouchID from 'react-native-touch-id';
import * as Keychain from 'react-native-keychain';
import { showAlert, showToast } from '../../util';
import { hook, store } from './controller';
import axios from 'axios';
import { endPoints, getUrl } from '../../service/api';
import { navigation } from '../signIn/controller';

export async function onbtnAllowSigninByFingerPress() {
  let isSupport: any;
  try {
    isSupport = await TouchID.isSupported();
  } catch (err: any) {
    console.log('err:', err);
    showAlert('Thiết bị lỗi Touch ID hoặc không hỗ trợ');
    return;
  }
  onModalOkPress = onModalOkEnterPasswordPress;
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
    const url = getUrl(endPoints.login);

    const result = await axios.get(url, {
      params: {
        UserAccount: store.state.userInfo.USER_ACCOUNT,
        Password: password,
      },
    });

    if (result.data.CODE === '1') {
      console.log('Đăng nhập thành công');

      store.setState(state => {
        state.isCredential = true;
        return { ...state };
      });

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

export let onModalOkPress: (pass: string) => void = () => {};

export async function onModalOkDeleteAccountPress(password: string) {
  hook.setState(state => {
    state.showModalEnterPass = false;
    return { ...state };
  });
  try {
    const url = getUrl(endPoints.deleteAccount);
    console.log('url:', url);
    console.log('params:', {
      UserAccount: store.state.userInfo.USER_ACCOUNT,
      Password: password,
      Token: store.state.userInfo.TOKEN,
    });

    const result = await axios.get(url, {
      params: {
        UserAccount: store.state.userInfo.USER_ACCOUNT,
        Password: password,
        Token: store.state.userInfo.TOKEN,
      },
    });

    console.log('result:', result.data);

    if (result.data.CODE === '1') {
      console.log('Xoá tài khoản thành công');

      showAlert('Xoá tài khoản thành công', {
        label: 'OK',
        func: () => {
          navigation.push('SignIn');
        },
      });
    } else {
      showAlert(
        'Xoá tài khoản thất bại' +
          ':' +
          result.data.MESSAGE +
          '. Có thể mật khẩu không chính xác',
      );
    }
  } catch (e: any) {
    showAlert('Lỗi: ' + e.message);
  } finally {
  }
}

export function onClearAccountPress() {
  showAlert(
    'Bạn có chắc chắn muốn xoá tài khoản ?',
    {
      label: 'Xoá',
      func: async () => {
        let isSupport: any;
        try {
          isSupport = await TouchID.isSupported();
        } catch (err: any) {
          console.log('err:', err);
          showAlert(t('login.handle.noSupportTouchID'));
          return;
        }
        onModalOkPress = onModalOkDeleteAccountPress;
        hook.setState(state => {
          state.showModalEnterPass = true;
          return { ...state };
        });
      },
    },
    {
      label: 'Huỷ',
      func: () => {},
    },
  );
}
