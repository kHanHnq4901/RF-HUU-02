import React, { useState } from 'react';
import { PropsKHCMISModel } from '../../database/model';
import { PropsData } from './index';

export type HookState = {};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

const TAG = ' Controller WriteByHand: ';

export const hookProps = {} as HookProps;

export const GetHook = (): HookProps => {
  const [state, setState] = useState<HookState>({});
  hookProps.state = state;
  hookProps.setState = setState;

  return hookProps;
};

export const onInit = async () => {};

export const onBeforeInit = async () => {};

export const onDeInit = () => {};

export const getTableContent = (item: PropsKHCMISModel): PropsData => {
  const data: PropsData = [];

  for (let i in item) {
    data.push({
      label: i,
      content: item[i],
    });
  }

  return data;
};
