import React, { useState } from 'react';
import { Menu, Row, Col, Avatar, Typography, Button } from 'antd';
import styles from './index.less';
import { Link, connect, history } from 'umi';
import LoginModal from '../loginModal';

const { Item, SubMenu } = Menu;
const { Text } = Typography;

const menuData = [
  { route: '/', name: 'Home' },
  { route: '/problem', name: 'problem' },
  { route: '/discuss', name: 'discuss' },
  { route: '/contest', name: 'contest' },
  { route: '/status', name: 'status' },
  { route: '/rankList', name: 'rankList' },
];

const PageHeader = (props) => {
  const {
    pathname,
    user: { currentUser },
    dispatch,
  } = props;
  const [loginModelVisible, setLoginModelVisible] = useState(false);

  const logout = () => {
    dispatch({
      type: 'login/logout',
    });
  };

  return (
    <>
      <div className={styles.header}>
        <Row align="middle">
          <Col span={3}>{/* logo */}</Col>
          <Col span={11}>
            <Menu
              className={styles.header_menu}
              mode="horizontal"
              selectedKeys={[`/${pathname.split('/')[1]}`]}
            >
              {menuData.map((menu) => {
                return (
                  <Item key={menu.route}>
                    <Link to={menu.route}>{menu.name}</Link>
                  </Item>
                );
              })}
            </Menu>
          </Col>
          <Col offset={7}>
            {!currentUser.uid ? (
              <>
                <Button
                  type="dashed"
                  size="small"
                  onClick={() => setLoginModelVisible(true)}
                >
                  登录
                </Button>
                <Button
                  style={{ marginLeft: '10px' }}
                  type="dashed"
                  size="small"
                >
                  注册
                </Button>
              </>
            ) : (
              <Menu
                mode="horizontal"
                selectable={false}
                className={styles.user_menu}
              >
                <SubMenu
                  title={
                    <>
                      <Avatar size="small" src={currentUser.avatar} />
                      <Text style={{ marginLeft: '10px' }}>
                        {currentUser.name}
                      </Text>
                    </>
                  }
                >
                  <Menu.Item
                    key="user_profile"
                    onClick={() => history.push(`/user/${currentUser.uid}`)}
                  >
                    个人信息
                  </Menu.Item>
                  <Menu.Item key="logout" onClick={() => logout()}>
                    退出登录
                  </Menu.Item>
                </SubMenu>
              </Menu>
            )}
          </Col>
        </Row>
      </div>
      <LoginModal
        visible={loginModelVisible}
        hideVisible={() => setLoginModelVisible(false)}
      />
    </>
  );
};

export default connect(({ user, login }) => ({
  user,
  login,
}))(PageHeader);
