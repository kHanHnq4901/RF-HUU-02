import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import component from '../component';
import { Header } from '../component/header';
import { GuideBookScreen } from '../screen/guideBook';
import { SettingUserScreen } from '../screen/settingUser';
import { UserInfoScreen } from '../screen/userInfoScreen';
import { screenDatas } from '../shared';
import { Fonts } from '../theme';
import { DrawerParamsList } from './model/model';

const Drawer = createDrawerNavigator<DrawerParamsList>();

// const heightHeader = 60 * scale;
export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Overview"
      screenOptions={{
        headerTitleStyle: { fontFamily: Fonts },
        drawerStyle: { width: '80%', maxWidth: 450 },

        // headerStyle: { height: heightHeader },
        swipeEdgeWidth: 0,
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
              options={{ title: e.title }}
              initialParams={{ title: e.title, info: e.info }}
            />
          );
        } else {
          return null;
        }
      })}
      <Drawer.Screen
        name="UserInfo"
        component={UserInfoScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="SettingUser"
        component={SettingUserScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="GuideBook"
        component={GuideBookScreen}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};
