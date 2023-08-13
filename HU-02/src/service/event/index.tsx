import {
  Alert,
  BackHandler,
  DeviceEventEmitter,
  Vibration,
} from 'react-native';
import RNFS from 'react-native-fs';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import SoundPlayer from 'react-native-sound-player';
import { PATH_IMPORT_CSDL, PATH_IMPORT_XML } from '../../shared/path';
import { getFilExtension } from '../../util';
import { importXmlFromPath } from '../../xml/xmlUtil';
import {
  EVENT_ERROR,
  EVENT_SUCCEEDED,
  PACKAGE_NAME,
  RECEIVE_FILE_CSDL,
  RECEIVE_FILE_XML,
} from './constant';

const TAG = 'EVENT: ';

type FileSharedProps = {
  contentUri: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  subject: string;
  text: string;
  weblink: string;
};

export function ListenEventSucceedError() {
  DeviceEventEmitter.addListener(EVENT_SUCCEEDED, () => {
    try {
      // play the file tone.mp3
      // console.log('haha ............');
      SoundPlayer.playSoundFile('succeed1', 'mp3');
    } catch (e) {
      console.log('cannot play the sound file', e);
    }
  });
  DeviceEventEmitter.addListener(EVENT_ERROR, () => {
    Vibration.vibrate();
  });
  SoundPlayer.addEventListener('FinishedLoading', data => {
    // console.log(TAG, 'finish loading mp3 file:' + JSON.stringify(data));
  });
}

export function emitEventSuccess() {
  DeviceEventEmitter.emit(EVENT_SUCCEEDED);
}
export function emitEventFailure() {
  DeviceEventEmitter.emit(EVENT_ERROR);
}

export const onReceiveSharingIntent = () => {
  ReceiveSharingIntent.getReceivedFiles(
    files => {
      let hasXmlFile = false;
      let hasCSDLFile = false;
      let fs = files as FileSharedProps[];
      new Promise<void>((resolve, reject) => {
        fs.forEach(async (file, index) => {
          //console.log('file:', file);
          console.log(TAG, 'received file ...: ' + file.fileName);
          const extension = getFilExtension(file.fileName).toLocaleLowerCase();
          console.log('extention file:', extension);
          if (extension === 'xml') {
            try {
              const destPath = PATH_IMPORT_XML + '/' + file.fileName;
              await RNFS.moveFile(file.filePath, destPath);
              hasXmlFile = true;
              console.log(TAG, 'move file xml success 1');
              Alert.alert(
                'Nhận được file',
                'Nhận file ' +
                  file.fileName +
                  '\nBạn có muốn nhập dữ liệu ngay?',
                [
                  {
                    text: 'Để sau',
                    style: 'destructive',
                  },
                  {
                    text: 'Nhập ngay',
                    onPress: async () => {
                      await importXmlFromPath(destPath);
                      Alert.alert(
                        'Thoát ứng dụng',
                        'Cần thoát ứng dụng để nạp lại dữ liệu.Bạn có muốn thoát không ?',
                        [
                          {
                            text: 'Để sau',
                            style: 'cancel',
                          },
                          {
                            text: 'Thoát',
                            onPress: () => {
                              BackHandler.exitApp();
                            },
                          },
                        ],
                      );
                    },
                  },
                ],
              );
            } catch (err) {
              console.log(TAG, 'Err: ' + err.message);
            }
          } else if (extension === 'db') {
            try {
              console.log('move file');

              await RNFS.moveFile(
                file.filePath,
                PATH_IMPORT_CSDL + '/' + file.fileName,
              );
              hasCSDLFile = true;
              console.log(TAG, 'move file db success');
            } catch (err) {
              console.log(TAG, 'Err: ' + err.message);
            }
          }

          if (index === fs.length - 1) {
            //console.log('resolve');
            resolve();
          }
        });
      }).then(() => {
        //console.log('check');
        if (hasXmlFile) {
          DeviceEventEmitter.emit(RECEIVE_FILE_XML);
          //console.log(TAG, 'receive xml file');
        }
        if (hasCSDLFile) {
          //console.log(TAG, 'receive csdl file');
          DeviceEventEmitter.emit(RECEIVE_FILE_CSDL);
        }
      });
    },
    error => {
      //console.log(TAG, error);
    },
    PACKAGE_NAME, // share url protocol (must be unique to your app, suggest using your apple bundle id)
  );
};
