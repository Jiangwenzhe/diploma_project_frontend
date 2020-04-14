/*
 * @Author: Wenzhe
 * @Date: 2020-04-14 12:35:19
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-14 12:55:20
 */
export default function(initialState) {
  const { userId, role } = { userId: 1, role: 'admin'};

  return {
    userId,
    role,
    // canReadFoo: true,
    // canUpdateFoo: role === 'admin',
    // canDeleteFoo: foo => {
    //   return foo.ownerId === userId;
    // },
  };
}