/*
 * @Author: Wenzhe
 * @Date: 2020-04-25 16:25:16
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-07 11:15:17
 */
import React from 'react';
import { connect, history } from 'umi';
import { useMount, useUnmount } from '@umijs/hooks';
import { Table, Alert, Divider, PageHeader } from 'antd';
import ShowCode from '../../../components/showCode/index';
import { BtoMB } from '../../../utils/tool_fuc';
import { judge_result } from '../../../config/judge_result';
import StatusTag from '../../../components/StatusTag';

const StatusDetail = (props) => {
  const {
    match,
    dispatch,
    status: { submissionDetail },
  } = props;

  useMount(() => {
    const { sid } = match.params;
    dispatch({
      type: 'status/fetchSubmissionDetail',
      payload: {
        sid,
      },
    });
  });

  useUnmount(() => {
    dispatch({
      type: 'status/cleanSubmissionDetail',
    });
  });

  const DrawerTableColumns = [
    {
      title: '#',
      render: (value) => value.test_case,
    },
    {
      title: '测试用例结果',
      dataIndex: 'result',
      render: (result) => <StatusTag status={result} />,
    },
    {
      title: 'CPU 用时',
      dataIndex: 'cpu_time',
    },
    {
      title: '执行用时',
      dataIndex: 'real_time',
    },
    {
      title: '内存消耗',
      dataIndex: 'memory',
      render: (memory) => `${BtoMB(memory)} mb`,
    },
    {
      title: '信号|Singal',
      dataIndex: 'signal',
    },
    {
      title: '错误',
      dataIndex: 'error',
    },
  ];

  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => history.goBack()}
        title={`提交记录 | Pid: ${submissionDetail.pid}`}
        subTitle={`sid: ${match.params.sid}`}
      />
      <div style={{ padding: '16px 30px' }}>
        {submissionDetail.result === -2 ? (
          <Alert
            message={judge_result[submissionDetail.result]}
            description={
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {submissionDetail.status_info.error_info}
              </div>
            }
            type={submissionDetail.result === 0 ? 'success' : 'error'}
            showIcon
          />
        ) : (
          <Alert
            message={judge_result[submissionDetail.result]}
            description={
              <div style={{ fontSize: '12px' }}>
                <span>
                  CPU 用时(总):{' '}
                  {submissionDetail.status_info
                    ? submissionDetail.status_info.cpu_time_cost
                    : 0}
                  ms
                </span>
                <span style={{ marginLeft: '15px' }}>
                  执行用时(总):{' '}
                  {submissionDetail.status_info
                    ? submissionDetail.status_info.real_time__cost
                    : 0}
                  ms
                </span>
                <span style={{ marginLeft: '15px' }}>
                  内存消耗(总):{' '}
                  {BtoMB(
                    submissionDetail.status_info
                      ? submissionDetail.status_info.memory_cost
                      : 0,
                  )}
                  MB
                </span>
                <span style={{ marginLeft: '15px' }}>
                  执行语言 : {submissionDetail.language}
                </span>
              </div>
            }
            type={submissionDetail.result === 0 ? 'success' : 'error'}
            showIcon
          />
        )}
        <Divider />
        {submissionDetail.result !== -2 && (
          <>
            <Table
              columns={DrawerTableColumns}
              dataSource={
                submissionDetail.info
                  ? submissionDetail.info.judge_result_info
                  : []
              }
              rowKey="output_md5"
              size="small"
            />
            <Divider />
          </>
        )}
        <ShowCode
          language={submissionDetail.language}
          code={submissionDetail.code}
        />
      </div>
    </div>
  );
};

export default connect(({ status, loading }) => ({
  status,
  fetchStatusDetailLoading: loading.effects['status/fetchSubmissionDetail'],
}))(StatusDetail);
