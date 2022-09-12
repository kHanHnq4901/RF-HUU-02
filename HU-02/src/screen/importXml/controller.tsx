import React, { useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { RECEIVE_FILE_XML } from '../../service/event/constant';
import { loadXmlFromStorage, PropsFileInfo } from '../../shared/file';
import { PATH_IMPORT_CSDL, PATH_IMPORT_XML } from '../../shared/path';

const TAG = 'Import Xml Controller: ';

export type HookState = {
  xmlList: PropsFileInfo[];
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

export const hookProps = {} as HookProps;

export const GetHookProps = (): HookProps => {
  const [state, setState] = useState<HookState>({
    xmlList: [],
  });
  hookProps.state = state;
  hookProps.setState = setState;

  return hookProps;
};

let listener;

export const updateXmlFile = async () => {
  const xmlList = await loadXmlFromStorage(PATH_IMPORT_XML);
  hookProps.setState(state => {
    state.xmlList = xmlList;
    return { ...state };
  });
};

export const onInit = async navigation => {
  listener = DeviceEventEmitter.addListener(RECEIVE_FILE_XML, () => {
    updateXmlFile();
  });
  navigation.addListener('focus', async () => {
    updateXmlFile();
  });
};

export const onDeInit = () => {
  if (listener) {
    listener.remove();
  }
};
