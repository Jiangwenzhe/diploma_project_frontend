import React from 'react';
import ReactEcharts from 'echarts-for-react';

const UserProgressChart = (props) => {
  const getOption = () => ({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    series: {
      type: 'pie',
      color: ['#52c41a', '#1990FF', '#faad14'],
      // radius: ['50%', '70%'],
      radius: '80%',
      center: ['50%', '50%'], //  上下居中
      labelLine: {
        show: false,
      },
      label: {
        show: false,
        position: 'center',
      },
      data: [
        { name: 'solved', value: 5 },
        { name: 'unsolved', value: 92 },
        { name: 'tried', value: 3 },
      ],
    },
  });

  return (
    <>
      <ReactEcharts option={getOption()} style={{ height: 200, width: 200 }} />
    </>
  );
};

export default UserProgressChart;
