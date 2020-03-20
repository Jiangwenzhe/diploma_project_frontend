import React from 'react';
import PageHeader from '@/components/header/index';

export default (props: { children: React.ReactNode; }) => {
  return (
    <div>
      <PageHeader />
        <div style={{ padding: 20 }}>{ props.children }</div>
    </div>
  );
}
