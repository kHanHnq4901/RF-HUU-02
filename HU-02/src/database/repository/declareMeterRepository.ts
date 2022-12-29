import SQLite from 'react-native-sqlite-storage';
import {NAME_CSDL} from '../../shared/path';
import {isNumeric} from '../../util';
import {PropsFilter, PropsPagination, PropsSorting} from '../service';
import {
  TABLE_NAME,
  dumyEntity,
  PropsDeclareMeterEntity,
} from '../entity/declareMeterEntity';

const TAG = 'Repository:';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase | null = null;

export async function deleteDB() {
  if (db) {
    await db.close();
  }
  await SQLite.deleteDatabase({
    location: 'default',
    name: NAME_CSDL,
  });
}

export const checkTabelDeclareMeterIfExist = async (): Promise<boolean> => {
  try {
    if ((await getDBConnection()) === false) {
      return false;
    }
    //const query = `SELECT name FROM sqlite_master WHERE type='table' AND name=${TABLE_NAME}`;
    let query = `create table if not exists ${TABLE_NAME} (`;
    let first: boolean;
    first = true;
    for (let i in dumyEntity) {
      if (first === true) {
        first = false;
      } else {
        query += ',';
      }

      query += i;
    }
    query += ')';
    //const results =
    //console.log('qury:', query);

    const res = await db?.executeSql(query);
    console.log('create table if exist');
  } catch (e) {
    console.log(TAG, 'err tabel exist: ', e.message);
  }
  return false;
};

export const deleteDataDB = async (): Promise<boolean> => {
  try {
    if ((await getDBConnection()) === false) {
      return false;
    }
    //const query = `SELECT name FROM sqlite_master WHERE type='table' AND name=${TABLE_NAME}`;
    let query = `DELETE FROM ${TABLE_NAME};`;
    const res = await db?.executeSql(query);
    console.log('deletedb :', JSON.stringify(res));
    return true;
  } catch (e) {
    console.log(TAG, 'err tabel exist: ', e.message);
  }
  return false;
};

export const getDBConnection = async (): Promise<boolean> => {
  let succeed = false;
  if (!db) {
    console.log('get db');
    // console.log(NAME_CSDL.split('.')[0]);
    // console.log(PATH_EXECUTE_CSDL + '/' + NAME_CSDL);
    succeed = await new Promise(async resolve => {
      db = await SQLite.openDatabase(
        {
          name: NAME_CSDL,
          location: 'default',
        },
        () => {
          resolve(true);
        },
        err => {
          console.log('open SQL error:' + err);
          db = null;
          resolve(false);
        },
      );
    });
    //await sleep(500);
    //console.log(await db.executeSql('database tables'));
  } else {
    succeed = true;
  }
  //console.log('succeed:', succeed);
  return succeed;
};

export type PropsCondition = {
  data: {[key: string]: any} | {[key: string]: any}[];
  logic: '=' | '!=' | '<=' | '>=' | 'LIKE';
  behindOperator: 'AND' | 'OR' | '';
};

export type PropsConditions = PropsCondition[];

export interface IDeclareMeterRepository {
  findAll: (
    pagination?: PropsPagination,
    condition?: PropsConditions,
  ) => Promise<PropsDeclareMeterEntity[]>;
  findByColumn: (
    filter: PropsFilter,
    pagination?: PropsPagination,
    sort?: PropsSorting,
  ) => Promise<PropsDeclareMeterEntity[]>;
  findUniqueValuesInColumn: (
    filter: PropsFilter,
    pagination?: PropsPagination,
    sort?: PropsSorting,
  ) => Promise<any[]>;
  update: (
    condition: PropsConditions,
    valueSet: {[key: string]: any},
  ) => Promise<boolean>;
  delete: (condition: PropsConditions) => Promise<boolean>;
  save: (item: PropsDeclareMeterEntity) => Promise<boolean>;
}
export const closeConnection = async () => {
  if (db) {
    console.log('close db connection');

    await db.close();
    db = null;
    return;
  }
};

export const DeclareMeterRepository = {} as IDeclareMeterRepository;

const filterArr = (items: any[], pagination: PropsPagination): any[] => {
  pagination.itemPerPage = pagination.itemPerPage ?? 1;
  pagination.totalPage = Math.floor(items.length / pagination.itemPerPage) + 1;
  const startIndex = pagination.page * pagination.itemPerPage;
  const endIndex =
    pagination.page * pagination.itemPerPage + pagination.itemPerPage;
  // console.log('startIndex', startIndex);
  // console.log('endIndex', endIndex);
  items = items.filter(
    (item, index) => index >= startIndex && index < endIndex,
  );
  return items;
};

function getQueryCondition(condition?: PropsConditions): string | null {
  let query: string | null = null;
  if (condition) {
    query = '';
    let first = true;
    query += `
    WHERE 
    `;
    for (let con of condition) {
      if (Array.isArray(con.data) === false) {
        for (let i in con.data) {
          if (first === true) {
            first = false;
          } else {
            query += ' ' + con.behindOperator + ' ';
          }

          query +=
            i + ' ' + con.logic + ' ' + convertStringSpecial(con.data[i]);
        }
      } else {
        for (let obj of con.data as {[key: string]: any}[]) {
          for (let i in obj) {
            if (first === true) {
              first = false;
            } else {
              query += ' ' + con.behindOperator + ' ';
            }

            query += i + ' ' + con.logic + ' ' + convertStringSpecial(obj[i]);
          }
        }
      }
    }
  }
  return query;
}
DeclareMeterRepository.findAll = async (
  pagination?: PropsPagination,
  condition?: PropsConditions,
) => {
  let items: PropsDeclareMeterEntity[] = [];
  try {
    if ((await getDBConnection()) === false) {
      return items;
    }
    let query = `SELECT * FROM ${TABLE_NAME}`;
    let conditionQuery = getQueryCondition(condition);
    if (conditionQuery) {
      query += conditionQuery;
    }
    query += ';';

    // const query1 = `PRAGMA table_info('${TABLE_NAME}')`;
    // const test = await db?.executeSql(query1);
    // console.log('test:', test[0].rows.raw());
    // console.log('query:', query);
    const results = await db?.executeSql(query);
    //console.log('ret:', JSON.stringify(results));
    results?.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        // if (index === 0) {
        //   console.log('result.rows.item(index):', result.rows.item(index));
        // }
        items.push(result.rows.item(index));
      }
    });
  } catch (e) {
    console.log(TAG, e.message);
  }
  if (pagination) {
    items = filterArr(items, pagination);
  }
  return items;
};

// DeclareMeterRepository.findByColumn = async (
//   filter: PropsFilter,
//   pagination?: PropsPagination,
//   sort?: PropsSorting,
// ) => {
//   let items: PropsDeclareMeterEntity[] = [];
//   try {
//     if ((await getDBConnection()) === false) {
//       return items;
//     }

//     let clause: string = '';
//     const type = getTypeOfColumn(filter.idColumn);
//     if (type === 'number') {
//       if (isNumeric(filter.startNumber) === false) {
//         return items;
//       }
//       if (isNumeric(filter.endNumber) === true) {
//         clause = `WHERE ${filter.idColumn} BETWEEN ${Number(
//           filter.startNumber,
//         )} AND ${Number(filter.endNumber)} `;
//       } else {
//         clause = `WHERE ${filter.idColumn} = ${Number(filter.startNumber)}`;
//       }
//     } else if (type === 'string') {
//       clause = `WHERE ${
//         filter?.idColumn
//       } LIKE '%${filter.valueString?.trim()}%'`;
//     } else {
//       console.log(TAG, 'No type suitable filter database');
//       return items;
//     }

//     if (sort) {
//       if (sort === 'ascending') {
//         clause += ` ORDER BY ${filter.idColumn} ASC`;
//       } else {
//         clause += ` ORDER BY ${filter.idColumn} DESC`;
//       }
//     }
//     const query = `SELECT * FROM ${TABLE_NAME} ` + clause;
//     //console.log(TAG, query);
//     const results = await db?.executeSql(query);
//     results?.forEach(result => {
//       for (let index = 0; index < result.rows.length; index++) {
//         items.push(result.rows.item(index));
//       }
//     });
//   } catch (e) {
//     console.log(TAG, e.message);
//   }
//   if (pagination) {
//     items = filterArr(items, pagination);
//   }
//   return items;
// };

DeclareMeterRepository.findUniqueValuesInColumn = async (
  filter: PropsFilter,
  pagination?: PropsPagination,
  sort?: PropsSorting,
) => {
  let items: any[] = [];
  let clause: string = '';
  if (sort) {
    if (sort === 'ascending') {
      clause += ` ORDER BY ${filter.idColumn} ASC`;
    } else {
      clause += ` ORDER BY ${filter.idColumn} DESC`;
    }
  }
  try {
    if ((await getDBConnection()) === false) {
      return items;
    }
    const query =
      `SELECT DISTINCT ${filter.idColumn} FROM ${TABLE_NAME} ` + clause;
    const results = await db?.executeSql(query);
    results?.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        items.push(result.rows.item(index));
      }
    });
  } catch (e) {
    console.log(TAG, e.message);
  }
  if (pagination) {
    items = filterArr(items, pagination);
  }
  return items;
};

const convertStringSpecial = (value): string => {
  if (typeof value === 'number') {
    return value.toString();
  } else {
    return '"' + value.toString() + '"';
  }
};

DeclareMeterRepository.update = async (
  condition: PropsConditions,
  valueSet: {[key: string]: any},
): Promise<boolean> => {
  if ((await getDBConnection()) === false) {
    return false;
  }
  let query: string = `UPDATE ${TABLE_NAME} 
  SET `;
  let first: boolean;
  first = true;
  for (let i in valueSet) {
    if (first === true) {
      first = false;
    } else {
      query += ', ';
    }

    query += i + ' = ' + convertStringSpecial(valueSet[i]);
  }
  let conditionQuery = getQueryCondition(condition);
  if (conditionQuery) {
    query += conditionQuery;
  }
  query += ';';
  //console.log(query);
  // return;
  try {
    const results = (await db?.executeSql(query)) as [
      {rows: {length: number}; rowsAffected: number},
    ];
    //console.log('result update: ' + JSON.stringify(results));
    if (results[0]?.rowsAffected > 0) {
      return true;
    }
  } catch (e) {
    console.log(TAG, 'result update: ', e.message);
    return false;
  }

  return false;
};
DeclareMeterRepository.delete = async (
  condition: PropsConditions,
): Promise<boolean> => {
  if ((await getDBConnection()) === false) {
    return false;
  }
  let query: string = `DELETE FROM ${TABLE_NAME} 
   `;
  let conditionQuery = getQueryCondition(condition);
  if (conditionQuery) {
    query += conditionQuery;
  }
  query += ';';
  //console.log(query);
  // return;
  try {
    const results = (await db?.executeSql(query)) as [
      {rows: {length: number}; rowsAffected: number},
    ];
    //console.log('result update: ' + JSON.stringify(results));
    if (results[0]?.rowsAffected > 0) {
      return true;
    }
  } catch (e) {
    console.log(TAG, 'result delete: ', e.message);
    return false;
  }

  return false;
};

DeclareMeterRepository.save = async (
  item: PropsDeclareMeterEntity,
): Promise<boolean> => {
  try {
    if ((await getDBConnection()) === false) {
      return false;
    }

    let queryCheckExist = `SELECT id FROM ${TABLE_NAME}  WHERE id = "${item.ID}";`; //'id'

    const res = await db?.executeSql(queryCheckExist);
    if (res) {
      if (res[0].rows.length > 0) {
        console.log('Item exist ' + item.ID);
        await DeclareMeterRepository.delete([
          {
            logic: '=',
            behindOperator: 'AND',
            data: {
              ID: item.ID,
            },
          },
        ]);
      }
    }

    let query = `INSERT INTO ${TABLE_NAME} (`;
    let first: boolean;
    first = true;
    for (let i in item) {
      if (first === true) {
        first = false;
      } else {
        query += ',';
      }

      query += i;
    }
    query += `)
  VALUES
  (`;
    first = true;
    for (let i in item) {
      if (first === true) {
        first = false;
      } else {
        query += ',';
      }
      if (item[i] !== null || item[i] !== undefined) {
        query += `"${item[i]}"`;
      } else {
      }
    }
    query += ');';
    //console.log('query:', query);

    await db?.executeSql(query);
    return true;
  } catch (error) {
    console.log(TAG, error.message);
  }
  return false;
};
