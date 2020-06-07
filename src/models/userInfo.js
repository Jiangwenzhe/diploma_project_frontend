/*
 * @Author: Wenzhe
 * @Date: 2020-04-25 16:36:55
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-06-07 13:07:48
 */
import { fetchUserInfo, updateUserInfo } from '@/service/userInfo';
import { getStatusList } from '@/service/status';
import { message } from 'antd';

const Model = {
  namespace: 'userInfo',
  state: {
    userInfo: {},
    userSubmissionList: [],
    userSubmissionTotal: 0,
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
        return response.data;
      }
    },
    // 获取用户提交信息
    *fetchStatusList({ payload }, { call, put }) {
      const response = yield call(getStatusList, payload);
      yield put({
        type: 'save',
        payload: {
          userSubmissionList: Array.isArray(response.data.list)
            ? response.data.list
            : [],
          userSubmissionTotal: response.data.total,
        },
      });
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
