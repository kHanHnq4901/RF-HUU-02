import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import TextInputInteractive from 'react-native-text-input-interactive';
import { Button } from '../../component/button/button';
import { RadioButton } from '../../component/radioButton/radioButton';
import { Text } from '../../component/Text';
import { Colors, CommonHeight, normalize, scale } from '../../theme';
import { CommonFontSize } from '../../theme/index';
import * as controller from './controller';
import { store } from './controller';
import {
  onLowerThresholdDoneSubmit,
  onNumRetriesReadSubmit,
  onSavePress,
  onUpperThresholdDoneSubmit,
} from './handleButton';

export const SettingAndAlarmScreen = () => {
  controller.GetHookProps();

  return (
    <>
      <ScrollView style={styles.conatiner}>
        {/* <Text style={styles.title}>Ngưỡng cảnh báo điện năng:</Text>
        <View style={styles.row}>
          {controller.typeAlarmRegister.map(item => {
            return (
              <RadioButton
                key={item.value}
                label={item.title}
                value={item.value}
                checked={
                  store.state.appSetting.setting.typeAlarm === item.value
                    ? true
                    : false
                }
                onPress={() => {
                  store.setValue(state => {
                    state.appSetting.setting.typeAlarm = item.value;
                    return { ...state };
                  });
                }}
              />
            );
          })}
        </View>
        <View style={styles.row}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.textThreshold}>Nhỏ hơn:</Text>
            <TextInputInteractive
              placeholder=""
              keyboardType="numeric"
              value={
                store.state.appSetting.setting.typeAlarm === 'Value'
                  ? store.state.appSetting.setting.lowerThresholdValue
                  : store.state.appSetting.setting.lowerThresholdPercent
              }
              textInputStyle={styles.valueTextInput}
              onChangeText={text => {
                store.setValue(state => {
                  if (state.appSetting.setting.typeAlarm === 'Value') {
                    state.appSetting.setting.lowerThresholdValue = text;
                  } else {
                    state.appSetting.setting.lowerThresholdPercent = text;
                  }
                  return { ...state };
                });
              }}
              onSubmitEditing={e => {
                onLowerThresholdDoneSubmit(e.nativeEvent.text);
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.textThreshold}>Lớn hơn:</Text>
            <TextInputInteractive
              placeholder=""
              keyboardType="numeric"
              value={
                store.state.appSetting.setting.typeAlarm === 'Value'
                  ? store.state.appSetting.setting.upperThresholdValue
                  : store.state.appSetting.setting.upperThresholdPercent
              }
              onChangeText={text => {
                store.setValue(state => {
                  if (state.appSetting.setting.typeAlarm === 'Value') {
                    state.appSetting.setting.upperThresholdValue = text;
                  } else {
                    state.appSetting.setting.upperThresholdPercent = text;
                  }
                  return { ...state };
                });
              }}
              onSubmitEditing={e => {
                onUpperThresholdDoneSubmit(e.nativeEvent.text);
              }}
              textInputStyle={styles.valueTextInput}
            />
          </View>
        </View> */}
        <View style={styles.containerIPPort}>
          <View style={styles.containerItemIPPort}>
            <Text style={styles.title}>IP:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <Text style={styles.textThreshold}>Nhỏ hơn:</Text> */}
              <TextInputInteractive
                placeholder=""
                keyboardType="numeric"
                value={store.state.appSetting.IP}
                textInputStyle={styles.textIP}
                onChangeText={text => {
                  store.setValue(state => {
                    store.state.appSetting.IP = text;
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
            <Text style={styles.title}>Port:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <Text style={styles.textThreshold}>Nhỏ hơn:</Text> */}
              <TextInputInteractive
                placeholder=""
                keyboardType="numeric"
                value={store.state.appSetting.Port}
                textInputStyle={styles.valueTextInput}
                onChangeText={text => {
                  store.setValue(state => {
                    store.state.appSetting.Port = text;
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
            value={store.state.appSetting.numRetriesRead}
            textInputStyle={styles.valueTextInput}
            onChangeText={text => {
              store.setValue(state => {
                store.state.appSetting.numRetriesRead = text;
                return { ...state };
              });
            }}
            onSubmitEditing={e => {
              onNumRetriesReadSubmit(e.nativeEvent.text);
            }}
          />
        </View>
        {/* <Text style={styles.title}>
        Hiển thị dữ liệu ghi thành công khi ghi chỉ số:
      </Text>
      <CheckboxButton
        label="Hiển thị"
        checked={store.state.appSetting.showResultOKInWriteData}
        onPress={onCheckBoxShowDataOkInWriteRegister}
      /> */}
      </ScrollView>
      <View style={styles.btnBottom}>
        <Button style={styles.button} label="Lưu" onPress={onSavePress} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    marginHorizontal: 10,
    paddingTop: 15,
  },
  title: {
    fontSize: normalize(18),
    marginLeft: 5,
    color: Colors.text,
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
  containerItemIPPort: {
    marginRight: 20,
  },
  containerIPPort: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  textIP: {
    width: 200 * scale,
    borderColor: '#6e83e4',
    height: CommonHeight,
    fontSize: CommonFontSize,
    color: Colors.text,
  },
});
