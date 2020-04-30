/*
 * @Author: Wenzhe
 * @Date: 2020-04-27 12:57:33
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-30 15:08:20
 */
import React from 'react';
import { Row, Avatar, Typography, Skeleton } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import { CommentOutlined } from '@ant-design/icons';
import { categoryToCN } from '../../config/discuss_config';

const { Paragraph } = Typography;

const isDiscussOrArticle = (type) => {
  return type === 'article' ? '发表了文章' : '发起了讨论';
};

const DiscussItem = (props) => {
  const { discussInfo, clickCategoryFnc } = props;
  const { authorInfo, title, category, comments, type, detail } = discussInfo;

  return (
    <div className={styles.discuss}>
      {title ? (
        <>
          <Row align="middle" style={{ height: '24px' }}>
            <Avatar src={authorInfo.avatar} size={22} />
            <span className={styles.discuss_title}>{title}</span>
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
            <div className={styles.dot} />0 阅读
          </Row>
          <Row className={styles.summary}>
            <Paragraph
              className={styles.summary_detail}
              ellipsis={{ rows: 3, expandable: true }}
            >
              {detail}
            </Paragraph>
          </Row>
          <Row className={styles.action} align="middle">
            <CommentOutlined />{' '}
            <span className={styles.comment}>{comments.length} 条评论</span>
          </Row>
        </>
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default DiscussItem;
