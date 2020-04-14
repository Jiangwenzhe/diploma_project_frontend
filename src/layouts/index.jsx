import React, {useEffect} from 'react';
import PageHeader from '../components/header/index.jsx';
import { useRequest } from '@umijs/hooks';
import { Button } from 'antd';
// import { history } from 'umi';
const BasicLayout = (props) => {
  console.log('layout props', props);
  const { data, error, loading } = useRequest({
    url: '/api/user/5e705038256ed078616221c1',
    method: 'get',
  });
  const {
    location: { pathname },
    children,
  } = props;
  return (
    <div>
      <PageHeader pathname={pathname} />
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
};

export default BasicLayout;
