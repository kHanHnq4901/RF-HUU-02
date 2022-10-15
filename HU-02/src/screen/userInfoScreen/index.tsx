import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, TextInput} from 'react-native-paper';
import {BackButton} from '../../component/backButton';

import {Colors, normalize, scale, sizeScreen} from '../../theme';
import {store, UpdateHook} from './controller';

export function UserInfoScreen() {
  UpdateHook();
  //console.log(store.state.userInfo);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <BackButton onPress={navigation.goBack} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
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
