/*
 * @Author: Wenzhe
 * @Date: 2020-04-22 09:34:08
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-06-08 10:24:57
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

export async function getUserCollectDiscuss() {
  return request(`/api/user_discuss`);
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

export async function userCollectDiscuss(params) {
  return request(`/api/user_discuss`, {
    method: 'POST',
    data: params,
  });
}

export async function cancelUserCollectDiscuss(params) {
  const { did } = params;
  return request(`/api/user_discuss/${did}`, {
    method: 'DELETE',
  });
}

export async function deleteDiscuss(params) {
  return request(`/api/discuss/${params.id}`, {
    method: 'DELETE',
  });
}

export async function createComment(params) {
  const { did, payload } = params;
  return request(`/api/discuss/comment/${did}`, {
    method: 'POST',
    data: payload,
  });
}

export async function deleteComment(params) {
  return request(`/api/discuss/comment/${params.id}`, {
    method: 'DELETE',
  });
}

export async function createReply(params) {
  const { comment_id, payload } = params;
  return request(`/api/discuss/reply/${comment_id}`, {
    method: 'POST',
    data: payload,
  });
}

export async function deleteReply(params) {
  const { comment_id, reply_id } = params;
  return request(
    `/api/discuss_delete_reply?comment_id=${comment_id}&reply_id=${reply_id}`,
    {
      method: 'DELETE',
    },
  );
}
