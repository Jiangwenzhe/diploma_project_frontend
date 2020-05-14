/*
 * @Author: Wenzhe
 * @Date: 2020-04-27 10:51:45
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-14 13:19:50
 */

import {
  getDiscussList,
  getDiscussTags,
  getMyDiscussInfo,
  getDiscussDetail,
  createDiscuss,
  joinDuscuss,
  getUserCollectDiscuss,
} from '@/service/discuss';

import { message } from 'antd';

const Model = {
  namespace: 'discuss',
  state: {
    discussList: [],
    discussTags: [],
    total: 0,
    discussDetail: {},
    communicationQuery: {
      category: '',
      type: '',
      tag: '',
      title: '',
    },
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
    *fetchUserCollectDiscuss(_, { call, put }) {
      const response = yield call(getUserCollectDiscuss);
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
    *createDiscuss({ payload }, { call }) {
      const response = yield call(createDiscuss, payload);
      if (response.data && response.data._id) {
        message.success(
          `题为「 ${response.data.title} 」的${
            response.data.type === 'article' ? '文章' : '讨论'
          }已创建成功`,
        );
        return 'create_success';
      }
    },
    *joinDuscuss({ payload }, { call, put }) {
      const response = yield call(joinDuscuss, payload);
      if (response.data && response.data === '添加讨论成功') {
        message.success('添加讨论成功');
        yield put({
          type: 'fetchDiscussDetail',
          payload: { did: payload.did },
        });
        return 'success';
      }
    },
    *changeCommunicationQuery({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          communicationQuery: payload,
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
