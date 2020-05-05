/*
 * @Author: Wenzhe
 * @Date: 2020-05-03 19:53:50
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-05 21:02:08
 */

import React, { useState } from 'react';
import { useMount, useUnmount } from '@umijs/hooks';
import { connect, history, Link } from 'umi';
import { Row, Col, Progress, Tabs, Table } from 'antd';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import { createFromIconfontCN, DownOutlined } from '@ant-design/icons';
import CodeBlock from '../../../../components/CodeBlock';
import moment from 'moment';
import styles from './index.less';
import icon_font_url from '../../../../config/iconfont';

const IconFont = createFromIconfontCN({
  scriptUrl: icon_font_url,
});

const ContestOverAll = (props) => {
  const {
    match,
    dispatch,
    fetchContestDetailLoading,
    contestDetail: { contestDetail },
    user: { currentUser },
  } = props;

  useMount(() => {
    if (!contestDetail._id) {
      const { cid } = match.params;
      dispatch({
        type: 'contestDetail/fetchContestDetail',
        payload: {
          cid,
        },
      });
    }
  });

  const columns = [
    {
      title: '',
      dataIndex: '',
      key: 'pid',
      width: '5%',
      render: (value) => {
        if (!currentUser) return <></>;
        const { pid } = value;
        const { solved_list, failed_list } = currentUser;
        if (solved_list && solved_list.includes(pid)) {
          return <IconFont type="icon-check" style={{ color: '#52c41a' }} />;
        }
        if (failed_list && failed_list.includes(pid)) {
          return <IconFont type="icon-question" style={{ color: '#faad14' }} />;
        }
      },
    },
    {
      title: () => <IconFont type="icon-hashtag" />,
      dataIndex: 'pid',
      key: 'pid',
      width: '5%',
      render: (_, __, index) => {
        return index + 1;
      },
    },
    {
      title: '题名',
      // dataIndex: 'title',
      render: (value) => {
        return <Link to={`/problem/${value.pid}`}>{value.title}</Link>;
      },
      width: '50%',
    },
    {
      title: '通过率',
      render: (value) => {
        const rate = Math.round((value.solve / value.submit) * 100);
        return <>{`${isNaN(rate) ? 0 : rate}%`}</>;
      },
      width: '10%',
    },
  ];

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.middle}>
          <h1>{contestDetail.title}</h1>
        </div>
        <div className={styles.middle}>
          <div className={styles.content}>
            <div className="markdown-body">
              <ReactMarkdown source={contestDetail.description} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.table}>
        <Table
          columns={columns}
          rowKey="_id"
          dataSource={contestDetail.problemList}
          pagination={false}
          size="small"
        />
      </div>
    </div>
  );
};

export default connect(({ contestDetail, user, loading }) => ({
  contestDetail,
  user,
}))(ContestOverAll);
