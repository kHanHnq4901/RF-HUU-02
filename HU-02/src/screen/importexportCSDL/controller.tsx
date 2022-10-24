import React, {useState} from 'react';
import RNFS from 'react-native-fs';
import {getFilExtension, showToast} from '../../util';
import {PropsFileInfo} from '../../shared/file';
import {PATH_IMPORT_CSDL, PATH_EXECUTE_CSDL} from '../../shared/path';
import {DeviceEventEmitter, EmitterSubscription} from 'react-native';
import {RECEIVE_FILE_CSDL} from '../../service/event/constant';

export type PropsXml = PropsFileInfo;

type HookState = {
  csdlList: PropsFileInfo[];
};

type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

const TAG = 'Import Export CSDL Controller: ';

export let hookProps = {} as HookProps;

export const GetHookProps = (): HookProps => {
  const [state, setState] = useState<HookState>({
    csdlList: [],
  });
  hookProps.state = state;
  hookProps.setState = setState;

  return hookProps;
};

let listenReceiveCSDL: EmitterSubscription;

export const onInit = async () => {
  loadFileCsdlFromStorage();

  listenReceiveCSDL = DeviceEventEmitter.addListener(RECEIVE_FILE_CSDL, () => {
    loadFileCsdlFromStorage();
  });
};

export const onDeInit = () => {
  listenReceiveCSDL.remove();
};

export const loadFileCsdlFromStorage = () => {
  console.log('load file csdl');
  RNFS.readDir(PATH_IMPORT_CSDL) //fsd On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then(result => {
      //console.log('GOT RESULT', JSON.stringify(result));
      hookProps.setState(state => {
        state.csdlList = [];
        result.forEach(e => {
          if (getFilExtension(e.name.toLocaleLowerCase()) === 'db') {
            state.csdlList.push({
              name: e.name,
              checked: false,
              time: new Date(e.mtime).getTime(),
              path: e.path,
              date: new Date(e.mtime).toLocaleString(),
            });
          }
        });
        state.csdlList.sort((a, b) => b.time - a.time);
        //console.log('b');
        return {...state};
      });
    })
    .catch(err => {
      console.log(TAG, 'Error: ', err.message, err.code);
      showToast(err.message);
    });
};
