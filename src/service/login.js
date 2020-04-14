/*
 * @Author: Wenzhe
 * @Date: 2020-04-14 16:32:09
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-14 16:32:47
 */
import request from '../utils/request';

export async function accountLogin(params) {
  return request('/api/user/access/login', {
    method: 'POST',
    data: params,
  });
}
