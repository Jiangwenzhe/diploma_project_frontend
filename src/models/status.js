/*
 * @Author: Wenzhe
 * @Date: 2020-04-22 09:41:30
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-24 09:55:27
 */
import { getStatusList, fetchSubmissionDetail } from '@/service/status';

const Model = {
  namespace: 'status',
  state: {
    statusList: [],
    total: 0,
    submissionDetail: {},
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
    *fetchSubmissionDetail({ payload }, { call, put }) {
      const response = yield call(fetchSubmissionDetail, payload);
      if (response.code === 0 && response.data) {
        yield put({
          type: 'save',
          payload: {
            submissionDetail: response.data,
          },
        });
      }
    },
    *cleanSubmissionDetail(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          submissionDetail: {},
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
