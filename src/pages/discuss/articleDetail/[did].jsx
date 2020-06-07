/*
 * @Author: Wenzhe
 * @Date: 2020-04-30 16:25:16
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-06-07 16:30:33
 */
import React, { useState, useEffect } from 'react';
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
} from 'antd';
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
    fetchDiscussDetailLoading,
  } = props;

  const [commentDetail, setCommentDetail] = useState('');
  const [replyDetail, setReplyDetail] = useState('');
  const [currentCommentReplyBox, setCurrentCommentReplyBox] = useState('');
  const [mindMapDrawerVisible, setMindMapDrawerVisible] = useState(false);

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

  const showcurrentCommentReplyBox = (comment) => {
    const { _id, authorInfo } = comment;
    if (currentCommentReplyBox === _id) {
      setCurrentCommentReplyBox('');
      setReplyDetail('');
      return;
    }
    setCurrentCommentReplyBox(_id);
    setReplyDetail(`@${authorInfo.name} `);
  };

  const showMapDrawer = () => {
    setMindMapDrawerVisible(true);
  };

  const hideMapDrawer = () => {
    setMindMapDrawerVisible(false);
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
          <div className={styles.shadow} style={{ height: '20px' }}></div>
          <div>
            {discussDetail.comments && discussDetail.comments.length} 条评论
          </div>
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
                <Button className={styles.submit_btn} size="small">
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
                          onClick={() => showcurrentCommentReplyBox(comment)}
                        >
                          回复
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
                    />
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
                            <Button className={styles.submit_btn} size="small">
                              评论
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
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

export default connect(({ discuss, loading }) => ({
  discuss,
  fetchDiscussDetailLoading: loading.effects['discuss/fetchDiscussDetail'],
}))(ArticleDetail);
