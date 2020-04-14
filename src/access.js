/*
 * @Author: Wenzhe
 * @Date: 2020-04-14 12:35:19
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-14 19:00:33
 */
export default function(initialState) {
  return {
    userInfo: initialState,
    canUpdate: initialState ? initialState.privilege === 3 : false,
  };
}
