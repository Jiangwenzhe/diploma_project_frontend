/*
 * @Author: Wenzhe
 * @Date: 2020-04-14 16:32:09
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-13 09:23:08
 */
import request from '../utils/request';

export async function accountLogin(params) {
  return request('/api/user/access/login', {
    method: 'POST',
    data: params,
  });
}

export async function createUserInfo(params) {
  return request(`/api/user`, {
    method: 'POST',
    data: params,
  });
}
