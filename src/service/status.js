/*
 * @Author: Wenzhe
 * @Date: 2020-04-22 09:34:08
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-07 11:28:49
 */
import request from '@/utils/request';

export async function getStatusList(params) {
  const {
    pagination: { current, pageSize },
    query: { uid, pid, username, result, language },
  } = params;
  return request(
    `/api/submission?current=${current}&pageSize=${pageSize}&uid=${uid}&pid=${pid}&username=${username}&result=${result}&language=${language}`,
  );
}

export async function fetchSubmissionDetail(params) {
  return request(`/api/submission/${params.sid}`);
}
