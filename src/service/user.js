/*
 * @Author: Wenzhe
 * @Date: 2020-04-08 16:25:28
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-14 22:17:40
 */
import request from '../utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/user/access/current');
}
export async function queryNotices() {
  return request('/api/notices');
}
