import { showAlert } from '../../util';
import { hook, navigation, store } from './controller';
import axios from 'axios';
import { PropsInfoUser, USER_ROLE_TYPE } from '../../service/user';
import { Keyboard } from 'react-native';
import { saveUserStorage } from '../../service/storage/user';
import TouchID from 'react-native-touch-id';
import * as Keychain from 'react-native-keychain';
import { sha256 } from 'react-native-sha256';

const TAG = 'Handle Sigin:';

type PropsLogin = {
  userAccount: string;
  password: string;
};

export async function onLoginPress(props?: PropsLogin) {
  if (!props) {
    if (
      !store.state.userInfo.USER_ACCOUNT ||
      store.state.userInfo.USER_ACCOUNT.trim().length <= 0
    ) {
      showAlert('Chưa điền thông tin tài khoản');
      return;
    }
    if (!hook.state.password || hook.state.password.trim().length <= 0) {
      showAlert('Chưa điền thông tin mật khẩu');
      return;
    }
  }

  Keyboard.dismiss();

  hook.setState(state => {
    state.btnSignInBusy = true;
    return { ...state };
  });

  try {
    // check admin
    const hashUser = await sha256(store.state.userInfo.USER_ACCOUNT.trim());
    const hashPassword = await sha256(hook.state.password.trim());

    if (
      store.state.appSetting.userAdmin === hashUser &&
      store.state.appSetting.passwordAdmin === hashPassword
    ) {
      store.setState(state => {
        state.userInfo = {} as PropsInfoUser;
        state.userInfo.USER_TYPE = USER_ROLE_TYPE.ADMIN;
        return { ...state };
      });
      console.log('Đăng nhập thành công');

      navigation.push('Drawer', {
        screen: 'Overview',
        params: {
          title: 'Tổng quan',
          info: 'Hiển thị tỉ lệ thu lập dữ liệu của thiết bị HU',
        },
      });
    } else {
      const url =
        'http://' +
        store.state.appSetting.server.host +
        ':' +
        store.state.appSetting.server.port +
        '/api' +
        '/Login';

      const result = await axios.get(url, {
        params: {
          UserAccount: props?.userAccount ?? store.state.userInfo.USER_ACCOUNT,
          Password: props?.password ?? hook.state.password,
        },
      });
      //console.log('result: ', JSON.stringify(result));

      const userInfo: PropsInfoUser = result.data;

      console.log('userInfo:', userInfo);

      userInfo.TOKEN_EXPIRED = new Date(userInfo.TOKEN_EXPIRED);

      if (userInfo.CODE === '1') {
        store.setState(state => {
          state.userInfo = userInfo;
          return { ...state };
        });
        console.log('Đăng nhập thành công');

        saveUserStorage({
          userAccount: props?.userAccount ?? store.state.userInfo.USER_ACCOUNT,
          code: '',
          pwd: '',
        });

        navigation.push('Drawer', {
          screen: 'Overview',
          params: {
            title: 'Tổng quan',
            info: 'Hiển thị tỉ lệ thu lập dữ liệu của thiết bị HU',
          },
        });

        //navigation.navigate('Home');
      } else {
        showAlert('Tài khoản hoặc mật khẩu không chính xác');
      }
    }
  } catch (e: any) {
    showAlert('Lỗi: ' + e.message);
  } finally {
    hook.setState(state => {
      state.btnSignInBusy = false;
      return { ...state };
    });
  }
}

export async function onFingerPress(isShowAlert: boolean) {
  let isSupport: any;
  try {
    isSupport = await TouchID.isSupported();
  } catch (err: any) {
    console.log('err:', err);
    if (isShowAlert) {
      showAlert('Thiết bị lỗi Touch ID hoặc không hỗ trợ');
    }
  }

  try {
    if (isSupport) {
      const credential = await Keychain.getGenericPassword();
      if (!credential) {
        if (isShowAlert) {
          showAlert('Chưa cài đặt chức năng này trong ứng dụng');
        }

        return;
      }

      store.state.isCredential = true;

      const result = await TouchID.authenticate('', {
        cancelText: 'Hủy',
        title: 'Đăng nhập bằng vân tay',
        sensorDescription: 'Chạm vào cảm biến vân tay trên thiết bị',
      });
      console.log('result:', result);
      if (result === true) {
        await onLoginPress({
          userAccount: credential.username,
          password: credential.password,
        });
      }
    }
  } catch (err: any) {
    console.log(TAG, 'Lỗi:', err.message);
  }
}

export function onBtnSettingPress() {
  navigation.navigate('Setting');
}
