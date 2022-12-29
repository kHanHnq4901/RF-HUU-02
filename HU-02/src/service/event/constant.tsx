import RNFS from 'react-native-fs';

export const PACKAGE_NAME = RNFS.DocumentDirectoryPath.substring(
  RNFS.DocumentDirectoryPath.indexOf('com'),
  RNFS.DocumentDirectoryPath.lastIndexOf('/'),
);

export const RECEIVE_FILE_XML = PACKAGE_NAME + 'RECEIVE_FILE_XML';
export const RECEIVE_FILE_CSDL = PACKAGE_NAME + 'RECEIVE_FILE_CSDL';
export const UPDATE_FW_HHU = PACKAGE_NAME + 'UPDATE_FW';

export const EVENT_SUCCEEDED = 'EVT_SUCCEEDED';
export const EVENT_ERROR = 'EVT_ERROR';
