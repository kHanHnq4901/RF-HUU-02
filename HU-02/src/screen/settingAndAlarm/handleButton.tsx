import {Alert} from 'react-native';
import {configRFBoardBle} from '../../service/hhu/Ble/hhuFunc';
import {PropsAppSetting, saveValueAppSettingToNvm} from '../../service/storage';
import {isNumeric, showToast} from '../../util';
import {hookProps, store} from './controller';
import {hook} from '../settingUser/controller';
import {uint8_t} from '../../util/custom_typedef';

export const onNumRetriesReadSubmit = (text: string) => {
  let err = false;
  let status = '';
  if (isNumeric(text) === true) {
    if (Number(text) <= 0) {
      status = 'Số lần đọc lại phải lơn hơn 0';
      err = true;
    }
  } else {
    err = true;
    status = 'Số không hợp lệ';
    Alert.alert('Lỗi', 'Số không hợp lệ', [
      {
        text: 'OK',
      },
    ]);
  }
  if (err === true) {
    Alert.alert('Lỗi', status, [
      {
        text: 'OK',
      },
    ]);
    store.setState(state => {
      state.appSetting.numRetriesRead = '1';
      return {...state};
    });
  }
};

export async function onSavePress() {
  console.log('save');

  await saveValueAppSettingToNvm(store.state.appSetting as PropsAppSetting);
  showToast('Đã lưu');
}

export async function onSetChanelPress() {
  const rest = await configRFBoardBle(Number(hookProps.state.chanelRF));
  if (rest === true) {
    showToast('Cài thành công');
  } else {
    showToast('Cài thất bại');
  }
}
