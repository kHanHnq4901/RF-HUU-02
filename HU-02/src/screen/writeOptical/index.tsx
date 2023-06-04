import throttle from 'lodash.throttle';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button} from '../../component/button/button';
import Loader3 from '../../component/loader3';
import {RadioText} from '../../component/radioText';
import {USER_ROLE_TYPE} from '../../service/user';
import Theme, {Colors, CommonFontSize, sizeScreen} from '../../theme';
import {GetHookProps, hookProps, onDeInit, onInit, store} from './controller';
import {onReadOpticalPress, onWriteOpticalPress} from './handleButton';

export const WriteOpticalScreen = () => {
  GetHookProps();

  useEffect(() => {
    onInit();
    return onDeInit;
  }, []);
  return (
    <View style={styles.container}>
      {hookProps.state.isBusy && (
        <View style={styles.containerLoader}>
          <Loader3 />
        </View>
      )}
      <Text style={styles.status}>{hookProps.state.status}</Text>
      <ScrollView
        contentContainerStyle={styles.contentContainerScroll}
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <View style={styles.row}>
          <View style={styles.width50}>
            <RadioText
              label="Seri đồng hồ:"
              checked={hookProps.state.seriMeter.checked}
              onCheckedChange={() => {
                hookProps.setState(state => {
                  state.seriMeter.checked = !state.seriMeter.checked;
                  return {...state};
                });
              }}
              onChangeText={text => {
                //console.log('seri text:', text);

                hookProps.data.seriMeter = text;
              }}
              
              maxLength={10}
              textAlign="right"
              containerStyle={styles.width50}
              keyboardType="numeric"
              ref={hookProps.refSeriMeter}
            />
          </View>

          <View style={styles.width50}>
            <RadioText
              label="Seri module:"
              checked={hookProps.state.seriModule.checked}
              onCheckedChange={() => {
                hookProps.setState(state => {
                  state.seriModule.checked = !state.seriModule.checked;
                  return {...state};
                });
              }}
              onChangeText={text => {
                hookProps.data.seriModule = text;
              }}
              // defaultValue={hookProps.state.seriModule.value}
              maxLength={10}
              textAlign="right"
              containerStyle={styles.width50}
              keyboardType="numeric"
              ref={hookProps.refSeriModule}
            />
          </View>
          <View style={styles.width50}>
            <RadioText
              label="Chỉ số (lít):"
              checked={hookProps.state.immediateData.checked}
              onCheckedChange={() => {
                hookProps.setState(state => {
                  state.immediateData.checked = !state.immediateData.checked;
                  return {...state};
                });
              }}
              onChangeText={text => {
                //console.log('seri data:', text);
                hookProps.data.immediateData = text;
              }}
              // defaultValue={hookProps.state.immediateData.value}
              maxLength={10}
              textAlign="right"
              containerStyle={styles.width50}
              keyboardType="numeric"
              ref={hookProps.refImmediateData}
            />
          </View>
          <View style={styles.width100}>
            <RadioText
              label="IP-Port:"
              checked={hookProps.state.ipPort.checked}
              onCheckedChange={() => {
                hookProps.setState(state => {
                  state.ipPort.checked = !state.ipPort.checked;
                  return {...state};
                });
              }}
              onChangeText={text => {
                //console.log('seri data:', text);
                hookProps.data.ipPortString = text;
              }}
              // defaultValue={hookProps.state.ipPort.value}
              placeholder="222.252.14.147:6060"
              maxLength={30}
              textAlign="right"
              containerStyle={styles.width50}
              // keyboardType='numbers-and-punctuation'
              ref={hookProps.refIPPort}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.areaButton}>
        <Button
          label="Đọc"
          onPress={throttle(onReadOpticalPress, 1000)}
          style={{flex: 1, height: 50, maxWidth: 150}}
        />
        {(store.state.userInfo.USER_TYPE === USER_ROLE_TYPE.ADMIN ||
          store.state.userInfo.USER_TYPE === USER_ROLE_TYPE.STAFF) && (
          <Button
            style={{
              backgroundColor: Theme.Colors.secondary,
              flex: 1,
              height: 50,
              maxWidth: 150,
            }}
            label="Ghi"
            onPress={throttle(onWriteOpticalPress, 1000)}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.backgroundColor,
  },
  status: {
    color: Colors.primary,
    fontSize: CommonFontSize,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginVertical: 5,
    marginHorizontal: 15,
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
  contentContainerScroll: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  width50: {
    width: sizeScreen.width / 2 - 30,
    minWidth: 150,
  },
  width100: {
    width: sizeScreen.width - 30,
    minWidth: 150,
    maxWidth: 250,
  },
  areaButton: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
