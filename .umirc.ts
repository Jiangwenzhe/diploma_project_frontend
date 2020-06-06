/*
 * @Author: Wenzhe
 * @Date: 2020-03-20 13:49:05
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-25 16:27:59
 */
import { defineConfig } from 'umi';

export default defineConfig({
  // ssr: {},
  title: 'Node OJ',
  // qiankun: {
  //   // 子应用信息
  //   master: {
  //     apps: [
  //       {
  //         name: 'admin', // 唯一 id
  //         entry: '//localhost:8001', // html entry
  //         base: '/admin', // app1 的路由前缀，通过这个前缀判断是否要启动该应用，通常跟子应用的 base 保持一致
  //         history: 'hash', // 子应用的 history 配置，默认为当前主应用 history 配置
  //       },
  //     ]
  //   }
  // },
  theme: {
    // '@primary-color': '#16a085',
    '@border-radius-base': '4px',
  },
  history: { type: 'hash' },
  // history: { type: 'browser' },
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
    // { path: '/admin', exact: true, component: '@/pages/admin' },
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
          path: '/discuss/discussDetail/:did',
          component: '@/pages/discuss/discussDetail/[did]',
          title: 'Discuss | Node OJ',
        },
        {
          path: '/discuss/articleDetail/:did',
          component: '@/pages/discuss/articleDetail/[did]',
          title: 'Discuss | Node OJ',
        },
        {
          path: '/contest',
          component: '@/pages/contest/index',
          title: 'Contest | Node OJ',
        },
        {
          path: '/contest/:cid',
          component: '@/pages/contest/contestDetail/[cid]',
          title: 'Contest | Node OJ',
          routes: [
            {
              path: '/contest/:cid',
              component: '@/pages/contest/contestDetail/overall',
              title: '总览 | Contest',
            },
            {
              path: '/contest/:cid/problem/:id',
              component: '@/pages/contest/contestDetail/problem',
              title: '题目 | Contest',
            },
            {
              path: '/contest/:cid/status',
              component: '@/pages/contest/contestDetail/status',
              title: 'Status | Contest',
            },
            {
              path: '/contest/:cid/ranklist',
              component: '@/pages/contest/contestDetail/ranklist',
              title: 'Ranklist | Contest',
            },
          ],
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
