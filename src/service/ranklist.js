/*
 * @Author: Wenzhe
 * @Date: 2020-04-24 16:15:57
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-07 17:17:04
 */
import request from '@/utils/request';

export async function getRankList(params) {
  const {
    // pagination: { current, pageSize },
    query: { name },
  } = params;
  return request(`/api/ranklist?name=${name}`);
}
