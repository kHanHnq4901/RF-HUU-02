import React, {useState} from 'react';
import {getLastPathImport} from '../../service/storage';
import {
  loadLogFileFromStorage,
  PropsFileInfo,
  writeXmlFile,
} from '../../shared/file';
import {PATH_EXPORT_LOG} from '../../shared/path';
import {exportDB2Xml} from '../../xml/xmlUtil';

export type HookState = {
  listFile: PropsFileInfo[];
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

const TAG = 'Eport Xml Controller: ';

// const dumyList: PropsXml[] = [];

// for (let i = 0; i < 50; i++) {
//   dumyList.push({
//     checked: false,
//     name: 'Test' + i.toString() + '.xml',
//   });
// }

export const hookProps = {} as HookProps;

export const GetHookProps = (): HookProps => {
  const [state, setState] = useState<HookState>({
    listFile: [],
  });
  hookProps.state = state;
  hookProps.setState = setState;

  return hookProps;
};
// console.log(RNFS.ExternalDirectoryPath); ///storage/emulated/0/Android/data/com.gelex.emic.hhuem/files
// console.log(RNFS.DocumentDirectoryPath); ///data/user/0/com.gelex.emic.hhuem/files
// console.log(RNFS.DownloadDirectoryPath); ////storage/emulated/0/Download
// console.log(RNFS.ExternalStorageDirectoryPath); ////storage/emulated/0
// console.log(RNFS.MainBundlePath); //undefined

const createXmlFile = async () => {
  const strXML = await exportDB2Xml();
  if (strXML) {
    const result = await writeXmlFile(await getLastPathImport(), strXML);
    if (result) {
      console.log('crete xml succeed');
    } else {
      console.log('crete xml failed');
    }
  }
  //console.log('strXML:', strXML);
};

export const updateLogFile = async () => {
  //await createXmlFile();
  const logList = await loadLogFileFromStorage(PATH_EXPORT_LOG);
  hookProps.setState(state => {
    state.listFile = logList;
    return {...state};
  });
};

export const onInit = async navigation => {
  navigation.addListener('focus', async () => {
    updateLogFile();
  });
};

export const onDeInit = () => {};
