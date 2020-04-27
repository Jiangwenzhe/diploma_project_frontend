/*
 * @Author: Wenzhe
 * @Date: 2020-04-25 16:32:03
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-27 09:37:52
 */
import request from '../utils/request';

export async function fetchUserInfo(params) {
  return request(`/api/userinfo/${params.uid}`);
}

export async function updateUserInfo(params) {
  return request(`/api/user/${params.id}`, {
    method: 'PUT',
    data: params.data,
  });
}
