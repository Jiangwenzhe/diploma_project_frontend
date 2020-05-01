/*
 * @Author: Wenzhe
 * @Date: 2020-04-30 16:25:16
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-01 22:43:08
 */
import React, { useState } from 'react';
import { connect, history } from 'umi';
import { useMount, useUnmount } from '@umijs/hooks';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import { Row, Col, message, Button, Comment, Avatar, Tooltip } from 'antd';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { DownOutlined } from '@ant-design/icons';
import { useSize } from '@umijs/hooks';
import moment from 'moment';
import { SendOutlined } from '@ant-design/icons';
import styles from './index.less';

// 初始化Markdown解析器
const mdParser = new MarkdownIt(/* Markdown-it options */);

const DiscussDetail = (props) => {
  const {
    match,
    dispatch,
    discuss: { discussDetail },
  } = props;

  const [formDetail, setFormDetail] = useState('');
  const [
    isMarkdownContentCollapsible,
    setIsMarkdownContentCollapsible,
  ] = useState(true);
  const [addDiscussFormVisible, setAddDiscussFormVisible] = useState(false);
  const [state, ref] = useSize();

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

  const showContent = () => {
    setIsMarkdownContentCollapsible(false);
  };

  const hideContent = () => {
    setIsMarkdownContentCollapsible(true);
  };

  const showForm = () => {
    setAddDiscussFormVisible(true);
  };

  const hideForm = () => {
    setAddDiscussFormVisible(false);
  };

  function handleEditorChange({ html, text }) {
    setFormDetail(text);
  }

  const handleImageUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (data) => {
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const submitDiscuss = () => {
    if (formDetail === '') {
      message.error('请输入讨论内容!');
      return;
    }
    dispatch({
      type: 'discuss/joinDuscuss',
      payload: {
        did: discussDetail._id,
        payload: {
          content: formDetail,
        },
      },
    }).then((msg) => {
      if (msg === 'success') {
        hideForm();
      }
    });
  };

  const count_discuss_user = (discussList) => {
    const userArr = [];
    if (!discussList) return 0;
    discussList.forEach((item) => {
      userArr.push(item.authorInfo._id);
    });
    if (!userArr.includes(discussDetail.authorInfo._id)) {
      userArr.push(discussDetail.authorInfo._id);
    }
    return [...new Set(userArr)].length;
  };

  return (
    <div>
      <Row>
        <Col span={18}>
          <div className={[styles.shadow, styles.main_discuss_panel].join(' ')}>
            <div className={styles.content}>
              <div
                className={
                  isMarkdownContentCollapsible && state.height > 290
                    ? styles.collapsibleMarkdownContent
                    : styles.unfloadMarkdownContent
                }
              >
                <div ref={ref} className="markdown-body">
                  <h2>{discussDetail.title}</h2>
                  <ReactMarkdown
                    source={discussDetail.detail}
                    escapeHtml={false}
                  />
                </div>
                {isMarkdownContentCollapsible && state.height > 290 && (
                  <div className={styles.contentMask} onClick={showContent}>
                    <span className={styles.text}>展开</span>
                    <DownOutlined className={styles.down_icon} />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.discussdetail_operation_panel}>
              <span>
                <Button onClick={showForm}>参与讨论</Button>
              </span>
              {!isMarkdownContentCollapsible && (
                <Button onClick={hideContent}>收起讨论</Button>
              )}
            </div>
          </div>
          <div
            className={[styles.shadow, styles.discuss_detail_info].join(' ')}
          >
            一共有
            {discussDetail.discussList ? discussDetail.discussList.length : 0}
            条讨论
          </div>
          {addDiscussFormVisible && (
            <div className={[styles.shadow, styles.discuss_form].join(' ')}>
              <div className={styles.form_header}>
                <Button onClick={hideForm}>取消</Button>
                <Button onClick={submitDiscuss}>
                  发起讨论&nbsp;
                  <SendOutlined />
                </Button>
              </div>
              <div>
                <MdEditor
                  style={{ height: '300px', width: '100%' }}
                  value={formDetail}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={handleEditorChange}
                  onImageUpload={handleImageUpload}
                />
              </div>
            </div>
          )}
          {discussDetail.discussList && (
            <div className={[styles.comment_list].join(' ')}>
              {discussDetail.discussList.map((discuss) => (
                <Comment
                  //  actions={actions}
                  key={discuss._id}
                  className={[styles.shadow, styles.comment].join(' ')}
                  author={
                    <span className={styles.name}>
                      {discuss.authorInfo.name}
                    </span>
                  }
                  avatar={
                    <Avatar
                      src={discuss.authorInfo.avatar}
                      alt={discuss.authorInfo.name}
                    />
                  }
                  content={
                    <div className="markdown-body">
                      <ReactMarkdown
                        source={discuss.content}
                        escapeHtml={false}
                      />
                    </div>
                  }
                  datetime={
                    <Tooltip
                      title={moment(discuss.createdAt).format(
                        'YYYY-MM-DD HH:mm:ss',
                      )}
                    >
                      <span>{moment(discuss.createdAt).fromNow()}</span>
                    </Tooltip>
                  }
                />
              ))}
            </div>
          )}
        </Col>
        <Col offset={1} span={4}>
          <div className={[styles.shadow, styles.right_info_panel].join(' ')}>
            <div className={styles.list}>
              <span>浏览次数</span>
              <span className={styles.tag}>{discussDetail.access_number}</span>
            </div>
            <div className={styles.list}>
              <span>参与人数</span>
              <span className={styles.tag}>
                {count_discuss_user(discussDetail.discussList)}
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ discuss, loading }) => ({
  discuss,
  fetchDiscussDetailLoading: loading.effects['discuss/fetchDiscussDetail'],
}))(DiscussDetail);
