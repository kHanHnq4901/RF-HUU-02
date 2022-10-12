import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import { getFilExtension } from '../../util';
import RNFS from 'react-native-fs';
import { PATH_IMPORT_CSDL, PATH_IMPORT_XML } from '../../shared/path';
import { Alert, DeviceEventEmitter, BackHandler } from 'react-native';
import { PACKAGE_NAME, RECEIVE_FILE_CSDL, RECEIVE_FILE_XML } from './constant';
import { closeConnection } from '../../database/repository';
import { importXmlFromPath } from '../../xml/xmlUtil';

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
