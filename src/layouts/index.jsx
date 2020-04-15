import React, {useEffect} from 'react';
import PageHeader from '../components/header/index.jsx';
import { useRequest } from '@umijs/hooks';
import { Button } from 'antd';
import { connect } from 'umi';
const BasicLayout = (props) => {
  const {
    location: { pathname },
    children,
    dispatch,
    user,
    login
  } = props;

  useEffect(() => {
    if (dispatch && localStorage.getItem('node-oj-token')) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, [login]);

  return (
    <div>
      <PageHeader pathname={pathname} user={user}/>
      <div style={{ padding: '30px' }}>{children}</div>
    </div>
  );
};

export default connect(({ user, login }) => ({
  user,
  login
}))(BasicLayout);
