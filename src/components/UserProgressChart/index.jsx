import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, Label } from 'recharts';
import styles from './index.less';

const COLORS = ['#52c41a', '#fa8c16', '#d9d9d9'];

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 3}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default class Example extends PureComponent {
  state = {
    activeIndex: 0,
  };

  componentDidMount() {
    console.log(this.props.data);
  }

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  onPieLeave = (data, index) => {
    this.setState({
      activeIndex: 0,
    });
  };

  render() {
    const { data } = this.props;
    return (
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          onMouseEnter={this.onPieEnter}
          onMouseLeave={this.onPieLeave}
          activeIndex={this.state.activeIndex}
          activeShape={renderActiveShape}
          innerRadius={70}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          <Label
            value={data ? data[this.state.activeIndex].name : ''}
            position="centerBottom"
            fill={'#595959'}
            className={styles.label_top}
          />
          <Label
            value={data ? data[this.state.activeIndex].value : ''}
            position="centerTop"
            className={styles.label_bottom}
            fill={'#595959'}
          />
          {data &&
            data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
        </Pie>
      </PieChart>
    );
  }
}
