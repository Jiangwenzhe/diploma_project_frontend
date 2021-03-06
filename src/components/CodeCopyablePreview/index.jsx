import React from 'react';
import { Typography } from 'antd';
import styles from './index.less';

const CodeCopyablePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default CodeCopyablePreview;
