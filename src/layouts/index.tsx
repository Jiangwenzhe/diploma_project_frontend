import React from 'react';
import PageHeader from '@/components/header/index';

export default (props: any) => {
  // console.log('layout props', props);
  const {
    location: { pathname },
    children,
  } = props;
  return (
    <div>
      <PageHeader pathname={pathname} />
        <div style={{ padding: 20 }}>{ children }</div>
    </div>
  );
}
