/*
 * @Author: Wenzhe
 * @Date: 2020-04-14 16:30:41
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-13 08:57:54
 */

import { accountLogin } from '../service/login';
import { message } from 'antd';
import { history } from 'umi';

const Model = {
  namespace: 'login',
  state: {
    status: 'error',
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (response.data.status === 'ok') {
        message.success('登录成功～～');
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
      history.push('/');
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
