import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Input,
  Table,
  Button,
  Popconfirm,
  Statistic,
  Row,
  Col,
  Tag,
  Divider,
  Menu,
  Dropdown,
} from 'antd';
import styles from './index.less';
import request from '@/utils/request';
import { connect, Link } from 'umi';
import {
  TagOutlined,
  createFromIconfontCN,
  DownOutlined,
  CheckOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Text, Title } = Typography;
const { CheckableTag } = Tag;
const { Search } = Input;

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1756231_qmkck7zzv8.js',
});

const difficultyToTag = (difficulty) => {
  if (!difficulty) return <Tag color="success">简单</Tag>;
  switch (difficulty) {
    case 'Low':
      return <Tag color="success">简单</Tag>;
    case 'Med':
      return <Tag color="success">中等</Tag>;
    case 'High':
      return <Tag color="success">困难</Tag>;
    default:
      return <Tag color="success">简单</Tag>;
  }
};

const ProblemList = (props) => {
  const {
    problem: { problemList, total },
    dispatch,
    fetching,
    user: { currentUser },
  } = props;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    request('/api/problemtag').then((response) => {
      const tagValue = response.data.map((item) => item.name);
      setTags(tagValue);
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'problem/fetchProblemList',
      payload: { pagination, query },
    });
  }, [dispatch, pagination, query]);

  // params: (current_pagination, filters, sorter)
  const tableChangeHandler = (current_pagination) => {
    setPagination(current_pagination);
  };

  const handleTitleQuery = (value) => {
    setQuery({ ...query, title: value });
    setPagination({ current: 1, pageSize: 10 });
  };

  const handleProblemTagSelected = (tag, checked) => {
    console.log(tag, checked);
    // const
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  const columns = [
    {
      title: '',
      dataIndex: '',
      key: 'pid',
      width: '5%',
      render: (value) => {
        if (!currentUser) return <></>;
        const { pid } = value;
        const { solved_list, failed_list } = currentUser;
        if (solved_list && solved_list.includes(pid)) {
          return <IconFont type="icon-check" style={{ color: '#52c41a' }} />;
        }
        if (failed_list && failed_list.includes(pid)) {
          return <IconFont type="icon-question" style={{ color: '#faad14' }} />;
        }
      },
    },
    {
      title: () => <IconFont type="icon-hashtag" />,
      dataIndex: 'pid',
      key: 'pid',
      width: '10%',
    },
    {
      title: '题名',
      // dataIndex: 'title',
      render: (value) => {
        return <Link to={`/problem/${value.pid}`}>{value.title}</Link>;
      },
      width: '40%',
    },
    {
      title: '题解',
      render: (value) => {
        return value.submit;
      },
      width: '10%',
    },
    {
      title: '通过率',
      render: (value) => {
        const rate = Math.round((value.solve / value.submit) * 100);
        return <>{`${isNaN(rate) ? 0 : rate}%`}</>;
      },
      width: '10%',
    },
    {
      title: '难度',
      render: (value) => {
        return difficultyToTag(value.difficulty);
      },
      width: '10%',
    },
  ];

  const select_difficulty_menu = (
    <Menu>
      <Menu.Item>简单</Menu.Item>
      <Menu.Item>中等</Menu.Item>
      <Menu.Item>困难</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Row>
        <Col span={15} offset={1}>
          <Table
            columns={columns}
            rowKey="_id"
            dataSource={problemList}
            pagination={{ ...pagination, total, showSizeChanger: true }}
            onChange={tableChangeHandler}
            loading={fetching}
            title={() => (
              <Row align="middle">
                <Col span={4}>
                  <Title level={4}>题目列表</Title>
                </Col>
                <Col offset={12} span={4}>
                  <Search />
                </Col>
                <Col span={1} offset={1}>
                  <Dropdown overlay={select_difficulty_menu}>
                    <a
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      难度 <DownOutlined />
                    </a>
                  </Dropdown>
                </Col>
              </Row>
            )}
          />
        </Col>
        <Col span={4} offset={2}>
          <Row>
            <div className={styles.section_title}>
              <IconFont type="icon-tag-o" />
              <span style={{ marginLeft: '10px' }}>标签分类</span>
              <br />
              <div className={styles.tag_group}>
                {tags.map((tag) => {
                  return (
                    <CheckableTag
                      checked={selectedTags.indexOf(tag) > -1}
                      onChange={(checked) =>
                        handleProblemTagSelected(tag, checked)
                      }
                      key={tag}
                    >
                      {tag}
                    </CheckableTag>
                  );
                })}
              </div>
            </div>
          </Row>
          <Divider />
          <Row>
            <div>
              <div className={styles.section_header}>
                <IconFont type="icon-schedule" />
                <span style={{ marginLeft: '10px' }}>我的进度</span>
              </div>
              会有一个饼图放在这里
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ problem, loading, user }) => ({
  problem,
  user,
  fetching: loading.effects['problem/fetchProblemList'],
}))(ProblemList);
