import {showAlert} from '../../util';
import {hook, navigation, store} from './controller';
import axios from 'axios';
import {PropsInfoUser} from '../../service/user';
import {Keyboard} from 'react-native';
import {saveUserStorage} from '../../service/storage/user';
import TouchID from 'react-native-touch-id';
import * as Keychain from 'react-native-keychain';

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
    return {...state};
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
        UserAccount: props?.userAccount ?? store.state.userInfo.USER_ACCOUNT,
        Password: props?.password ?? hook.state.password,
      },
    });
    //console.log('result: ', JSON.stringify(result));

    const userInfo: PropsInfoUser = result.data;

    //console.log('userInfo:', userInfo);

    userInfo.TOKEN_EXPIRED = new Date(userInfo.TOKEN_EXPIRED);

    if (userInfo.CODE === '1') {
      store.setState(state => {
        state.userInfo = userInfo;
        return {...state};
      });
      console.log('Đăng nhập thành công');

      saveUserStorage({
        userAccount: props?.userAccount ?? store.state.userInfo.USER_ACCOUNT,
        code: '',
        pwd: '',
      });

      navigation.push('Drawer', {
        screen: 'Bottom',
        params: {
          screen: 'HomeStack',
          params: {
            screen: 'Home',
          },
        },
      });

      //navigation.navigate('Home');
    } else {
      showAlert('Tài khoản hoặc mật khẩu không chính xác');
    }
  } catch (e: any) {
    showAlert('Lỗi: ' + e.message);
  } finally {
    hook.setState(state => {
      state.btnSignInBusy = false;
      return {...state};
    });
  }
}

export async function onFingerPress() {
  let isSupport: any;
  try {
    isSupport = await TouchID.isSupported();
  } catch (err: any) {
    console.log('err:', err);
    showAlert('Thiết bị lỗi Touch ID hoặc không hỗ trợ');
  }

  try {
    if (isSupport) {
      const credential = await Keychain.getGenericPassword();
      if (!credential) {
        showAlert('Chưa cài đặt chức năng này trong ứng dụng');
        return;
      }

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
  // const username = 'haha';
  // const password = '123456';

  // // Store the credentials
  // const ret = await Keychain.setGenericPassword(username, password);

  // console.log('ret:', ret);

  // try {
  //   // Retrieve the credentials
  //   const credentials = await Keychain.getGenericPassword();
  //   if (credentials) {
  //     console.log(
  //       'Credentials successfully loaded for user ' +
  //         JSON.stringify(credentials),
  //     );
  //   } else {
  //     console.log('No credentials stored');
  //   }
  // } catch (error) {
  //   console.log("Keychain couldn't be accessed!", error);
  // }
}
