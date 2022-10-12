import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, TextInput} from 'react-native-paper';

import {normalize, scale, sizeScreen} from '../../theme';
import {store, UpdateHook} from './controller';

export function UserInfoScreen() {
  UpdateHook();
  //console.log(store.state.userInfo);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.containerImage}>
          <Avatar.Image
            size={70 * scale}
            source={require('../../asset/images/icon/user.png')}
            style={styles.avatar}
          />
        </View>
        <TextInput
          style={styles.textInput}
          value={store.state.userInfo.USER_NAME}
          label="Họ tên"
          autoCorrect={false}
          editable={false}
          underlineColor="transparent"
        />
        <TextInput
          style={styles.textInput}
          value={store.state.userInfo.USER_ADDRESS}
          label="Địa chỉ"
          autoCorrect={false}
          editable={false}
          underlineColor="transparent"
        />
        <TextInput
          style={styles.textInput}
          value={store.state.userInfo.USER_TEL}
          label="Số điện thoại"
          autoCorrect={false}
          editable={false}
          underlineColor="transparent"
        />
        <TextInput
          style={styles.textInput}
          value={store.state.userInfo.USER_EMAIL}
          label="Email"
          autoCorrect={false}
          editable={false}
          underlineColor="transparent"
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  containerImage: {
    height: 0.2 * sizeScreen.height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {},
  textInput: {
    backgroundColor: 'white',
    fontSize: normalize(20),
    borderRadius: 3,
    paddingHorizontal: 10,
    margin: 10,
  },
});
