import React, { useEffect } from 'react';
import PageHeader from '../components/header/index.jsx';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { connect } from 'umi';
import styles from './index.less';

let currHref = '';

const BasicLayout = (props) => {
  const {
    location: { pathname },
    children,
    dispatch,
    user,
    login,
    loading,
  } = props;

  const { href } = window.location;

  if (currHref !== href) {
    // currHref 和 href 不一致时说明进行了页面跳转
    NProgress.start(); // 页面开始加载时调用 start 方法
    if (!loading.global) {
      // loading.global 为 false 时表示加载完毕
      NProgress.done(); // 页面请求完毕时调用 done 方法
      currHref = href; // 将新页面的 href 值赋值给 currHref
    }
  }

  useEffect(() => {
    if (dispatch && localStorage.getItem('node-oj-token')) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, [login]);

  return (
    <div className={styles.whole_page}>
      <PageHeader pathname={pathname} user={user} />
      <div className={styles.container}>
        <div className={styles.main}>{children}</div>
      </div>
    </div>
  );
};

export default connect(({ user, login, loading }) => ({
  user,
  login,
  loading,
}))(BasicLayout);
