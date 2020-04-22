/*
 * @Author: Wenzhe
 * @Date: 2020-03-20 13:49:05
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-22 09:25:45
 */
import { defineConfig } from 'umi';

export default defineConfig({
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
        { path: '/problem', component: '@/pages/problem/problemList' },
        {
          path: '/problem/:pid',
          component: '@/pages/problem/problemDetail/[pid]',
        },
        { path: '/rankList', component: '@/pages/rankList/index' },
        { path: '/discuss', component: '@/pages/discuss/index' },
        { path: '/contest', component: '@/pages/contest/index' },
        { path: '/status', component: '@/pages/status/index' },
      ],
    },
  ],
});
