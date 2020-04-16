import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import { Row, Col, Tabs, Menu, Dropdown, Button, Select } from 'antd';
import { ControlledEditor } from '@monaco-editor/react';
import { monaco } from '@monaco-editor/react';
import {
  custom_editor_theme,
  default_editor_theme,
} from '../../../config/editor-theme';
import language_config from '../../../config/editor-language';
import { createFromIconfontCN } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1756231_hpadq9p8rid.js',
});

const problemDetail = props => {
  const { match } = props;

  function handleLeftTabChange(key) {
    console.log(key);
  }

  // TODO: 从后台获取代码模版
  const [editortheme, setEditorTheme] = useState('light');
  const [language, setLanguage] = useState('cpp');
  const [judge_language, setJudgeLanguage] = useState('C++');
  const [code, setCode] = useState('// type your code...');

  const editorRef = useRef();

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor;
  }

  const handleEditorChange = (ev, value) => {
    // console.log(ev, value);
    setCode(value);
  };

  const handleThemeSelectChange = selected_tehme => {
    console.log(`selected ${selected_tehme}`);
    // TODO: 把 这个 theme 移动到 config 文件中
    if (default_editor_theme.includes(selected_tehme)) {
      setEditorTheme(selected_tehme);
    } else {
      monaco
        .init()
        .then(monaco => {
          import(`../../../../public/monaco_themes/${selected_tehme}.json`)
            .then(data => {
              console.log('data', data);
              return data;
            })
            .then(theme_data => {
              console.log('---', selected_tehme.replace(/\s/gi, ''));
              monaco.editor.defineTheme(
                selected_tehme.replace(/\s/gi, ''),
                theme_data,
              );
              setEditorTheme(selected_tehme.replace(/\s/gi, ''));
            });
        })
        .catch(error =>
          console.error(
            'An error occurred during initialization of Monaco: ',
            error,
          ),
        );
    }
  };

  const handleLanguageSelectChange = selected_language => {
    setJudgeLanguage(selected_language);
    if (selected_language === 'C++') {
      setLanguage('cpp');
      return;
    }
    if (selected_language === 'C') {
      setLanguage('c');
      return;
    }
    if (selected_language === 'Java') {
      setLanguage('java');
      return;
    }
    if (selected_language === 'Python2') {
      setLanguage('python');
      return;
    }
    if (selected_language === 'Python3') {
      setLanguage('python');
      return;
    }
    // setLanguage(selected_language);
  };

  return (
    <>
      <Row>
        <Col
          span={7}
          // className={styles.box_shadow }
        >
          <h1>Left Content</h1>
          <Tabs onChange={handleLeftTabChange} type="card">
            <TabPane
              tab={
                <span>
                  <IconFont type="icon-description" />
                  题目描述
                </span>
              }
              key="1"
            >
              题目描述
              <p>
                miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu
                miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu
                miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu
                miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu
                miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu
                miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu miaoshu
              </p>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <IconFont type="icon-daan" />
                  题解
                </span>
              }
              key="2"
            >
              Content of Tab Pane 2
            </TabPane>
            <TabPane
              tab={
                <span>
                  <IconFont type="icon-HistoryOutline" />
                  提交记录
                </span>
              }
              key="3"
            >
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </Col>
        <Col span={17}>
          <h1>Right Content</h1>
          <Row>
            <Col>
              <Select
                defaultValue="C++"
                style={{ width: 300 }}
                onChange={handleLanguageSelectChange}
              >
                {language_config.map(item => (
                  <Option key={item.name} key={item.language}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                defaultValue="light"
                style={{ width: 300 }}
                onChange={handleThemeSelectChange}
              >
                <Option value="light">light</Option>
                <Option value="dark">dark</Option>
                {custom_editor_theme.map(theme => (
                  <Option key={theme} value={theme}>
                    {theme}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <div className={styles.editor_window}>
            <ControlledEditor
              height="80vh"
              language={language}
              theme={editortheme}
              value={code}
              onChange={handleEditorChange}
              editorDidMount={handleEditorDidMount}
              options={{
                fontSize: '15px',
                minimap: {
                  enabled: false,
                },
              }}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default problemDetail;
