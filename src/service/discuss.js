/*
 * @Author: Wenzhe
 * @Date: 2020-04-22 09:34:08
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-30 22:59:18
 */
import request from '@/utils/request';

export async function getDiscussList(params) {
  const {
    pagination: { current, pageSize },
    query: { category, type, tag },
  } = params;
  return request(
    `/api/discuss?current=${current}&pageSize=${pageSize}&category=${category}&type=${type}&tag=${tag}`,
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
