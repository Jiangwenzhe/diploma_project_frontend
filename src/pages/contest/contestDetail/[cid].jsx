/*
 * @Author: Wenzhe
 * @Date: 2020-05-03 19:53:50
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-03 23:44:18
 */
import React, { useState } from 'react';
import { connect, history } from 'umi';
import { useMount, useUnmount } from '@umijs/hooks';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import moment from 'moment';
import CodeBlock from '../../../components/CodeBlock';
import styles from './index.less';

const ContestDetail = (props) => {
  const {
    match,
    dispatch,
    fetchContestDetailLoading,
    contest: { contestDetail },
  } = props;

  useMount(() => {
    const { cid } = match.params;
    dispatch({
      type: 'contest/fetchContestDetail',
      payload: {
        cid,
      },
    });
  });

  console.log(contestDetail);

  return (
    <div>
      <h1>Contest Detail</h1>
      <h1>{contestDetail.title}</h1>
    </div>
  );
};

export default connect(({ contest, loading }) => ({
  contest,
  fetchContestDetailLoading: loading.effects['contest/fetchContestDetail'],
}))(ContestDetail);
