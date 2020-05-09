/*
 * @Author: Wenzhe
 * @Date: 2020-04-15 08:24:32
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-08 09:58:33
 */
import request from '@/utils/request';

export async function getProlebmList(params) {
  const {
    pagination: { current, pageSize },
    query: { title, difficulty, tag },
  } = params;
  console.log(difficulty);
  // if (title) {
  //   return request(
  //     `/api/problem?current=${current}&pageSize=${pageSize}&title=${title}&visible=true`,
  //   );
  // }
  return request(
    `/api/problem?current=${current}&pageSize=${pageSize}&title=${title}&difficulty=${difficulty}&tag=${tag}&visible=true`,
  );
}

export async function getSingleProblemInfo(params) {
  const { pid } = params;
  return request(`/api/problemid/${pid}`);
}

export async function getSingleProblemTestCase(params) {
  const { test_case_id } = params;
  return request(`/api/problem/testcase/${test_case_id}`);
}

export async function deleteSingleProblem(params) {
  const { problem_id } = params;
  return request(`/api/problem/${problem_id}`, { method: 'DELETE' });
}

export async function createProblem(params) {
  return request('/api/problem', {
    method: 'POST',
    data: params,
  });
}

export async function updateProblem(params) {
  return request(`/api/problem/${params.id}`, {
    method: 'PUT',
    data: params.data,
  });
}

export async function getProblemInfo(params) {
  return request(`/api/problem/${params}`);
}
