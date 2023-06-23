import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Caption} from 'react-native-paper';
import {StackRootList} from '../../navigation/model/model';
import {Colors, normalize} from '../../theme';
import {
  GetHookProps,
  hookProps,
  onDeInit,
  onInit,
  PropsItemBle,
  setStatus,
  store,
} from './controller';
import {connectHandle, disConnect, onScanPress} from './handleButton';

const TAG = 'BleScreen:';

const BleItem = (props: PropsItemBle) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setStatus('Đang kết nối tới  ' + props.name + ' ...');
        connectHandle(props.id);
      }}
      style={styles.containerItem}
      onLongPress={() => {
        disConnect(props.id);
      }}>
      <View style={styles.row}>
        <Text style={{...styles.titleItem, maxWidth: '80%'}}>{props.name}</Text>
        <IconFontAwesome
          name="bluetooth"
          size={25}
          color={
            props.id === store.state.hhu.idConnected ? '#5fe321' : '#8f0cad'
          }
        />
      </View>
      <Caption style={styles.caption}>{props.id}</Caption>
    </TouchableOpacity>
  );
};

//const BleItemMemorize = React.memo(BleItem, (prev, next) => next.id !== );

export const SetUpBleScreen = () => {
  GetHookProps();

  const navigation = useNavigation<StackNavigationProp<StackRootList>>();

  React.useEffect(() => {
    onInit(navigation);
    return () => {
      onDeInit();
    };
  }, []);

  //const refScroll = useRef<any>({});

  return (
    <View style={{flex: 1, paddingHorizontal: 10}}>
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 20,
          paddingHorizontal: 8,
        }}>
        <View style={{flex: 1}} />
        <TouchableOpacity
          onPress={onScanPress}
          style={{
            flexDirection: 'row',
            backgroundColor: '#ede8e9',
            padding: 10,
            borderRadius: 15,
          }}>
          <Text style={{fontSize: 20, marginRight: 10, color: Colors.text}}>
            {hookProps.state.ble.isScan ? 'Đang tìm kiếm ...' : 'Tìm kiếm'}
          </Text>
          <IconAnt name="search1" size={35} color="#f70f3c" />
        </TouchableOpacity>
      </View>

      <Text style={styles.status}>{hookProps.state.status}</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {store.state.hhu.connect === 'CONNECTED' && (
          <>
            <Text style={{...styles.title, marginBottom: 10}}>
              Thiết bị đang kết nối:
            </Text>
            <BleItem
              id={store.state.hhu.idConnected as string}
              name={store.state.hhu.idConnected as string}
            />
          </>
        )}

        <Text style={{...styles.title, marginBottom: 10}}>
          Thiết bị khả dụng:
        </Text>
        {hookProps.state.ble.listNewDevice.map((item, index) => {
          return <BleItem key={item.id} id={item.id} name={item.name} />;
        })}
        <Text style={{...styles.title, marginBottom: 10, marginTop: 25}}>
          Thiết bị đã kết nối:
        </Text>
        {hookProps.state.ble.listBondedDevice.map((item, index) => {
          return <BleItem key={item.id} id={item.id} name={item.name} />;
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: Colors.text,
    // fontWeight: 'bold',
  },
  titleItem: {
    fontSize: 20,
    color: Colors.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerItem: {
    paddingVertical: 20,
    marginVertical: 5,
    backgroundColor: '#ede8e9',
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  caption: {
    color: 'green',
  },
  status: {
    fontSize: normalize(18),
    color: Colors.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginVertical: 5,
  },
});
