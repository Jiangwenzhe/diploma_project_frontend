import React from 'react';
import PageHeader from '@/components/header/index';
import { Button } from 'antd';
import { history } from 'umi';

const BasicLayout = (props: any) => {
  console.log('layout props', props);
  const {
    location: { pathname },
    children,
  } = props;
  return (
    <div>
      <PageHeader pathname={pathname} />
      <Button onClick={() => {
        history.goBack()
      }}>go back</Button>
        <div style={{ padding: 20 }}>{ children }</div>
    </div>
  );
}

export default BasicLayout;
