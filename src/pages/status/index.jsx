import React, { useState, useEffect } from 'react';
import { Table, Input, Form, Button, Select } from 'antd';
import { connect, Link } from 'umi';
import styles from './index.less';
import StatusTag from '../../components/StatusTag';
import moment from 'moment';
import { BtoMB } from '../../utils/tool_fuc';

const { Item } = Form;
const { Option } = Select;

const StatusList = (props) => {
  const {
    dispatch,
    fetchStatusListLoading,
    status: { statusList, total },
  } = props;

  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [query, setQuery] = useState({
    uid: '',
    pid: '',
    username: '',
    result: '',
    language: '',
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
      title: '提交用户',
      render: (_, record) => {
        return record.userInfo.name;
      },
    },
    {
      title: '判题结果',
      dataIndex: 'result',
      render: (result) => <StatusTag status={result} />,
    },
    {
      title: 'CPU 用时',
      render: (record) => {
        if (record.result === -2) return '/';
        return record.status_info.cpu_time_cost;
      },
    },
    {
      title: '执行用时',
      render: (record) => {
        if (record.result === -2) return '/';
        return record.status_info.real_time__cost;
      },
    },
    {
      title: '内存消耗',
      render: (record) => {
        if (record.result === -2) return '/';
        return `${BtoMB(record.status_info.memory_cost)} MB`;
      },
    },
    {
      title: '执行语言',
      dataIndex: 'language',
    },
    {
      title: '提交时间',
      dataIndex: 'create_at',
      render: (time_stamp) => moment(time_stamp).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  const buttonItemLayout = {
    wrapperCol: { span: 14, offset: 4 },
  };

  const handleFormFinish = (values) => {
    const { pid, name, result, language } = values;
    setPagination({ ...pagination, current: 1 });
    setQuery({
      ...query,
      pid,
      name,
      result: result ? result : '',
      language: language ? language : '',
    });
  };

  return (
    <div>
      <div>
        <Form
          layout="inline"
          form={form}
          initialValues={{
            pid: '',
            name: '',
          }}
          onFinish={handleFormFinish}
        >
          <Item label="Pid" name="pid">
            <Input placeholder="请输入 pid" allowClear />
          </Item>
          <Item label="用户名" name="name">
            <Input placeholder="请输入用户名" allowClear />
          </Item>
          <Item name="result" label="判题结果">
            <Select
              style={{ width: 200 }}
              placeholder="请选择判题结果"
              allowClear={true}
            >
              <Option value="0">Accepted</Option>
              <Option value="-1">Wrong Answer</Option>
              <Option value="-2">Complie Error</Option>
              <Option value="4">RUNTIME ERROR</Option>
              <Option value="5">SYSTEM ERROR</Option>
              <Option value="1">CPU TIME LIMIT EXCEEDED</Option>
              <Option value="2">REAL TIME LIMIT EXCEEDED</Option>
            </Select>
          </Item>
          <Item name="language" label="执行语言">
            <Select
              style={{ width: 200 }}
              placeholder="请选择执行语言"
              allowClear={true}
            >
              <Option value="Cpp">C++</Option>
              <Option value="C">C</Option>
              <Option value="Java">Java</Option>
              <Option value="Python2">Python2</Option>
              <Option value="Python3">Python3</Option>
            </Select>
          </Item>
          <Item {...buttonItemLayout}>
            <Button type="dashed" htmlType="submit">
              搜索
            </Button>
          </Item>
        </Form>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Table
          columns={columns}
          rowKey="_id"
          onChange={tableChangeHandler}
          dataSource={statusList}
          pagination={{ ...pagination, total, showSizeChanger: true }}
          loading={fetchStatusListLoading}
        />
      </div>
    </div>
  );
};

export default connect(({ status, loading }) => ({
  status,
  fetchStatusListLoading: loading.effects['status/fetchStatusList'],
}))(StatusList);
