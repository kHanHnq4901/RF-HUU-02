import React, {useState} from 'react';
import {PropsKHCMISModel} from '../../database/model';
import {TYPE_READ_RF} from '../../service/hhu/defineEM';
import {PropsStore, storeContext} from '../../store';
import {PropsData} from './index';

export type HookState = {
  CS_Moi: string;
  datePick: Date;
  ghichu: string;
  status: string;
  allowWrite: boolean;
  isWriting: boolean;
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

const TAG = ' Controller WriteByHand: ';

export const hookProps = {} as HookProps;
export let store = {} as PropsStore;

export const GetHook = (): HookProps => {
  const [state, setState] = useState<HookState>({
    CS_Moi: '',
    datePick: new Date(),
    ghichu: '',
    status: '',
    allowWrite: false,
    isWriting: false,
  });
  hookProps.state = state;
  hookProps.setState = setState;

  store = React.useContext(storeContext) as PropsStore;

  return hookProps;
};

export const onInit = async () => {};

export const onBeforeInit = async (item: PropsKHCMISModel) => {
  hookProps.setState(state => {
    state.CS_Moi = '0';

    if (
      item.TYPE_READ === TYPE_READ_RF.READ_FAILED ||
      item.TYPE_READ === TYPE_READ_RF.WRITE_BY_HAND ||
      item.TYPE_READ === TYPE_READ_RF.ABNORMAL_CAPACITY
    ) {
      state.allowWrite = true;
    } else {
      state.allowWrite = false;
    }

    return {...state};
  });
};

export const onDeInit = () => {};

export const getTableContent = (item: PropsKHCMISModel): PropsData => {
  const data: PropsData = [];
  data.push({
    label: 'KH',
    content: item.CUSTOMER_NAME,
  });
  data.push({
    label: 'Đ/c',
    content: item.ADDRESS,
  });
  if (item.DATA?.length) {
    let i = 1;
    for (let objData of item.DATA) {
      data.push({
        label: 'Thời điểm chốt ' + i,
        content: objData.time,
      });
      data.push({
        label: 'Chỉ số(m3)',
        content: ((objData.cwRegister - objData.uCwRegister) / 1000).toFixed(3),
      });
      i++;
    }
  }
  return data;
};
