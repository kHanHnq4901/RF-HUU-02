import React, { useContext } from 'react';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { PropsStore, storeContext } from '../../store/store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { closeAlert } from '../../service/alert';

export let store = {} as PropsStore;
export const data: {
  title: string;
  subtitle: string;
  theme: 'default' | 'inverse' | 'success' | 'info' | 'danger' | 'warning';
  icon: string;
  onOKPress: () => void | null;
  onCancelPress: () => void | null;
} = {
  title: '',
  subtitle: '',
  theme: 'default',
  icon: '',
  onOKPress: null,
  onCancelPress: null,
};

export const Alert = () => {
  store = useContext(storeContext);

  return (
    <SCLAlert
      show={store.state.alert.show}
      onRequestClose={closeAlert}
      slideAnimationDuration={0}
      onDismiss={closeAlert}
      theme={data.theme}
      title={data.title}
      subtitle={data.subtitle}
      headerIconComponent={
        <MaterialCommunityIcons name={data.icon} size={40} color="white" />
      }>
      <SCLAlertButton
        theme={data.theme}
        onPress={() => {
          closeAlert();
          if (data.onOKPress) {
            data.onOKPress();
          }
        }}>
        OK
      </SCLAlertButton>
      {data.onCancelPress !== null ? (
        <SCLAlertButton
          theme="default"
          onPress={() => {
            closeAlert();

            data.onCancelPress();
          }}>
          Hủy
        </SCLAlertButton>
      ) : null}
    </SCLAlert>
  );
};
