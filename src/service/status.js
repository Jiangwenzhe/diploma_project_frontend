/*
 * @Author: Wenzhe
 * @Date: 2020-04-22 09:34:08
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-22 09:45:25
 */
import request from '@/utils/request';

export async function getStatusList(params) {
  const {
    pagination: { current, pageSize },
    query: { uid, pid },
  } = params;
  return request(
    `/api/submission?current=${current}&pageSize=${pageSize}&uid=${uid}&pid=${pid}`,
  );
}
