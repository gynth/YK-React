import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import * as echarts from 'echarts';
import { gfc_sleep } from '../../../Method/Comm';
import { gfs_dispatch } from '../../../Method/Store';
let myChart;
let index = 0;
let data1Org;

let data1Data = [];
let data2Data = [];
let data3Data = [];
let data4Data = [];

async function test() {
  index = 0;

  while(true){
    
    if(data1Org !== undefined && data1Org.length > 0){
      index = index + 1;

      if(index >= 50){
        data1Data.shift();
        data2Data.shift();
        data3Data.shift();
        data4Data.shift();
      }

      data1Data.push(data1Org[index].VALUE1 * 1)
      data2Data.push(data1Org[index].VALUE2 * 1)
      data3Data.push(data1Org[index].VALUE3 * 1)
      data4Data.push(data1Org[index].VALUE4 * 1)
      
      gfs_dispatch('PGMTEST2_REDUCER', 'CHART1', 
        ({
          data1  : [data1Data, data2Data, data3Data, data4Data]
        })
      );

      if(data1Org.length < index) return;
    }
  
    await gfc_sleep(1000);
  }
};

let xValue = [];
const Chart1 = (props) => {
  // index = 1;
  const chartDiv = useRef(null);

  data1Org = useSelector((e) => e.PGMTEST2_REDUCER.data1Org, (p , n) => {
    return p.length === n.length
  });

  const data1 = useSelector((e) => e.PGMTEST2_REDUCER.data1);

  if(data1Org.length > 0 && index === 0){
    test()

    for (let step = 1; step <= 50; step++) {
      xValue.push(step)
    }
  }


  const valueList1 = data1[0];
  const valueList2 = data1[1];
  const valueList3 = data1[2];
  const valueList4 = data1[3];
  // const valueList2 = data1.map(function (item, index) {
  //   return [index + 1, item.VALUE2 * 1];
  // });
  // const valueList3 = data1.map(function (item, index) {
  //   return [index + 1, item.VALUE3 * 1];
  // });
  // const valueList4 = data1.map(function (item, index) {
  //   return [index + 1, item.VALUE4 * 1];
  // });

  const option = {
    title: {
      text: '테스트차트'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['VALUE1', 'VALUE2', 'VALUE3', 'VALUE4']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xValue
    },
    yAxis: {
        type: 'value',
        min:0,
        max:100
    },
    animation: false,
    series: [
        {
            name: 'VALUE1',
            type: 'line',
            data: valueList1
        },
        {
            name: 'VALUE2',
            type: 'line',
            data: valueList2
        },
        {
            name: 'VALUE3',
            type: 'line',
            data: valueList3
        },
        {
            name: 'VALUE4',
            type: 'line',
            data: valueList4
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

export default Chart1;