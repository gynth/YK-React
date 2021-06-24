import React, { Component } from 'react';

import Layout from '../../../Component/Layout/Layout';
import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_getAtt, gfc_getMultiLang } from '../../../Method/Comm';
import { gfs_getStoreValue, gfs_injectAsyncReducer } from '../../../Method/Store';
import { gfo_getInput } from '../../../Method/Component';

class INSP_PROC extends Component {
  constructor(props){
    super(props)
    gfc_initPgm(props.pgm, props.nam, this)
  }

  componentDidMount() {

    const INSP_WAIT_MAIN = (nowState, action) => {

      if(action.reducer !== 'INSP_WAIT_MAIN') {
        return {
          WAIT   : nowState === undefined ? 0 : nowState.WAIT,
          TOTAL  : nowState === undefined ? 0 : nowState.TOTAL,
          WEIGHT : nowState === undefined ? 0 : nowState.WEIGHT
        };
      }

      if(action.type === 'WAIT'){

        return Object.assign({}, nowState, {
          WAIT : action.WAIT
        })
      }if(action.type === 'TOTAL'){

        return Object.assign({}, nowState, {
          TOTAL : action.TOTAL
        })
      }if(action.type === 'WEIGHT'){

        return Object.assign({}, nowState, {
          WEIGHT : action.WEIGHT
        })
      }
    }

    gfs_injectAsyncReducer('INSP_WAIT_MAIN', INSP_WAIT_MAIN);
  }

  Retrieve = () => {
    // const search_car_no = gfo_getInput(this.props.pgm, 'search_car_no').getValue();
    
    console.log(gfs_getStoreValue('INSP_WAIT_MAIN', 'WAIT'));
  }

  render() {
    return (
      <Layout split='vertical'
              defaultSize = {'50%'}>
        <div style={{background:'greenYellow', width:'100%', height:'100%'}}>
          <div style={{background:'#25262B', width:'100%', height:'200', overflow:'auto'}}>
            <div style={{ display:'flex', background:'white', width:'768', height:'50', borderRadius:'5px', margin:'7px 0 0 5px'}}>
              <Input pgm         = {this.props.pgm}
                     id          = 'search_car_no'
                     placeHolder = '                                                                          차량번호 검색'
                     borderWidth = '0'
                     height      = '40'
                     width       = '730'
                     marginTop   = '4px' 
                     outline     = 'none'/>
              
              <img style={{height:'25', marginTop:'11px'}} src={require('../../../Image/search2.png').default} alt='검색'/>
            </div>

            <div style={{display:'flex', marginTop:'20px', width:'770'}}>
              <div style={{background:'#25262B', width: '215', height:'46', borderRadius:'25px', marginLeft:'5px', border:'2px solid #68757D'}}>
                <img style={{height:'24', marginLeft:'5px', marginTop:'10px'}} src={require('../../../Image/yk_car.jpg').default} alt='yk_car'/> 
                <span style={{color:'white', fontSize:'30', margin:'0 0 8px 20px'}}>잔류 : 15</span>
              </div>
              <div style={{background:'#25262B', width: '215', height:'46', borderRadius:'25px', marginLeft:'15px', border:'2px solid #68757D'}}>
                <img style={{height:'24', marginLeft:'5px', marginTop:'10px'}} src={require('../../../Image/yk_car.jpg').default} alt='yk_car'/> 
                <span style={{color:'white', fontSize:'30', margin:'0 0 8px 20px'}}>전체 : 55</span>
              </div>
              <div style={{background:'#25262B', width: '290', height:'46', borderRadius:'25px', marginLeft:'15px', border:'2px solid #68757D'}}>
                <img style={{height:'24', marginLeft:'5px', marginTop:'10px'}} src={require('../../../Image/yk_weight.jpg').default} alt='yk_car'/> 
                <span style={{color:'white', fontSize:'30', margin:'0 0 8px 20px'}}>입고 : 777,440</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{background:'green', width:'100%', height:'100%'}}></div>
      </Layout>
    );
  }
}

export default INSP_PROC;