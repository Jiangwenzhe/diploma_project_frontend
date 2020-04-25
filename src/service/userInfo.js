/*
 * @Author: Wenzhe
 * @Date: 2020-04-25 16:32:03
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-25 16:44:16
 */
import request from '../utils/request';

export async function fetchUserInfo(params) {
  return request(`/api/userinfo/${params.uid}`);
}
