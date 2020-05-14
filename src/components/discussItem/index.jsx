/*
 * @Author: Wenzhe
 * @Date: 2020-04-27 12:57:33
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-14 16:10:36
 */
import React, { useState, useEffect } from 'react';
import { Row, Avatar, Typography, Skeleton, Col } from 'antd';
import { connect } from 'umi';
import { history } from 'umi';
import styles from './index.less';
import { CommentOutlined } from '@ant-design/icons';
import { categoryToCN } from '../../config/discuss_config';
import {
  PlusOutlined,
  createFromIconfontCN,
  HeartFilled,
  HeartOutlined,
} from '@ant-design/icons';
import icon_font_url from '../../config/iconfont';

const IconFont = createFromIconfontCN({
  scriptUrl: icon_font_url,
});

const { Paragraph } = Typography;

const isDiscussOrArticle = (type) => {
  return type === 'article' ? '发表了文章' : '发起了讨论';
};

const DiscussItem = (props) => {
  const {
    discussInfo,
    clickCategoryFnc,
    dispatch,
    discuss,
    user: { currentUser },
  } = props;
  const {
    authorInfo,
    title,
    category,
    comments,
    type,
    detail,
    _id,
    access_number,
    discussList,
  } = discussInfo;

  const [isHovering, setIsHovering] = useState(false);
  const [isCollected, setIsCollected] = useState(false);

  const handleMouseHover = () => {
    setIsHovering(!isHovering);
  };

  const pushDiscuss = () => {
    if (type === 'article') {
      return history.push(`/discuss/articleDetail/${_id}`);
    }
    if (type === 'discuss') {
      return history.push(`/discuss/discussDetail/${_id}`);
    }
  };

  useEffect(() => {
    if (currentUser.uid && currentUser.collect_list.length > 0) {
      if (currentUser.collect_list.includes(_id)) {
        setIsCollected(true);
      }
    }
  }, [currentUser, _id]);

  const collectDiscuss = () => {
    setIsCollected(true);
    dispatch({
      type: 'discuss/userCollectDiscuss',
      payload: {
        did: _id,
      },
    });
  };

  const cancelCollectDiscuss = () => {
    setIsCollected(false);
    dispatch({
      type: 'discuss/cancelUserCollectDiscuss',
      payload: {
        did: _id,
      },
    });
  };

  return (
    <div className={styles.discuss}>
      {title ? (
        <>
          <Row align="middle" style={{ height: '24px' }}>
            <Avatar
              src={authorInfo.avatar}
              size={22}
              onClick={() => history.push(`/user/${authorInfo.uid}`)}
              style={{ cursor: 'pointer' }}
            />
            <span
              className={styles.discuss_title}
              onClick={() => pushDiscuss()}
            >
              {title}
            </span>
          </Row>
          <Row className={styles.info} align="middle">
            <span
              className={styles.click}
              onClick={() => history.push(`/user/${authorInfo.uid}`)}
            >
              {authorInfo.name}
            </span>
            &nbsp;在&nbsp;
            <span
              className={styles.click}
              onClick={() => clickCategoryFnc(category, type)}
            >
              {categoryToCN(category)}
            </span>
            &nbsp;中
            {isDiscussOrArticle(type)}
            <div className={styles.dot} />
            {access_number} 阅读
          </Row>
          <Row className={styles.summary} onClick={() => pushDiscuss()}>
            <Paragraph
              className={styles.summary_detail}
              ellipsis={{ rows: 3, expandable: true }}
            >
              {detail}
            </Paragraph>
          </Row>
          <Row
            className={styles.action}
            align="middle"
            onMouseEnter={handleMouseHover}
            onMouseLeave={handleMouseHover}
          >
            <Col span={2}>
              <CommentOutlined />
              <span className={styles.comment}>
                {type === 'discuss'
                  ? `${discussList.length} 条讨论`
                  : `${comments.length} 条评论`}
              </span>
            </Col>
            <Col span={2} style={{ marginLeft: '10px' }}>
              {isCollected ? (
                <span>
                  <span
                    className={styles.collect}
                    onClick={cancelCollectDiscuss}
                  >
                    <HeartFilled />
                    <span className={styles.comment}>已收藏</span>
                  </span>
                </span>
              ) : (
                <span className={styles.hide}>
                  <span className={styles.collect} onClick={collectDiscuss}>
                    <HeartOutlined />
                    <span className={styles.comment}>我的收藏</span>
                  </span>
                </span>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default connect(({ discuss, user, loading }) => ({
  discuss,
  user,
  // fetchMyDiscussInfoLoading: loading.effects['discuss/fetchMyDiscussInfo'],
  // fetchDiscussListLoading: loading.effects['discuss/fetchDiscussList'],
}))(DiscussItem);
