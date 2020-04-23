/*
 * @Author: Wenzhe
 * @Date: 2020-04-17 10:30:33
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-23 12:25:52
 */
import request from '@/utils/request';

export async function createSubmission(params) {
  return request('/api/submission', {
    method: 'POST',
    data: params,
  });
}

export async function getSubmission(params) {
  return request(`/api/submission/${params.id}`);
}
