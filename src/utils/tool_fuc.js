/*
 * @Author: Wenzhe
 * @Date: 2020-04-21 10:48:38
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-06-06 14:29:03
 */

import { v4 as uuidv4 } from 'uuid';

//  bit 转 mb 的函数
const BtoMB = (param) => Math.round(param / (1024 * 1024));

// 数组 filter 函数
const filterItem = (arr, query) => {
  return arr.filter((el) => el.toLowerCase().indexOf(query.toLowerCase()) > -1);
};

const inverseFilter = (arr, query) => {
  return arr.filter(
    (el) => el.toLowerCase().indexOf(query.toLowerCase()) === -1,
  );
};

const makeRandomListKey = () => {
  return uuidv4();
};

export { BtoMB, filterItem, inverseFilter, makeRandomListKey };
