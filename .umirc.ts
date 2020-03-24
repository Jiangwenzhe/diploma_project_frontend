/*
 * @Author: Wenzhe
 * @Date: 2020-03-20 13:49:05
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-24 09:43:14
 */
import { defineConfig } from 'umi';

export default defineConfig({
  history: { type: 'hash' },
  locale: { antd: true },
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
