/*
 * @Author: Wenzhe
 * @Date: 2020-04-21 10:48:38
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-21 16:47:32
 */

//  bit 转 mb 的函数
const BtoMB = param => Math.round(param / (1024 * 1024));

export { BtoMB };
