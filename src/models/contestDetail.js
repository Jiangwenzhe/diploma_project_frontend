/*
 * @Author: Wenzhe
 * @Date: 2020-05-05 16:38:42
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-05 16:50:16
 */
import { getContentDetail } from '@/service/contest';
import { message } from 'antd';
import { history } from 'umi';

const Model = {
  namespace: 'contestDetail',
  state: {
    contestDetail: {},
  },
  effects: {
    *fetchContestDetail({ payload }, { call, put }) {
      const response = yield call(getContentDetail, payload);
      if (response.data === 'verify error') {
        history.push(`/contest`);
        message.error('你没有权限！！！');
        return;
      }
      yield put({
        type: 'save',
        payload: {
          contestDetail: response.data,
        },
      });
    },
    *cleanContestDetail(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          contestDetail: {},
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
