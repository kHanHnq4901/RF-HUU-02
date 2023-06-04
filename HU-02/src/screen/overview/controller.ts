import React from 'react';
import {
  PropsItemBook,
  PropsItemColumn,
  PropsItemStation,
} from '../../component/detailDB';
import {PropsKHCMISModel, PropsPercentRead} from '../../database/model';
import {CMISKHServices} from '../../database/service';
import {TYPE_READ_RF} from '../../service/hhu/defineEM';

const labels = [
  'Lỗi ',
  'Ghi\ntay ',
  'Bất       \nthường\n',
  'Thành\ncông\n',
  'Chưa\nđọc ',
];

export const labelsStock = [
  'Lỗi ',
  'Ghi tay ',
  'Bất thường',
  'Thành công',
  'Chưa đọc',
  'Tổng BCS',
];

export const colorsChart = [
  '#F44336',
  '#FF9800',
  '#FFEB3B',
  '#4CAF50',
  '#2196F3',
  '#0b3af9',
];

export const dummyDataTable = [
  {
    x: labels[0],
    y: 10,
  },
  {
    x: labels[1],
    y: 10,
  },
  {
    x: labels[2],
    y: 10,
  },
  {
    x: labels[3],
    y: 10,
  },
  {
    x: labels[4],
    y: 10,
  },
];

type PropsState = {
  graphicData: {
    x: string;
    y: number;
  }[];
  percent: number[];
  dataDB: PropsKHCMISModel[];
  detailDB: PropsItemStation[];
};

type PropsHook = {
  state: PropsState;
  setState: React.Dispatch<React.SetStateAction<PropsState>>;
};

export const hookProps = {} as PropsHook;

export const GetHook = () => {
  const graphData: {
    x: string;
    y: number;
  }[] = [];

  const percent: number[] = [];

  for (let item of labels) {
    graphData.push({
      x: item,
      y: 1,
    });
    percent.push(0);
  }
  //console.log(graphData);
  const [state, setState] = React.useState<PropsState>({
    graphicData: graphData,
    percent: percent,
    dataDB: [],
    detailDB: [],
  });

  hookProps.state = state;
  hookProps.setState = setState;
};

export const onInit = async navigation => {
  navigation.addListener('beforeRemove', e => {
    e.preventDefault();
  });

  // navigation.addListener('focus', async () => {
  //   console.log('Get Percentage Read');

  //   const dataDB = await CMISKHServices.findAll();
  //   console.log('length dataDB:', dataDB?.length);

  //   //const result = await CMISKHServices.getPercentRead();
  //   //console.log('resultcc:', result);

  //   const result: PropsPercentRead = {
  //     readFailed: 0,
  //     writeByHand: 0,
  //     abnormalRead: 0,
  //     readSucceed: 0,
  //     haveNotRead: 0,
  //   };

  //   dataDB.forEach(item => {
  //     if (item.TYPE_READ === TYPE_READ_RF.READ_SUCCEED) {
  //       result.readSucceed++;
  //     } else if (item.TYPE_READ === TYPE_READ_RF.READ_FAILED) {
  //       result.readFailed++;
  //     } else if (item.TYPE_READ === TYPE_READ_RF.ABNORMAL_CAPACITY) {
  //       result.abnormalRead++;
  //     } else if (item.TYPE_READ === TYPE_READ_RF.WRITE_BY_HAND) {
  //       result.writeByHand++;
  //     } else {
  //       result.haveNotRead++;
  //     }
  //   });

  //   hookProps.setState(state => {
  //     // 'Lỗi ',0
  //     // 'Ghi tay ',1
  //     // 'Bất thường',2
  //     // 'Thành công',3
  //     // 'Chưa đọc',4
  //     // 'Tổng',

  //     let total = 0;
  //     let percent: string[] = [];

  //     state.percent = [];
  //     for (let item in result) {
  //       total += result[item];
  //     }

  //     for (let item in result) {
  //       if (total === 0) {
  //         percent.push(' %');
  //         state.percent.push(0);
  //       } else {
  //         const per = (result[item] / total) * 100;
  //         state.percent.push(per);
  //         percent.push(' ' + per.toFixed(0) + ' %');
  //       }
  //     }

  //     const minimumPercent = 8;

  //     state.graphicData[0].x =
  //       state.percent[0] > minimumPercent ? labels[0] + percent[0] : '';
  //     state.graphicData[0].y = result.readFailed;
  //     state.graphicData[1].x =
  //       state.percent[1] > minimumPercent ? labels[1] + percent[1] : '';
  //     state.graphicData[1].y = result.writeByHand;
  //     state.graphicData[2].x =
  //       state.percent[2] > minimumPercent ? labels[2] + percent[2] : '';
  //     state.graphicData[2].y = result.abnormalRead;
  //     state.graphicData[3].x =
  //       state.percent[3] > minimumPercent ? labels[3] + percent[3] : '';
  //     state.graphicData[3].y = result.readSucceed;
  //     state.graphicData[4].x =
  //       state.percent[4] > minimumPercent ? labels[4] + percent[4] : '';
  //     state.graphicData[4].y = result.haveNotRead;

  //     //console.log(state.graphicData);
  //     //console.log(state.percent);

  //     //state.detailDB = getDbDetail(dataDB);

  //     return {...state};
  //   });
  // });
};

export const onDeInit = navigation => {
  navigation.removeListener('focus', () => {});
  navigation.removeListener('beforeRemove', () => {});
};
