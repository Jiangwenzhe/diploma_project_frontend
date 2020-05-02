/*
 * @Author: Wenzhe
 * @Date: 2020-04-30 16:25:16
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-02 16:11:51
 */
import React, { useState } from 'react';
import { connect, history } from 'umi';
import { useMount, useUnmount } from '@umijs/hooks';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import {
  Table,
  Alert,
  Divider,
  PageHeader,
  Breadcrumb,
  Avatar,
  Button,
  Tooltip,
  Comment,
} from 'antd';
import moment from 'moment';
import CodeBlock from '../../../components/CodeBlock';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import styles from './index.less';
import { categoryToCN } from '../../../config/discuss_config';

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
  } = props;

  const [commentDetail, setCommentDetail] = useState('');
  const [replyDetail, setReplyDetail] = useState('');
  const [currentCommentReplyBox, setCurrentCommentReplyBox] = useState('');

  useMount(() => {
    const { did } = match.params;
    dispatch({
      type: 'discuss/fetchDiscussDetail',
      payload: {
        did,
      },
    });
  });

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

  console.log(discussDetail.comments);

  return (
    <div className={styles.main}>
      <div className={styles.main_content}>
        <div className={styles.article_header}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <a
                href=""
                onClick={(e) => callChangeCommunicationQuery(e, 'article', '')}
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
        <div className={styles.article_info}></div>
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
                          {moment(comment.createdAt).locale('zh-cn').fromNow()}
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
      </div>
    </div>
  );
};

export default connect(({ discuss, loading }) => ({
  discuss,
  fetchDiscussDetailLoading: loading.effects['discuss/fetchDiscussDetail'],
}))(ArticleDetail);
