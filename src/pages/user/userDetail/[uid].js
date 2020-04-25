/*
 * @Author: Wenzhe
 * @Date: 2020-04-25 16:25:16
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-25 16:43:44
 */
import React from 'react';
import { connect, history } from 'umi';
import { useMount, useUnmount } from '@umijs/hooks';
import { Table, Alert, Divider, PageHeader } from 'antd';

const UserDetail = (props) => {
  const {
    match,
    dispatch,
    userInfo: { userInfo },
  } = props;

  useMount(() => {
    const { uid } = match.params;
    dispatch({
      type: 'userInfo/fetchUserInfo',
      payload: {
        uid,
      },
    });
  });

  useUnmount(() => {
    dispatch({
      type: 'status/cleanUserInfo',
    });
  });

  return (
    <div>
      <h1>{match.params.uid}</h1>
    </div>
  );
};

export default connect(({ userInfo, loading }) => ({
  userInfo,
  fetchUserInfoLoading: loading.effects['userInfo/fetchUserInfo'],
}))(UserDetail);
