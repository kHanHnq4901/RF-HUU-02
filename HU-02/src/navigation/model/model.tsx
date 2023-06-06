import {DrawerNavigationProp} from '@react-navigation/drawer';
import {NavigatorScreenParams} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {PropsDataTable} from '../../screen/writeDataByStationCode/controller';
export type StackRootList = {
  SignIn: undefined;
  SignUp: undefined;
  Drawer: NavigatorScreenParams<DrawerParamsList>;
  BleScreen: undefined;
  Setting: undefined;
};

export type StackWriteDataList = {
  WriteRegister: ParamsDrawerProps;
  WriteRegisterByHand: {
    row: string[];
  };
};

export type StackViewDataList = {
  ViewRegister: ParamsDrawerProps;
  ViewRegisterDetailed: {
    data: PropsDataTable;
  };
};

export type PropsRouteParamsWriteBook = {
  stationCode: string;
  bookCode: string[];
};
export type PropsRouteParamsWriteStation = {
  litStationCode: string[];
};

export type StackWriteDataByBookCodeList = {
  SelectBook: ParamsDrawerProps;
  WriteBook: PropsRouteParamsWriteBook;
  WriteByHand: {
    // navigation: StackWriteBookCodeNavigationProp;
    data: PropsDataTable;
  };
};
export type StackWriteDataByStationCodeList = {
  SelectStation: ParamsDrawerProps;
  WriteStation: PropsRouteParamsWriteStation;
  WriteByHand: {
    // navigation: StackWriteBookCodeNavigationProp;
    data: PropsDataTable;
  };
};

// export type StackRootNavigationProp = CompositeNavigationProp<
//   StackNavigationProp<StackRootParamsList>,
//   DrawerNavigationProp<DrawerParamsList>
// >;

export type StackRootNavigationProp = StackNavigationProp<StackRootList>;

export type StackWiteDataNavigationProp =
  StackNavigationProp<StackWriteDataList>;

export type StackViewDataNavigationProp =
  StackNavigationProp<StackViewDataList>;

export type StackWriteBookCodeNavigationProp =
  StackNavigationProp<StackWriteDataByBookCodeList>;
export type StackWriteStationCodeNavigationProp =
  StackNavigationProp<StackWriteDataByStationCodeList>;

export type DrawerNavigationProps = DrawerNavigationProp<DrawerParamsList>;

export type ParamsDrawerProps = {
  title: string;
  info: string;
};

export type DrawerParamsList = {
  Overview: ParamsDrawerProps;
  ViewData: NavigatorScreenParams<StackViewDataNavigationProp>;
  ViewDataByVolatge: ParamsDrawerProps;
  WriteDataByStationCode: NavigatorScreenParams<StackWriteStationCodeNavigationProp>;
  WriteDataByPosition: ParamsDrawerProps;
  ReadParameter: ParamsDrawerProps;
  DeclareMeter: ParamsDrawerProps;
  PositionMeter: ParamsDrawerProps;
  ReadOptical: ParamsDrawerProps;
  WriteOptical: ParamsDrawerProps;
  AbnormalRegister: ParamsDrawerProps;
  ImportExportCSDL: ParamsDrawerProps;
  ExportXml: ParamsDrawerProps;
  ExportLog: ParamsDrawerProps;
  ImportXml: ParamsDrawerProps;
  ImportExportCMIS: ParamsDrawerProps;
  CkeckSignal: ParamsDrawerProps;
  SettingAndAlarm: ParamsDrawerProps;
  BoardBLE: ParamsDrawerProps & {
    isUpdate?: boolean;
  };
  ChangePassword: ParamsDrawerProps;
  SupportCustomer: ParamsDrawerProps;
  About: ParamsDrawerProps;
  UserInfo: undefined;
  SettingUser: undefined;
  GuideBook: undefined;
};
