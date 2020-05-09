import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { connect } from 'umi';
import moment from 'moment';

const defaultColumns = [
  {
    title: '#',
    // dataIndex: '_id',
    render: (_, __, index) => {
      if (index === 0) {
        return (
          <>
            <strong>1</strong> <span style={{ fontSize: '18px' }}>🏅️</span>
          </>
        );
      }
      if (index === 1) {
        return (
          <>
            <strong>2</strong> <span style={{ fontSize: '18px' }}>🥈</span>
          </>
        );
      }
      if (index === 2) {
        return (
          <>
            <strong>3</strong> <span style={{ fontSize: '18px' }}>🥉</span>
          </>
        );
      }
      return <strong>{index}</strong>;
    },
  },
  {
    title: 'uid',
    dataIndex: 'uid',
  },
  {
    title: '用户名',
    dataIndex: 'userInfo',
    render: (userInfo) => <>{userInfo.name}</>,
  },
  {
    title: '已解决',
    dataIndex: 'solveCount',
  },
  {
    title: '总时间',
    dataIndex: 'total_time',
    render: (time) => {
      const ms = moment.duration(time, 'seconds');
      return `${Math.trunc(ms.asHours())}:${ms.minutes()}:${ms.seconds()}`;
    },
  },
];

const makeColumns = (problemList) => {
  const problemColumns = problemList.map((problem, index) => {
    return {
      title: index + 1,
      onCell: (record, rowIndex) => ({
        // style: {
        //   backgroundColor: 'red'
        // }
      }),
      render: (_, record) => {
        // console.log(problem)
        const { ac_time, is_first_ac, wa_count } = record.list[index][
          problem.pid
        ];
        console.log(record.list[index]);
        console.log(problem.pid);
        if (ac_time) {
          return (
            <span style={{ color: is_first_ac ? 'blue' : 'green' }}>
              {wa_count === 0 ? `${ac_time}` : `${ac_time} | (${wa_count})`}
            </span>
          );
        }
        if (wa_count) {
          return <span style={{ color: 'red' }}>{`-${wa_count}`}</span>;
        }
        return '';
      },
    };
  });
  return [...defaultColumns, ...problemColumns];
};

const StatusList = (props) => {
  const {
    match,
    dispatch,
    fetchRankListLoading,
    contestDetail: { contestDetail, rankList },
  } = props;

  // const [columns, setColumns] = useState(defaultColumns);

  useEffect(() => {
    if (!contestDetail._id) {
      const { cid } = match.params;
      dispatch({
        type: 'contestDetail/fetchContestDetail',
        payload: {
          cid,
        },
      });
    }
  }, [contestDetail, dispatch]);

  useEffect(() => {
    const { cid } = match.params;
    dispatch({
      type: 'contestDetail/fetchRankList',
      payload: { cid },
    });
  }, [dispatch, match]);

  // useEffect(() => {
  //   if (contestDetail._id) {
  //     console.log(contestDetail.problemList);
  //     const { problemList } = contestDetail;
  //     const problemColumns = problemList.map((problem, index) => {
  //       return {
  //         title: index + 1,
  //         render: (_, record, index) => {
  //           return 1;
  //         },
  //       };
  //     });
  //     setColumns([...columns, ...problemColumns]);
  //   }
  // }, [contestDetail]);

  return (
    <div>
      <div style={{ marginTop: '20px' }}>
        <Table
          bordered
          columns={
            contestDetail._id
              ? makeColumns(contestDetail.problemList)
              : defaultColumns
          }
          rowKey="uid"
          dataSource={rankList}
          loading={fetchRankListLoading}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default connect(({ contestDetail, loading }) => ({
  contestDetail,
  fetchRankListLoading: loading.effects['contestDetail/fetchRankList'],
}))(StatusList);
