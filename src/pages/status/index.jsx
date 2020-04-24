import React, { useState, useEffect } from 'react';
import { Table, Row } from 'antd';
import { connect, Link } from 'umi';
import styles from './index.less';
import StatusTag from '../../components/StatusTag';
import moment from 'moment';
import { BtoMB } from '../../utils/tool_fuc';

const StatusList = (props) => {
  const {
    dispatch,
    fetchStatusListLoading,
    status: { statusList, total },
  } = props;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [query, setQuery] = useState({
    uid: '',
    pid: '',
  });

  useEffect(() => {
    dispatch({
      type: 'status/fetchStatusList',
      payload: { pagination, query },
    });
  }, [dispatch, pagination, query]);

  const tableChangeHandler = (current_pagination) => {
    setPagination(current_pagination);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      render: (id) => {
        return <Link to={`/status/${id}`}>{id}</Link>;
      },
    },
    {
      title: 'PID',
      dataIndex: 'pid',
    },
    {
      title: 'Username',
      dataIndex: 'username',
    },
    {
      title: 'Status',
      dataIndex: 'result',
      render: (result) => <StatusTag status={result} />,
    },
    {
      title: 'CPU Time',
      // dataIndex: 'cpu_time_cost',
      render: (record) => {
        if (record.result === -2) return '/';
        return record.status_info.cpu_time_cost;
      },
    },
    {
      title: 'Real Time',
      // dataIndex: 'real_time__cost',
      render: (record) => {
        if (record.result === -2) return '/';
        return record.status_info.real_time__cost;
      },
    },
    {
      title: 'Memory',
      // dataIndex: 'memory_cost',
      render: (record) => {
        if (record.result === -2) return '/';
        return `${BtoMB(record.status_info.memory_cost)} MB`;
      },
    },
    {
      title: 'Language',
      dataIndex: 'language',
    },
    {
      title: 'Submit Time',
      dataIndex: 'create_at',
      render: (time_stamp) => moment(time_stamp).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <div>
      <Table
        title={() => <Row></Row>}
        columns={columns}
        rowKey="_id"
        onChange={tableChangeHandler}
        dataSource={statusList}
        pagination={{ ...pagination, total, showSizeChanger: true }}
        loading={fetchStatusListLoading}
      />
    </div>
  );
};

export default connect(({ status, loading }) => ({
  status,
  fetchStatusListLoading: loading.effects['status/fetchStatusList'],
}))(StatusList);
