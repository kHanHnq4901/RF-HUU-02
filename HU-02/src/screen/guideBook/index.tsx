import React from 'react';
import { StyleSheet } from 'react-native';
import Theme from '../../theme';
import { WebView } from 'react-native-webview';
import { GetHookProps, store } from './controller';
import { endPointsNsx, getUrlNsx } from '../../service/api';

export const GuideBookScreen = () => {
  // useEffect(() => {
  //   controller.onInit();
  //   return controller.onDeInit;
  // }, []);
  GetHookProps();
  const url = getUrlNsx(endPointsNsx.getHDSD);
  return <WebView source={{ uri: url }} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.backgroundColor,
  },
  title: {
    fontSize: 24,
    margin: 10,
    alignSelf: 'center',
  },
});
