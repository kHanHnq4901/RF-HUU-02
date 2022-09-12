import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Caption, Checkbox, Divider } from 'react-native-paper';
import { Button } from '../../component/button/button';
import { Text } from '../../component/Text';
import { PropsFileInfo } from '../../shared/file';
import Theme, { Colors, normalize } from '../../theme';
import * as controller from './controller';
import * as handleButton from './handleButton';

export const ExportXmlScreen = () => {
  const hookProps = controller.GetHookProps();
  const navigation = useNavigation();
  React.useEffect(() => {
    controller.onInit(navigation);
    return controller.onDeInit;
  }, []);

  const RenderItem = ({ item }: { item: PropsFileInfo }) => {
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
            return { ...state };
          });
        }}>
        {/* <Divider /> */}
        <View style={styles.row}>
          <Checkbox
            color={Theme.Colors.secondary}
            status={item.checked ? 'checked' : 'unchecked'}
            onPress={() => {}}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, color: Colors.text }}>
              {item.name}
            </Text>
          </View>
          <View style={styles.dateTimeItem}>
            <Caption>{item.date}</Caption>
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
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 45, fontWeight: 'bold' }}>Trống</Text>
        </View>
      ) : (
        <FlatList
          data={hookProps.state.xmlList}
          renderItem={RenderItem}
          keyExtractor={item => item.name}
        />
      )}
      <View style={styles.row}>
        <Button
          style={{ flex: 1, height: 50, maxWidth: 150 }}
          label="Xóa"
          onPress={handleButton.onDeleteFilePress}
        />
        <Button
          style={{
            backgroundColor: Theme.Colors.secondary,
            flex: 1,
            height: 50,
            maxWidth: 150,
          }}
          label="Xuất"
          onPress={handleButton.onExportPress}
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
    color: 'black',
  },
});
