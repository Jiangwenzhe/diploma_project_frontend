import React, { useEffect } from 'react';
import PageHeader from '../components/header/index.jsx';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Layout, Typography } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import Clock from 'react-live-clock';
import { GithubOutlined } from '@ant-design/icons';

let currHref = '';

const { Content, Footer } = Layout;
const { Text } = Typography;

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
    <Layout className={styles.whole_page}>
      <PageHeader pathname={pathname} user={user} />
      <Content className={styles.container}>
        <div className={styles.main}>{children}</div>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#f5f7f9' }}>
        <Text type="secondary" style={{ marginRight: '5px' }}>
          Server Time:
        </Text>
        <Clock format="YYYY-MM-DD HH:mm:ss" ticking={true} />
        <br />
        <Text strong>Node OJ</Text>
        <Text> by </Text>
        <a href="https://github.com/Jiangwenzhe">
          姜文哲 <GithubOutlined />.
        </a>
      </Footer>
    </Layout>
  );
};

export default connect(({ user, login, loading }) => ({
  user,
  login,
  loading,
}))(BasicLayout);
