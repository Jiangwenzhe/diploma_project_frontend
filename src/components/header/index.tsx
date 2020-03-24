import React from 'react';
import { Menu, Row, Col } from 'antd';
import styles from './index.less';
import { Link } from 'umi';
// import { HomeOutlined }  from '@ant-design/icons';

const { Item } = Menu;

interface Pathname {
  pathname: string,
}

interface menuRoute {
  route: string;
  name: string;
}

const menuData: menuRoute[] = [
  { route: '/', name: 'Home' },
  { route: '/problems', name: 'problems' },
  { route: '/discuss', name: 'discuss' },
  { route: '/contest', name: 'contest' },
  { route: '/rankList', name: 'rankList' },
];



const PageHeader = (props: Pathname) => {
  console.log(props);
  const { pathname } = props;
  return (
    <Row className={styles.header}>
      <Col span={1}></Col>
      <Col>
        <Menu
          // className={styles.header}
          mode="horizontal"
          style={{ lineHeight: '60px', padding: '0 30px 0 30px' }}
          selectedKeys={[pathname]}
        >
          {menuData.map(menu => {
            return (
              <Item key={menu.route}>
                <Link to={menu.route}>{menu.name}</Link>
              </Item>
            );
          })}
        </Menu>
      </Col>
      <Col></Col>
    </Row>
  );
};

export default PageHeader;
