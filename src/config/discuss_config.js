/*
 * @Author: Wenzhe
 * @Date: 2020-04-30 14:00:43
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-01 15:34:13
 */
const categoryToCN = (category) => {
  switch (category) {
    case 'all':
      return '全部话题';
    case 'interview':
      return '面试考题';
    case 'algorithm':
      return '算法与数据结构';
    case 'question':
      return '题目交流';
    case 'work':
      return '职场问题';
    case 'news':
      return '最新资讯';
    case 'feedback':
      return '系统反馈';
    default:
      return '';
  }
};

const typeToCN = (type) => {
  switch (type) {
    case 'article':
      return '文章';
    case 'discuss':
      return '讨论';
    case 'draft':
      return '草稿';
    default:
      return '';
  }
};

const discuss_template = `## 讨论模版`;

const article_template = `## 文章模版`;

export { categoryToCN, typeToCN, discuss_template, article_template };
