/*
 * @Author: Wenzhe
 * @Date: 2020-03-20 14:03:23
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-14 18:59:44
 */

import { queryCurrent } from './service/user';

export async function getInitialState() {
  if (!localStorage.getItem('node-oj-token')) {
    return {
      msg: '用户未登录',
    };
  }
  const response = await queryCurrent();
  return response.data;
}
