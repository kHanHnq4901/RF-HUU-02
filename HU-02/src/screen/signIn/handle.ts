import { showAlert, showAlertProps } from '../../util';
import { hook, navigation, olState, store } from './controller';
import axios from 'axios';
import { PropsInfoUser, USER_ROLE_TYPE } from '../../service/user';
import { Keyboard } from 'react-native';
import { saveUserStorage } from '../../service/storage/user';
import TouchID from 'react-native-touch-id';
import * as Keychain from 'react-native-keychain';
import { sha256 } from 'react-native-sha256';
import { endPoints, getUrl } from '../../service/api';

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
      const userAccount =
        props?.userAccount ?? store.state.userInfo.USER_ACCOUNT;
      const password = props?.password ?? hook.state.password;
      const url = getUrl(endPoints.login);

      // console.log('url: ' + url);
      // console.log('params: ', {
      //   UserAccount: userAccount,
      //   Password: password,
      // });

      const result = await axios.get(url, {
        params: {
          UserAccount: userAccount,
          Password: password,
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

        if (userAccount !== olState.userName) {
          await Keychain.resetGenericPassword();
          console.log('save new user');
          saveUserStorage({
            userAccount: userAccount,
            pwd: '',
            code: '',
          });
          olState.userName = userAccount;
          if (
            store.state.typeTouchID !== 'NoSupport' &&
            (await Keychain.getGenericPassword()) === false
          ) {
            await showAlert(
              'Bạn có muốn sử dụng chức năng ' +
                store.state.typeTouchID +
                ' cho lần sau ?',
              {
                label: 'Để sau',
                func: () => {},
              },
              {
                label: 'Có',
                func: async () => {
                  const save = await Keychain.setGenericPassword(
                    userAccount,
                    password,
                  );

                  if (save) {
                    //showAlert('Thêm thành công');
                    store.state.isCredential = true;
                  } else {
                    showAlert('Lỗi thêm ' + store.state.typeTouchID);
                  }
                },
              },
            );
          }
        }

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
        if (props?.password) {
          await Keychain.resetGenericPassword();
          // login by touch ID
        }
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

  if (hook.state.btnSignInBusy === true) {
    return;
  }
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
        // console.log('credential:', credential);

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

export function onBtnForgotPassword() {
  console.log('a');

  showAlertProps({
    message:
      'Hãy liên hệ bộ phận hỗ trợ để lấy lại mật khẩu của bạn qua email kd@emic.com.vn',
  });
}
