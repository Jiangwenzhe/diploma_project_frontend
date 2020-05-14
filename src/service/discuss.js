/*
 * @Author: Wenzhe
 * @Date: 2020-04-22 09:34:08
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-14 10:14:41
 */
import request from '@/utils/request';

export async function getDiscussList(params) {
  const {
    pagination: { current, pageSize },
    query: { category, type, tag, title },
  } = params;
  return request(
    `/api/discuss?current=${current}&pageSize=${pageSize}&category=${category}&type=${type}&tag=${tag}&title=${title}`,
  );
}

export async function getMyDiscussInfo(params) {
  const {
    pagination: { current, pageSize },
    query: { author_id, type },
  } = params;
  return request(
    `/api/discuss?current=${current}&pageSize=${pageSize}&type=${type}&author_id=${author_id}`,
  );
}

export async function getDiscussTags() {
  return request(`/api/discusstag`);
}

export async function getDiscussDetail(params) {
  const { did } = params;
  return request(`/api/discuss/${did}`);
}

export async function createDiscuss(params) {
  return request('/api/discuss', {
    method: 'POST',
    data: params,
  });
}

export async function joinDuscuss(params) {
  const { did, payload } = params;
  return request(`/api/discuss/joindiscuss/${did}`, {
    method: 'POST',
    data: payload,
  });
}
