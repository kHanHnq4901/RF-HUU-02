import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Caption, Checkbox, Divider} from 'react-native-paper';
import {Button} from '../../component/button/button';
import {PropsFileInfo} from '../../shared/file';
import Theme, {Colors, normalize} from '../../theme';
import * as controller from './controller';
import * as handleButton from './handleButton';

export const ImportXmlScreen = () => {
  const hookProps = controller.GetHookProps();
  const navigation = useNavigation();
  useEffect(() => {
    controller.onInit(navigation);

    return controller.onDeInit;
  }, []);

  const RenderItem = ({item}: {item: PropsFileInfo}) => {
    // return useMemo(
    //   () => (

    return (
      <TouchableOpacity
        onPress={() => {
          hookProps.setState(state => {
            state.xmlList.forEach(e => {
              if (e.name === item.name) {
                e.checked = !e.checked;
                //console.log(state);
              }
            });
            return {...state};
          });
        }}>
        {/* <Divider /> */}
        <View style={styles.row}>
          <Checkbox
            color={Theme.Colors.secondary}
            status={item.checked ? 'checked' : 'unchecked'}
            onPress={() => {}}
          />
          <View style={{flex: 1}}>
            <Text style={styles.title}>{item.name}</Text>
          </View>
          <View style={styles.dateTimeItem}>
            <Caption
              style={{
                fontSize: normalize(15),
                paddingTop: 15,
              }}>
              {item.date}
            </Caption>
          </View>
          {/* <MaterialCommunityIcons
          name="xml"
          color={Theme.Colors.secondary}
          size={20}
        /> */}
        </View>
        <Divider />
      </TouchableOpacity>
    );
    //   ),
    //   [item.checked, item.name],
    // );
  };

  return (
    <View style={Theme.StyleCommon.container}>
      {hookProps.state.xmlList.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 45, fontWeight: 'bold'}}>Trống</Text>
        </View>
      ) : (
        <FlatList
          data={hookProps.state.xmlList}
          renderItem={RenderItem}
          keyExtractor={item => item.name}
        />
      )}
      <View style={styles.areaButton}>
        <Button
          label="Xóa"
          onPress={handleButton.onDeleteFilePress}
          style={{flex: 1, height: 50, maxWidth: 150}}
        />
        <Button
          style={{
            backgroundColor: Theme.Colors.secondary,
            flex: 1,
            height: 50,
            maxWidth: 150,
          }}
          label="Nhập"
          onPress={handleButton.onImportPress}
        />
      </View>
      {/* <Alert /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 15,
    alignItems: 'center',
  },
  dateTimeItem: {
    marginRight: 15,
  },
  areaButton: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: normalize(20),
    color: Colors.text,
  },
});
