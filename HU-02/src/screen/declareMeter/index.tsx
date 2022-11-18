import React, {Component, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View, TextInput} from 'react-native';
import {Button} from '../../component/button/button';
import Loader3 from '../../component/loader3';
import Theme, {Colors, normalize} from '../../theme';
import {GetHookProps, hookProps, onDeInit, onInit} from './controller';
import {onDeclarePress} from './handleButton';

export const DeclareMeterScreen = () => {
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.containerSeri}>
          <TextInput
            style={styles.seri}
            value={hookProps.state.seri}
            onChangeText={text => {
              hookProps.setState(state => {
                state.seri = text;
                return {...state};
              });
            }}
            keyboardType="number-pad"
            placeholder="Số NO module"
          />
        </View>
      </ScrollView>

      <Button
        // labelStyle={{color: 'black'}}
        style={styles.styleBtn}
        label="Khai báo"
        onPress={() => {
          onDeclarePress();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.backgroundColor,
  },
  status: {
    fontSize: normalize(18),
    color: Colors.primary,
    alignSelf: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    margin: 10,
    alignSelf: 'center',
  },
  containerSeri: {
    width: '50%',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  seri: {
    fontSize: normalize(20),
    color: Colors.text,
    backgroundColor: Colors.backgroundIcon,
    borderRadius: 10,
  },
  styleBtn: {
    marginBottom: 10,
    alignSelf: 'center',
    width: '50%',
    // backgroundColor: Colors.backgroundColor,
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
});
