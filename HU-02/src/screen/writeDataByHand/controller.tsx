import React, { useState } from 'react';
import { PropsKHCMISModel } from '../../database/model';
import { TYPE_READ_RF } from '../../service/hhu/defineEM';
import { PropsStore, storeContext } from '../../store';
import { getIndexOfHeader } from '../WriteRegister/controller';
import { PropsData } from './index';

export type HookState = {
  CS_Moi: string;
  Pmax: string;
  NgayPmax: string;
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
    Pmax: '',
    NgayPmax: '',
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

export const onBeforeInit = async (
  item: PropsKHCMISModel,
  isManyPrice: boolean,
) => {
  hookProps.setState(state => {
    state.CS_Moi = item.CS_MOI.toString();
    if (isManyPrice) {
      state.Pmax = item.PMAX.toString();
      state.NgayPmax = item.NGAY_PMAX.toString();
    }
    if (
      item.LoaiDoc === TYPE_READ_RF.READ_FAILED ||
      item.LoaiDoc === TYPE_READ_RF.ABNORMAL_CAPACITY
    ) {
      state.allowWrite = true;
    } else {
      state.allowWrite = false;
    }

    return { ...state };
  });
};

export const onDeInit = () => {};

export const getTableContent = (item: PropsKHCMISModel): PropsData => {
  const data: PropsData = [];
  data.push({
    label: 'KH',
    content: item.TEN_KHANG,
  });
  data.push({
    label: 'Đ/c',
    content: item.DIA_CHI,
  });
  data.push({
    label: 'Bộ CS',
    content: item.LOAI_BCS,
  });
  data.push({
    label: 'CS cũ',
    content: item.CS_CU + ' (kWh)',
  });
  data.push({
    label: 'SL cũ',
    content: item.SL_CU + ' (kWh)',
  });

  return data;
};
