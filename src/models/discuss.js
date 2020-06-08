/*
 * @Author: Wenzhe
 * @Date: 2020-04-27 10:51:45
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-06-08 19:27:23
 */

import {
  getDiscussList,
  getDiscussTags,
  getMyDiscussInfo,
  getDiscussDetail,
  createDiscuss,
  updateDiscuss,
  joinDuscuss,
  getUserCollectDiscuss,
  userCollectDiscuss,
  cancelUserCollectDiscuss,
  deleteDiscuss,
  createComment,
  deleteComment,
  createReply,
  deleteReply,
  deleteJoinDiscuss,
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
    *updateDiscuss({ payload }, { call }) {
      const response = yield call(updateDiscuss, payload);
      console.log('updayte res', response);
      if (response.data && response.data.status) {
        message.success('更新成功');
        return 'update_success';
      }
    },
    *deleteDiscuss({ payload }, { call }) {
      const response = yield call(deleteDiscuss, payload);
      if (response.data === '删除成功') {
        message.success('删除成功');
        return 'delete_success';
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
    *deleteJoinDiscuss({ payload }, { call }) {
      const response = yield call(deleteJoinDiscuss, payload);
      if (response.data && response.data === '删除讨论成功') {
        message.success('删除讨论成功');
        return 'delete_discuss_success';
      }
    },
    *userCollectDiscuss({ payload }, { call }) {
      const response = yield call(userCollectDiscuss, payload);
      if (response.data && response.data === '用户添加收藏成功') {
        message.success('添加收藏成功');
      }
    },
    *cancelUserCollectDiscuss({ payload }, { call, put }) {
      const response = yield call(cancelUserCollectDiscuss, payload);
      if (response.data && response.data === '用户取消收藏成功') {
        message.success('用户取消收藏成功');
        // 还是不要直接获取数据好 。。。
        // yield put({
        //   type: 'fetchUserCollectDiscuss',
        // });
        yield put({
          type: 'user/fetchCurrent',
        });
      }
    },
    *createComment({ payload }, { call }) {
      const response = yield call(createComment, payload);
      if (response.data && response.data === '评论添加成功') {
        return 'comment_success';
      }
    },
    *deleteComment({ payload }, { call }) {
      const response = yield call(deleteComment, payload);
      if (response.data && response.data === '删除评论成功') {
        message.success('删除评论成功');
        return 'delete_comment_success';
      }
    },
    *createReply({ payload }, { call }) {
      const response = yield call(createReply, payload);
      if (response.data && response.data === '评论添加成功') {
        return 'comment_success';
      }
    },
    *deleteReply({ payload }, { call }) {
      const response = yield call(deleteReply, payload);
      if (response.data && response.data === '删除回复成功') {
        message.success('删除回复成功');
        return 'delete_reply_success';
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
