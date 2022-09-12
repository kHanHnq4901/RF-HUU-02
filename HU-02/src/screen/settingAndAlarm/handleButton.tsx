import { Alert } from 'react-native';
import {
  PropsAppSetting,
  saveValueAppSettingToNvm,
} from '../../service/storage';
import { isNumeric, showToast } from '../../util/util';
import { store } from './controller';

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
    store.setValue(state => {
      state.appSetting.numRetriesRead = '1';
      return { ...state };
    });
  }
};

export const onLowerThresholdDoneSubmit = (text: string) => {
  if (isNumeric(text) === true) {
  } else {
    Alert.alert('Lỗi', 'Ngưỡng nhỏ hơn không hợp lệ', [
      {
        text: 'OK',
      },
    ]);
    return;
  }

  let uppervalue;

  if (store.value.appSetting.setting.typeAlarm === 'Value') {
    uppervalue = Number(store.value.appSetting.setting.upperThresholdValue);
  } else {
    uppervalue = Number(store.value.appSetting.setting.upperThresholdPercent);
  }
  const lower = Number(text);
  if (Number(text) < 0 || lower >= uppervalue) {
    Alert.alert('Lỗi', 'Ngưỡng nhỏ hơn phải lớn hơn bằng 0', [
      {
        text: 'OK',
      },
    ]);
    store.setValue(state => {
      if (state.appSetting.setting.typeAlarm === 'Value') {
        state.appSetting.setting.lowerThresholdValue = (
          uppervalue - 1 > 0 ? uppervalue - 1 : 0
        ).toString();
      } else {
        state.appSetting.setting.lowerThresholdPercent = (
          uppervalue - 1 > 0 ? uppervalue - 1 : 0
        ).toString();
      }
      return { ...state };
    });
    return;
  }
};
export const onUpperThresholdDoneSubmit = (text: string) => {
  if (isNumeric(text) === true) {
  } else {
    Alert.alert('Lỗi', 'Ngưỡng lớn hơn không hợp lệ', [
      {
        text: 'OK',
      },
    ]);
    return;
  }
  let lowerValue;

  if (store.value.appSetting.setting.typeAlarm === 'Value') {
    lowerValue = Number(store.value.appSetting.setting.lowerThresholdValue);
  } else {
    lowerValue = Number(store.value.appSetting.setting.lowerThresholdPercent);
  }
  const upper = Number(text);
  if (upper <= lowerValue) {
    Alert.alert('Lỗi', 'Ngưỡng lớn hơn phải lớn hơn Ngưỡng nhỏ hơn', [
      {
        text: 'OK',
      },
    ]);
    store.setValue(state => {
      if (state.appSetting.setting.typeAlarm === 'Value') {
        state.appSetting.setting.upperThresholdValue = (
          lowerValue + 1
        ).toString();
      } else {
        state.appSetting.setting.upperThresholdPercent = (
          lowerValue + 1
        ).toString();
      }
      return { ...state };
    });
    return;
  }
};

export const onCheckBoxShowDataOkInWritwRegister = () => {
  store.setValue(state => {
    state.appSetting.showResultOKInWriteData = state.appSetting
      .showResultOKInWriteData
      ? false
      : true;
    //console.log(state.appSetting.showResultOKInWriteData);
    return { ...state };
  });
};
export async function onSavePress() {
  await saveValueAppSettingToNvm(store?.value.appSetting as PropsAppSetting);
  showToast('Đã lưu');
}
