/*
 * @Author: Wenzhe
 * @Date: 2020-04-14 16:30:41
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-13 09:27:43
 */

import { accountLogin, createUserInfo } from '../service/login';
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
    *register({ payload }, { call }) {
      const response = yield call(createUserInfo, payload);
      if (response.code === 0 && response.data) {
        message.success('用户添加成功~');
        return {
          status: 'success',
          loginPayload: {
            name: payload.name,
            password: payload.password,
          },
        };
      }
      return undefined;
    },
    logout(_) {
      // 删除 localStorage
      localStorage.removeItem('node-oj-token');
      history.push('/');
      location.reload();
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
