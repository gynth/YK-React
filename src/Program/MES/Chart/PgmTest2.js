// import Basic from './Basic';
// import Test from './test';
// import { useSelector } from 'react-redux';
import React, { Component } from 'react';
import { getCallSP_Mysql } from '../../../db/Mysql/Mysql';
import { injectAsyncReducer } from '../../../Store/Store';
import { gfs_dispatch } from '../../../Method/Store';

import Chart1 from './Chart1';
import Chart2 from './Chart2';
import Chart3 from './Chart3';
import Chart4 from './Chart4';

class PgmTest2 extends Component{
  constructor(props){
    super(props)
    // gf_initPgm(props.pgm, props.nam, this)


    const PgmTest2Reducer = (nowState, action) => {

      if(action.reducer !== 'PGMTEST2_REDUCER') {
        return {
          data1   : nowState === undefined ? [] : nowState.data1,
          data1Org: nowState === undefined ? [] : nowState.data1Org,
          data2Org: nowState === undefined ? [] : nowState.data2Org,
          data2   : nowState === undefined ? [] : nowState.data2,
          data3Org: nowState === undefined ? [] : nowState.data3Org,
          data3   : nowState === undefined ? [] : nowState.data3,
          data4Org: nowState === undefined ? [] : nowState.data4Org,
          data4   : nowState === undefined ? [] : nowState.data4
        };
      }

      if(action.type === 'INITDATA1'){
    
        return Object.assign({}, nowState, {
          data1Org: action.data1Org,
          data1   : nowState.data1,
          data2Org: nowState.data2Org,
          data2   : nowState.data2,
          data3Org: nowState.data3Org,
          data3   : nowState.data3,
          data4Org: nowState.data4Org,
          data4   : nowState.data4
        })
      }else if(action.type === 'INITDATA2'){
        
        return Object.assign({}, nowState, {
          data1Org: nowState.data1Org,
          data1   : nowState.data1,
          data2Org: action.data2Org,
          data2   : nowState.data2,
          data3Org: nowState.data3Org,
          data3   : nowState.data3,
          data4Org: nowState.data4Org,
          data4   : nowState.data4
        })
      }else if(action.type === 'INITDATA3'){
        
        return Object.assign({}, nowState, {
          data1Org: nowState.data1Org,
          data1   : nowState.data1,
          data2Org: nowState.data2Org,
          data2   : nowState.data2,
          data3Org: action.data3Org,
          data3   : nowState.data3,
          data4Org: nowState.data4Org,
          data4   : nowState.data4
        })
      }else if(action.type === 'INITDATA4'){
        
        return Object.assign({}, nowState, {
          data1Org: nowState.data1Org,
          data1   : nowState.data1,
          data2Org: nowState.data2Org,
          data2   : nowState.data2,
          data3Org: nowState.data3Org,
          data3   : nowState.data3,
          data4Org: action.data4Org,
          data4   : nowState.data4
        })
      }else if(action.type === 'CHART1'){
        
        return Object.assign({}, nowState, {
          data1Org: nowState.data1Org,
          data1   : action.data1,
          data2Org: nowState.data2Org,
          data2   : nowState.data2,
          data3Org: nowState.data3Org,
          data3   : nowState.data3
        })
      }else if(action.type === 'CHART2'){
        
        return Object.assign({}, nowState, {
          data1Org: nowState.data1Org,
          data1   : nowState.data1,
          data2Org: nowState.data2Org,
          data2   : action.data2,
          data3Org: nowState.data3Org,
          data3   : nowState.data3
        })
      }else if(action.type === 'CHART3'){
        
        return Object.assign({}, nowState, {
          data1Org: nowState.data1Org,
          data1   : nowState.data1,
          data2Org: nowState.data2Org,
          data2   : nowState.data2,
          data3Org: nowState.data3Org,
          data3   : action.data3
        })
      }
    };

    injectAsyncReducer('PGMTEST2_REDUCER', PgmTest2Reducer);
  }

  Retrieve = () => {

    getCallSP_Mysql(
      [{SP         : 'SP_ED000_TEST2',
        ROWSTATUS  : 'R1'
      }]
    ).then(
      e => {
        
        gfs_dispatch('PGMTEST2_REDUCER', 'INITDATA1', 
          ({
            data1Org: e.data.data
          })
        );
      }
    )

    getCallSP_Mysql(
      [{SP         : 'SP_ED000_TEST2',
        ROWSTATUS  : 'R2'
      }]
    ).then(
      e => {
        gfs_dispatch('PGMTEST2_REDUCER', 'INITDATA2', 
          ({
            data2Org: e.data.data
          })
        );
      }
    )

    getCallSP_Mysql(
      [{SP         : 'SP_ED000_TEST2',
        ROWSTATUS  : 'R3'
      }]
    ).then(
      e => {
        gfs_dispatch('PGMTEST2_REDUCER', 'INITDATA3', 
          ({
            data3Org: e.data.data
          })
        );
      }
    )

    getCallSP_Mysql(
      [{SP         : 'SP_ED000_TEST2',
        ROWSTATUS  : 'R4'
      }]
    ).then(
      e => {
        gfs_dispatch('PGMTEST2_REDUCER', 'INITDATA4', 
          ({
            data4Org: 
                    [['2019-10-10', 200],
                    ['2019-10-11', 560],
                    ['2019-10-12', 750],
                    ['2019-10-13', 580],
                    ['2019-10-14', 250],
                    ['2019-10-15', 300],
                    ['2019-10-16', 450],
                    ['2019-10-17', 300],
                    ['2019-10-18', 100]]
          })
        );
      }
    )

    /* 김경현
    getDynamicSql_Mysql(
      'Common/Common.js',
      'CHART',
      [{name: '2CRM_NEW_S7CP_001.2CR_IBA_DB1030_REAL92'}]
    ).then(
      e => {
        gfs_dispatch('PGMTEST2_REDUCER', 'INITDATA1', 
          ({
            data1Org: e.data
          })
        );
      }
    )

    getDynamicSql_Mysql(
      'Common/Common.js',
      'CHART',
      [{name: '2CRM_NEW_S7CP_003.2CR_IBA_DB230_REAL32'}]
    ).then(
      e => {
        gfs_dispatch('PGMTEST2_REDUCER', 'INITDATA2', 
          ({
            data2Org: e.data
          })
        );
      }
    )

    getDynamicSql_Mysql(
      'Common/Common.js',
      'CHART',
      [{name: '2CRM_NEW_S7CP_001.2CR_IBA_DB500_REAL184'}]
    ).then(
      e => {
        gfs_dispatch('PGMTEST2_REDUCER', 'INITDATA3', 
          ({
            data3Org: e.data
          })
        );
      }
    )
    */
  }

  componentDidMount(){
    this.Retrieve();
  }

  render(){
    return (
      <>
        <div style={{width:'100%', height:'50%'}}>
          <Chart1 />
          <Chart2 />
        </div>
        <div style={{width:'100%', height:'50%'}}>
          <Chart3 />
          <Chart4 />
        </div>
      </>
    );
  }
}

export default PgmTest2;
