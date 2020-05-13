/*
 * @Author: Wenzhe
 * @Date: 2020-05-03 19:53:50
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-13 14:04:53
 */

import React, { useState, useEffect, useRef } from 'react';
import { useUnmount, useDebounceFn } from '@umijs/hooks';
import { connect, history } from 'umi';
import {
  Row,
  Col,
  Table,
  Pagination,
  Typography,
  Divider,
  Tag,
  Collapse,
  Select,
  Button,
  Modal,
  Badge,
  Drawer,
  Empty,
  Alert,
} from 'antd';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import {
  CaretRightOutlined,
  SettingOutlined,
  ReloadOutlined,
  SendOutlined,
} from '@ant-design/icons';
// ================== import component
import { ControlledEditor } from '@monaco-editor/react';
import { monaco } from '@monaco-editor/react';
import CodeCopyablePreview from '../../../../components/CodeCopyablePreview';
import ShowCode from '../../../../components/showCode/index';
import StatusTag from '../../../../components/StatusTag';
import styles from './index.less';

// ================ import config
import {
  cpp_template,
  c_template,
  java_template,
  py_2_template,
  py_3_template,
} from '../../../../config/language_template';
import language_config from '../../../../config/editor-language';
import {
  custom_editor_theme,
  default_editor_theme,
} from '../../../../config/editor-theme';
import { judge_result } from '../../../../config/judge_result';
import { BtoMB } from '../../../../utils/tool_fuc';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

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
const getLastSubmissionFromLocalStorage = (cid, pid) => {
  const last_submission = localStorage.getItem(
    `node-oj-problem-contest-${cid}-${pid}`,
  );
  if (!last_submission) return false;
  return JSON.parse(last_submission);
};

const loadEditorTheme = (selected_theme) => {
  return new Promise((res) => {
    monaco
      .init()
      .then((monaco) => {
        import(`../../../../../public/monaco_themes/${selected_theme}.json`)
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

const ContestProblem = (props) => {
  const {
    match,
    dispatch,
    contestDetail: { contestDetail, submissionInfo, currentSubmissionID },
    submitting,
  } = props;

  const [currentProblemInfo, setCurrentProblemInfo] = useState({});
  const [editortheme, setEditorTheme] = useState('light');
  const [language, setLanguage] = useState('cpp');
  const [judge_language, setJudgeLanguage] = useState('C++');
  const [code, setCode] = useState(setLanguageTemplate('C++'));
  const [editorOptions, setEditorOptions] = useState({
    fontSize: '15px',
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

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor;
  }

  const handleEditorChange = (ev, value) => {
    // console.log(ev, value);
    setCode(value);
  };

  // // 更改编辑器 theme
  const handleThemeSelectChange = (selected_theme) => {
    if (default_editor_theme.includes(selected_theme)) {
      setEditorTheme(selected_theme);
    } else {
      loadEditorTheme(selected_theme).then((_) =>
        setEditorTheme(selected_theme.replace(/\s/gi, '')),
      );
    }
  };

  // // 更改判题所需的 language
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

  // // 点击 Redo 重制 editor 模版
  const handleEditorRedo = () => {
    setCode('');
  };

  // // 更改编辑器的字体大小
  const handleFontSelectorChange = (fontSize) => {
    setEditorOptions({ ...editorOptions, fontSize: fontSize });
  };

  // // 显示编辑器修改 Modal
  const showEditorSettingModal = () => {
    setEditorSettingModalVisible(true);
  };

  // // 关闭编辑器修改 Modal
  const hideEditorSettingModal = () => {
    setEditorSettingModalVisible(false);
  };

  // // 显示判题结果 Drawer
  const showJudgeResultDrawer = () => {
    if (!(submissionInfo.result + 3)) {
      message.error('后台还未判题完成，请耐心等待');
      return;
    }
    setJudgeResultDrawerVisible(true);
  };

  // 关闭判题结果 Drawer
  const hideJudgeResultDrawer = () => {
    setJudgeResultDrawerVisible(false);
  };

  useEffect(() => {
    if (!contestDetail._id) {
      const { cid } = match.params;
      dispatch({
        type: 'contestDetail/fetchContestDetail',
        payload: {
          cid,
        },
      });
    }
  }, [contestDetail, dispatch]);

  useEffect(() => {
    // 清除上一次提交的内容
    dispatch({
      type: 'contestDetail/cleanSubmission',
    });
    const { problemList } = contestDetail;
    const { id, cid } = match.params;
    if (!problemList) {
      return;
    }
    setCurrentProblemInfo(problemList[id - 1]);
    // 下面来回显 用户上次提交的内容
    const { pid } = problemList[id - 1];
    const last_submission = getLastSubmissionFromLocalStorage(cid, pid);
    if (last_submission) {
      const { code, editortheme, judge_language, language } = last_submission;
      // 设置 editor theme
      if (default_editor_theme.includes(editortheme)) {
        setEditorTheme(editortheme);
      } else {
        loadEditorTheme(editortheme).then((_) => {
          setEditorTheme(editortheme);
        });
      }
      // 设置 language
      setLanguage(language);
      // 设置 judge_language
      setJudgeLanguage(judge_language);
      // 设置 code
      setCode(code);
    } else {
      setEditorTheme('light');
      setLanguage('cpp');
      setJudgeLanguage('C++');
      setCode(setLanguageTemplate('C++'));
    }
  }, [dispatch, match, contestDetail]);

  const handlePaginationChange = (page) => {
    const { cid } = match.params;
    history.push(`/contest/${cid}/problem/${page}`);
  };

  useUnmount(() => {
    console.log('unmount');
  });

  // 提交解答给后台 judge 使用 useDebounce 函数
  const { run } = useDebounceFn(() => {
    const {
      params: { cid },
    } = match;
    const { pid } = currentProblemInfo;
    // 首先清空上一次提交的 submissionInfo
    dispatch({
      type: 'contestDetail/cleanSubmission',
    });
    const payload = {
      pid,
      cid,
      status: 2,
      code: code,
      language: judge_language,
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
      `node-oj-problem-contest-${cid}-${pid}`,
      JSON.stringify(last_submission),
    );
    dispatch({
      type: 'contestDetail/createSubmission',
      payload,
    }).then((submission) => {
      dispatch({
        type: 'contestDetail/getSubmission',
        payload: {
          id: submission._id,
          pid: submission.pid,
        },
      });
    });
  }, 300);

  const DrawerTableColumns = [
    {
      title: '#',
      render: (value) => value.test_case,
    },
    {
      title: '测试用例结果',
      dataIndex: 'result',
      render: (result) => <StatusTag status={result} />,
    },
    {
      title: 'CPU 用时',
      dataIndex: 'cpu_time',
    },
    {
      title: '执行用时',
      dataIndex: 'real_time',
    },
    {
      title: '内存消耗',
      dataIndex: 'memory',
      render: (memory) => `${BtoMB(memory)} mb`,
    },
    {
      title: '信号|Singal',
      dataIndex: 'signal',
    },
    {
      title: '错误',
      dataIndex: 'error',
    },
  ];

  return (
    <div>
      <div>
        <Row justify="space-between" gutter={25}>
          <Col span={9}>
            <Pagination
              current={Number(match.params.id)}
              pageSize={1}
              onChange={handlePaginationChange}
              total={
                contestDetail.problemList ? contestDetail.problemList.length : 0
              }
            />
          </Col>
          <Col span={15}>
            <div className={styles.right_operation}>
              <div className={styles.editor_operation}>
                <div className={styles.inline_block}>
                  <Select
                    value={judge_language}
                    style={{ width: 200 }}
                    onChange={handleLanguageSelectChange}
                  >
                    {language_config.map((item) => (
                      <Option key={item.name} key={item.language}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div
                  className={styles.inline_block}
                  style={{ marginLeft: '10px' }}
                >
                  <Button onClick={() => handleEditorRedo()}>
                    <ReloadOutlined />
                  </Button>
                  <Button
                    style={{ marginLeft: '5px' }}
                    onClick={() => showEditorSettingModal()}
                  >
                    <SettingOutlined />
                  </Button>
                </div>
              </div>
              <div>
                {currentSubmissionID ? (
                  <span>
                    <Button
                      type="dashed"
                      onClick={() => showJudgeResultDrawer()}
                      style={{ padding: '0px 13px', borderRadius: '4px' }}
                    >
                      {submissionInfo.result === 0 ? (
                        <Badge
                          status="success"
                          text={judge_result[submissionInfo.result]}
                        />
                      ) : submissionInfo.result + 3 ? (
                        <Badge
                          status="error"
                          text={judge_result[submissionInfo.result]}
                        />
                      ) : (
                        <Badge status="processing" text="判题中..." />
                      )}
                    </Button>
                  </span>
                ) : (
                  // 如果 submission._id 不存在就显示 <div />
                  <div />
                )}
                <Button
                  style={{ marginLeft: '10px' }}
                  onClick={run}
                  loading={
                    submitting ||
                    (currentSubmissionID && !(submissionInfo.result + 3))
                  }
                >
                  提交 <SendOutlined />
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.problemInfo}>
        <Row gutter={25}>
          <Col span={9}>
            <Row>
              <Title
                level={4}
              >{`${currentProblemInfo.pid}.${currentProblemInfo.title}`}</Title>
            </Row>
            <Divider style={{ margin: '0 0 10px 0' }} />
            <div className="markdown-body">
              <ReactMarkdown source={currentProblemInfo.detail} />
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
                      {currentProblemInfo.sample_input}
                    </CodeCopyablePreview>
                    <CodeCopyablePreview>
                      {currentProblemInfo.sample_output}
                    </CodeCopyablePreview>
                  </Panel>
                  <Panel header="题目标签" key="2">
                    <Tag color="#108ee9"> {currentProblemInfo.tags}</Tag>
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          </Col>
          <Col span={15}>
            <div className={styles.editor_window}>
              <ControlledEditor
                height="600px"
                width="100%"
                style={{ borderRadius: '4px' }}
                language={language}
                theme={editortheme}
                value={code}
                onChange={handleEditorChange}
                editorDidMount={handleEditorDidMount}
                options={editorOptions}
              />
            </div>
          </Col>
        </Row>
      </div>
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
                      submissionInfo.info
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
    </div>
  );
};

export default connect(({ contestDetail, user, loading }) => ({
  contestDetail,
  user,
  submitting: loading.effects['contestDetail/createSubmission'],
  delay_submitting: loading.effects['contestDetail/getSubmission'],
}))(ContestProblem);
