/*
 * @Author: Wenzhe
 * @Date: 2020-04-30 14:00:43
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-30 15:10:47
 */
const categoryToCN = (category) => {
  switch (category) {
    case 'all':
      return '全部话题';
    case 'interview':
      return '面试问题';
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

export { categoryToCN, typeToCN };
