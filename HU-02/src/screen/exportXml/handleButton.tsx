import Share from 'react-native-share';
import * as controller from './controller';
import { hookProps, updateXmlFile } from './controller';
import { showToast } from '../../util/util';
import { showAlertDanger } from '../../service/alert';
import { deleteFile } from '../../shared/file';
import { Alert } from 'react-native';

export const onExportPress = () => {
  //controller.testMoveFile();

  let hasItem = false;
  const listUrl: string[] = [];
  //const filenames: string[] = [];
  for (let i = 0; i < hookProps.state.xmlList.length; i++) {
    if (hookProps.state.xmlList[i].checked === true) {
      hasItem = true;
      listUrl.push('file://' + hookProps.state.xmlList[i].path);
      //filenames.push(hookProps.state.xmlList[i].name.split('.')[0]);
    }
    if (hasItem === false) {
      showToast('Chưa có file nào được chọn');
      return;
    }
  }

  //console.log('filenames:', filenames);

  Share.open({
    title: 'Chia sẻ qua',
    urls: listUrl,
    //filenames: filenames,
    type: 'application/xml',
    showAppsToView: true,
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      err && console.log(err);
    });
};

// export const onDeleteFilePress = async () => {
//   let hasItem = false;
//   let selectedItem = 0;
//   for (let i = 0; i < hookProps.state.xmlList.length; i++) {
//     if (hookProps.state.xmlList[i].checked === true) {
//       hasItem = true;
//       selectedItem++;
//     }
//   }
//   if (hasItem) {
//     showAlertDanger({
//       title: 'Xóa',
//       subtitle: 'Bạn có muốn xóa ' + selectedItem + ' file ?',
//       onOkPress: async () => {
//         for (let i = 0; i < hookProps.state.xmlList.length; i++) {
//           if (hookProps.state.xmlList[i].checked === true) {
//             await deleteFile(hookProps.state.xmlList[i].path);
//           }
//         }
//         if (hasItem) {
//           controller.loadXmlFromStorage();
//         }
//       },
//       onCancelPress: () => {},
//     });
//   }
// };

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
            //controller.();
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
