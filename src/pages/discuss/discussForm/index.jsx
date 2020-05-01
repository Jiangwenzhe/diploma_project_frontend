import React, { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { Select, Divider, Input, Form, Button, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import { connect, history } from 'umi';
import 'react-markdown-editor-lite/lib/index.css';
import {
  categoryToCN,
  discuss_template,
  article_template,
} from '../../../config/discuss_config';
import { SendOutlined } from '@ant-design/icons';

const { Option } = Select;

// 初始化Markdown解析器
const mdParser = new MarkdownIt(/* Markdown-it options */);

const makeSubmitButtonValue = (type) => {
  if (type === 'article')
    return (
      <span>
        发表文章&nbsp;
        <SendOutlined />
      </span>
    );
  if (type === 'discuss')
    return (
      <span>
        发起讨论&nbsp;
        <SendOutlined />
      </span>
    );
};

const DiscussForm = (props) => {
  const {
    discussFormVisible,
    handleHideDiscussForm,
    type,
    discussTags,
    dispatch,
    refetchDiscussList,
  } = props;

  const [form] = Form.useForm();

  const [formDetail, setFormDetail] = useState('');
  const [tags, setTags] = useState(discussTags);
  const [tagname, setTagName] = useState('');

  const addTag = () => {
    const newTags = JSON.parse(JSON.stringify(tags));
    newTags.push(tagname);
    setTags([...new Set(newTags)]);
    setTagName('');
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

  useEffect(() => {
    setTags(discussTags);
  }, [discussTags]);

  useEffect(() => {
    console.log(discussFormVisible);
    if (discussFormVisible) {
      if (type === 'article') {
        setFormDetail(article_template);
      }
      if (type === 'discuss') {
        setFormDetail(discuss_template);
      }
    }
  }, [discussFormVisible, type]);

  // 当关闭 Drawer 以后需要重置表单
  const closeDrawer = () => {
    form.resetFields();
    setFormDetail('');
    handleHideDiscussForm();
  };

  const handleFormSubmit = (values) => {
    console.log('Success:', values);
    const payload = {
      ...values,
      detail: formDetail,
      type,
    };
    dispatch({
      type: 'discuss/createDiscuss',
      payload: payload,
    }).then((value) => {
      if (value === 'create_success') {
        refetchDiscussList();
        closeDrawer();
      }
    });
  };

  return (
    <div className={styles.form_modal}>
      <Drawer
        placement="left"
        title={
          <div className={styles.form_header}>
            <Form
              layout="inline"
              form={form}
              onFinish={handleFormSubmit}
              initialValues={{
                category: 'interview',
              }}
            >
              <Form.Item
                name="title"
                rules={[{ required: true, message: '请先输入标题' }]}
              >
                <Input
                  placeholder={`在这里输入${
                    type === 'article' ? '文章' : '讨论'
                  }标题`}
                  allowClear
                />
              </Form.Item>
              <Form.Item name="tags">
                <Select
                  mode="multiple"
                  placeholder="请选择标签"
                  style={{ width: 200 }}
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          padding: 8,
                        }}
                      >
                        <Input
                          style={{ flex: 'auto' }}
                          value={tagname}
                          onChange={(e) => setTagName(e.target.value)}
                        />
                        <a
                          style={{
                            flex: 'none',
                            padding: '8px',
                            display: 'block',
                            cursor: 'pointer',
                          }}
                          onClick={addTag}
                        >
                          <PlusOutlined /> 添加 tag
                        </a>
                      </div>
                    </div>
                  )}
                >
                  {tags.map((item) => (
                    <Option key={item}>{item}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="category">
                <Select style={{ width: 120 }}>
                  <Option value="interview">{categoryToCN('interview')}</Option>
                  <Option value="algorithm">{categoryToCN('algorithm')}</Option>
                  <Option value="question">{categoryToCN('question')}</Option>
                  <Option value="work">{categoryToCN('work')}</Option>
                  <Option value="news">{categoryToCN('news')}</Option>
                  <Option value="feedback">{categoryToCN('feedback')}</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit">{makeSubmitButtonValue(type)}</Button>
              </Form.Item>
            </Form>
          </div>
        }
        visible={discussFormVisible}
        maskClosable={false}
        width="80%"
        footer={null}
        onClose={closeDrawer}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ padding: '10px' }}
        forceRender
        destroyOnClose={true}
        closable
      >
        <div>
          <div className={styles.markdown_editor}>
            <MdEditor
              style={{ height: 'calc(100vh - 55px)', width: '100%' }}
              value={formDetail}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              onImageUpload={handleImageUpload}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default connect(({ discuss }) => ({
  discuss,
}))(DiscussForm);
