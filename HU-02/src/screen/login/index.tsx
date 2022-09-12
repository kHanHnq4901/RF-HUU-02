import React, { useContext } from 'react';
import { Alert, BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import LoginSC from 'react-native-login-screen';
import { screenDatas, version as ver } from '../../shared';

import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { StackRootNavigationProp } from '../../navigation/model/model';
import { updateValueAppSettingFromNvm } from '../../service/storage';
import { storeContext } from '../../store/store';
import { isValidText } from '../../util/util';

const TAG = 'LoginScreen:';

const version = 'HU-02 Esoft Version ' + ver;

let pass = '';

export const LoginScreen = () => {
  //const [showAlert, setShowAlert] = useState<boolean>(false);
  //const navigation = useNavigation();
  const navigation = useNavigation<StackRootNavigationProp>();

  const store = useContext(storeContext);

  const onInit = async () => {
    let appSetting = await updateValueAppSettingFromNvm();
    store?.setValue(state => {
      state.appSetting = appSetting;
      return { ...state };
    });
    try {
      const { data }: { data: string } = await axios.get(
        'http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh',
      );
      const onlineDate = new Date(data);
      const curDate = new Date();
      const secDif = (curDate.getTime() - onlineDate.getTime()) / 1000;
      if (Math.abs(secDif) > 120) {
        Alert.alert(
          'Thời gian sai',
          'Thời gian của thiết bị chưa đúng, vui lòng chỉnh lại để đám bảo tính đúng của dữ liệu khi ghi chỉ số',
        );
      } else {
        console.log(TAG, 'time is true');
      }
    } catch (err) {
      console.log(TAG, err.message);
    }
  };

  React.useLayoutEffect(() => {
    onInit();
  }, []);

  React.useEffect(() => {
    // navigation.addListener('focus', e => {
    //   //e.preventDefault();
    //   console.log('focus');
    //   setShowAlert(_ => false);
    // });
    //console.log('ren');
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={{ backgroundColor: 'pink' }}>My nae is Tan</Text> */}
      <StatusBar backgroundColor="transparent" />
      <LoginSC
        style={{ backgroundColor: 'white' }}
        disableSocialButtons={true}
        haveAccountText={version}
        logoImageSource={require('../../asset/images/logo/logo.png')}
        onLoginPress={() => {
          if (isValidText(pass) === false) {
            //setShowAlert(true);
            Alert.alert('Lỗi', 'Mật khẩu không hợp lệ');
            return;
          }
          if (pass !== store?.value.appSetting.password) {
            Alert.alert('Lỗi', 'Mật khẩu không chính xác');
            return;
          }
          //console.log('login');
          const itemOverView = screenDatas.find(item => item.id === 'Overview');
          navigation.navigate('Drawer', {
            screen: 'Overview',
            params: {
              info: itemOverView?.info ?? '',
              title: itemOverView?.title ?? '',
            },
          });
        }}
        onHaveAccountPress={() => {}}
        onEmailChange={(email: string) => {}}
        onPasswordChange={(password: string) => {
          pass = password;
        }}
      />
      {/* <SCLAlert
        show={showAlert}
        onRequestClose={() => {}}
        slideAnimationDuration={0}
        theme="danger"
        title="Lỗi"
        subtitle="Mật khẩu không chính xác"
        headerIconComponent={
          <MaterialIcons name="error" size={32} color="white" />
        }>
        <SCLAlertButton
          theme="danger"
          onPress={() => {
            setShowAlert(false);
          }}>
          OK
        </SCLAlertButton>
      </SCLAlert> */}
    </View>
    //<Text>Helllo</Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
