/*
 * @Author: Wenzhe
 * @Date: 2020-04-22 09:41:30
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-22 10:10:34
 */
import { getStatusList } from '@/service/status';

const Model = {
  namespace: 'status',
  state: {
    statusList: [],
    total: 0,
  },
  effects: {
    *fetchStatusList({ payload }, { call, put }) {
      const response = yield call(getStatusList, payload);
      yield put({
        type: 'save',
        payload: {
          statusList: Array.isArray(response.data.list)
            ? response.data.list
            : [],
          total: response.data.total,
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default Model;
