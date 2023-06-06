import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button} from '../../component/button/button';
import Loader3 from '../../component/loader3';
import {NormalTextInput} from '../../component/normalTextInput';
import Theme, {Colors, normalize} from '../../theme';
import {GetHookProps, hook, onDeInit, onInit} from './controller';
import {
  onGoogleMapPress,
  onReDecareMeter,
  onSearchInfo,
  onUpdateCoordinatePress,
} from './handleButton';

export const PositionMeterScreen = () => {
  GetHookProps();
  useEffect(() => {
    onInit();
    return onDeInit;
  }, []);
  return (
    <View style={styles.container}>
      {hook.state.isBusy && (
        <View style={styles.containerLoader}>
          <Loader3 />
        </View>
      )}
      <Text style={styles.status}>{hook.state.status}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.containerSeri}>
          <View style={{flex: 1}}>
            <NormalTextInput
              label="Seri đồng hồ"
              // style={styles.textInput}
              value={hook.state.seri}
              keyboardType="decimal-pad"
              onChangeText={text => {
                hook.setState(state => {
                  state.seri = text;
                  return {...state};
                });
              }}
            />
          </View>

          <Button
            style={styles.btnSearch}
            label="Tìm kiếm"
            onPress={onSearchInfo}
          />
        </View>

        <NormalTextInput
          value={hook.state.data.LINE_NAME}
          label="Mã trạm: (*)"
          editable={false}

          // onChangeText={text => {
          //   hook.setState(state => {
          //     state.data.CUSTOMER_NAME = text;
          //     return {...state};
          //   });
          // }}
        />
        <NormalTextInput
          value={hook.state.data.CUSTOMER_NAME}
          label="Khách hàng: (*)"
          autoCapitalize="words"
          onChangeText={text => {
            hook.setState(state => {
              state.data.CUSTOMER_NAME = text;
              return {...state};
            });
          }}
        />
        <NormalTextInput
          value={hook.state.data.CUSTOMER_CODE}
          label="Mã khách hàng: (*)"
          onChangeText={text => {
            hook.setState(state => {
              state.data.CUSTOMER_CODE = text;
              return {...state};
            });
          }}
        />
        <NormalTextInput
          value={hook.state.data.PHONE}
          label="SĐT:"
          keyboardType="decimal-pad"
          onChangeText={text => {
            hook.setState(state => {
              state.data.PHONE = text;
              return {...state};
            });
          }}
        />
        <NormalTextInput
          value={hook.state.data.ADDRESS}
          label="Địa chỉ:"
          multiline
          onChangeText={text => {
            hook.setState(state => {
              state.data.ADDRESS = text;
              return {...state};
            });
          }}
        />
        <View style={styles.containerSeri}>
          <View style={{flex: 1}}>
            <NormalTextInput
              label="Toạ độ:"
              // style={styles.textInput}
              value={hook.state.data.COORDINATE}
              onChangeText={text => {
                hook.setState(state => {
                  state.data.COORDINATE = text;
                  return {...state};
                });
              }}
            />
          </View>

          <Button
            style={styles.btnUpdate}
            label="Cập nhật"
            onPress={onUpdateCoordinatePress}
          />
        </View>
        <NormalTextInput
          value={hook.state.data.CREATED}
          label="Ngày khai báo:"
          editable={false}

          // onChangeText={text => {
          //   hook.setState(state => {
          //     state.data.CUSTOMER_NAME = text;
          //     return {...state};
          //   });
          // }}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          style={styles.btnReDeclare}
          label="Khai báo lại"
          onPress={onReDecareMeter}
        />
        <Button
          style={styles.btnMap}
          label="Google Map"
          onPress={onGoogleMapPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.backgroundColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  status: {
    fontSize: normalize(18),
    color: Colors.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginVertical: 5,
  },
  containerLoader: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    zIndex: 1000000,
  },
  title: {
    fontSize: 24,
    margin: 10,
    alignSelf: 'center',
  },
  label: {
    fontSize: normalize(18),
    color: Colors.caption,
    marginBottom: 5,
  },
  containerSeri: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  textInput: {
    fontSize: normalize(18),
    color: Colors.text,
    marginBottom: 5,
    flex: 1,
    // width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    maxWidth: 300,
    // height: 45 * scale,
    textAlign: 'right',
    paddingHorizontal: 15,
    borderColor: Colors.border,
  },

  btnUpdate: {
    backgroundColor: '#f3d20e',
    width: 100,
  },
  btnReDeclare: {
    backgroundColor: '#f3d20e',
    width: 150,
  },
  btnSearch: {
    backgroundColor: '#14f30e',
    width: 100,
  },
  btnMap: {
    // backgroundColor: Colors.secondary,
    width: 150,
    alignSelf: 'center',
  },
});
