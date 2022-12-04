import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import throttle from 'lodash.throttle';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import * as Progress from 'react-native-progress';
import {Button} from '../../component/button/button';
import {DrawerParamsList} from '../../navigation/model/model';
import Theme, {
  Colors,
  CommonFontSize,
  normalize,
  sizeScreen,
} from '../../theme';
import {
  GetHookProps,
  hookProps,
  onDeInit,
  onInit,
  store,
  variable,
} from './controller';
import * as handleBtn from './handleButton';
import {onUpdateFirmWareContainer} from './handleButton';
import {EatBeanLoader} from 'react-native-indicator';
import {ModalGetText} from '../../component/modal/modalGetText';
import {USER_ROLE_TYPE} from '../../service/user';

const sizeChartPie = sizeScreen.width * 0.42;

export const BoardBLEScreen = () => {
  GetHookProps();

  const route = useRoute<RouteProp<DrawerParamsList, 'BoardBLE'>>();

  //const navigation = useNavigation();

  useEffect(() => {
    onInit();
    // navigation.addListener('focus', () => {
    //   console.log('focus');
    // });
    return onDeInit;
  }, []);

  useEffect(() => {
    console.log('route');
    if (route.params?.isUpdate === true) {
      console.log('update from HHU request');
      onUpdateFirmWareContainer(false);
    }
  }, [route.params?.isUpdate]);

  const version =
    store.state.hhu.version?.length === 0
      ? ''
      : 'HHU: ' + store.state.hhu.version;

  return (
    <View style={styles.container}>
      <ModalGetText
        title="Đổi tên"
        visible={hookProps.state.showModalSetName}
        onOKPress={variable.onOkChangeName}
        onDismiss={variable.onDismiss}
      />
      <Text style={styles.version}>{version}</Text>
      <Text style={styles.status}>{hookProps.state.status}</Text>
      <View style={styles.loading}>
        {hookProps.state.isBusy && (
          // <Progress.Circle size={30} indeterminate={true} />
          <EatBeanLoader size={30} />
        )}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.btnArea}>
          <Button
            label="Reset thiết bị"
            style={styles.btn}
            onPress={throttle(handleBtn.onResetBoardBtnPress, 3000)}
          />
          <Button
            label="Đọc version"
            style={styles.btn}
            //style={{ ...styles.btn, backgroundColor: Colors.secondary }}
            onPress={throttle(handleBtn.onReadVersionBtnPress, 2000)}
          />
          <Button
            label="Kiểm tra update"
            style={styles.btn}
            //style={{ ...styles.btn, backgroundColor: Colors.secondary }}
            onPress={throttle(handleBtn.onCheckUpdateBtnPress, 2000)}
          />
          <Button
            label={
              hookProps.state.isUpdatingFirmware
                ? 'Đang cập nhật ...'
                : 'Cập nhật phần mềm'
            }
            style={styles.btn}
            //style={{ ...styles.btn, backgroundColor: Colors.secondary }}
            onPress={throttle(handleBtn.onUpdateFirmWareContainer, 2000)}
          />
          {store.state.userInfo.USER_TYPE === USER_ROLE_TYPE.ADMIN && (
            <Button
              label="Đổi tên thiết bị"
              style={styles.btn}
              //style={{ ...styles.btn, backgroundColor: Colors.secondary }}
              onPress={throttle(handleBtn.onChangeNamePress, 2000)}
            />
          )}
        </View>
        <View
          style={{
            flex: 1,
            minHeight: sizeChartPie,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          {hookProps.state.showProgress && (
            <Progress.Circle
              size={sizeChartPie}
              indeterminate={false}
              progress={hookProps.state.progressUpdate}
              borderWidth={2}
              formatText={pro => {
                //console.log('pro:', pro);
                return (pro * 100).toFixed(1) + '%';
              }}
              showsText={true}
              thickness={5}
              //style={{ margin: 5, padding: 5 }}
            />
          )}
          {/* <Progress.Pie progress={0.4} size={sizeChartPie} /> */}

          {/* <Progress.Bar progress={0.3} width={200} />
        <Progress.Pie progress={0.4} size={50} />
        <Progress.Circle size={30} indeterminate={true} />
        <Progress.CircleSnail color={['red', 'green', 'blue']} /> */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.backgroundColor,
  },
  title: {
    fontSize: 24,
    margin: 5,
    alignSelf: 'center',
  },
  status: {
    color: Colors.primary,
    fontSize: CommonFontSize,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginVertical: 5,
    marginHorizontal: 15,
  },
  btnArea: {
    //flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    marginVertical: 10,
    width: '80%',
    maxWidth: 350,
    height: 45,
    backgroundColor: '#f36784',
  },
  loading: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  version: {
    fontSize: normalize(20),
    color: Colors.text,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginVertical: 10,
  },
});
