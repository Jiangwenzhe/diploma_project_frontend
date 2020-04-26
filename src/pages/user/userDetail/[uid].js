/*
 * @Author: Wenzhe
 * @Date: 2020-04-25 16:25:16
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-26 14:25:08
 */
import React, { useEffect } from 'react';
import { connect, Link } from 'umi';
import { useMount, useUnmount } from '@umijs/hooks';
import {
  Divider,
  Tabs,
  Row,
  Col,
  Avatar,
  Typography,
  Badge,
  Statistic,
} from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import icon_font_url from '../../../config/iconfont';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const IconFont = createFromIconfontCN({
  scriptUrl: icon_font_url,
});

const UserDetail = (props) => {
  const {
    match,
    dispatch,
    userInfo: { userInfo },
    // 当前用户 / 用来开启编辑界面
    user: { currentUser },
  } = props;

  useEffect(() => {
    const { uid } = match.params;
    dispatch({
      type: 'userInfo/fetchUserInfo',
      payload: {
        uid,
      },
    });
  }, [match, dispatch]);

  useUnmount(() => {
    dispatch({
      type: 'status/cleanUserInfo',
    });
  });

  return (
    <div>
      <Tabs tabPosition="left">
        <TabPane tab="用户信息" key="1">
          <Row style={{ marginTop: '10px' }}>
            <Col span={5} offset={1}>
              <Row justify="space-around" align="middle">
                <Badge
                  count={userInfo.privilege === 3 ? '管理员' : '普通用户'}
                  showZero
                  style={{
                    backgroundColor:
                      userInfo.privilege === 3 ? '#fa541c' : '#1890ff',
                  }}
                >
                  <Avatar shape="square" size={120} src={userInfo.avatar} />
                </Badge>
              </Row>
              <Title style={{ marginTop: '10px' }} level={2}>
                {userInfo.name}
              </Title>
              <Text ellipsis={true}>
                <IconFont type="icon-jilika" />
                <span style={{ marginLeft: '6px' }}>
                  Motto: {userInfo.motto}
                </span>
              </Text>
              <br />
              <Text ellipsis={true}>
                <IconFont type="icon-email" />
                <span style={{ marginLeft: '6px' }}>
                  Mail: {userInfo.mail ? userInfo.mail : 'null'}
                </span>
              </Text>
              <br />
              <Text ellipsis={true}>
                <IconFont type="icon-school" />
                <span style={{ marginLeft: '6px' }}>
                  School: {userInfo.school ? userInfo.school : 'null'}
                </span>
              </Text>
              <br />
              <Text ellipsis={true}>
                <IconFont type="icon-company" />
                <span style={{ marginLeft: '6px' }}>
                  Company: {userInfo.company ? userInfo.company : 'null'}
                </span>
              </Text>
              <Divider />
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="已解决"
                    value={
                      userInfo.solved_list ? userInfo.solved_list.length : 0
                    }
                    valueStyle={{ color: '#51C41B' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="尝试过"
                    value={
                      userInfo.submit_list ? userInfo.submit_list.length : 0
                    }
                    valueStyle={{ color: '#FAAD15' }}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={15} offset={2}>
              <div style={{ minHeight: '200px' }}>
                <Title level={4} style={{ fontWeight: 300, display: 'block' }}>
                  已解决:
                </Title>
                {userInfo.solved_list && userInfo.solved_list.length > 0 ? (
                  userInfo.solved_list.map((pid) => (
                    <Link
                      style={{
                        marginRight: '10px',
                        fontSize: '16px',
                        color: '#51C41B',
                      }}
                      to={`/problem/${pid}`}
                      key={pid}
                    >
                      {pid}
                    </Link>
                  ))
                ) : (
                  <div />
                )}
              </div>
              <div style={{ minHeight: '200px' }}>
                <Title level={4} style={{ fontWeight: 300, display: 'block' }}>
                  尝试过:
                </Title>
                {userInfo.failed_list && userInfo.failed_list.length > 0 ? (
                  userInfo.failed_list.map((pid) => (
                    <Link
                      style={{
                        marginRight: '10px',
                        fontSize: '16px',
                        color: '#FAAD15',
                      }}
                      to={`/problem/${pid}`}
                      key={pid}
                    >
                      {pid}
                    </Link>
                  ))
                ) : (
                  <div />
                )}
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="用户分析" key="2">
          Content of Tab 3
        </TabPane>
        {currentUser.uid === userInfo.uid && (
          <TabPane tab="编辑" key="3">
            Content of Tab 2
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default connect(({ userInfo, loading, user }) => ({
  userInfo,
  user,
  fetchUserInfoLoading: loading.effects['userInfo/fetchUserInfo'],
}))(UserDetail);
