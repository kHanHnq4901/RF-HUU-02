import React, { useState } from 'react';
import RNFS from 'react-native-fs';
import { KHCMISRepository } from '../../database/repository';
import { getLastPathImport } from '../../service/storage';
import {
  loadXmlFromStorage,
  PropsFileInfo,
  writeXmlFile,
} from '../../shared/file';
import { PATH_EXPORT_XML } from '../../shared/path';
import { getFilExtension, showToast } from '../../util/util';
import { PropsCreateXML } from '../../xml';
import { exportDB2Xml } from '../../xml/xmlUtil';

export type HookState = {
  xmlList: PropsFileInfo[];
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
    xmlList: [],
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

export const updateXmlFile = async () => {
  await createXmlFile();
  const xmlList = await loadXmlFromStorage(PATH_EXPORT_XML);
  hookProps.setState(state => {
    state.xmlList = xmlList;
    return { ...state };
  });
};

export const onInit = async navigation => {
  navigation.addListener('focus', async () => {
    updateXmlFile();
  });
};

export const onDeInit = () => {};
