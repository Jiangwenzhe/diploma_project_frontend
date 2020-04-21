/*
 * @Author: Wenzhe
 * @Date: 2020-04-16 16:36:43
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-21 17:39:22
 */
import { getSingleProblemInfo } from '@/service/problem';
import { createSubmission } from '@/service/submission';
import { message } from 'antd';
import { history } from 'umi';

const Model = {
  namespace: 'problemDetail',
  state: {
    problemInfo: {},
    submissionInfo: {},
  },
  effects: {
    *fetchProblemInfo({ payload }, { call, put }) {
      const response = yield call(getSingleProblemInfo, payload);
      if (!response.data) {
        message.error(`pid 为 ${payload.pid} 的题目不存在`);
        history.push('/problem');
      }
      if (response.code === 0 && response.data) {
        yield put({
          type: 'save',
          payload: {
            problemInfo: response.data,
          },
        });
      }
    },
    *createSubmission({ payload }, { call, put }) {
      console.log('---payload---', payload);
      const response = yield call(createSubmission, payload);
      if (response.code === 0 && response.data) {
        console.log(response);
        yield put({
          type: 'save',
          payload: {
            submissionInfo: response.data,
          },
        });
      }
    },
    *cleanSubmission({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          submissionInfo: {},
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
