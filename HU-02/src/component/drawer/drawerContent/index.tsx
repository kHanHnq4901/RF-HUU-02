import {DrawerContentScrollView} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
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
import {Avatar, Divider} from 'react-native-paper';
import {
  DrawerNavigationProps,
  StackRootNavigationProp,
} from '../../../navigation/model/model';

import * as Shared from '../../../shared';
import {screenDatas} from '../../../shared';
import Theme, {Colors, normalize} from '../../../theme';
import {infoHeader} from '../../header';
import {Text} from '../../Text';
import {DrawerItem} from '../drawerItem';
import {GetHookProps, onDeInit, onInit, store} from './controller';

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

  // useEffect(() => {
  //   //console.log('a');
  //   return () => {
  //     console.log('onDeinit:', store.state.appSetting);
  //     saveValueAppSettingToNvm(store.state.appSetting as PropsAppSetting);
  //   };
  // }, [store.state.appSetting]);

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
            style={{height: 120, marginTop: -5}}

            //resizeMode="cover"
          />
          <View style={styles.infoUser}>
            {/* <Avatar.Image
              size={60}
              style={{marginBottom: 10, elevation: 1}}
              source={require('../../../asset/images/icon/rf.jpg')}
            /> */}

            <Image
              source={require('../../../asset/images/logo/logo.png')}
              style={{height: 50, width: 150}}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>HU-02</Text>
            {/* <Text style={Theme.StyleCommon.title}>Gelex HHU</Text> */}
          </View>

          <Text style={styles.userName}>
            {/* 🤗 */}
            {store.state.userInfo.USER_NAME}
          </Text>

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
                      BackHandler.exitApp();
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
          HHU {store.state.hhu.shortVersion}
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
  logo: {height: 25, width: 150, marginTop: 20},
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
    marginTop: -90,
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
    fontFamily: 'kufam-semi-bold-italic',
    fontSize: normalize(25),
    marginBottom: 10,
    color: '#f3688f',
  },
  userName: {
    color: Colors.caption,
    fontSize: normalize(30),
    fontFamily: 'Lato-Regular',
    marginBottom: 15,
    marginVertical: 10,
    marginLeft: 10,
  },
});
