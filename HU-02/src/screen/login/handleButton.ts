import { Alert } from 'react-native';
import { screenDatas } from '../../shared';
import { isValidText } from '../../util/util';
import { navigation, store } from './controller';
import { sha256 } from 'react-native-sha256';

export async function onLoginPress(pass: string) {
  //sha256('123456').then(hash => console.log(hash));

  if (isValidText(pass) === false) {
    //setShowAlert(true);
    Alert.alert('Lỗi', 'Mật khẩu không hợp lệ');
    return;
  }
  const hash = await sha256(pass);
  if (
    hash !== store?.value.appSetting.password &&
    hash !== store?.value.appSetting.passwordAdmin
  ) {
    // console.log('hash:' , hash);
    // console.log('password:' , store?.value.appSetting.password);

    Alert.alert('Lỗi', 'Mật khẩu không chính xác');
    return;
  }

  store.setValue(state => {
    if (hash === store?.value.appSetting.passwordAdmin) {
      state.user = 'admin';
    } else {
      state.user = 'customer';
    }

    return { ...state };
  });

  //console.log('login');
  const itemOverView = screenDatas.find(item => item.id === 'Overview');
  navigation.navigate('Drawer', {
    screen: 'Overview',
    params: {
      info: itemOverView?.info ?? '',
      title: itemOverView?.title ?? '',
    },
  });
}
