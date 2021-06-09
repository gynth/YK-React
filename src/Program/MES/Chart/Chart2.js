import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import * as echarts from 'echarts';
import { gfs_dispatch } from '../../../Method/Store';
import { gfc_sleep } from '../../../Method/Comm';

let myChart;
let index = 0;
let data2Org;

async function test() {
  index = 0;

  while(true){
    
    if(data2Org !== undefined && data2Org.length > 0){
      index = index + 1;
      
      gfs_dispatch('PGMTEST2_REDUCER', 'CHART2', 
        ({
          data2  : data2Org.slice(index > 500 ? index - 499 : 0, index )
        })
      );

      if(data2Org.length < index) return;
    }
  
    await gfc_sleep(1000);
  }
};

const Chart2 = (props) => {
  // index = 1;
  const chartDiv = useRef(null);

  data2Org = useSelector((e) => e.PGMTEST2_REDUCER.data2Org, (p , n) => {
    return p.length === n.length
  });

  const data2 = useSelector((e) => e.PGMTEST2_REDUCER.data2);

  if(data2Org.length > 0 && index === 0){
    test()
  }

  const valueList = data2.map(function (item, index) {
    return [index + 1, item.RAWVALUE * 1];
  });

  const option = {
    title: [{
        left: 'center',
        text: '강판 투입 길이'
    }], 
    xAxis: {
        scale: true,
        min:0,
        max:500
    },
    yAxis: {
        scale: true,
        min:0,
        max:1500
    },
    animation: false,
    series: [{
      type: 'effectScatter',
      symbolSize: 20,
      data: [
        valueList[valueList.length - 1]
      ]
    }, {
      type: 'scatter',
      data: valueList,
    }]
  };

  if(myChart === undefined && chartDiv.current !== null){
     myChart = echarts.init(chartDiv.current, 'dark');
  }

  if(option && myChart) myChart.setOption(option);

  return(
    <div ref={chartDiv} style={{float:'left', width:'50%', height:'100%'}} ></div>
  );
}

export default Chart2;