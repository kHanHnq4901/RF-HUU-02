import {
  dummyXML,
  endHeadXml,
  PropsCreateXML,
  PropsXmlModel,
  PropsXmlReturnFromFile,
  startHeadXml,
} from './index';
import xml2js, { parseString } from 'react-native-xml2js';
import { deleteDataDB, KHCMISRepository } from '../database/repository';
import { dumyEntity, PropsKHCMISEntity } from '../database/entity';
import {
  getRFCodeByRangeSeriAndCodeMeter,
  TYPE_READ_RF,
} from '../service/hhu/defineEM';
import { Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { savePathImport } from '../service/storage/index';

const TAG = 'UTIL_XML';

export const updateDbByXml = async (strXml: string): Promise<boolean> => {
  try {
    let xmlFromString: PropsXmlReturnFromFile | null = await new Promise(
      (resolve, reject) => {
        parseString(
          strXml,
          {
            explicitArray: false,
            explicitRoot: false,
          },
          function (err, result) {
            //console.log(JSON.stringify(result.Table1));

            if (!err) {
              //console.log('result:', result);
              resolve(result);
            } else {
              //console.log('err:', err);
              resolve(null);
            }
          },
        );
      },
    );
    if (xmlFromString === null) {
      return false;
    }
    let acceptAll = await new Promise(resolve => {
      Alert.alert(
        'Ghi toàn bộ XML ?',
        'Bạn có muốn ghi cả dữ liệu đã được ghi thành công không ?',
        [
          {
            text: 'Ghi toàn bộ',
            style: 'default',
            onPress: () => {
              resolve(true);
            },
          },
          {
            text: 'Ghi điểm thiếu',
            style: 'default',
            onPress: () => {
              resolve(false);
            },
          },
        ],
      );
    });
    Alert.alert('Đang cập nhật dữ liệu ...');
    let index = 0;
    let ok = false;
    for (let tabel of xmlFromString.Table1) {
      if (acceptAll === true) {
        ok = true;
      } else {
        if (Number(tabel.CS_MOI) === 0) {
          ok = true;
        } else {
          ok = false;
        }
      }
      if (ok) {
        const row = {} as PropsKHCMISEntity;
        for (let i in dumyEntity) {
          row[i] = tabel[i];
        }
        index++;
        row.TT = index;
        row.RF = getRFCodeByRangeSeriAndCodeMeter(row.SERY_CTO, row.MA_CTO);
        row.id = row.SERY_CTO + row.LOAI_BCS + row.RF;
        row.GhiChu = '';
        row.LoaiDoc = TYPE_READ_RF.HAVE_NOT_READ;
        const succeed = await KHCMISRepository.save(row);
        if (succeed === false) {
          await new Promise(resolve => {
            Alert.alert('Lỗi', 'Nhập file lỗi', [
              {
                text: 'OK',
                onPress: () => resolve(true),
              },
            ]);
          });
          return false;
        }
      }
      //console.log(TAG, 'succeed save:', succeed);
    }

    await new Promise(resolve => {
      Alert.alert(
        'Thành công',
        'Nhập thành công ' + xmlFromString?.Table1.length + ' BCS vào csdl',
        [
          {
            text: 'OK',
            onPress: () => resolve(true),
          },
        ],
      );
    });
    return true;
  } catch (err) {
    console.log(TAG, err.message);
  }
  return false;
};

export const exportDB2Xml = async (): Promise<string | null> => {
  // var obj = { name: 'Super', Surname: 'Man', age: 23 };

  // var bd = new xml2js.Builder();
  // var xml = bd.buildObject(obj);

  // //console.log('xml:', xml);

  const listTabel: PropsXmlReturnFromFile = {
    Table1: [],
  };

  const dataDB = await KHCMISRepository.findAll();
  if (dataDB.length === 0) {
    return null;
  }
  for (let row of dataDB) {
    const modelXml = {} as PropsXmlModel;
    for (let i in dummyXML) {
      modelXml[i] = row[i];
    }
    listTabel.Table1.push(modelXml);
  }
  let builder = new xml2js.Builder();
  let strXML = startHeadXml;
  for (let tabel of listTabel.Table1) {
    const tb = {} as PropsCreateXML;
    tb.Table1 = tabel;
    let str: string = builder.buildObject(tb);
    str = str.replace(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '',
    );
    strXML += str;
  }
  strXML += endHeadXml;

  return strXML;
};

export const importXmlFromPath = async (path: string) => {
  const ok = await new Promise(resolve => {
    Alert.alert(
      'Xóa dữ liệu cũ và Nhập mới',
      'Dữ liệu cũ sẽ bị xóa ? \r\n\nBạn có thể xuất dữ liệu xml trước khi thực hiện thao tác này',
      [
        {
          text: 'Hủy',
          onPress: () => resolve(false),
          style: 'cancel',
        },
        {
          text: 'OK',

          onPress: async () => {
            await deleteDataDB();
            resolve(true);
          },
        },
      ],
    );
  });

  if (ok) {
    try {
      Alert.alert('Đang chuẩn bị dữ liệu ...');
      const xmlText = await RNFS.readFile(path);

      if ((await updateDbByXml(xmlText)) === true) {
        await savePathImport(path);
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Nhập dữ liệu thất bại: ' + err.message);
    }
  }
};
