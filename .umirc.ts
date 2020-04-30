/*
 * @Author: Wenzhe
 * @Date: 2020-03-20 13:49:05
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-30 23:05:22
 */
import { defineConfig } from 'umi';

export default defineConfig({
  title: 'Node OJ',
  theme: {
    // '@primary-color': '#16a085',
    '@border-radius-base': '4px',
  },
  history: { type: 'hash' },
  antd: {
    // dark: true,
  },
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:7001/api',
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    },
  },
  routes: [
    // { path: '/', component: '@/pages/index' },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', component: '@/pages/home/index' },
        {
          path: '/problem',
          component: '@/pages/problem/problemList',
          title: 'Problem | Node OJ',
        },
        {
          path: '/problem/:pid',
          component: '@/pages/problem/problemDetail/[pid]',
          title: 'Problem | Node OJ',
        },
        {
          path: '/rankList',
          component: '@/pages/rankList/index',
          title: 'RankList | Node OJ',
        },
        {
          path: '/discuss',
          component: '@/pages/discuss/index',
          title: 'Discuss | Node OJ',
        },
        {
          path: '/discuss/:did',
          component: '@/pages/discuss/discussDetail/[did]',
          title: 'Discuss | Node OJ',
        },
        {
          path: '/contest',
          component: '@/pages/contest/index',
          title: 'Contest | Node OJ',
        },
        {
          path: '/status',
          component: '@/pages/status/index',
          title: 'Status | Node OJ',
        },
        {
          path: '/status/:sid',
          component: '@/pages/status/statusDetail/[sid]',
          title: 'Status | Node OJ',
        },
        // user ====================
        {
          path: '/user/:uid',
          component: '@/pages/user/userDetail/[uid]',
          title: 'User | Node OJ',
        },
      ],
    },
  ],
});
