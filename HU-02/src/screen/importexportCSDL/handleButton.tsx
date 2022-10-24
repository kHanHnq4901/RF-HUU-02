import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {closeConnection} from '../../database/repository';
import {deleteFile} from '../../shared/file';
import {
  NAME_CSDL,
  PATH_EXECUTE_CSDL,
  PATH_EXPORT_CSDL,
} from '../../shared/path';
import {showToast} from '../../util';
import * as controller from './controller';
import {hookProps} from './controller';

const TAG = 'Handle Btn Import Export CSDL';

export const onImportPress = async () => {
  //controller.testMoveFile();
  // try {
  //   //console.log('here');
  //   await onInitWriteRegister(null);
  // } catch (err) {
  //   console.log(TAG, err);
  // }
  // return;
  let hasItem = false;
  const listUrl: string[] = [];
  //const filenames: string[] = [];
  for (let i = 0; i < hookProps.state.csdlList.length; i++) {
    if (hookProps.state.csdlList[i].checked === true) {
      hasItem = true;
      listUrl.push(hookProps.state.csdlList[i].path);
      //filenames.push(hookProps.state.xmlList[i].name.split('.')[0]);
    }
    if (hasItem === false) {
      showToast('Chưa có file nào được chọn');
      return;
    }
  }

  if (listUrl.length > 1) {
    showToast('Chỉ chọn được 1 file duy nhất');
    return;
  }

  // showAlertWarning({
  //   title: 'Nhập CSDL ?',
  //   subtitle: 'Bạn có muốn nhập CSDL mới ? CSDL cũ sẽ bị mất',
  //   onOkPress: async () => {
  //     try {
  //       await closeConnection();
  //       RNFS.copyFile(listUrl[0], PATH_EXECUTE_CSDL + '/' + NAME_CSDL);
  //       showToast('Cập nhật CSDL mới thành công');
  //       hookProps.setState(state => {
  //         for (let item of state.csdlList) {
  //           item.checked = false;
  //         }
  //         return {...state};
  //       });
  //     } catch (err) {
  //       showToast('Cập nhật CSDL mới thất bại');
  //       console.log(TAG, err.message);
  //     }
  //   },
  //   onCancelPress: () => {},
  // });

  //console.log('filenames:', filenames);
};

const getStringTime = (): string => {
  const date = new Date();
  const str =
    date.getFullYear().toString() +
    '' +
    (date.getMonth() + 1).toString().padStart(2, '0').slice(-2) +
    '' +
    date.getDate().toString().padStart(2, '0').slice(-2) +
    '_' +
    date.getHours().toString().padStart(2, '0').slice(-2) +
    '' +
    date.getMinutes().toString().padStart(2, '0').slice(-2) +
    '' +
    date.getSeconds().toString().padStart(2, '0').slice(-2);
  return str;
};

export const onExportPress = async () => {
  try {
    console.log('move file');

    await RNFS.copyFile(
      'file://' + PATH_EXECUTE_CSDL + '/' + NAME_CSDL,
      PATH_EXPORT_CSDL +
        '/' +
        NAME_CSDL.split('.')[0] +
        '_' +
        getStringTime() +
        '.db',
    );
    console.log(TAG, 'coppy file to ' + PATH_EXPORT_CSDL);
  } catch (err) {
    console.log(TAG, 'Err: ' + err.message);
  }
  // try {
  //   Share.open({
  //     title: 'Chia sẻ qua',
  //     url: 'file://' + PATH_EXECUTE_CSDL + '/' + NAME_CSDL,
  //     //filenames: filenames,
  //     type: 'application/db',
  //     showAppsToView: true,
  //   })
  //     .then(res => {
  //       console.log(res);
  //     })
  //     .catch(err => {
  //       err && console.log(err);
  //     });
  // } catch (err) {
  //   console.log(TAG, err.message);
  // }
};

export const onDeleteFilePress = async () => {
  let hasItem = false;
  let selectedItem = 0;
  for (let i = 0; i < hookProps.state.csdlList.length; i++) {
    if (hookProps.state.csdlList[i].checked === true) {
      hasItem = true;
      selectedItem++;
    }
  }
  if (hasItem) {
    // showAlertDanger({
    //   title: 'Xóa',
    //   subtitle: 'Bạn có muốn xóa ' + selectedItem + ' file ?',
    //   onOkPress: async () => {
    //     for (let i = 0; i < hookProps.state.csdlList.length; i++) {
    //       if (hookProps.state.csdlList[i].checked === true) {
    //         await deleteFile(hookProps.state.csdlList[i].path);
    //       }
    //     }
    //     if (hasItem) {
    //       controller.loadFileCsdlFromStorage();
    //     }
    //   },
    //   onCancelPress: () => {},
    // });
  }
};
