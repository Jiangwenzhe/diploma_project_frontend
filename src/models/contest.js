/*
 * @Author: Wenzhe
 * @Date: 2020-05-03 14:07:26
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-03 23:45:37
 */
import {
  getContestList,
  getContentDetail,
  verifyUserPersmission,
} from '@/service/contest';
import { message } from 'antd';
import { history } from 'umi';

const Model = {
  namespace: 'contest',
  state: {
    contestListInfo: [],
    total: 0,
    contestDetail: {},
  },
  effects: {
    *fetchContestList({ payload }, { call, put }) {
      const response = yield call(getContestList, payload);
      yield put({
        type: 'save',
        payload: {
          contestListInfo: Array.isArray(response.data.list)
            ? response.data.list
            : [],
          total: response.data.total,
        },
      });
    },
    *verifyUserPersmission({ payload }, { call, put }) {
      const response = yield call(verifyUserPersmission, payload);
      console.log('permission --- response --- ', response);
      if (response.data === 'verify error') {
        message.error('密码错误');
        return;
      }
      if (response.data === 'success') {
        history.push(`/contest/${payload.cid}`);
      }
    },
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
    *cleanContestList(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          contestListInfo: [],
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
