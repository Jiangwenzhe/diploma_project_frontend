/*
 * @Author: Wenzhe
 * @Date: 2020-05-03 14:07:32
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-07 10:32:46
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
  return request('/api/contest/verify', {
    method: 'POST',
    data: params,
  });
}

export async function getProblemInfoByCidAndPid(params) {
  const { cid, pid } = params;
  return request(`/api/contest_problemDetail?cid=${cid}&pid=${pid}`);
}

export async function getStatusList(params) {
  const {
    pagination: { current, pageSize },
    query: { uid, pid, status, cid, username, result, language },
  } = params;
  return request(
    `/api/submission?current=${current}&pageSize=${pageSize}&uid=${uid}&pid=${pid}&status=${status}&cid=${cid}&username=${username}&result=${result}&language=${language}`,
  );
}
