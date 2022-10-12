import { Alert } from 'react-native';
import { connectLatestBLE } from '../../service/hhu/Ble/bleHhuFunc';
import { ObjSend } from '../../service/hhu/Ble/hhuFunc';
import BleManager from '../../util/BleManager';
import { showToast } from '../../util/util';
import { navigation, store } from './controller';

export async function onBlePress() {
  // if (store.state.hhu.connected === 'BLE') {

  if (store.state.hhu.connect === 'DISCONNECTED') {
    try {
      connectLatestBLE(store);
    } catch {}
  } else if (store.state.hhu.connect === 'CONNECTING') {
  } else {
    Alert.alert(
      'Ngắt bluetooth ?',
      'Bạn có muốn ngắt kết nối thiết bị bluetooth ?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Ngắt kết nối',
          onPress: async () => {
            let peripheral = ObjSend.id;
            if (!ObjSend.id) {
              const peripheralConnected =
                await BleManager.getConnectedPeripherals();
              //console.log('getPeripheral Connected: ', peripheralConnected);
              peripheral = peripheralConnected[0].id;
              //console.log(peripheral);
            }
            console.log(peripheral);
            await BleManager.disconnect(peripheral, true);
            //showToast('Ngắt kết nối bluetoth ' + peripheral);
          },
        },
      ],
    );
  }
  // }
}

export function onBleLongPress() {
  //if (store.state.typeConnect === 'BLE') {
  navigation.navigate('BleScreen');
  //}
}
