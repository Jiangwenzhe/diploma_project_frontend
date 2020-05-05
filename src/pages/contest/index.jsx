import React, { useState, useEffect } from 'react';
import {
  Table,
  Row,
  Pagination,
  Tag,
  Badge,
  Modal,
  Input,
  message,
  Progress,
} from 'antd';
import { connect, Link } from 'umi';
import moment from 'moment';
import styles from './index.less';

const { Password } = Input;

const makeContestTypeTag = (need_pass) => {
  if (need_pass) {
    return <Tag color="warning">需要密码</Tag>;
  } else {
    return <Tag color="success">公开</Tag>;
  }
};

const contestStatus = (startTime, endTime) => {
  if (moment(Date.now()).isBetween(startTime, endTime)) {
    return (
      <span>
        <Badge status="processing" />
        <span style={{ color: '#1890ff' }}>进行中</span>
      </span>
    );
  }
  if (moment(Date.now()).isBefore(startTime)) {
    return (
      <span>
        <Badge status="default" />{' '}
        <span style={{ color: '#d9d9d9' }}>未开始</span>
      </span>
    );
  }
  if (moment(Date.now()).isAfter(endTime)) {
    return (
      <span>
        <Badge status="error" />{' '}
        <span style={{ color: '#ff4d4f' }}>已结束</span>
      </span>
    );
  }
};

const Contest = (props) => {
  const {
    dispatch,
    fetchContestListLoading,
    contest: { contestListInfo, total },
    user: { currentUser },
  } = props;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [query, setQuery] = useState({
    title: '',
  });
  const [verifyFormModelVisible, setVerifyFormModelVisible] = useState(false);
  const [contestPass, setContestPass] = useState('');
  const [currentClickCid, setCurrentClickCid] = useState(null);

  useEffect(() => {
    dispatch({
      type: 'contest/fetchContestList',
      payload: { pagination, query },
    });
  }, [dispatch, pagination]);

  // 更改 pagination 中的 current 当前页码
  const paginationChangeHandler = (current) => {
    setPagination({ ...pagination, current });
  };

  // 更改 pagination 中的 pageSize 当前页面容量
  const handlePageSizeChange = (_, pageSize) => {
    setPagination({ ...pagination, pageSize });
  };

  const showVerifyFormModel = () => {
    setVerifyFormModelVisible(true);
  };

  const hideVerifyFormModel = () => {
    setVerifyFormModelVisible(false);
    // 清除相关的 state
    setContestPass('');
    setCurrentClickCid(null);
  };

  const handleContestPassChange = (e) => {
    setContestPass(e.target.value);
  };

  // 处理用户想要参与 contest 的函数
  const handleJoinContest = (record) => {
    if (moment(Date.now()).isBefore(record.start_time)) {
      message.info('当前比赛还未开始，请耐心等待。');
      return;
    }
    const { cid, need_pass } = record;
    if (!need_pass) {
      dispatch({
        type: 'contest/verifyUserPersmission',
        payload: { cid: record.cid, password: '' },
      });
    }
    setCurrentClickCid(cid);
    if (need_pass) {
      showVerifyFormModel();
    }
  };

  // 处理用户提交表单
  const handleVerifyFormSubmit = () => {
    dispatch({
      type: 'contest/verifyUserPersmission',
      payload: { cid: currentClickCid, password: contestPass },
    });
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'cid',
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: '10%',
      render: (text, record) => {
        return <a onClick={() => handleJoinContest(record)}>{text}</a>;
      },
    },
    {
      title: '进度',
      width: '40%',
      render: (text, record) => {
        const total_time = moment.duration(
          moment(record.end_time).diff(moment(record.start_time)),
        )._milliseconds;
        const rest_time = moment.duration(
          moment(Date.now()).diff(moment(record.start_time)),
        )._milliseconds;
        const percent = (rest_time / total_time) * 100;
        console.log(record.end_time, record.start_time);
        return (
          <Progress
            strokeWidth={10}
            size="small"
            percent={rest_time > 0 ? percent : 0}
            status="active"
            showInfo={false}
          />
        );
      },
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      render: (time) => {
        return time;
      },
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
    },
    {
      title: '类型',
      dataIndex: 'need_pass',
      render: (need_pass) => makeContestTypeTag(need_pass),
    },
    {
      title: '状态',
      render: (_, record) => contestStatus(record.start_time, record.end_time),
    },
  ];

  return (
    <div className={styles.main_contest_table}>
      <h1>比赛列表</h1>
      <div>
        <Table
          columns={columns}
          rowKey="_id"
          dataSource={contestListInfo}
          loading={fetchContestListLoading}
          pagination={false}
        />
      </div>
      <div>
        <Pagination
          style={{ marginTop: '10px' }}
          current={pagination.current}
          pageSize={pagination.pageSize}
          onChange={(current) => paginationChangeHandler(current)}
          onShowSizeChange={handlePageSizeChange}
          showSizeChanger
          total={total}
        />
      </div>
      <Modal
        title={'密码输入框'}
        visible={verifyFormModelVisible}
        onOk={handleVerifyFormSubmit}
        onCancel={hideVerifyFormModel}
        okText="确定"
        cancelText="取消"
      >
        <Password
          value={contestPass}
          onChange={handleContestPassChange}
          placeholder="请输入密码"
        />
      </Modal>
    </div>
  );
};

export default connect(({ contest, loading, user }) => ({
  contest,
  user,
  fetchContestListLoading: loading.effects['contest/fetchContestList'],
}))(Contest);
