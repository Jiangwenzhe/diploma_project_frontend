/*
 * @Author: Wenzhe
 * @Date: 2020-04-14 12:44:43
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-20 09:36:32
 */
import { queryCurrent, query as queryUsers } from '../service/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response.data && response.data.user.uid) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data.user,
        });
      }
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
