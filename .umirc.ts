/*
 * @Author: Wenzhe
 * @Date: 2020-03-20 13:49:05
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-14 12:50:47
 */
import { defineConfig } from 'umi';

export default defineConfig({
  history: { type: 'hash' },
  // locale: { default: 'zh-CN', antd: true },
  antd: {
    // dark: true,
  },
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:7001/api',
      pathRewrite: { '^/api': '' },
      changeOrigin: true
    }
  },
  routes: [
    // { path: '/', component: '@/pages/index' },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', component: '@/pages/home/index' },
        { path: '/problems', component: '@/pages/problems/index' },
        { path: '/rankList', component: '@/pages/rankList/index' },
        { path: '/discuss', component: '@/pages/discuss/index' },
        { path: '/contest', component: '@/pages/contest/index' },
      ],
    },
  ],
});
