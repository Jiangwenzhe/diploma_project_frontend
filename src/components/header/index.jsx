import React from 'react';
import { Menu, Row, Col, Avatar } from 'antd';
import styles from './index.less';
import { Link } from 'umi';
import { UserOutlined } from '@ant-design/icons';

const { Item } = Menu;


const menuData = [
  { route: '/', name: 'Home' },
  { route: '/problem', name: 'problem' },
  { route: '/discuss', name: 'discuss' },
  { route: '/contest', name: 'contest' },
  { route: '/rankList', name: 'rankList' },
];

const PageHeader = (props) => {
  console.log(props);
  const { pathname } = props;
  return (
    <Row className={styles.header} align="middle">
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
      <Col offset={4} styles={styles.user}>
        <Avatar  size="small" icon={<UserOutlined />} />
      </Col>
    </Row>
  );
};

export default PageHeader;
