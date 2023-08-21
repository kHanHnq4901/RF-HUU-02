import React from 'react';
import {
  InputAccessoryView,
  ScrollView,
  StyleSheet,
  View,
  Button as RNButton,
  Keyboard,
  Platform,
} from 'react-native';
import TextInputInteractive from 'react-native-text-input-interactive';
import { Button } from '../../component/button/button';
import { Text } from '../../component/Text';
import { USER_ROLE_TYPE } from '../../service/user';
import { Colors, CommonHeight, normalize, scale } from '../../theme';
import { CommonFontSize } from '../../theme/index';
import { GetHookProps, hookProps, listSelectServer, store } from './controller';
import {
  onNumRetriesReadSubmit,
  onSavePress,
  onSetChanelPress,
} from './handleButton';
import { RadioButton } from '../../component/radioButton/radioButton';

const inputAccessoryViewID = 'uniqueID';

export const SettingAndAlarmScreen = () => {
  GetHookProps();

  return (
    <View style={styles.contain}>
      <ScrollView style={styles.container}>
        {Platform.OS === 'ios' && (
          <InputAccessoryView nativeID={inputAccessoryViewID}>
            <RNButton onPress={() => Keyboard.dismiss()} title="OK" />
          </InputAccessoryView>
        )}
        <Text style={styles.title}>Chọn server:</Text>
        <View style={styles.listSelectServer}>
          {listSelectServer.map(item => {
            return (
              <RadioButton
                checked={hookProps.state.selectedSerVer === item}
                key={item}
                label={item}
                value={item}
                onPress={() => {
                  hookProps.setState(state => {
                    state.selectedSerVer = item;
                    if (item === 'EMIC') {
                      store.state.appSetting.server.host = 'api.emic.com.vn';
                      store.state.appSetting.server.port = '80';
                    } else if (item === 'Sawaco') {
                      store.state.appSetting.server.host = '182.237.21.93';
                      store.state.appSetting.server.port = '3090';
                    }

                    return { ...state };
                  });
                }}
              />
            );
          })}
        </View>
        <View style={styles.containerIPPort}>
          <View style={styles.containerItemIPPort}>
            <Text style={styles.title}>IP dữ liệu:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <Text style={styles.textThreshold}>Nhỏ hơn:</Text> */}
              <TextInputInteractive
                placeholder="182.237.21.93|api.emic.com.vn"
                //keyboardType="numeric"
                placeholderTextColor={Colors.caption}
                value={store.state.appSetting.server.host}
                textInputStyle={styles.textIP}
                onChangeText={text => {
                  store.setState(state => {
                    store.state.appSetting.server.host = text;
                    return { ...state };
                  });
                }}
                // onSubmitEditing={e => {
                //   onNumRetriesReadSubmit(e.nativeEvent.text);
                // }}
              />
            </View>
          </View>
          <View style={styles.containerItemIPPort}>
            <Text style={styles.title}>Port dữ liệu:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <Text style={styles.textThreshold}>Nhỏ hơn:</Text> */}
              <TextInputInteractive
                placeholder="3090"
                keyboardType="numeric"
                inputAccessoryViewID={inputAccessoryViewID}
                placeholderTextColor={Colors.caption}
                value={store.state.appSetting.server.port}
                textInputStyle={styles.valueTextInput}
                onChangeText={text => {
                  store.setState(state => {
                    store.state.appSetting.server.port = text;
                    return { ...state };
                  });
                }}
                // onSubmitEditing={e => {
                //   onNumRetriesReadSubmit(e.nativeEvent.text);
                // }}
              />
            </View>
          </View>
        </View>
        <View style={styles.containerIPPort}>
          <View style={styles.containerItemIPPort}>
            <Text style={styles.title}>IP HU:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <Text style={styles.textThreshold}>Nhỏ hơn:</Text> */}
              <TextInputInteractive
                placeholder=""
                keyboardType="numeric"
                inputAccessoryViewID={inputAccessoryViewID}
                value={store.state.appSetting.hhu.host}
                textInputStyle={styles.textIP}
                onChangeText={text => {
                  store.setState(state => {
                    store.state.appSetting.hhu.host = text.trim();
                    return { ...state };
                  });
                }}
                // onSubmitEditing={e => {
                //   onNumRetriesReadSubmit(e.nativeEvent.text);
                // }}
              />
            </View>
          </View>
          <View style={styles.containerItemIPPort}>
            <Text style={styles.title}>Port HU:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <Text style={styles.textThreshold}>Nhỏ hơn:</Text> */}
              <TextInputInteractive
                placeholder=""
                keyboardType="numeric"
                inputAccessoryViewID={inputAccessoryViewID}
                value={store.state.appSetting.hhu.port}
                textInputStyle={styles.valueTextInput}
                onChangeText={text => {
                  store.setState(state => {
                    store.state.appSetting.hhu.port = text.trim();
                    return { ...state };
                  });
                }}
                // onSubmitEditing={e => {
                //   onNumRetriesReadSubmit(e.nativeEvent.text);
                // }}
              />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Số lần đọc lại:</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* <Text style={styles.textThreshold}>Nhỏ hơn:</Text> */}
          <TextInputInteractive
            placeholder=""
            keyboardType="numeric"
            inputAccessoryViewID={inputAccessoryViewID}
            value={store.state.appSetting.numRetriesRead}
            textInputStyle={styles.valueTextInput}
            onChangeText={text => {
              store.setState(state => {
                store.state.appSetting.numRetriesRead = text.trim();
                return { ...state };
              });
            }}
            onSubmitEditing={e => {
              onNumRetriesReadSubmit(e.nativeEvent.text);
            }}
          />
        </View>
        {store.state.userInfo.USER_TYPE === USER_ROLE_TYPE.ADMIN && (
          <>
            <Text style={styles.title}>Cấu hình kênh RF:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <Text style={styles.textThreshold}>Nhỏ hơn:</Text> */}
              <TextInputInteractive
                placeholder=""
                keyboardType="numeric"
                inputAccessoryViewID={inputAccessoryViewID}
                editable={false}
                value={hookProps.state.chanelRF}
                textInputStyle={styles.valueTextInput}
                // onChangeText={text => {
                //   hookProps.setState(state => {
                //     state.chanelRF = text;
                //     return {...state};
                //   });
                // }}
              />
              <Button
                style={styles.buttonSmall}
                label="Cài"
                onPress={onSavePress}
              />
            </View>
            <View style={styles.chanelRF}>
              {hookProps.state.chanelRFRadio.map((item, index) => {
                return (
                  <RadioButton
                    key={item}
                    label={item}
                    value={item}
                    checked={
                      hookProps.state.chanelRF === index.toString()
                        ? true
                        : false
                    }
                    onPress={() => {
                      hookProps.setState(state => {
                        state.chanelRF = index.toString();
                        return { ...state };
                      });
                    }}
                  />
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
      <View style={styles.btnBottom}>
        <Button style={styles.button} label="Lưu" onPress={onSavePress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listSelectServer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  contain: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  chanelRF: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginVertical: 5,
    marginBottom: 50,
  },
  container: {
    flex: 1,
    marginHorizontal: 10,
    paddingTop: 15,
    backgroundColor: 'white',
  },
  title: {
    fontSize: normalize(18),
    marginLeft: 5,
    color: Colors.caption,
    marginVertical: 10,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  textThreshold: {
    marginHorizontal: 5,
    fontSize: normalize(14),
    height: CommonHeight,
    textAlignVertical: 'center',
    color: Colors.text,
    //color: 'black',
  },
  valueTextInput: {
    width: 80 * scale,
    borderColor: '#6e83e4',
    height: CommonHeight,
    fontSize: CommonFontSize,
    color: Colors.text,
  },
  btnBottom: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
  },
  button: {
    width: '50%',
    height: 50,
    alignSelf: 'center',
    maxWidth: 350,
  },
  buttonSmall: {
    width: '30%',
    height: 45,
    alignSelf: 'center',
    maxWidth: 100,
    backgroundColor: '#0cf814',
  },
  containerItemIPPort: {
    marginRight: 20,
  },
  containerIPPort: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: 15,
  },
  textIP: {
    width: 200 * scale,
    borderColor: '#6e83e4',
    height: CommonHeight,
    fontSize: CommonFontSize,
    color: Colors.text,
  },
});
