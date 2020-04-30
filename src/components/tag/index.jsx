/*
 * @Author: Wenzhe
 * @Date: 2020-04-30 10:28:46
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-30 11:46:42
 */
import React from 'react';
import styles from './index.less';

const CustomTag = (props) => {
  const { children, onClick } = props;

  return (
    <div className={styles.tag} onClick={onClick}>
      {children}
    </div>
  );
};

export default CustomTag;
