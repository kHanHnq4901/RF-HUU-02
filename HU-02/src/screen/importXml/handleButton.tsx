import { Alert } from 'react-native';
import { deleteFile } from '../../shared/file';
import { hookProps, updateXmlFile } from './controller';

import { importXmlFromPath } from '../../xml/xmlUtil';

export const onImportPress = async () => {
  // //controller.testMoveFile();
  // var obj = { name: 'Super', Surname: 'Man', age: 23 };
  // var builder = new xml2js.Builder();
  // var xml = builder.buildObject(obj);

  // console.log('k:', xml);

  // return;

  let hasItem = false;
  const listUrl: string[] = [];
  //const filenames: string[] = [];
  //console.log('lenghth:', hookProps.state.xmlList.length);
  for (let i = 0; i < hookProps.state.xmlList.length; i++) {
    if (hookProps.state.xmlList[i].checked === true) {
      hasItem = true;
      listUrl.push('file://' + hookProps.state.xmlList[i].path);
    }
  }
  if (hasItem === false) {
    Alert.alert('', 'Chưa có file nào được chọn');
    return;
  }
  if (listUrl.length > 1) {
    Alert.alert('', 'Chỉ chọn được 1 file');
  }

  await importXmlFromPath(listUrl[0]);
};

export const onDeleteFilePress = async () => {
  let hasItem = false;
  let selectedItem = 0;
  for (let i = 0; i < hookProps.state.xmlList.length; i++) {
    if (hookProps.state.xmlList[i].checked === true) {
      hasItem = true;
      selectedItem++;
    }
  }
  if (hasItem) {
    Alert.alert('Xóa file ?', 'Bạn có muốn xóa ' + selectedItem + ' file ?', [
      {
        text: 'Hủy',
        style: 'cancel',
        onPress: () => {},
      },
      {
        text: 'Xóa',
        onPress: async () => {
          for (let i = 0; i < hookProps.state.xmlList.length; i++) {
            if (hookProps.state.xmlList[i].checked === true) {
              await deleteFile(hookProps.state.xmlList[i].path);
            }
          }
          if (hasItem) {
            updateXmlFile();
          }
        },
      },
    ]);
    // showAlertDanger({
    //   title: 'Xóa',
    //   subtitle: 'Bạn có muốn xóa ' + selectedItem + ' file ?',
    //   onOkPress: async () => {
    //     for (let i = 0; i < hookProps.state.xmlList.length; i++) {
    //       if (hookProps.state.xmlList[i].checked === true) {
    //         await deleteFile(hookProps.state.xmlList[i].path);
    //       }
    //     }
    //     if (hasItem) {
    //       //controller.();
    //     }
    //   },
    //   onCancelPress: () => {},
    // });
  }
};
