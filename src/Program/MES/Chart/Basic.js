import React from 'react';
import { Component } from 'react';
import * as echarts from 'echarts';

let myChart;

class Basic extends Component {
  // constructor(props){
  //   super(props);
  // }

  // componentDidMount() {
  //   echarts.init(this.chartDiv);
  // }

  componentDidUpdate(props){

    if(myChart === undefined) myChart = echarts.init(this.chartDiv);

    // let option = {
    //     xAxis: {
    //         type: 'category',
    //         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    //     },
    //     yAxis: {
    //         type: 'value'
    //     },
    //     series: [{
    //         data: [150, 230, 224, 218, 135, 147, 270],
    //         type: 'line'
    //     }]
    // };
    
    this.props.option && myChart.setOption(this.props.option, false);
  }

  render() {

    return(
      <div ref={(ref) => this.chartDiv=ref} style={{width:'100%', height:'100%'}} />
    );
  }
}

export default Basic;