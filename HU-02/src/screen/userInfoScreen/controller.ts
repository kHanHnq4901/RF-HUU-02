import React from 'react';
import {PropsStore, storeContext} from '../../store';

type PropsState = {};

type PropsHook = {
  state: PropsState;
  setState: React.Dispatch<React.SetStateAction<PropsState>>;
};

export const hook = {} as PropsHook;
export let store = {} as PropsStore;

export function UpdateHook() {
  const [state, setState] = React.useState<PropsState>({});

  hook.state = state;
  hook.setState = setState;

  store = React.useContext(storeContext);
}

export async function onInit() {}

export function onDeInit() {}
