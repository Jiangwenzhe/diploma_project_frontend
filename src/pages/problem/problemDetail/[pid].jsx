/*
 * @Author: Wenzhe
 * @Date: 2020-04-16 16:36:43
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-22 20:29:05
 */
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
  Alert,
  Table,
} from 'antd';
import { connect } from 'umi';
import ReactMarkdown from 'react-markdown';
import { ControlledEditor } from '@monaco-editor/react';
import { monaco } from '@monaco-editor/react';
import { useDebounceFn, useMount, useUnmount } from '@umijs/hooks';
import 'github-markdown-css';
import {
  custom_editor_theme,
  default_editor_theme,
} from '../../../config/editor-theme';
import language_config from '../../../config/editor-language';
import { judge_result } from '../../../config/judge_result';
import {
  cpp_template,
  c_template,
  java_template,
  py_2_template,
  py_3_template,
} from '../../../config/language_template';
import CodeCopyablePreview from '../../../components/CodeCopyablePreview';
import { BtoMB } from '../../../utils/tool_fuc';
import ShowCode from '../../../components/showCode/index';
import { createFromIconfontCN, CaretRightOutlined } from '@ant-design/icons';
import icon_font_url from '../../../config/iconfont';
import StatusTag from '../../../components/StatusTag';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const IconFont = createFromIconfontCN({
  scriptUrl: icon_font_url,
});

// 从 language_template 根据语言加载模版
const setLanguageTemplate = (language) => {
  switch (language) {
    case 'C++':
      return cpp_template;
    case 'C':
      return c_template;
    case 'Java':
      return java_template;
    case 'Python2':
      return py_2_template;
    case 'Python3':
      return py_3_template;
    default:
      return '// type your code here...';
  }
};

// 从 localSotrage 从加载之前提交的问题
const getLastSubmissionFromLocalStorage = (pid) => {
  const last_submission = localStorage.getItem(`node-oj-problem-${pid}`);
  if (!last_submission) return false;
  return JSON.parse(last_submission);
};

const loadEditorTheme = (selected_theme) => {
  return new Promise((res) => {
    monaco
      .init()
      .then((monaco) => {
        import(`../../../../public/monaco_themes/${selected_theme}.json`)
          .then((data) => {
            return data;
          })
          .then((theme_data) => {
            monaco.editor.defineTheme(
              selected_theme.replace(/\s/gi, ''),
              theme_data,
            );
            res();
          });
      })
      .catch((error) =>
        console.error(
          'An error occurred during initialization of Monaco: ',
          error,
        ),
      );
  });
};

const problemDetail = (props) => {
  const {
    match,
    dispatch,
    problemDetail: { problemInfo, submissionInfo },
    user: { currentUser },
    submitting,
  } = props;

  function handleLeftTabChange(key) {
    console.log(key);
  }

  // loadEditorTheme returns a promise
  const [editortheme, setEditorTheme] = useState(() => {
    const last_submission = getLastSubmissionFromLocalStorage(match.params.pid);
    if (!last_submission) return 'light';
    const { editortheme } = last_submission;
    if (default_editor_theme.includes(editortheme)) {
      return editortheme;
    } else {
      loadEditorTheme(editortheme).then((_) => {
        setEditorTheme(editortheme);
      });
    }
  });
  const [language, setLanguage] = useState(() => {
    const last_submission = getLastSubmissionFromLocalStorage(match.params.pid);
    if (!last_submission) return 'cpp';
    return last_submission.language;
  });
  const [judge_language, setJudgeLanguage] = useState(() => {
    const last_submission = getLastSubmissionFromLocalStorage(match.params.pid);
    if (!last_submission) return 'C++';
    return last_submission.judge_language;
  });
  const [code, setCode] = useState(() => {
    const last_submission = getLastSubmissionFromLocalStorage(match.params.pid);
    if (!last_submission) return setLanguageTemplate(judge_language);
    return last_submission.code;
  });
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

  //
  // useEffect(() => {
  //   const { params, path } = match;
  //   if (path === '/problem/:pid') {
  //     dispatch({
  //       type: 'problemDetail/fetchProblemInfo',
  //       payload: params,
  //     });
  //   }
  //   return function cleanModelState() {
  //     dispatch({
  //       type: 'problemDetail/cleanSubmission',
  //     });
  //   };
  // }, []);

  // useMount 获取 problemInfo
  useMount(() => {
    const { params, path } = match;
    if (path === '/problem/:pid') {
      dispatch({
        type: 'problemDetail/fetchProblemInfo',
        payload: params,
      });
    }
  });

  // 在组件卸载的时候需要清除 Model 中的 state
  useUnmount(() => {
    console.log('unmount');
    dispatch({
      type: 'problemDetail/cleanProblemDetailModel',
    });
  });

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor;
  }

  const handleEditorChange = (ev, value) => {
    // console.log(ev, value);
    setCode(value);
  };

  // 更改编辑器 theme
  const handleThemeSelectChange = (selected_theme) => {
    // console.log(`selected ${selected_theme}`);
    // if (default_editor_theme.includes(selected_theme)) {
    //   setEditorTheme(selected_theme);
    // } else {
    //   monaco
    //     .init()
    //     .then(monaco => {
    //       import(`../../../../public/monaco_themes/${selected_theme}.json`)
    //         .then(data => {
    //           console.log('data', data);
    //           return data;
    //         })
    //         .then(theme_data => {
    //           console.log('---', selected_theme.replace(/\s/gi, ''));
    //           monaco.editor.defineTheme(
    //             selected_theme.replace(/\s/gi, ''),
    //             theme_data,
    //           );
    //           setEditorTheme(selected_theme.replace(/\s/gi, ''));
    //         });
    //     })
    //     .catch(error =>
    //       console.error(
    //         'An error occurred during initialization of Monaco: ',
    //         error,
    //       ),
    //     );
    // }
    if (default_editor_theme.includes(selected_theme)) {
      setEditorTheme(selected_theme);
    } else {
      loadEditorTheme(selected_theme).then((_) =>
        setEditorTheme(selected_theme.replace(/\s/gi, '')),
      );
    }
  };

  // 更改判题所需的 language
  const handleLanguageSelectChange = (selected_language) => {
    // 设置提交后台的判题语言
    setJudgeLanguage(selected_language);
    // 设置新的语言模版
    // setCode(setLanguageTemplate(selected_language));
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

  // 点击 Redo 重制 editor 模版
  const handleEditorRedo = () => {
    setCode(setLanguageTemplate(judge_language));
  };

  // 更改编辑器的字体大小
  const handleFontSelectorChange = (fontSize) => {
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

  // 提交解答给后台 judge 使用 useDebounce 函数
  const { run } = useDebounceFn(() => {
    const {
      params: { pid },
    } = match;
    const payload = {
      pid: problemInfo.pid,
      language: judge_language,
      code: code,
    };
    // 在这里设置回答的 localStorage
    // 储存的格式应该是 key: node-oj-problem-pid 的格式, value: { code, language, editorOptions}
    const last_submission = {
      judge_language,
      code,
      language,
      editortheme,
      editorOptions,
    };
    localStorage.setItem(
      `node-oj-problem-${pid}`,
      JSON.stringify(last_submission),
    );
    dispatch({
      type: 'problemDetail/createSubmission',
      payload,
    });
  }, 400);

  const DrawerTableColumns = [
    {
      title: '#',
      render: (value) => value.test_case,
    },
    {
      title: 'Result',
      dataIndex: 'result',
      render: (result) => <StatusTag status={result} />,
    },
    {
      title: 'CPU Time',
      dataIndex: 'cpu_time',
    },
    {
      title: 'Real Time',
      dataIndex: 'real_time',
    },
    {
      title: 'Singal',
      dataIndex: 'signal',
    },
    {
      title: 'Error',
      dataIndex: 'error',
    },
  ];

  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
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
                    <Panel header="输入 ｜ 输出" key="1">
                      <CodeCopyablePreview>
                        {problemInfo.sample_input}
                      </CodeCopyablePreview>
                      <CodeCopyablePreview>
                        {problemInfo.sample_output}
                      </CodeCopyablePreview>
                    </Panel>
                    <Panel header="题目标签" key="2">
                      <Tag color="#108ee9"> {problemInfo.tags}</Tag>
                    </Panel>
                    <Panel header="提示1" key="3">
                      hint1123
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
                defaultValue={judge_language}
                style={{ width: 300 }}
                onChange={handleLanguageSelectChange}
              >
                {language_config.map((item) => (
                  <Option key={item.name} key={item.language}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button onClick={() => handleEditorRedo()}>redo</Button>
            </Col>
            <Col>
              <Button onClick={() => showEditorSettingModal()}>设置</Button>
            </Col>
          </Row>
          <div className={styles.editor_window}>
            <ControlledEditor
              height="600px"
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
            {/* 如果用户提交过这个题目的话就显示 <Alert /> , 但是如果在题目内部提交的话就不显示*/}
            {currentUser.uid &&
            currentUser.submit_list.includes(problemInfo.pid) &&
            !submissionInfo._id ? (
              // 这里就在用户提交列表中匹配
              currentUser.solved_list.includes(problemInfo.pid) ? (
                <Alert
                  message="Last Submit is Accepted 👍"
                  type="success"
                  showIcon
                />
              ) : (
                <Alert
                  message="Last Submit is Wrong 💪"
                  type="warning"
                  showIcon
                />
              )
            ) : // 如果 submission._id 存在的话就显示提交的结果
            submissionInfo._id ? (
              <span>
                <span style={{ fontSize: '14px', marginRight: '10px' }}>
                  提交状态:{' '}
                </span>
                <Button
                  size="large"
                  type="dashed"
                  onClick={() => showJudgeResultDrawer()}
                  style={{ padding: '0px 13px', borderRadius: '4px' }}
                >
                  {submitting ? (
                    <Badge status="processing" text="submitting..." />
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
            ) : (
              // 如果 submission._id 不存在就显示 <div />
              <div />
            )}
            <Button
              size="large"
              type="primary"
              style={{ padding: '6px 30px', borderRadius: '4px' }}
              onClick={run}
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
              showSearch
              defaultValue={editortheme}
              style={{ width: 200 }}
              onChange={handleThemeSelectChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="light">light</Option>
              <Option value="dark">dark</Option>
              {custom_editor_theme.map((theme) => (
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
              {[12, 13, 14, 15, 16, 17, 18, 19, 20].map((fontSize) => (
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
        {submissionInfo._id ? (
          <Row gutter={2}>
            <Col span={12}>
              {submissionInfo.result === -2 ? (
                <Alert
                  message={judge_result[submissionInfo.result]}
                  description={
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {submissionInfo.status_info.error_info}
                    </div>
                  }
                  type={submissionInfo.result === 0 ? 'success' : 'error'}
                  showIcon
                />
              ) : (
                <>
                  <Alert
                    message={judge_result[submissionInfo.result]}
                    description={
                      <div style={{ fontSize: '12px' }}>
                        <span>
                          CPU Time: {submissionInfo.status_info.cpu_time_cost}ms
                        </span>
                        <span style={{ marginLeft: '15px' }}>
                          Real Time:{' '}
                          {submissionInfo.status_info.real_time__cost}ms
                        </span>
                        <span style={{ marginLeft: '15px' }}>
                          Memory :{' '}
                          {BtoMB(submissionInfo.status_info.memory_cost)}MB
                        </span>
                        <span style={{ marginLeft: '15px' }}>
                          Language : {submissionInfo.language}
                        </span>
                      </div>
                    }
                    type={submissionInfo.result === 0 ? 'success' : 'error'}
                    showIcon
                  />
                  <Divider />
                  <Table
                    columns={DrawerTableColumns}
                    dataSource={
                      submissionInfo
                        ? submissionInfo.info.judge_result_info
                        : []
                    }
                    rowKey="output_md5"
                    size="small"
                  />
                </>
              )}
            </Col>
            <Divider type="vertical" />
            <Col span={10}>
              <ShowCode
                language={submissionInfo.language}
                code={submissionInfo.code}
              />
            </Col>
          </Row>
        ) : (
          <Empty />
        )}
      </Drawer>
    </>
  );
};

export default connect(({ problem, problemDetail, loading, user }) => ({
  problemDetail,
  problem,
  user,
  fetching: loading.effects['problemDetail/fetchProblemInfo'],
  submitting: loading.effects['problemDetail/createSubmission'],
}))(problemDetail);
