/*
 * @Author: Wenzhe
 * @Date: 2020-04-30 16:25:16
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-01 09:17:36
 */
import React from 'react';
import { connect, history } from 'umi';
import { useMount, useUnmount } from '@umijs/hooks';
import { Table, Alert, Divider, PageHeader } from 'antd';
import styles from './index.less';

const ArticleDetail = (props) => {
  const {
    match,
    dispatch,
    discuss: { discussDetail },
  } = props;

  useMount(() => {
    const { did } = match.params;
    dispatch({
      type: 'discuss/fetchDiscussDetail',
      payload: {
        did,
      },
    });
  });

  useUnmount(() => {
    dispatch({
      type: 'discuss/cleanDiscussDetail',
    });
  });

  return (
    <div>
      <h1>article detail</h1>
      <h1>{discussDetail.title}</h1>
      <p>{discussDetail.detail}</p>
    </div>
  );
};

export default connect(({ discuss, loading }) => ({
  discuss,
  fetchDiscussDetailLoading: loading.effects['discuss/fetchDiscussDetail'],
}))(ArticleDetail);
