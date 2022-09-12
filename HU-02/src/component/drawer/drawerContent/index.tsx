import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  BackHandler,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Avatar, Divider } from 'react-native-paper';
import { DrawerNavigationProps } from '../../../navigation/model/model';

import * as Shared from '../../../shared';
import { screenDatas } from '../../../shared';
import Theme, { Colors, normalize } from '../../../theme';
import { infoHeader } from '../../header';
import { Text } from '../../Text';
import { DrawerItem } from '../drawerItem';
import { GetHookProps, onDeInit, onInit, store } from './controller';

const TAG = 'DrawerContent:';

export const DrawerContent = props => {
  const navigation = useNavigation<DrawerNavigationProps>();
  //const navigationRoot = useNavigation<StackRootNavigationProp>();

  GetHookProps();

  React.useEffect(() => {
    onInit(navigation);

    return () => {
      onDeInit();
    };
  }, []);

  // useEffect(() => {
  //   //console.log('a');
  //   return () => {
  //     console.log('onDeinit:', store?.value.appSetting);
  //     saveValueAppSettingToNvm(store?.value.appSetting as PropsAppSetting);
  //   };
  // }, [store?.value.appSetting]);

  //console.log('ren drawer');

  return (
    <>
      <StatusBar
        backgroundColor={Theme.Colors.primary}
        barStyle="light-content"
      />
      <DrawerContentScrollView {...props}>
        <View style={styles.containerInfo}>
          <ImageBackground
            source={require('../../../asset/images/drawer/HeaderDrawer.jpg')}
            style={{ height: 120, marginTop: -5 }}

            //resizeMode="cover"
          />
          <View style={styles.infoUser}>
            <Avatar.Image
              size={60}
              style={{ marginBottom: 10, elevation: 1 }}
              source={require('../../../asset/images/icon/rf.jpg')}
            />
            <Image
              source={require('../../../asset/images/logo/logo.png')}
              style={{ height: 50, width: 150 }}
              resizeMode="contain"
            />
            {/* <Text style={Theme.StyleCommon.title}>Gelex HHU</Text> */}
          </View>

          <View style={styles.body}>
            <Divider />
            {screenDatas.map(element => {
              if (element.component) {
                return (
                  <DrawerItem
                    key={element.id}
                    lable={element.title}
                    icon={element.icon}
                    colorIcon={Theme.Colors.primary}
                    onPress={() => {
                      //console.log(element.id);
                      infoHeader.title = element.title;
                      infoHeader.info = element.info;
                      //navigation.closeDrawer();
                      //console.log('func close:', navigation);
                      navigation.navigate(element.id, {
                        info: element.info,
                        title: element.title,
                      });
                    }}
                  />
                );
              } else {
                return null;
              }
            })}
            {/* title: 'Đọc RF',
    info: `
    Đọc dữ liệu tức thời công tơ bất kỳ, dữ liệu sẽ không được lưu vào DB.
    Chức năng Khởi tạo, Search , Reset module công tơ
    `,

    id: 'ReadParameter',
    icon: 'ios-book-outline',
    component: ReadParameterScreen, */}
            {/* <DrawerItem
              lable="Đọc RF"
              icon="ios-book-outline"
              colorIcon={Theme.Colors.primary}
              onPress={() => {
                //console.log(element.id);
                infoHeader.title = 'Đọc RF';
                infoHeader.info = `
                      Đọc dữ liệu tức thời công tơ bất kỳ, dữ liệu sẽ không được lưu vào DB.
                      Chức năng Khởi tạo, Search , Reset module công tơ
                      `;
                navigation.navigate('ReadParameter', {
                  info: `
                        Đọc dữ liệu tức thời công tơ bất kỳ, dữ liệu sẽ không được lưu vào DB.
                        Chức năng Khởi tạo, Search , Reset module công tơ
                        `,
                  title: 'Đọc RF',
                });
              }}
            /> */}

            <Divider />
            <DrawerItem
              lable="Thoát"
              icon="log-out"
              onPress={() => {
                //navigationRoot.navigate('Login');
                Alert.alert('Thoát', 'Bạn có muốn thoát ứng dụng ?', [
                  {
                    text: 'Hủy',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      BackHandler.exitApp();
                    },
                  },
                ]);
              }}
              colorIcon={Theme.Colors.primary}
              // style={{ color: Theme.Colors.primary }}
            />
          </View>
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 20,
        }}>
        <Text style={styles.textVersion}>
          HHU {store?.value.hhu.shortVersion}
        </Text>
        <Text style={styles.textVersion}>Phiên bản {Shared.version}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerInfo: {
    // flex: 1,
    marginBottom: 5,
  },
  textVersion: {
    fontSize: normalize(12),
    color: Colors.caption,
  },
  body: {
    marginHorizontal: 20,
    marginVertical: 10,
    paddingTop: 10,
  },
  infoUser: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: -50,
  },
  version: {
    alignItems: 'flex-end',
    marginRight: 20,
  },
  versionHHU: {
    alignItems: 'flex-start',
    marginLeft: 20,
  },
});
