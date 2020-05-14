import React, { useState, useEffect } from 'react';
import styles from './index.less';
import {
  Row,
  Tag,
  Divider,
  Pagination,
  Spin,
  Col,
  Button,
  Menu,
  Input,
  PageHeader,
} from 'antd';
import { PlusOutlined, createFromIconfontCN } from '@ant-design/icons';
import { connect } from 'umi';
import DiscussForm from './discussForm/index';
import { v4 as uuidv4 } from 'uuid';
import DiscussItem from '../../components/discussItem';
import icon_font_url from '../../config/iconfont';
import CustomTag from '../../components/tag';
import { filterItem, inverseFilter } from '../../utils/tool_fuc';
import { categoryToCN, typeToCN } from '../../config/discuss_config';

const { CheckableTag } = Tag;
const { Item } = Menu;
const { Search } = Input;

const IconFont = createFromIconfontCN({
  scriptUrl: icon_font_url,
});

const Discuss = (props) => {
  const {
    dispatch,
    fetchDiscussListLoading,
    fetchMyDiscussInfoLoading,
    discuss: { discussList, total, discussTags, communicationQuery },
    user: { currentUser },
  } = props;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [discussType, setDiscussType] = useState('all');
  const [selectCategory, setSelectCategory] = useState(['all']);
  const [query, setQuery] = useState({
    category: '',
    type: '',
    tag: '',
    title: '',
  });
  const [pagediscussTags, setPageDiscussTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [search, setSearch] = useState('');
  const [titleSearch, setTitleSearch] = useState('');
  const [isMy, setIsMy] = useState(false);
  const [myPageHeaderTitle, setMyPageHeaderTitle] = useState('');
  const [discussFormVisible, setDiscussFormVisible] = useState(false);
  const [discussFormType, setDiscussFormType] = useState('');

  // '', 'interview/面试', 'algorithm/数据结构与算法', 'question/题目讨论'， 'work/工作', 'news/新闻', 'feedback/反馈'
  const categories = [
    'all',
    'question',
    'algorithm',
    'interview',
    'work',
    'news',
    'feedback',
  ];

  // 数据初始化, 获取 discussTags
  useEffect(() => {
    dispatch({
      type: 'discuss/fetchDiscussTags',
    });
  }, []);

  // 当 model 里获取到 discussTags 以后，储存一份在页面上
  useEffect(() => {
    setPageDiscussTags(discussTags);
  }, [discussTags]);

  // 通过分页 / 关键字获取 discussList
  useEffect(() => {
    dispatch({
      type: 'discuss/fetchDiscussList',
      payload: { pagination, query },
    });
  }, [dispatch, pagination, query]);

  // 拼装 query 的函数
  useEffect(() => {
    const currentCategory =
      selectCategory[0] === 'all' ? '' : selectCategory[0];
    const currentType = discussType === 'all' ? '' : discussType;
    const currentTag = selectedTags.length === 0 ? '' : selectedTags.join(',');
    setQuery({
      ...query,
      category: currentCategory,
      type: currentType,
      tag: currentTag,
      title: titleSearch,
    });
  }, [selectCategory, discussType, selectedTags, titleSearch]);

  useEffect(() => {
    const { type, category } = communicationQuery;
    if (type) {
      setDiscussType(type);
    }
    if (category) {
      setSelectCategory([category]);
    }
  }, [communicationQuery]);

  // refetch discusslist
  const refetchDiscussList = () => {
    dispatch({
      type: 'discuss/fetchDiscussList',
      payload: { pagination, query },
    });
  };

  // 更改 pagination 中的 current 当前页码
  const paginationChangeHandler = (current) => {
    setPagination({ ...pagination, current });
  };

  // 更改 pagination 中的 pageSize 当前页面容量
  const handlePageSizeChange = (_, pageSize) => {
    setPagination({ ...pagination, pageSize });
  };

  // 处理页头的 category 的修改
  const handleCategoryChange = (tag) => {
    setSelectCategory([tag]);

    // if (tag === 'all') {
    //   setQuery({ ...query, category: '' });
    //   return;
    // }
    // setQuery({ ...query, category: tag });
  };

  // 给子组件传递一个函数 让子组件可以更改父亲组件的 category 与 type 主要是为了 discussItem 组件使用
  const handleChangeCategoryAndTypefromChildComponents = (category, type) => {
    setSelectCategory([category]);
    setDiscussType(type);
    // setQuery({ ...query, category, type });
  };

  // 更改 menu 全部 | 讨论 | 文章
  const handleTypeMenuChange = (e) => {
    setDiscussType(e.key);
    // if (e.key === 'all') {
    //   setQuery({ ...query, type: '' });
    //   return;
    // }
    // setQuery({ ...query, type: e.key });
  };

  // 处理 discussTags 的修改，模糊查询
  const handleTagSearch = (e) => {
    const value = e.target.value;
    if (value === '') {
      // 如果没有 selectedTags 就直接返回 discussTags
      if (selectedTags.length === 0) {
        setPageDiscussTags(discussTags);
        return;
      }
      // 如果有 selectedTags 就返回 discussTags 与 selectedTags 的差集
      const differenceSetPageDiscussTag = discussTags.filter(
        (item) => selectedTags.indexOf(item) === -1,
      );
      setPageDiscussTags(differenceSetPageDiscussTag);
      return;
    }
    const filteredTag = filterItem(discussTags, value);
    setPageDiscussTags(filteredTag);
  };

  // 处理 discuss tag 的点击
  const handleTagClick = (tag) => {
    // 先处理下面的 tags
    const inverseFilterPagediscussTags = inverseFilter(pagediscussTags, tag);
    const newSelectedTags = JSON.parse(JSON.stringify(selectedTags));
    // 再添加上面的 tags
    newSelectedTags.push(tag);
    setPageDiscussTags(inverseFilterPagediscussTags);
    setSelectedTags([...new Set(newSelectedTags)]);
  };

  // 处理 discuss tag 的关闭
  const handleTagClose = (tag) => {
    // 先去除上面的 tags
    const filteredTag = inverseFilter(selectedTags, tag);
    setSelectedTags(filteredTag);
    // 再添加下面的 tags
    const newPagediscussTags = JSON.parse(JSON.stringify(pagediscussTags));
    newPagediscussTags.unshift(tag);
    setPageDiscussTags([...new Set(newPagediscussTags)]);
  };

  // 获取与我有关的 discuss, 包括 我的文章 ｜ 我的讨论 ｜ 我的草稿
  const getMyDiscussInfo = (type) => {
    setMyPageHeaderTitle(typeToCN(type));
    setIsMy(true);
    dispatch({
      type: 'discuss/fetchMyDiscussInfo',
      payload: {
        pagination,
        query: {
          type,
          author_id: currentUser._id,
        },
      },
    });
  };

  // 从 我的文章 ｜ 我的讨论 ｜ 我的草稿 返回分页获取 discussList
  const cancelMy = () => {
    setIsMy(false);
    dispatch({
      type: 'discuss/fetchDiscussList',
      payload: { pagination, query },
    });
  };

  // 显示 DiscussForm
  const showDiscussForm = (type) => {
    setDiscussFormVisible(true);
    setDiscussFormType(type);
  };

  // 隐藏 DiscussForm
  const hideDiscussForm = () => {
    setDiscussFormVisible(false);
  };

  const changeTitleSearch = (e) => {
    if (e.target.value === '') {
      setTitleSearch('');
    }
    setSearch(e.target.value);
  };

  const handleTitleSearch = () => {
    setTitleSearch(search);
  };

  return (
    <div>
      <Row justify="center">
        <Col span={17} className={styles.shadow}>
          {isMy ? (
            <>
              <PageHeader
                className={styles.my_page_header}
                onBack={() => cancelMy()}
                title={`我的${myPageHeaderTitle}`}
                subTitle={currentUser.name}
              />
            </>
          ) : (
            <div>
              {categories.map((tag) => (
                <span key={uuidv4()}>
                  <CheckableTag
                    key={tag}
                    checked={selectCategory.indexOf(tag) > -1}
                    onChange={(checked) => handleCategoryChange(tag, checked)}
                    style={{
                      fontSize: '14px',
                      cursor: 'pointer',
                      padding: '2px 7px',
                    }}
                  >
                    {categoryToCN(tag)}
                  </CheckableTag>
                  <Divider type="vertical" />
                </span>
              ))}
              <Menu
                className={styles.discuss_type_menu}
                onClick={handleTypeMenuChange}
                selectedKeys={discussType}
                mode="horizontal"
              >
                <Item key="all">全部</Item>
                <Item key="discuss">讨论</Item>
                <Item key="article">文章</Item>
              </Menu>
            </div>
          )}
          <div style={{ marginTop: '25px' }}>
            <Spin
              spinning={
                fetchDiscussListLoading ||
                (fetchMyDiscussInfoLoading !== undefined &&
                  fetchMyDiscussInfoLoading)
              }
            >
              {discussList.map((discuss) => (
                <DiscussItem
                  key={discuss._id}
                  clickCategoryFnc={
                    handleChangeCategoryAndTypefromChildComponents
                  }
                  discussInfo={discuss}
                />
              ))}
              <Pagination
                style={{ marginTop: '30px' }}
                current={pagination.current}
                pageSize={pagination.pageSize}
                onChange={(current) => paginationChangeHandler(current)}
                onShowSizeChange={handlePageSizeChange}
                showSizeChanger
                total={total}
              />
            </Spin>
          </div>
        </Col>
        <div style={{ width: '270px', marginLeft: '50px' }}>
          <div className={styles.operation}>
            <div className={styles.searchBox}>
              <Search
                placeholder="按标题搜索"
                onChange={(value) => changeTitleSearch(value)}
                onSearch={(value) => handleTitleSearch(value)}
              />
            </div>
            <Divider style={{ margin: '15px 0' }} />

            <div className={styles.right_upper_wrapper}>
              <div
                className={styles.icon_wrapper}
                onClick={() => getMyDiscussInfo('article')}
              >
                <IconFont className={styles.icon} type="icon-book" />
                <div>我的文章</div>
              </div>
              <div
                className={styles.icon_wrapper}
                onClick={() => getMyDiscussInfo('discuss')}
              >
                <IconFont className={styles.icon} type="icon-discussion" />
                <div>我的讨论</div>
              </div>
              <div className={styles.icon_wrapper}>
                <IconFont className={styles.icon} type="icon-collect" />
                <div>我的收藏</div>
              </div>
            </div>
            <Divider style={{ margin: '15px 0' }} />
            <Row style={{ margin: '0 15px' }}>
              <Col>
                <Button
                  type="primary"
                  block
                  onClick={() => showDiscussForm('article')}
                >
                  <PlusOutlined />
                  编写文章
                </Button>
              </Col>
              <div style={{ width: '10px' }} />
              <Col>
                <Button block onClick={() => showDiscussForm('discuss')}>
                  <PlusOutlined />
                  发起讨论
                </Button>
              </Col>
            </Row>
            {/* <div style={{ padding: '0 15px' }}>
              <Divider style={{ margin: '15px 0' }} />
            </div>
            <div className={styles.right_panle}>
              <div className={styles.click_list}>
                <span>
                  <IconFont type="icon-caogaoxiang" />
                  &nbsp;&nbsp;我的草稿
                </span>
                <RightOutlined />
              </div>
              <div className={styles.click_list}>
                <span>
                  <IconFont type="icon-guanzhu" />
                  &nbsp;&nbsp;我的关注
                </span>
                <RightOutlined />
              </div>
            </div> */}
          </div>
          {!isMy && (
            <div className={styles.tag_panel}>
              {selectedTags.map((tag) => (
                <Tag
                  className={styles.tag}
                  key={tag}
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    handleTagClose(tag);
                  }}
                >
                  {tag}
                </Tag>
              ))}
              <Search
                className={styles.tag_search}
                placeholder="标签搜索"
                onChange={(value) => handleTagSearch(value)}
              />
              {pagediscussTags.map((tag) => (
                <CustomTag key={tag} onClick={() => handleTagClick(tag)}>
                  {tag}
                </CustomTag>
              ))}
            </div>
          )}
        </div>
      </Row>
      <DiscussForm
        discussFormVisible={discussFormVisible}
        type={discussFormType}
        handleHideDiscussForm={hideDiscussForm}
        discussTags={discussTags}
        refetchDiscussList={refetchDiscussList}
      />
    </div>
  );
};

export default connect(({ discuss, user, loading }) => ({
  discuss,
  user,
  fetchMyDiscussInfoLoading: loading.effects['discuss/fetchMyDiscussInfo'],
  fetchDiscussListLoading: loading.effects['discuss/fetchDiscussList'],
}))(Discuss);
