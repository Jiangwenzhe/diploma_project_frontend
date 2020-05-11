/*
 * @Author: Wenzhe
 * @Date: 2020-05-10 19:22:24
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-10 19:26:10
 */
import { getHomeInfo } from '@/service/home';

const Model = {
  namespace: 'home',
  state: {
    homeInfo: {},
  },
  effects: {
    *fetchHomeInfo(_, { call, put }) {
      const response = yield call(getHomeInfo);
      yield put({
        type: 'save',
        payload: {
          homeInfo: response.data,
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
