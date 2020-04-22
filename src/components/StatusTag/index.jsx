import React from 'react';
import { Tag } from 'antd';
import { judge_result } from '../../config/judge_result';

const StatusTag = (props) => {
  const { status } = props;
  if (status === 0) {
    return <Tag color="#52c41a">{judge_result[status]}</Tag>;
  }
  if (status === -2) {
    return <Tag color="#ff4d4f">{judge_result[status]}</Tag>;
  }
  return <Tag color="#faad14">{judge_result[status]}</Tag>;
};

export default StatusTag;
