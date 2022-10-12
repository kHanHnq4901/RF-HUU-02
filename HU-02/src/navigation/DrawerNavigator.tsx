import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import component from '../component';
import {Header} from '../component/header';
import {screenDatas} from '../shared';
import {Fonts, scale} from '../theme';
import {DrawerParamsList} from './model/model';
import {UserInfoScreen} from '../screen/userInfoScreen';
import {SettingUserScreen} from '../screen/settingUser';

const Drawer = createDrawerNavigator<DrawerParamsList>();

const heightHeader = 50 * scale;
export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="ReadOptical"
      screenOptions={{
        headerTitleStyle: {fontFamily: Fonts},
        drawerStyle: {width: '80%', maxWidth: 450},
        headerStyle: {height: heightHeader},
        header: props => <Header {...props} />,
      }}
      drawerContent={props => <component.DrawerContent {...props} />}>
      {screenDatas.map(e => {
        if (e.component) {
          return (
            <Drawer.Screen
              key={e.id}
              name={e.id}
              component={e.component}
              options={{title: e.title}}
              initialParams={{title: e.title, info: e.info}}
            />
          );
        } else {
          return null;
        }
      })}
      <Drawer.Screen
        name="UserInfo"
        component={UserInfoScreen}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="SettingUser"
        component={SettingUserScreen}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};
