import React, { useState, useEffect } from 'react';
import {
  Table,
  Row,
  Input,
  Col,
  Typography,
  Card,
  Avatar,
  Badge,
  Tag,
  Progress,
} from 'antd';
import { useMount, useUnmount } from '@umijs/hooks';
import { connect, Link, history } from 'umi';
import Countdown from 'react-countdown';
import moment from 'moment';
import styles from './index.less';
import { makeReverseStrokeColor } from '../../config/contest_config';

const { Title, Paragraph } = Typography;

const pushDiscuss = (type, _id) => {
  if (type === 'article') {
    return history.push(`/discuss/articleDetail/${_id}`);
  }
  if (type === 'discuss') {
    return history.push(`/discuss/discussDetail/${_id}`);
  }
};

const makeContestTypeTag = (need_pass) => {
  if (need_pass) {
    return <Tag color="warning">需要密码</Tag>;
  } else {
    return <Tag color="success">公开</Tag>;
  }
};

const contestStatus = (startTime, endTime) => {
  if (moment(Date.now()).isBetween(startTime, endTime)) {
    return (
      <span>
        <Badge status="processing" />
        <span style={{ color: '#1890ff' }}>进行中</span>
      </span>
    );
  }
  if (moment(Date.now()).isBefore(startTime)) {
    return (
      <span>
        <Badge status="default" />{' '}
        <span style={{ color: '#d9d9d9' }}>未开始</span>
      </span>
    );
  }
  if (moment(Date.now()).isAfter(endTime)) {
    return (
      <span>
        <Badge status="error" />{' '}
        <span style={{ color: '#ff4d4f' }}>已结束</span>
      </span>
    );
  }
};

const renderDiscuss = (info) => {
  return (
    <div key={info._id} className={styles.discussMain}>
      <div className={styles.discussItemHeader}>
        <span>
          <span>
            <Avatar
              src={info.authorInfo.avatar}
              size={22}
              onClick={() => history.push(`/user/${info.authorInfo.uid}`)}
              style={{ cursor: 'pointer' }}
            />
          </span>
          <span
            className={styles.click_title}
            onClick={() => pushDiscuss(info.type, info._id)}
          >
            {info.title}
          </span>
        </span>
        <span className={styles.drak}>
          {moment(info.createdAt).format('YYYY-MM-DD')}
        </span>
      </div>
      <div
        style={{ marginLeft: '10px' }}
        onClick={() => pushDiscuss(info.type, info._id)}
      >
        <Paragraph ellipsis={{ rows: 2 }}>{info.detail}</Paragraph>
      </div>
    </div>
  );
};

const renderHot = (info) => {
  return (
    <div key={info._id} className={styles.discussMain}>
      <div className={styles.discussItemHeader}>
        <span>
          <span>
            <Avatar
              src={info.authorInfo.avatar}
              size={22}
              onClick={() => history.push(`/user/${info.authorInfo.uid}`)}
              style={{ cursor: 'pointer' }}
            />
          </span>
          <span
            className={styles.click_title}
            onClick={() => pushDiscuss(info.type, info._id)}
          >
            {info.title}
          </span>
        </span>
        <span className={styles.drak}>{`${info.access_number} 次阅读`}</span>
      </div>
      <div
        style={{ marginLeft: '10px' }}
        onClick={() => pushDiscuss(info.type, info._id)}
      >
        <Paragraph ellipsis={{ rows: 2 }}>{info.detail}</Paragraph>
      </div>
    </div>
  );
};

const renderContest = (info) => {
  const total_time = moment.duration(
    moment(info.end_time).diff(moment(info.start_time)),
  )._milliseconds;
  const rest_time = moment.duration(
    moment(Date.now()).diff(moment(info.start_time)),
  )._milliseconds;
  const percent = (rest_time / total_time) * 100;
  return (
    <div
      key={info._id}
      className={styles.contestMain}
      onClick={() => history.push('/contest')}
    >
      <div className={styles.contest_header}>
        <span className={styles.contest_title}>{info.title}</span>
        <span>
          <span>{makeContestTypeTag(info.need_pass)}</span>
        </span>
      </div>
      <div>
        <Countdown date={moment(info.end_time).toDate()}>
          <span className={styles.countend_title}>时间到</span>
        </Countdown>
        <Progress
          strokeWidth={10}
          size="small"
          percent={rest_time > 0 ? percent : 0}
          status="active"
          showInfo={false}
          strokeColor={makeReverseStrokeColor(percent)}
        />
      </div>
    </div>
  );
};

const Home = (props) => {
  const {
    dispatch,
    fetchHomeInfoLoading,
    home: {
      homeInfo: { contest, hot, news },
    },
  } = props;

  useMount(() => {
    dispatch({
      type: 'home/fetchHomeInfo',
    });
  });

  return (
    <div>
      <Row justify="center">
        <Col className={styles.box_shadow} span={7}>
          <Title level={3}>资讯</Title>
          <div>{news && news.map((info) => renderDiscuss(info))}</div>
        </Col>
        <Col className={styles.box_shadow} span={7} offset={1}>
          <Title level={3}>最近比赛</Title>
          <div>{news && contest.map((info) => renderContest(info))}</div>
        </Col>
        <Col className={styles.box_shadow} span={7} offset={1}>
          <Title level={3}>热榜 🔥</Title>
          <div>{news && hot.map((info) => renderHot(info))}</div>
        </Col>
      </Row>
      <br />
      {/* <Row justify="center">
        <Col className={styles.box_shadow} span={7}>
          <Title level={3}>资讯</Title>
          <li>xasxsa</li>
        </Col>
        <Col className={styles.box_shadow} span={7} offset={1}>
          <Title level={3}>资讯</Title>
          <li>xasxsa</li>
        </Col>
        <Col className={styles.box_shadow} span={7} offset={1}>
          <Title level={3}>资讯</Title>
          <li>xasxsa</li>
        </Col>
      </Row> */}
    </div>
  );
};
export default connect(({ home, loading }) => ({
  home,
  fetchHomeInfoLoading: loading.effects['home/fetchHomeInfo'],
}))(Home);
