/*
 * @Author: Wenzhe
 * @Date: 2020-04-16 16:36:43
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-08 23:34:30
 */
import { getSingleProblemInfo } from '@/service/problem';
import { createSubmission, getSubmission } from '@/service/submission';
import { getUserQuestionsSubmittedRecords } from '@/service/status';
import { message } from 'antd';
import { history } from 'umi';

const Model = {
  namespace: 'problemDetail',
  state: {
    problemInfo: {},
    submissionInfo: {},
    currentSubmissionID: null,
    userSubmissionInfo: [],
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
            currentSubmissionID: response.data._id,
          },
        });
        return response.data;
      }
    },
    // 轮训请求 ---------
    *getSubmission({ payload }, { call, put }) {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      // 设置 delay 500ms
      yield delay(1000);
      const clone_payload = JSON.parse(JSON.stringify(payload));
      const response = yield call(getSubmission, payload);
      const check = (response) => {
        if (response.data.result + 4) return true;
        return false;
      };
      console.log(check(response));
      if (response.code === 0 && response.data && check(response)) {
        console.log('change submit info');
        message.success('🎉 判题结果返回成功 🎉', 1);
        yield put({
          type: 'save',
          payload: {
            submissionInfo: response.data,
          },
        });
        // 重新获取 problemInfo
        yield put({
          type: 'fetchProblemInfo',
          payload: {
            pid: payload.pid,
          },
        });
      }
      const needToCheckAgain = !check(response);
      if (needToCheckAgain) {
        yield put({ type: 'getSubmission', payload: clone_payload });
      }
    },
    *getUserQuestionsSubmittedRecords({ payload }, { call, put }) {
      const response = yield call(getUserQuestionsSubmittedRecords, payload);
      yield put({
        type: 'save',
        payload: {
          userSubmissionInfo: response.data.list ? response.data.list : [],
        },
      });
    },
    *cleanProblemDetailModel(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          problemInfo: {},
          currentSubmissionID: null,
          submissionInfo: {},
          userSubmissionInfo: [],
        },
      });
    },
    *cleanSubmission(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          currentSubmissionID: null,
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
