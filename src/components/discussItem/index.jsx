/*
 * @Author: Wenzhe
 * @Date: 2020-04-27 12:57:33
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-06-08 19:00:07
 */
import React, { useState, useEffect } from 'react';
import {
  Row,
  Avatar,
  Typography,
  Skeleton,
  Popover,
  Button,
  Modal,
  Popconfirm,
} from 'antd';
import { connect } from 'umi';
import { history } from 'umi';
import styles from './index.less';
import { CommentOutlined } from '@ant-design/icons';
import { categoryToCN } from '../../config/discuss_config';
import { makeRandomListKey } from '../../utils/tool_fuc';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;
const { confirm } = Modal;

const isDiscussOrArticle = (type) => {
  return type === 'article' ? '发表了文章' : '发起了讨论';
};

const DiscussItem = (props) => {
  const {
    discussInfo,
    clickCategoryFnc,
    dispatch,
    user: { currentUser },
    refetchDiscussList,
    updateDiscuss,
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
    tags,
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

  const deleteUserDiscuss = async (_id) => {
    const result = await dispatch({
      type: 'discuss/deleteDiscuss',
      payload: {
        id: _id,
      },
    });
    if (result === 'delete_success') {
      refetchDiscussList();
    }
  };

  return (
    <div className={styles.discuss}>
      {title ? (
        <>
          <Row
            align="middle"
            style={{ height: '24px' }}
            justify="space-between"
          >
            <span>
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
            </span>
            <span>
              {tags.map((tag, index) => {
                if (index > 1) {
                  return (
                    <Popover
                      placement="top"
                      title={'所有 tag '}
                      content={tags.map((tag) => (
                        <span key={makeRandomListKey()}>
                          <span className={styles.tag}>{tag}</span>
                          <span style={{ marginRight: '6px' }} />
                        </span>
                      ))}
                    >
                      ...
                    </Popover>
                  );
                }
                return (
                  <span key={makeRandomListKey()}>
                    <span className={styles.tag}>{tag}</span>
                    <span style={{ marginRight: '6px' }} />
                  </span>
                );
              })}
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
            <div className={styles.inline_block}>
              <CommentOutlined />
              <span className={styles.comment}>
                {type === 'discuss'
                  ? `${discussList.length} 条讨论`
                  : `${comments.length} 条评论`}
              </span>
            </div>
            {currentUser.uid && (
              <div
                className={styles.inline_block}
                style={{ marginLeft: '15px' }}
              >
                {isCollected ? (
                  <span>
                    <span
                      className={styles.collect}
                      onClick={cancelCollectDiscuss}
                    >
                      <HeartFilled />
                      <span className={styles.comment}>已收藏</span>
                    </span>
                    <span className={styles.hide}>
                      {authorInfo.uid === currentUser.uid && (
                        <span className={styles.ellipsis_aciton}>
                          <Popover
                            placement="top"
                            content={
                              <>
                                <Button
                                  type="text"
                                  size="small"
                                  onClick={() =>
                                    updateDiscuss(discussInfo, discussInfo.type)
                                  }
                                >
                                  编辑
                                </Button>
                                <Popconfirm
                                  title="您确定要删除当前内容吗？"
                                  onConfirm={() => deleteUserDiscuss(_id)}
                                  okText="删除"
                                  cancelText="取消"
                                >
                                  <Button type="text" size="small" danger>
                                    删除
                                  </Button>
                                </Popconfirm>
                              </>
                            }
                          >
                            <span className={styles.collect}>•••</span>
                          </Popover>
                        </span>
                      )}
                    </span>
                  </span>
                ) : (
                  <span className={styles.hide}>
                    <span className={styles.collect} onClick={collectDiscuss}>
                      <HeartOutlined />
                      <span className={styles.comment}>我的收藏</span>
                    </span>
                    {authorInfo.uid === currentUser.uid && (
                      <span className={styles.ellipsis_aciton}>
                        <Popover
                          placement="top"
                          content={
                            <>
                              <Button
                                type="text"
                                size="small"
                                onClick={() =>
                                  updateDiscuss(discussInfo, discussInfo.type)
                                }
                              >
                                编辑
                              </Button>
                              <Popconfirm
                                title="您确定要删除当前内容吗？"
                                onConfirm={() => deleteUserDiscuss(_id)}
                                okText="删除"
                                cancelText="取消"
                              >
                                <Button type="text" size="small" danger>
                                  删除
                                </Button>
                              </Popconfirm>
                            </>
                          }
                        >
                          <span className={styles.collect}>•••</span>
                        </Popover>
                      </span>
                    )}
                  </span>
                )}
              </div>
            )}
          </Row>
        </>
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default connect(({ discuss, user }) => ({
  discuss,
  user,
}))(React.memo(DiscussItem));
