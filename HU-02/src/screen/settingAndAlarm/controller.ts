import React, { useState } from 'react';
import { PropsStore, storeContext } from '../../store';

type PropsHookState = {
  chanelRF: string;
  chanelRFRadio: string[];
  selectedSerVer: PropsSelectServer | null;
};

type PropsHook = {
  state: PropsHookState;
  setState: React.Dispatch<React.SetStateAction<PropsHookState>>;
};

type PropsTypeAlarmRegister = 'Giá trị (kWh)' | 'Phần trăm (%)';

type PropsValueAlarmRegister = 'Percent' | 'Value';

type PropsSelectServer = 'EMIC' | 'Sawaco';

export const listSelectServer: PropsSelectServer[] = ['EMIC', 'Sawaco'];

export const typeAlarmRegister: {
  title: PropsTypeAlarmRegister;
  value: PropsValueAlarmRegister;
}[] = [
  {
    title: 'Giá trị (kWh)',
    value: 'Value',
  },
  {
    title: 'Phần trăm (%)',
    value: 'Percent',
  },
];

export const hookProps = {} as PropsHook;
export let store = {} as PropsStore;

function getInitialState(): PropsHookState {
  const initialState = {} as PropsHookState;

  initialState.chanelRF = '0';
  initialState.chanelRFRadio = [];

  let initChanel = 920225;

  for (let i = 0; i < 18; i++) {
    initialState.chanelRFRadio.push(initChanel.toString() + 'kHz');
    initChanel += 150;
  }
  initialState.selectedSerVer = null;

  return initialState;
}

export const GetHookProps = (): PropsHook => {
  const [state, setState] = useState<PropsHookState>(getInitialState());
  hookProps.state = state;
  hookProps.setState = setState;

  store = React.useContext(storeContext);

  return hookProps;
};
