import RNFS from 'react-native-fs';
import { getFilExtension, showToast } from '../util';

const TAG = ' SHARED FILE: ';

export type PropsFileInfo = {
  checked: boolean;
  name: string;
  time: number;
  path: string;
  date: string;
};

export const deleteFile = async (filePath: string) => {
  try {
    console.log(TAG, 'Delete :', filePath);
    await RNFS.unlink(filePath);
  } catch (err) {
    console.log(TAG, 'Error her: ', err.message);
  }
};

export const writeXmlFile = async (
  path: string,
  strXml: string,
): Promise<boolean> => {
  try {
    await RNFS.writeFile(path, strXml);
    //console.log('result xml:', result);
    return true;
  } catch (err) {
    console.log(TAG, 'Error: ', err.message, err.code);
    showToast(err.message);
  }
  return false;
};

export const loadXmlFromStorage = async (
  path: string,
): Promise<PropsFileInfo[]> => {
  console.log('load file xml');
  const xmlList: PropsFileInfo[] = [];
  try {
    const result = await RNFS.readDir(path);
    //console.log('result xml:', result);
    for (let e of result) {
      if (getFilExtension(e.name.toLocaleLowerCase()) === 'xml') {
        xmlList.push({
          name: e.name,
          checked: false,
          time: new Date(e.mtime).getTime(),
          path: e.path,
          date: new Date(e.mtime).toLocaleString(),
        });
      }
    }
  } catch (err) {
    console.log(TAG, 'Error: ', err.message, err.code);
    showToast(err.message);
  }
  return xmlList;
};
