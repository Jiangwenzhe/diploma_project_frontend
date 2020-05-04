/*
 * @Author: Wenzhe
 * @Date: 2020-05-03 14:07:32
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-03 23:47:53
 */
import request from '@/utils/request';

export async function getContestList(params) {
  const {
    pagination: { current, pageSize },
    query: { title },
  } = params;
  return request(
    `/api/contest?current=${current}&pageSize=${pageSize}&title=${title}`,
  );
}

export async function getContentDetail(params) {
  const { cid } = params;
  return request(`/api/contest/${cid}`);
}

export async function verifyUserPersmission(params) {
  console.log('params', params);
  return request('/api/contest/verify', {
    method: 'POST',
    data: params,
  });
}
