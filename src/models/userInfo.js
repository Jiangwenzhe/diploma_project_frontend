/*
 * @Author: Wenzhe
 * @Date: 2020-04-25 16:36:55
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-25 16:44:48
 */
import { fetchUserInfo } from '@/service/userInfo';

const Model = {
  namespace: 'userInfo',
  state: {
    userInfo: {},
  },
  effects: {
    *fetchUserInfo({ payload }, { call, put }) {
      const response = yield call(fetchUserInfo, payload);
      if (response.code === 0 && response.data) {
        yield put({
          type: 'save',
          payload: {
            userInfo: response.data,
          },
        });
      }
    },
    *cleanUserInfo(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          userInfo: {},
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
