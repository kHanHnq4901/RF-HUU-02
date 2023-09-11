import { DrawerHeaderProps } from '@react-navigation/drawer/lib/typescript/src/types';
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { CircleSnail } from 'react-native-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { RouteProp, useRoute } from '@react-navigation/native';
import { navigationRef } from '../../navigation/StackRootNavigator';
import {
  DrawerParamsList,
  ParamsDrawerProps,
} from '../../navigation/model/model';
import { navigationStackReadOptical } from '../../screen/readOptical/controller';
import { screenDatas } from '../../shared';
import Theme, { Colors, normalize, scale } from '../../theme';
import { STATUS_BAR_HEIGHT } from '../customStatusBar';
import LoadingModal from '../loadingModal/index';
import { GetHookProps, store } from './controller';
import { onBleLongPress, onBlePress } from './handleButton';

const TAG = 'HEADER:';

export let infoHeader = {
  title: screenDatas[0].title,
  info: screenDatas[0].info,
} as ParamsDrawerProps;

const sizeIcon = scale * 25;

export function Header(props: DrawerHeaderProps) {
  GetHookProps();

  const route = useRoute<RouteProp<DrawerParamsList, 'Overview'>>();

  // if (props.route.params) {
  //   params = props.route.params as ParamsDrawerProps;
  // }

  const title = navigationRef?.isReady()
    ? navigationRef?.getCurrentOptions()?.title ??
      route.params?.title ??
      props.route.name
    : route.params?.title ?? props.route.name;

  if (navigationRef?.isReady()) {
    console.log('title:', navigationRef?.getCurrentOptions()?.title);
  }

  let back: boolean = false;

  // React.useEffect(() => {
  //   if (title === 'Log') {
  //     props.navigation.setOptions({
  //       headerShown: false,
  //     });
  //   } else {
  //     if (props.options.headerShown === false) {
  //       props.navigation.setOptions({
  //         headerShown: true,
  //       });
  //     }
  //   }
  // }, [title]);

  // console.log('props.back:', props.back);

  if (title === 'Log') {
    back = true;
  }

  //theme.colors.surface
  return (
    <View style={styles.header}>
      {back ? (
        <Appbar.BackAction
          onPress={navigationStackReadOptical.goBack}
          color={Colors.secondary}
        />
      ) : (
        <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
          <Avatar.Image
            size={40 * scale}
            source={require('../../asset/images/icon/user.png')}
            style={{
              elevation: 5,
              marginLeft: 5,
              zIndex: 100,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
            }}
          />
          {/* <Icon name="user-circle" size={40} color={theme.colors.primary} /> */}
        </TouchableOpacity>
      )}
      {/* <Appbar.Content
        style={{
          //alignItems: 'center',
          //backgroundColor: 'pink',
          //position: 'absolute',
          //left: dimensionwidth,
          alignSelf: 'center',
        }}
        titleStyle={{ alignSelf: 'center', fontSize: normalize(18) }}
        title={route.params?.title}
      /> */}
      <Text style={styles.title}>{title}</Text>
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        onLongPress={onBleLongPress}
        onPress={onBlePress}
        style={styles.borderIcon}>
        {store.state.hhu.connect === 'CONNECTING' ? (
          <CircleSnail
            color={['red', 'green', 'blue']}
            size={sizeIcon}
            indeterminate={true}
            thickness={1}
            //borderWidth={1}
          />
        ) : (
          <MaterialCommunityIcons
            name={
              store.state.hhu.connect ? 'bluetooth-connect' : 'bluetooth-off'
            }
            size={sizeIcon}
            color={
              store.state.hhu.connect === 'CONNECTED' ? '#5fe321' : 'black'
            }
          />
        )}
      </TouchableOpacity>
      {/* <View style={styles.borderIcon}>
          <MaterialCommunityIcons
            name="information-outline"
            onPress={() => {
              store.setState(state => {
                state.modal.showInfo = true;
                return {...state};
              });
            }}
            size={sizeIcon}
            color="#5fe321"
          />
        </View> */}

      {/* <ModalListBle />
      <ModalListUsb />
      <ModalSetting /> */}

      {/* <Divider /> */}

      {/* <ModalInfo title="Thông tin" info={infoHeader.info} /> */}
      <LoadingModal
        task={'Đang tải dữ liệu ...'}
        modalVisible={
          store.state.isBusy === true && store.state.canShowModalBusy === true
        }
        // modalVisible={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    elevation: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    // height: 60 * scaleHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    paddingTop: 5,
    minHeight: 50,
  },
  itemMenu: {
    height: 30,
    marginHorizontal: 5,
    //marginVertical: 10,
    paddingLeft: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: normalize(18),
    marginLeft: 10,
    letterSpacing: 0.1,
    color: 'black',
    //color: '#1c1cfb',
    //color: Theme.Colors.secondary,
  },
  borderIcon: {
    width: 40 * scale,
    height: 40 * scale,
    borderRadius: 50,
    backgroundColor: Theme.Colors.backgroundIcon,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
