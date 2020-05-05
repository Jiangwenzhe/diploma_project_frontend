/*
 * @Author: Wenzhe
 * @Date: 2020-05-03 19:53:50
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-05 21:20:06
 */
import React, { useState } from 'react';
import { connect, history, Link } from 'umi';
import { useMount, useUnmount } from '@umijs/hooks';
import { Row, Col, Progress, Menu } from 'antd';
import Countdown from 'react-countdown';
import moment from 'moment';
import styles from './index.less';

const { Item } = Menu;

const menuData = [
  { route: '/', name: '总览' },
  { route: '/problem', name: '题目详情' },
  { route: '/status', name: '提交详情' },
  { route: '/ranklist', name: '本场排名' },
];

const ContestDetail = (props) => {
  const {
    match,
    location,
    dispatch,
    contestDetail: { contestDetail },
    children,
  } = props;

  const [countdownToPercentage, setCountdownToPercentage] = useState(0);

  useMount(() => {
    const { cid } = match.params;
    dispatch({
      type: 'contestDetail/fetchContestDetail',
      payload: {
        cid,
      },
    });
  });

  useUnmount(() => {
    dispatch({
      type: 'contestDetail/cleanContestDetail',
    });
  });

  const hadnleCountdownTick = () => {
    const total_time = moment.duration(
      moment(contestDetail.end_time).diff(moment(contestDetail.start_time)),
    )._milliseconds;
    const rest_time = moment.duration(
      moment(Date.now()).diff(moment(contestDetail.start_time)),
    )._milliseconds;
    const percent = (rest_time / total_time) * 100;
    setCountdownToPercentage(percent);
  };

  return (
    <div>
      <div className={styles.countdown_card}>
        <Row justify="space-between">
          <Col span={5} className={styles.center}>
            <h2 className={styles.time_title}>
              开始：{contestDetail.start_time}
            </h2>
          </Col>
          <Col span={5} className={[styles.center, styles.countdown].join(' ')}>
            <Countdown
              date={moment(contestDetail.end_time).toDate()}
              onTick={hadnleCountdownTick}
            >
              <h2 className={styles.countend_title}>时间到</h2>
            </Countdown>
          </Col>
          <Col span={5} className={styles.center}>
            <h2 className={styles.time_title}>
              结束：{contestDetail.end_time}
            </h2>
          </Col>
        </Row>
        <div>
          <Progress
            strokeWidth={15}
            strokeColor={{
              '0%': '#52c41a',
              '100%': '#fa541c',
            }}
            percent={countdownToPercentage}
            status="active"
            showInfo={false}
          />
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Menu
          className={styles.header_menu}
          mode="horizontal"
          selectedKeys={[
            `/${
              location.pathname.split('/')[3]
                ? location.pathname.split('/')[3]
                : ''
            }`,
          ]}
        >
          {menuData.map((menu) => {
            return (
              <Item key={menu.route}>
                <Link
                  to={`/contest/${match.params.cid}${
                    menu.route === '/problem' ? '/problem/1' : menu.route
                  }`}
                >
                  {menu.name}
                </Link>
              </Item>
            );
          })}
        </Menu>
      </div>
      <div className={styles.main}>{children}</div>
    </div>
  );
};

export default connect(({ contestDetail, loading }) => ({
  contestDetail,
  fetchContestDetailLoading:
    loading.effects['contestDetail/fetchContestDetail'],
}))(ContestDetail);
