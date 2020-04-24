import React from 'react';
import style from './index.less';
import { connect } from 'umi';

const StatusDetail = (props) => {
  const { match } = props;

  return (
    <div>
      <h1>{match.params.sid}</h1>
    </div>
  );
};

export default StatusDetail;
