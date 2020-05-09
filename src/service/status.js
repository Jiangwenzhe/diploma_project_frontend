/*
 * @Author: Wenzhe
 * @Date: 2020-04-22 09:34:08
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-08 23:25:10
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

export async function getUserQuestionsSubmittedRecords(params) {
  const { uid, pid } = params;
  return request(`/api/get_user_problem_submission?uid=${uid}&pid=${pid}`);
}
