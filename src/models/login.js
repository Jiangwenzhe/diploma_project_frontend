/*
 * @Author: Wenzhe
 * @Date: 2020-04-14 16:30:41
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-14 19:24:20
 */

import { accountLogin } from '../service/login';

const Model = {
  namespace: 'login',
  state: {
    status: 'error',
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (response.data.status === 'ok') {
        const { token } = response.data;
        localStorage.setItem('node-oj-token', token);
        yield put({
          type: 'save',
          payload: {
            status: response.data.status,
          },
        });
      }
      return response.data.status;
    },
    logout(_) {
      // 删除 localStorage
      localStorage.removeItem('node-oj-token');
      location.reload();
    }
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
