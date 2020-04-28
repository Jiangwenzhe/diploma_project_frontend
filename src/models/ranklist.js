/*
 * @Author: Wenzhe
 * @Date: 2020-04-24 16:15:49
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-27 10:53:16
 */
import { getRankList } from '@/service/ranklist';

const Model = {
  namespace: 'ranklist',
  state: {
    ranklistInfo: [],
    total: 0,
  },
  effects: {
    *fetchRankList({ payload }, { call, put }) {
      const response = yield call(getRankList, payload);
      yield put({
        type: 'save',
        payload: {
          ranklistInfo: Array.isArray(response.data.list)
            ? response.data.list
            : [],
          total: response.data.total,
        },
      });
    },
    *cleanRankListInfo(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          ranklistInfo: [],
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
