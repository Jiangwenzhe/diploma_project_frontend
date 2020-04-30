/*
 * @Author: Wenzhe
 * @Date: 2020-04-27 10:51:45
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-30 23:04:16
 */

import {
  getDiscussList,
  getDiscussTags,
  getMyDiscussInfo,
  getDiscussDetail,
} from '@/service/discuss';

const Model = {
  namespace: 'discuss',
  state: {
    discussList: [],
    discussTags: [],
    total: 0,
    discussDetail: {},
  },
  effects: {
    *fetchDiscussList({ payload }, { call, put }) {
      const response = yield call(getDiscussList, payload);
      yield put({
        type: 'save',
        payload: {
          discussList: Array.isArray(response.data.list)
            ? response.data.list
            : [],
          total: response.data.total,
        },
      });
    },
    *fetchMyDiscussInfo({ payload }, { call, put }) {
      const response = yield call(getMyDiscussInfo, payload);
      yield put({
        type: 'save',
        payload: {
          discussList: Array.isArray(response.data.list)
            ? response.data.list
            : [],
          total: response.data.total,
        },
      });
    },
    *fetchDiscussTags(_, { call, put }) {
      const response = yield call(getDiscussTags);
      const tagValue = response.data.map((item) => item.name);
      yield put({
        type: 'save',
        payload: {
          discussTags: tagValue,
        },
      });
    },
    *fetchDiscussDetail({ payload }, { call, put }) {
      const response = yield call(getDiscussDetail, payload);
      yield put({
        type: 'save',
        payload: {
          discussDetail: response.data,
        },
      });
    },
    *cleanDiscussListInfo(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          discussList: [],
        },
      });
    },
    *cleanDiscussDetail(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          discussDetail: {},
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
