/*
 * @Author: Wenzhe
 * @Date: 2020-05-05 16:38:42
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-06 15:59:19
 */
import { getContentDetail, getProblemInfoByCidAndPid } from '@/service/contest';
import { createSubmission, getSubmission } from '@/service/submission';
import { message } from 'antd';
import { history } from 'umi';

const Model = {
  namespace: 'contestDetail',
  state: {
    contestDetail: {},
    problemDetail: {},
    submissionInfo: {},
    currentSubmissionID: null,
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
    *getProblemInfoByCidAndPid({ payload }, { call, put }) {
      const response = yield call(getProblemInfoByCidAndPid, payload);
      yield put({
        type: 'save',
        payload: {
          problemDetail: response.data,
        },
      });
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
    *cleanContestDetail(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          contestDetail: {},
        },
      });
    },
    *cleanProblemInfo(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          currentSubmissionID: null,
          submissionInfo: {},
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
