/*
 * @Author: Wenzhe
 * @Date: 2020-05-03 19:11:02
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-06 08:39:05
 */

const makeStrokeColor = (rate) => {
  if (rate <= 25) {
    return '#f5222d';
  }
  if (rate > 25 && rate <= 50) {
    return '#fa8c16';
  }
  if (rate > 50 && rate <= 75) {
    return '#1890ff';
  }
  if (rate > 75) {
    return '#52c41a';
  }
};

const makeReverseStrokeColor = (rate) => {
  if (rate <= 25) {
    return '#52c41a';
  }
  if (rate > 25 && rate <= 50) {
    return '#1890ff';
  }
  if (rate > 50 && rate <= 75) {
    return '#fa8c16';
  }
  if (rate > 75) {
    return '#f5222d';
  }
};

export { makeStrokeColor, makeReverseStrokeColor };
