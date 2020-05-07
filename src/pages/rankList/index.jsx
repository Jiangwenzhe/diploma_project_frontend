import React, { useState, useEffect } from 'react';
import { Table, Row, Input } from 'antd';
import { connect, Link } from 'umi';

const { Search } = Input;

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

  const [name, setName] = useState('');

  const [query, setQuery] = useState({
    name: '',
  });

  useEffect(() => {
    dispatch({
      type: 'ranklist/fetchRankList',
      payload: { query },
    });
  }, [dispatch, pagination, query]);

  const tableChangeHandler = (current_pagination) => {
    setPagination(current_pagination);
  };

  const changeSearchName = (e) => {
    if (e.target.value === '') {
      setQuery({ ...query, name: '' });
    }
    setName(e.target.value);
  };

  const handleSearch = () => {
    setQuery({ ...query, name });
  };

  const columns = [
    {
      title: '排名',
      width: '6%',
      render: (text, record, index) => {
        if (record.rank === 1) {
          return (
            <>
              <strong>1</strong> <span style={{ fontSize: '18px' }}>🏅️</span>
            </>
          );
        }
        if (record.rank === 2) {
          return (
            <>
              <strong>2</strong> <span style={{ fontSize: '18px' }}>🥈</span>
            </>
          );
        }
        if (record.rank === 3) {
          return (
            <>
              <strong>3</strong> <span style={{ fontSize: '18px' }}>🥉</span>
            </>
          );
        }
        return <strong>{record.rank}</strong>;
      },
    },
    {
      title: '用户名称',
      dataIndex: 'name',
      width: '10%',
      render: (text, record, index) => (
        <Link to={`/user/${record.uid}`}>{text}</Link>
      ),
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
      <div style={{ marginBottom: '20px' }}>
        <Search
          placeholder="请输入用户名"
          size="large"
          onChange={(e) => changeSearchName(e)}
          onSearch={handleSearch}
          value={name}
          enterButton
        />
      </div>
      <Table
        size="large"
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
