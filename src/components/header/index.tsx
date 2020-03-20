import React from 'react';
import { Menu } from 'antd';
import styles from './index.less';
import { Link } from 'umi';

const { Item } = Menu;

const PageHeader = (props: {}) => {
  return (
    <Menu
      className={styles.header}
      mode="horizontal"
      style={{ lineHeight: '60px', padding: '0 30px 0 30px' }}
      defaultSelectedKeys={['1']}
    >
      <Item key="1">
        <Link to="/">Home</Link>
      </Item>
      <Item key="2">
        <Link to="/problems">problems</Link>
      </Item>
      <Item key="3">
        <Link to="/discuss">discuss</Link>
      </Item>
      <Item key="4">
        <Link to="/contest">contest</Link>
      </Item>
      <Item key="5">
        <Link to="/rankList">rankList</Link>
      </Item>
    </Menu>
  );
};

export default PageHeader;
