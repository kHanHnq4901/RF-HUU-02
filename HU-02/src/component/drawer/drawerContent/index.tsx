import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Divider } from 'react-native-paper';
import {
  DrawerNavigationProps,
  StackRootNavigationProp,
} from '../../../navigation/model/model';

import RNExitApp from 'react-native-exit-app';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { USER_ROLE_TYPE } from '../../../service/user/index';
import * as Shared from '../../../shared';
import { screenDatas } from '../../../shared';
import Theme, { Colors, normalize } from '../../../theme';
import { Text } from '../../Text';
import { STATUS_BAR_HEIGHT } from '../../customStatusBar';
import { infoHeader } from '../../header';
import { DrawerItem } from '../drawerItem';
import { GetHookProps, onDeInit, onInit, store } from './controller';

const TAG = 'DrawerContent:';

export const DrawerContent = props => {
  const navigation = useNavigation<DrawerNavigationProps>();
  const navigationRoot = useNavigation<StackRootNavigationProp>();

  GetHookProps();

  React.useEffect(() => {
    onInit(navigation);

    return () => {
      onDeInit();
    };
  }, []);

  const safeAreaInsets = useSafeAreaInsets();

  const role =
    store.state.userInfo.USER_TYPE === USER_ROLE_TYPE.ADMIN
      ? 'Admin'
      : store.state.userInfo.USER_TYPE === USER_ROLE_TYPE.STAFF
      ? 'Nhân viên'
      : 'Khách hàng';

  return (
    <View
      style={{
        flex: 1,
        // paddingTop: STATUS_BAR_HEIGHT,
        paddingBottom: safeAreaInsets.bottom,
        backgroundColor: 'white',
      }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.containerInfo}>
          {Platform.OS === 'android' && (
            <ImageBackground
              source={require('../../../asset/images/drawer/HeaderDrawer.jpg')}
              style={{ height: 120, marginTop: -5 }}
            />
          )}
          <View style={styles.infoUser}>
            {/* <Avatar.Image
              size={60}
              style={{marginBottom: 10, elevation: 1}}
              source={require('../../../asset/images/icon/rf.jpg')}
            /> */}

            <Image
              source={require('../../../asset/images/logo/logo.png')}
              style={
                Platform.OS === 'android' ? styles.logoAndroid : styles.logoIOS
              }
              resizeMode="contain"
            />
            <Text style={styles.logoText}>HU-02</Text>
            {/* <Text style={Theme.StyleCommon.title}>Gelex HHU</Text> */}
          </View>

          <Text style={styles.userName}>
            {/* 🤗 */}
            {store.state.userInfo.USER_NAME}
          </Text>

          <Text style={styles.role}>{role}</Text>

          <View style={styles.body}>
            <Divider />
            {screenDatas.map(element => {
              if (element.component) {
                if (element.id === 'ExportLog') {
                  if (store.state.userInfo.ROLE_NAME === 'DVKH') {
                  } else {
                    // return null;
                  }
                }
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

            <DrawerItem
              lable="Hướng dẫn sử dụng"
              icon="help-circle"
              onPress={async () => {
                //navigation.navigate('GuideBook');

                const url = `http://${store.state.appSetting.hhu.host}:${
                  store.state.appSetting.hhu.port
                }/HU_01/HDSD_HU_02.pdf?timestamp=${new Date().getTime()}`;
                const supported = await Linking.canOpenURL(url);

                if (supported) {
                  // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                  // by some browser in the mobile
                  await Linking.openURL(url);
                } else {
                  //Alert.alert('Không thể mở trang web này');
                  try {
                    navigation.navigate('GuideBook');
                  } catch (e) {
                    Alert.alert('Không thể mở trang web này');
                    console.log(TAG, e.message);
                  }
                }
              }}
              colorIcon={Theme.Colors.primary}
              // style={{ color: Theme.Colors.primary }}
            />

            <Divider />
            <Image
              source={require('../../../asset/images/icon/user.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <DrawerItem
              lable="Thông tin người dùng"
              icon="person-outline"
              colorIcon={Colors.secondary}
              onPress={() => {
                navigation.navigate('UserInfo');
              }}
            />
            <Divider />
            <DrawerItem
              lable="Cài đặt tài khoản"
              icon="settings-outline"
              colorIcon={Colors.secondary}
              onPress={() => {
                navigation.navigate('SettingUser');
              }}
            />

            {/* <Divider /> */}
            {/* <View style={styles.margin} /> */}
            <DrawerItem
              lable="Đăng xuất"
              icon="log-out-outline"
              onPress={() => {
                console.log('logged out');
                navigationRoot.push('SignIn');
              }}
              colorIcon={Colors.secondary}
              // style={{ color: Theme.Colors.primary }}
            />
            <Divider />

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
                      // BackHandler.exitApp();
                      RNExitApp.exitApp();
                    },
                  },
                ]);
              }}
              colorIcon={Theme.Colors.secondary}
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
          HU {store.state.hhu.shortVersion}
        </Text>
        <Text style={styles.textVersion}>Phiên bản {Shared.version}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerInfo: {
    // flex: 1,
    marginBottom: 5,
  },
  logo: { height: 25, width: 150, marginTop: 20 },
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
    marginTop: Platform.OS === 'android' ? -90 : -20,
  },
  version: {
    alignItems: 'flex-end',
    marginRight: 20,
  },
  versionHHU: {
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  logoText: {
    fontFamily: Platform.OS === 'android' ? 'kufam-semi-bold-italic' : 'Kufam',
    fontSize: normalize(25),
    marginBottom: 10,
    color: '#f3688f',
  },
  userName: {
    color: Colors.caption,
    fontSize: normalize(30),
    fontFamily: 'Lato-Regular',
    marginBottom: 15,
    marginTop: 10,
    marginEnd: 0,
    marginLeft: 10,
  },
  role: {
    color: Colors.caption,
    fontSize: normalize(14),
    fontFamily: 'Lato-Regular',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  logoAndroid: { height: 50, width: 150 },
  logoIOS: { height: 100, width: 200 },
});
