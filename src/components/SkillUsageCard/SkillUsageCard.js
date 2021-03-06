// Packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { Paper } from 'material-ui';
import CountryWiseSkillUsageCard from '../CountryWiseSkillUsageCard/CountryWiseSkillUsageCard';

// Static assets
import './SkillUsage.css';

class SkillUsageCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      activePieIndex: 0,
    };
  }

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  };

  updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth * 0.8 > 800 ? 800 : window.innerWidth * 0.8,
    });
  };

  onPieEnter = (data, index) => {
    this.setState({
      activePieIndex: index,
    });
  };

  render() {
    let totalSkillUsage = 0;
    if (this.props.skill_usage) {
      // eslint-disable-next-line
      totalSkillUsage = this.props.skill_usage.reduce((totalCount, day) => {
        if (day) {
          return totalCount + day.count;
        }
        return totalCount;
      }, 0);
    }
    return (
      <div>
        <Paper className="margin-b-md margin-t-md">
          <h1 className="title">Skill Usage</h1>
          <div>
            <div className="sub-title" style={{ paddingLeft: '20px' }}>
              Time wise Usage
            </div>
            {totalSkillUsage > 0 ? (
              <div>
                <div className="time-chart">
                  <div>
                    <ResponsiveContainer width={this.state.width} height={300}>
                      <LineChart
                        data={this.props.skill_usage}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <XAxis dataKey="date" padding={{ right: 20 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip wrapperStyle={{ height: '60px' }} />
                        <Legend />
                        <Line
                          name="Skill usage count"
                          type="monotone"
                          dataKey="count"
                          stroke="#82ca9d"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="total-hits">
                  <div className="large-text">{totalSkillUsage}</div>
                  Hits this week
                </div>
              </div>
            ) : (
              <div className="default-message">
                No time wise skill usage data available.
              </div>
            )}
            <div className="device-usage">
              <div className="sub-title">Device wise Usage</div>
              {this.props.device_usage_data &&
              this.props.device_usage_data.length ? (
                <div className="pie-chart">
                  <ResponsiveContainer width={600} height={350}>
                    <PieChart>
                      <Pie
                        activeIndex={this.state.activePieIndex}
                        activeShape={renderActiveShape}
                        data={this.props.device_usage_data}
                        cx={300}
                        cy={175}
                        innerRadius={80}
                        nameKey="device_type"
                        dataKey="count"
                        outerRadius={120}
                        fill="#8884d8"
                        onMouseEnter={this.onPieEnter}
                      >
                        {this.props.device_usage_data.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend wrapperStyle={{ position: 'relative' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="default-message">
                  No device wise usage data available.
                </div>
              )}
            </div>
          </div>
          <div className="country-usage">
            <div className="sub-title">Country wise Usage</div>
            <CountryWiseSkillUsageCard
              countryWiseSkillUsage={this.props.countryWiseSkillUsage}
            />
          </div>
        </Paper>
      </div>
    );
  }
}

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    percent,
    value,
    name,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${name}: ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

renderActiveShape.propTypes = {
  cx: PropTypes.number,
  cy: PropTypes.number,
  midAngle: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  fill: PropTypes.string,
  percent: PropTypes.number,
  value: PropTypes.number,
  name: PropTypes.string,
};

SkillUsageCard.propTypes = {
  skill_usage: PropTypes.array,
  device_usage_data: PropTypes.array,
  countryWiseSkillUsage: PropTypes.array,
};

export default SkillUsageCard;
