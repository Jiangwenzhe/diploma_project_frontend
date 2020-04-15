import React from 'react';

const problemDetail = props => {

  const { match } = props;

  return (
    <>
      <h1>Problem Pid</h1>
      <h3>{match.params.pid}</h3>
    </>
  );
};

export default problemDetail;
