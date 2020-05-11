/*
 * @Author: Wenzhe
 * @Date: 2020-04-25 16:36:55
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-11 16:23:47
 */
import { fetchUserInfo, updateUserInfo } from '@/service/userInfo';
import { message } from 'antd';

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
    *updateUserInfo({ payload }, { call, put }) {
      const response = yield call(updateUserInfo, payload);
      if (response.code === 0 && response.data) {
        console.log(response);
        message.success('用户信息更新成功~');
        yield put({
          type: 'fetchUserInfo',
          payload: {
            uid: payload.uid,
          },
        });
        yield put({
          type: 'user/fetchCurrent',
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
