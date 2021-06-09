import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import * as echarts from 'echarts';

let myChart;

const Chart4 = (props) => {
  const chartDiv = useRef(null);
  
  const data = useSelector((e) => e.PGMTEST2_REDUCER.data4Org);

  const dateList = data.map(function (item) {
      return item.OTIME;
  });
  const valueList = data.map(function (item) {
      return item.VALUE;
  });

  const option = {
    xAxis: {
        type: 'category',
        boundaryGap: false
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '30%']
    },
    visualMap: {
        type: 'piecewise',
        show: false,
        dimension: 0,
        seriesIndex: 0,
        pieces: [{
            gt: 1,
            lt: 3,
            color: 'rgba(0, 0, 180, 0.4)'
        }, {
            gt: 5,
            lt: 7,
            color: 'rgba(255, 0, 0)'
        }]
    },
    series: [
        {
            type: 'line',
            smooth: 0.6,
            symbol: 'none',
            lineStyle: {
                color: '#5470C6',
                width: 5
            },
            markLine: {
                symbol: ['none', 'none'],
                label: {show: false},
                data: [
                    {xAxis: 1},
                    {xAxis: 3},
                    {xAxis: 5},
                    {xAxis: 7}
                ]
            },
            areaStyle: {},
            data: [
                ['2019-10-10', 200],
                ['2019-10-11', 560],
                ['2019-10-12', 750],
                ['2019-10-13', 580],
                ['2019-10-14', 250],
                ['2019-10-15', 300],
                ['2019-10-16', 450],
                ['2019-10-17', 300],
                ['2019-10-18', 100]
            ]
        }
    ]
  };


  if(myChart === undefined && chartDiv.current !== null){
     myChart = echarts.init(chartDiv.current);
  }

  if(option && myChart) myChart.setOption(option);

  return(
    <div ref={chartDiv} style={{float:'left', width:'50%', height:'100%'}} ></div>
  );
}

export default Chart4;