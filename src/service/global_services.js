/*
 * @Author: Wenzhe
 * @Date: 2020-03-26 09:58:55
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-14 12:24:12
 */

import request from '@/utils/request';

const baseURL  = 'http://127.0.0.1:7001';

export async function checkBackEnd() {
  return request(baseURL + '/');
}
