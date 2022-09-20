import React, { useState } from 'react';
import { updateValueAppSettingFromNvm } from '../../service/storage';
import { PropsStore, storeContext } from '../../store/store';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackRootNavigationProp } from '../../navigation/model/model';
import { Alert } from 'react-native';

const TAG = 'Login Controller';

type PropsHookState = {};

type PropsHook = {
  state: PropsHookState;
  setState: React.Dispatch<React.SetStateAction<PropsHookState>>;
};

export const hookProps = {} as PropsHook;
export let store = {} as PropsStore;
export let navigation = {} as StackRootNavigationProp;

export const GetHookProps = (): PropsHook => {
  const [state, setState] = useState<PropsHookState>({});
  hookProps.state = state;
  hookProps.setState = setState;

  store = React.useContext(storeContext);

  navigation = useNavigation<StackRootNavigationProp>();

  return hookProps;
};

export const onInit = async () => {
  let appSetting = await updateValueAppSettingFromNvm();
  store?.setValue(state => {
    state.appSetting = appSetting;
    return { ...state };
  });
  try {
    const { data }: { data: string } = await axios.get(
      'http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh',
    );
    const onlineDate = new Date(data);
    const curDate = new Date();
    const secDif = (curDate.getTime() - onlineDate.getTime()) / 1000;
    if (Math.abs(secDif) > 120) {
      Alert.alert(
        'Thời gian sai',
        'Thời gian của thiết bị chưa đúng, vui lòng chỉnh lại để đám bảo tính đúng của dữ liệu khi ghi chỉ số',
      );
    } else {
      console.log(TAG, 'time is true');
    }
  } catch (err) {
    console.log(TAG, err.message);
  }
};
