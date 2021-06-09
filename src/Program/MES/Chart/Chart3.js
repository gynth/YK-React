import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import * as echarts from 'echarts';
import { gfs_dispatch } from '../../../Method/Store';
import { gfc_sleep } from '../../../Method/Comm';

let myChart;
let index = 0;
let data3Org;

async function test() {
  index = 0;

  while(true){
    
    if(data3Org !== undefined && data3Org.length > 0){
      index = index + 1;

      gfs_dispatch('PGMTEST2_REDUCER', 'CHART3', 
        ({
          data3  : data3Org.slice(0, index )
        })
      );

      if(data3Org.length < index) return;
    }
  
    await gfc_sleep(1000);
  }
};

const Chart3 = (props) => {
  // index = 1;
  const chartDiv = useRef(null);
  
  data3Org = useSelector((e) => e.PGMTEST2_REDUCER.data3Org, (p , n) => {
    return p.length === n.length
  });

  const data3 = useSelector((e) => e.PGMTEST2_REDUCER.data3);

  if(data3Org.length > 0 && index === 0){
    test()
  }

  const valueList = data3.map(function (item) {
    return [item.VALUE, item.RAWVALUE];
  });

  const option = {
    title: {
        left: 'center',
        // text: echarts.format.addCommas(Math.round(rawData.length / 2)) + ' Points',
        text: 'bending OS servovalve  전류값 ' + valueList.length + ' Points'
    },
    tooltip: {},
    toolbox: {
        right: 20,
        feature: {
            dataZoom: {}
        }
    },
    grid: {
        right: 70,
        bottom: 70
    },
    xAxis: [{
      min: -50,
      max: 50
    }],
    yAxis: [{
      min: -50,
      max: 50
    }],
    dataZoom: [{
        type: 'inside'
    }, {
        type: 'slider',
        showDataShadow: false,
        // handleIcon: 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%'
    }, {
        type: 'inside',
        orient: 'vertical'
    }, {
        type: 'slider',
        orient: 'vertical',
        showDataShadow: false,
        // handleIcon: 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%'
    }],
    // animation: false,
    series: [{
        type: 'scatter',
        data: valueList,
        dimensions: ['x', 'y'],
        symbolSize: 5,
        itemStyle: {
            opacity: 0.4
        },
        blendMode: 'source-over',
        large: true,
        largeThreshold: 500
    },{
      type: 'effectScatter',
      symbolSize: 10,
      data: [
        valueList[valueList.length - 1]
      ]
    }]
  };

  if(myChart === undefined && chartDiv.current !== null){
     myChart = echarts.init(chartDiv.current);
  }

  if(option && myChart) myChart.setOption(option);

  return(
    <div ref={chartDiv} style={{float:'left', width:'50%', height:'100%'}} ></div>
  );
}

export default Chart3;