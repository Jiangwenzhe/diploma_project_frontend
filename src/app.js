/*
 * @Author: Wenzhe
 * @Date: 2020-03-20 14:03:23
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-25 16:23:38
 */

import { queryCurrent } from './service/user';

export async function getInitialState() {
  if (!localStorage.getItem('node-oj-token')) {
    return {
      msg: '用户未登录',
    };
  }
  const response = await queryCurrent();
  return response.data;
}

// // 从接口中获取子应用配置，export 出的 qiankun 变量是一个 promise
export const qiankun = fetch('/config').then(({ apps }) => ({
  // 注册子应用信息
  apps,
  jsSandbox: true, // 是否启用 js 沙箱，默认为 false
  prefetch: true, // 是否启用 prefetch 特性，默认为 true
  lifeCycles: {
    // see https://github.com/umijs/qiankun#registermicroapps
    afterMount: (props) => {
      console.log(props);
    },
  },
  // ...even more options qiankun start() supported, see https://github.com/umijs/qiankun#start
}));
