/*
 * @Author: Wenzhe
 * @Date: 2020-04-30 16:25:16
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-06-08 15:53:48
 */
import React, { useState, useEffect, useRef } from 'react';
import { connect, history } from 'umi';
import { useMount, useUnmount } from '@umijs/hooks';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import {
  Drawer,
  Breadcrumb,
  Avatar,
  Button,
  Tooltip,
  Comment,
  Skeleton,
  Divider,
  Popconfirm,
} from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import moment from 'moment';
import CodeBlock from '../../../components/CodeBlock';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { ApartmentOutlined } from '@ant-design/icons';
import { categoryToCN } from '../../../config/discuss_config';
import { transform } from 'markmap-lib/dist/transform';
import { Markmap } from 'markmap-lib/dist/view';
import styles from './index.less';

// 初始化Markdown解析器
const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }
    return ''; // use external default escaping
  },
});

const ArticleDetail = (props) => {
  const {
    match,
    dispatch,
    discuss: { discussDetail },
    user: { currentUser },
    fetchDiscussDetailLoading,
  } = props;

  const [commentDetail, setCommentDetail] = useState('');
  const [replyDetail, setReplyDetail] = useState('');
  const [currentCommentReplyBox, setCurrentCommentReplyBox] = useState('');
  const [mindMapDrawerVisible, setMindMapDrawerVisible] = useState(false);

  const commentPositionRef = useRef();

  useMount(() => {
    const { did } = match.params;
    dispatch({
      type: 'discuss/fetchDiscussDetail',
      payload: {
        did,
      },
    });
  });

  useEffect(() => {
    if (discussDetail.detail) {
      const data = transform(discussDetail.detail);
      Markmap.create('#markmap', null, data);
    }
  }, [discussDetail]);

  useUnmount(() => {
    dispatch({
      type: 'discuss/cleanDiscussDetail',
    });
  });

  const callChangeCommunicationQuery = (e, type, category) => {
    e.preventDefault();
    dispatch({
      type: 'discuss/changeCommunicationQuery',
      payload: {
        type,
        category,
        tag: '',
      },
    });
    return history.push('/discuss');
  };

  function handleEditorChange({ html, text }) {
    setCommentDetail(text);
  }

  function handleReplyEditorChange({ html, text }) {
    setReplyDetail(text);
  }

  const showcurrentCommentReplyBox = (comment, type, reply) => {
    if (type === 'reply') {
      const { _id } = comment;
      const { authorInfo } = reply;
      if (currentCommentReplyBox === _id) {
        setCurrentCommentReplyBox('');
        setReplyDetail('');
        return;
      }
      setCurrentCommentReplyBox(_id);
      setReplyDetail(`@${authorInfo.name} `);
    } else {
      const { _id, authorInfo } = comment;
      if (currentCommentReplyBox === _id) {
        setCurrentCommentReplyBox('');
        setReplyDetail('');
        return;
      }
      setCurrentCommentReplyBox(_id);
      setReplyDetail(`@${authorInfo.name} `);
    }
  };

  const showMapDrawer = () => {
    setMindMapDrawerVisible(true);
  };

  const hideMapDrawer = () => {
    setMindMapDrawerVisible(false);
  };

  // 用户评论相关操作
  const createComment = async () => {
    const { did } = match.params;
    const res = await dispatch({
      type: 'discuss/createComment',
      payload: {
        did,
        payload: {
          content: commentDetail,
        },
      },
    });
    if (res === 'comment_success') {
      setCommentDetail('');
      await dispatch({
        type: 'discuss/fetchDiscussDetail',
        payload: {
          did,
        },
      });
      window.scrollTo({
        behavior: 'auto',
        top: commentPositionRef.current.offsetTop,
      });
    }
  };

  const deleteComment = async (id) => {
    const { did } = match.params;
    const res = await dispatch({
      type: 'discuss/deleteComment',
      payload: {
        id,
      },
    });
    if (res === 'delete_comment_success') {
      await dispatch({
        type: 'discuss/fetchDiscussDetail',
        payload: {
          did,
        },
      });
      window.scrollTo({
        behavior: 'auto',
        top: commentPositionRef.current.offsetTop,
      });
    }
  };

  const createReply = async () => {
    const { did } = match.params;
    const res = await dispatch({
      type: 'discuss/createReply',
      payload: {
        comment_id: currentCommentReplyBox,
        payload: {
          reply_user_id: currentUser._id,
          content: replyDetail,
        },
      },
    });
    if (res === 'comment_success') {
      setReplyDetail('');
      setCurrentCommentReplyBox('');
      await dispatch({
        type: 'discuss/fetchDiscussDetail',
        payload: {
          did,
        },
      });
      window.scrollTo({
        behavior: 'auto',
        top: commentPositionRef.current.offsetTop,
      });
    }
  };

  const deleteReply = async (comment_id, reply_id) => {
    const { did } = match.params;
    const res = await dispatch({
      type: 'discuss/deleteReply',
      payload: {
        comment_id,
        reply_id,
      },
    });
    if (res === 'delete_reply_success') {
      await dispatch({
        type: 'discuss/fetchDiscussDetail',
        payload: {
          did,
        },
      });
      window.scrollTo({
        behavior: 'auto',
        top: commentPositionRef.current.offsetTop,
      });
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.main_content}>
        <Skeleton
          avatar
          active
          paragraph={{ rows: 10 }}
          loading={fetchDiscussDetailLoading}
        >
          <div className={styles.article_header}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <a
                  href=""
                  onClick={(e) =>
                    callChangeCommunicationQuery(e, 'article', '')
                  }
                >
                  讨论
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a
                  href=""
                  onClick={(e) =>
                    callChangeCommunicationQuery(
                      e,
                      'article',
                      discussDetail.category,
                    )
                  }
                >
                  {categoryToCN(discussDetail.category)}
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{discussDetail.title}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className={styles.article_title}>
            <Avatar
              src={
                (discussDetail.authorInfo && discussDetail.authorInfo.avatar) ||
                ''
              }
              size={32}
            ></Avatar>
            <div className={styles.title_info}>{discussDetail.title}</div>
            <div className={styles.btn_wrapper}>
              <Button onClick={showMapDrawer}>
                <ApartmentOutlined /> 查看脑图
              </Button>
            </div>
          </div>
          <div className={styles.info_wrapper}>
            <div className={styles.article_info}>
              <span className={styles.author_name}>
                {(discussDetail.authorInfo && discussDetail.authorInfo.name) ||
                  ''}
              </span>
              <span className={styles.info_text}>
                {`${discussDetail.access_number} 次阅读`}
              </span>
              <span className={styles.dot}></span>
              <span className={styles.info_text}>
                {moment(discussDetail.createdAt).lang('zh-cn').fromNow()}
              </span>
            </div>
          </div>
          <div className={styles.article_content}>
            <div className="markdown-body">
              <ReactMarkdown
                source={discussDetail.detail}
                escapeHtml={false}
                renderers={{ code: CodeBlock }}
              />
            </div>
          </div>
          <div ref={commentPositionRef} />
          <Divider orientation="left">
            {discussDetail.comments && discussDetail.comments.length} 条评论
            &nbsp;
            <CommentOutlined />
          </Divider>
          <div className={styles.make_comment}>
            <div className={styles.editor}>
              <MdEditor
                className={styles.comment_editor}
                config={{
                  view: {
                    menu: false,
                    md: true,
                    html: false,
                  },
                }}
                style={{ height: '100px', width: '100%' }}
                value={commentDetail}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
              />
              <div className={styles.comment_button}>
                <Button
                  className={styles.submit_btn}
                  onClick={createComment}
                  size="small"
                >
                  评论
                </Button>
              </div>
            </div>
            <div className={styles.comment_list}>
              {discussDetail._id &&
                discussDetail.comments.map((comment) => (
                  <div>
                    <Comment
                      actions={[
                        <span
                          key="comment-list-reply-to-0"
                          onClick={() =>
                            showcurrentCommentReplyBox(comment, 'comment')
                          }
                        >
                          回复
                        </span>,
                        <span key="comment-list-reply-to-1">
                          {currentUser._id === comment.comment_user_id && (
                            <Popconfirm
                              placement="right"
                              title={`确定要删除该评论吗？`}
                              onConfirm={() => deleteComment(comment._id)}
                              okText="删除"
                              cancelText="取消"
                            >
                              <span key="comment-list-reply-to-2">删除</span>
                            </Popconfirm>
                          )}
                        </span>,
                      ]}
                      key={comment._id}
                      className={[styles.comment].join(' ')}
                      author={
                        <span className={styles.name}>
                          {comment.authorInfo.name}
                        </span>
                      }
                      avatar={
                        <Avatar
                          src={comment.authorInfo.avatar}
                          alt={comment.authorInfo.name}
                        />
                      }
                      content={
                        <div className="markdown-body">
                          <ReactMarkdown
                            source={comment.content}
                            escapeHtml={false}
                          />
                        </div>
                      }
                      datetime={
                        <Tooltip
                          title={moment(comment.createdAt)
                            .locale('zh-cn')
                            .format('YYYY-MM-DD HH:mm:ss')}
                        >
                          <span>
                            {moment(comment.createdAt)
                              .locale('zh-cn')
                              .fromNow()}
                          </span>
                        </Tooltip>
                      }
                    >
                      <div key={comment._id + '123'}>
                        {comment._id === currentCommentReplyBox && (
                          <div className={styles.replybox}>
                            <MdEditor
                              config={{
                                view: {
                                  menu: false,
                                  md: true,
                                  html: false,
                                },
                              }}
                              className={styles.comment_editor}
                              style={{ height: '100px', width: '100%' }}
                              value={replyDetail}
                              renderHTML={(text) => mdParser.render(text)}
                              onChange={handleReplyEditorChange}
                            />
                            <div className={styles.comment_button}>
                              <Button
                                className={styles.submit_btn}
                                size="small"
                                onClick={() => createReply()}
                              >
                                评论
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      {comment.replys &&
                        comment.replys.length > 0 &&
                        comment.replys.map((reply) => (
                          <div key={reply._id}>
                            <Comment
                              actions={[
                                <span
                                  key="comment-list-reply-to-4"
                                  onClick={() =>
                                    showcurrentCommentReplyBox(
                                      comment,
                                      'reply',
                                      reply,
                                    )
                                  }
                                >
                                  回复
                                </span>,
                                <span key="comment-list-reply-to-1">
                                  {currentUser._id === reply.reply_user_id && (
                                    <Popconfirm
                                      placement="right"
                                      title={`确定要删除该评论吗？`}
                                      onConfirm={() =>
                                        deleteReply(comment._id, reply._id)
                                      }
                                      okText="删除"
                                      cancelText="取消"
                                    >
                                      <span key="comment-list-reply-to-2">
                                        删除
                                      </span>
                                    </Popconfirm>
                                  )}
                                </span>,
                              ]}
                              key={reply._id}
                              className={[styles.comment].join(' ')}
                              author={
                                <span className={styles.name}>
                                  {reply.authorInfo.name}
                                </span>
                              }
                              avatar={
                                <Avatar
                                  src={reply.authorInfo.avatar}
                                  alt={reply.authorInfo.name}
                                />
                              }
                              content={
                                <div className="markdown-body">
                                  <ReactMarkdown
                                    source={reply.content}
                                    escapeHtml={false}
                                  />
                                </div>
                              }
                              datetime={
                                <Tooltip
                                  title={moment(reply.createdAt)
                                    .locale('zh-cn')
                                    .format('YYYY-MM-DD HH:mm:ss')}
                                >
                                  <span>
                                    {moment(reply.createdAt)
                                      .locale('zh-cn')
                                      .fromNow()}
                                  </span>
                                </Tooltip>
                              }
                            />
                            <div key={reply._id + '123'}>
                              {reply._id === currentCommentReplyBox && (
                                <div className={styles.replybox}>
                                  <MdEditor
                                    config={{
                                      view: {
                                        menu: false,
                                        md: true,
                                        html: false,
                                      },
                                    }}
                                    className={styles.comment_editor}
                                    style={{ height: '100px', width: '100%' }}
                                    value={replyDetail}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={handleReplyEditorChange}
                                  />
                                  <div className={styles.comment_button}>
                                    <Button
                                      className={styles.submit_btn}
                                      size="small"
                                      onClick={() => createReply()}
                                    >
                                      评论
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </Comment>
                  </div>
                ))}
            </div>
          </div>
        </Skeleton>
      </div>
      {/* <div className={styles.fixedWeight}>
        <div className={styles.fixedButton} onClick={showMapDrawer}>
          <ApartmentOutlined />
        </div>
      </div> */}
      <Drawer
        width="1200px"
        title="文章脑图"
        placement="left"
        closable={true}
        onClose={hideMapDrawer}
        visible={mindMapDrawerVisible}
        forceRender
      >
        <div className={styles.mindMapWrapper}>
          <svg id="markmap" style={{ width: '1200px', height: '700px' }}></svg>
        </div>
      </Drawer>
    </div>
  );
};

export default connect(({ discuss, loading, user }) => ({
  discuss,
  user,
  fetchDiscussDetailLoading: loading.effects['discuss/fetchDiscussDetail'],
}))(ArticleDetail);
