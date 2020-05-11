/*
 * @Author: Wenzhe
 * @Date: 2020-05-10 19:21:41
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-10 19:27:03
 */
import request from '@/utils/request';

export async function getHomeInfo() {
  return request('/api/home');
}
