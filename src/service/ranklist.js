/*
 * @Author: Wenzhe
 * @Date: 2020-04-24 16:15:57
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-24 16:17:11
 */
import request from '@/utils/request';

export async function getRankList(params) {
  const {
    pagination: { current, pageSize },
  } = params;
  return request(`/api/ranklist?current=${current}&pageSize=${pageSize}`);
}
