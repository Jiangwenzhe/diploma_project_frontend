import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import {
  Row,
  Col,
  Tabs,
  Button,
  Select,
  Typography,
  Divider,
  Collapse,
  Tag,
  Modal,
  Badge,
  Drawer,
  Empty,
} from 'antd';
import { connect } from 'umi';
import ReactMarkdown from 'react-markdown';
import { ControlledEditor } from '@monaco-editor/react';
import { monaco } from '@monaco-editor/react';
import 'github-markdown-css';
import {
  custom_editor_theme,
  default_editor_theme,
} from '../../../config/editor-theme';
import language_config from '../../../config/editor-language';
import { judge_result } from '../../../config/judge_result';
import { createFromIconfontCN, CaretRightOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1756231_hpadq9p8rid.js',
});

const problemDetail = props => {
  const {
    match,
    dispatch,
    problemDetail: { problemInfo, submissionInfo },
    submitting,
  } = props;

  function handleLeftTabChange(key) {
    console.log(key);
  }

  // TODO: 从后台获取代码模版
  const [editortheme, setEditorTheme] = useState('light');
  const [language, setLanguage] = useState('cpp');
  const [judge_language, setJudgeLanguage] = useState('C++');
  const [code, setCode] = useState('// type your code...');
  const [editorOptions, setEditorOptions] = useState({
    fontSize: '14px',
    minimap: {
      enabled: false,
    },
  });
  const [editorSettingModalVisible, setEditorSettingModalVisible] = useState(
    false,
  );
  const [judgeResultDrawerVisible, setJudgeResultDrawerVisible] = useState(
    false,
  );

  const editorRef = useRef();

  useEffect(() => {
    const { params, path } = match;
    if (path === '/problem/:pid') {
      dispatch({
        type: 'problemDetail/fetchProblemInfo',
        payload: params,
      });
    }
  }, []);

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor;
  }

  const handleEditorChange = (ev, value) => {
    // console.log(ev, value);
    setCode(value);
  };

  // 更改编辑器 theme
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

  // 更改判题所需的 language
  const handleLanguageSelectChange = selected_language => {
    // 设置提交后台的判题语言
    setJudgeLanguage(selected_language);
    // 更改页面高亮的语言设置
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
  };

  // 更改编辑器的字体大小
  const handleFontSelectorChange = fontSize => {
    setEditorOptions({ ...editorOptions, fontSize: fontSize });
  };

  // 显示编辑器修改 Modal
  const showEditorSettingModal = () => {
    setEditorSettingModalVisible(true);
  };

  // 关闭编辑器修改 Modal
  const hideEditorSettingModal = () => {
    setEditorSettingModalVisible(false);
  };

  // 显示判题结果 Drawer
  const showJudgeResultDrawer = () => {
    setJudgeResultDrawerVisible(true);
  };

  // 关闭判题结果 Drawer
  const hideJudgeResultDrawer = () => {
    setJudgeResultDrawerVisible(false);
  };

  // 提交解答给后台 judge
  const submit_solution = () => {
    const payload = {
      pid: problemInfo.pid,
      language: judge_language,
      code: code,
    };
    dispatch({
      type: 'problemDetail/createSubmission',
      payload,
    });
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={8} className={styles.box_shadow}>
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
              <Row>
                <Title
                  level={4}
                >{`${problemInfo.pid}.${problemInfo.title}`}</Title>
              </Row>
              <Row>
                <Col span={8}>
                  难度：<span style={{ color: 'green' }}>简单</span>
                </Col>
                <Col span={14}>
                  <span>提交次数：{problemInfo.submit}</span>
                  <Divider type="vertical" />
                  <span>通过次数：{problemInfo.solve}</span>
                </Col>
              </Row>
              <Divider style={{ margin: '10px 0' }} />
              <div className="markdown-body">
                <ReactMarkdown source={problemInfo.detail} />
              </div>
              <Row style={{ marginTop: '30px' }}>
                <Divider style={{ margin: '10px 0' }} />
                <Col span={24}>
                  <Collapse
                    bordered={false}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    className={styles.custom_collapse}
                  >
                    <Panel header="题目标签" key="1">
                      <Tag color="#108ee9"> {problemInfo.tags}</Tag>
                    </Panel>
                    <Panel header="提示1" key="2">
                      hint1123
                    </Panel>
                    <Panel header="This is panel header 3" key="3">
                      321
                    </Panel>
                  </Collapse>
                </Col>
              </Row>
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
        <Col span={16}>
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
              <Button>redo</Button>
            </Col>
            <Col>
              <Button onClick={() => showEditorSettingModal()}>设置</Button>
            </Col>
          </Row>
          <div className={styles.editor_window}>
            <ControlledEditor
              height="80vh"
              width="100%"
              language={language}
              theme={editortheme}
              value={code}
              onChange={handleEditorChange}
              editorDidMount={handleEditorDidMount}
              options={editorOptions}
            />
          </div>
          <div className={styles.submit_bar}>
            <span>
              <span style={{ fontSize: '14px', marginRight: '10px' }}>
                提交状态:{' '}
              </span>
              <Button
                size="large"
                onClick={() => showJudgeResultDrawer()}
                style={{ padding: '6px 30px', borderRadius: '4px' }}
              >
                {submitting ? (
                  <Badge status="warning" text="submitting..." />
                ) : submissionInfo.result === 0 ? (
                  <Badge
                    status="success"
                    text={judge_result[submissionInfo.result]}
                  />
                ) : (
                  <Badge
                    status="error"
                    text={judge_result[submissionInfo.result]}
                  />
                )}
              </Button>
            </span>
            <Button
              size="large"
              type="primary"
              style={{ padding: '6px 30px', borderRadius: '4px' }}
              onClick={() => submit_solution()}
              loading={submitting}
            >
              提交
            </Button>
          </div>
        </Col>
      </Row>
      {/* 编辑器调整 Modal ---------------------- */}
      <Modal
        title="编辑器设置"
        visible={editorSettingModalVisible}
        onCancel={hideEditorSettingModal}
        footer={null}
        width={700}
      >
        <Row align="middle">
          <Col span={16}>
            <Row>
              <h3 style={{ fontWeight: '400', margin: '0' }}>主题设置</h3>
            </Row>
            <Row>
              <Text type="secondary">
                切换不同的代码编辑器主题，选择适合你的语法高亮。
              </Text>
            </Row>
          </Col>
          <Col>
            <Select
              defaultValue="light"
              style={{ width: 200 }}
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
        <Row align="middle" style={{ marginTop: '10px' }}>
          <Col span={16}>
            <Row>
              <h3 style={{ fontWeight: '400', margin: '0' }}>字体设置</h3>
            </Row>
            <Row>
              <Text type="secondary">调整适合你的字体大小。</Text>
            </Row>
          </Col>
          <Col>
            <Select
              defaultValue="14px"
              style={{ width: 200 }}
              onChange={handleFontSelectorChange}
            >
              {[12, 13, 14, 15, 16, 17, 18, 19, 20].map(fontSize => (
                <Option
                  key={`${fontSize}px`}
                  value={`${fontSize}px`}
                >{`${fontSize}px`}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Modal>
      {/* 判题结果 Drawer */}
      <Drawer
        title="判题结果"
        placement="bottom"
        closable={true}
        height="500"
        onClose={() => hideJudgeResultDrawer()}
        visible={judgeResultDrawerVisible}
      >
        {/* <Result
          status="success"
          title={judge_result[submissionInfo.result]}
        >
          <h1>xsa</h1>
        </Result> */}
        {submissionInfo.result ? (
          <Row>
            <Col span={12}></Col>
            <Col span={12}></Col>
          </Row>
        ) : (
          <Empty />
        )}
      </Drawer>
    </>
  );
};

export default connect(({ problem, problemDetail, loading }) => ({
  problemDetail,
  problem,
  fetching: loading.effects['problemDetail/fetchProblemInfo'],
  submitting: loading.effects['problemDetail/createSubmission'],
}))(problemDetail);
