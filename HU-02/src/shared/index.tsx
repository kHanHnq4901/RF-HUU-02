import {StackWriteStationCodeNavigator} from '../navigation/StackWriteBySatationCode';
import {DrawerParamsList} from '../navigation/model/model';
import {AboutScreen} from '../screen/about';
import {BoardBLEScreen} from '../screen/boardBLE';
import {DeclareMeterScreen} from '../screen/declareMeter';
import {ExportLogScreen} from '../screen/exportLog';
import {OverViewScreen} from '../screen/overview';
import {ReadOpticalScreen} from '../screen/readOptical';
import {ReadParameterScreen} from '../screen/readParameter';
import {SettingAndAlarmScreen} from '../screen/settingAndAlarm';
import {WriteOpticalScreen} from '../screen/writeOptical';

export const version = '1.2.2';

// export const widthScreen = Dimensions.get('screen').width;
// export const heighScreen = Dimensions.get('screen').height;

type ScreenProps = {
  title: string;
  info: string;
  id: keyof DrawerParamsList;
  icon: string;
  component: (() => JSX.Element) | null;
};

type DataScreensProps = ScreenProps[];

export type TYPE_DEVICE = 'HHU';

export const screenDatas: DataScreensProps = [
  {
    title: 'Tổng quan',
    info: 'Hiển thị tỉ lệ thu lập dữ liệu của thiết bị HU',
    id: 'Overview',
    icon: 'pie-chart',
    component: OverViewScreen,
  },

  {
    title: 'Xem chỉ số',
    info: 'Xem toàn bộ dữ liệu. \nNhấn vào biểu tượng quyển sách để xem chi tiết',
    id: 'ViewData',
    icon: 'reader-sharp',
    component: null, //StackViewDataNavigator,
  },
  {
    title: 'Khai báo đồng hồ',
    info: 'Khai báo đồng hồ kèm vị trí GPS của đồng hồ',
    id: 'DeclareMeter',
    icon: 'ios-create-outline',
    component: DeclareMeterScreen,
  },
  // {
  //   title: 'Xem điện áp',
  //   info: 'info',
  //   id: 'WriteRegister',
  //   icon: 'md-speedometer',
  //   component: null,
  // }

  {
    title: 'Ghi theo mã trạm',
    info: `
    
    `,
    id: 'WriteDataByStationCode',
    icon: 'ios-pencil',
    component: StackWriteStationCodeNavigator,
  },
  {
    title: 'Ghi điện theo vị trí',
    info: 'info',
    id: 'WriteDataByPosition',
    icon: 'ios-navigate',
    component: null,
  },
  {
    title: 'Đọc RF',
    info: `
    Đọc dữ liệu tức thời công tơ bất kỳ, dữ liệu sẽ không được lưu vào DB.
    
    `,

    id: 'ReadParameter',
    icon: 'ios-book-outline',
    component: ReadParameterScreen,
  },
  {
    title: 'Ghi cổng quang',
    info: `
    
    `,
    id: 'WriteOptical',
    icon: 'ios-pencil',
    component: WriteOpticalScreen,
  },
  {
    title: 'Đọc cổng quang',
    info: `
    
    `,
    id: 'ReadOptical',
    icon: 'ios-book-outline',
    component: ReadOpticalScreen,
  },

  {
    title: 'Chỉ số bất thường',
    info: 'info',
    id: 'AbnormalRegister',
    icon: 'md-warning',
    component: null,
  },
  {
    title: 'Nhập xuất CSDL',
    info: `
    Nhập cơ sở dữ liệu:
      +Đẩy file cơ sở dữ liệu lên zalo ..., 
      +Chọn chia sẻ file, 
      +Chọn 'Ứng dụng khác'
      +Chọn ứng dụng HHU Gelex
      +Trở lại ứng dụng HHU Gelex
      +Vào màn hình nhập xuất CSDL
      +Chọn file vừa được chia sẻ
      +Nhấn nút 'Nhập' trên màn hình

      
    Xuất cơ sở dữ liệu:
      +Nhấn nút 'Xuất' trên màn hình
      +Chọn ứng dụng muốn chia sẻ CSDL
    `,
    id: 'ImportExportCSDL',
    icon: 'server',
    component: null, //ImportExportCSDLScreen,
  },
  {
    title: 'Xuất file xml',
    info: `
    Xuất cơ sở dữ liệu:
      +Nhấn nút 'Xuất' trên màn hình
      +Chọn ứng dụng muốn chia sẻ CSDL
    `,
    id: 'ExportXml',
    icon: 'md-print',
    component: null,
  },
  {
    title: 'Xuất file log',
    info: `
    Xuất file log:
      +Nhấn nút 'Xuất' trên màn hình
      +Chọn ứng dụng muốn chia sẻ file log
    `,
    id: 'ExportLog',
    icon: 'md-print',
    component: ExportLogScreen,
  },
  {
    title: 'Nhập file xml',
    info: `
    +Đẩy file xml lên zalo..., hoặc truyền file vào thiết bị qua cổng usb, 
      +Chọn chia sẻ file, 
      +Chọn 'Ứng dụng khác'(đối với zalo)
      +Chọn ứng dụng HHU Gelex
    `,
    id: 'ImportXml',
    icon: 'code-download',
    component: null,
  },
  {
    title: 'Nhập xuất CMIS',
    info: 'info',
    id: 'ImportExportCMIS',
    icon: 'barcode',
    component: null,
  },
  {
    title: 'Kiểm tra tín hiệu',
    info: 'info',
    id: 'CkeckSignal',
    icon: 'cellular',
    component: null,
  },
  {
    title: 'Cài đặt',
    info: `
    Cài đặt ngưỡng cảnh báo bất thường cho điện năng khi thực hiện chức năng 'Ghi chỉ số'
    `,
    id: 'SettingAndAlarm',
    icon: 'ios-build',
    component: SettingAndAlarmScreen,
  },
  {
    title: 'Thiết bị cầm tay',
    info: `
    Reset, cập nhật frimware cho thiết bị cầm tay
    `,
    id: 'BoardBLE',
    icon: 'journal',
    component: BoardBLEScreen,
  },
  {
    title: 'Đổi mật khẩu',
    info: 'info',
    id: 'ChangePassword',
    icon: 'key',
    component: null,
  },
  {
    title: 'Hỗ trợ',
    info: 'info',
    id: 'SupportCustomer',
    icon: 'ios-help-circle',
    component: null, //SupportCustomerScreen,
  },
  {
    title: 'Giới thiệu',
    info: 'Giới thiệu',
    id: 'About',
    icon: 'information-circle',
    component: AboutScreen,
  },
];
