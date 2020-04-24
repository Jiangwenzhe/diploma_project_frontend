import React, { useState, useEffect } from 'react';
import { Table, Row } from 'antd';
import { connect, Link } from 'umi';
import styles from './index.less';
import StatusTag from '../../components/StatusTag';
import moment from 'moment';
import { BtoMB } from '../../utils/tool_fuc';

const RankList = (props) => {
  const {
    dispatch,
    fetchStatusListLoading,
    ranklist: { ranklistInfo, total },
  } = props;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    dispatch({
      type: 'ranklist/fetchRankList',
      payload: { pagination },
    });
  }, [dispatch, pagination]);

  const tableChangeHandler = (current_pagination) => {
    setPagination(current_pagination);
  };

  const columns = [
    {
      title: '排名',
      render: (text, record, index) => `${index + 1}`,
      width: '5%',
    },
    {
      title: '用户名称',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: 'UID',
      dataIndex: 'uid',
      width: '5%',
    },
    {
      title: 'Motto',
      dataIndex: 'motto',
      width: '65%',
    },
    {
      title: 'Solve',
      width: '5%',
      render: (text, record, index) => {
        if (!record.solved_list) return 0;
        return record.solved_list.length;
      },
    },
    {
      title: 'Submit',
      width: '5%',
      render: (text, record, index) => {
        if (!record.submit_list) return 0;
        return record.submit_list.length;
      },
    },
    {
      title: 'Radio',
      width: '5%',
      render: (_, record) => {
        if (!record.submit_list || !record.solved_list.length) return '0%';
        return `${Math.round(
          (record.solved_list.length / record.submit_list.length) * 100,
        )}%`;
      },
    },
  ];

  return (
    <div>
      <Table
        title={() => <Row></Row>}
        columns={columns}
        rowKey="_id"
        onChange={tableChangeHandler}
        dataSource={ranklistInfo}
        pagination={{ ...pagination, total, showSizeChanger: true }}
        loading={fetchStatusListLoading}
      />
    </div>
  );
};

export default connect(({ ranklist, loading }) => ({
  ranklist,
  fetchRankListLoading: loading.effects['ranklist/fetchRankList'],
}))(RankList);
