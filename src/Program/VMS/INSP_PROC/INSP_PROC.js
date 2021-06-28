import React, { Component } from 'react';

import Layout from '../../../Component/Layout/Layout';
import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_getAtt, gfc_getMultiLang } from '../../../Method/Comm';
import { gfs_getStoreValue, gfs_injectAsyncReducer, gfs_dispatch } from '../../../Method/Store';
import { gfo_getInput } from '../../../Method/Component';
import { gfg_getGrid, gfg_setSelectRow } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Image as columnImage } from '../../../Component/Grid/Column/Image';
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';
import { DateTime as columnDateTime } from '../../../Component/Grid/Column/DateTime';

import Combobox from '../../../Component/Control/Combobox';

import Mainspan from './Mainspan';
import Botspan from './Botspan';

import GifPlayer from 'react-gif-player';

import { YK_WEB_REQ } from '../../../WebReq/WebReq';

class INSP_PROC extends Component {
  state = {
    wait_list: []
  }

  constructor(props){
    super(props)
    gfc_initPgm(props.pgm, props.nam, this)

    const INSP_PROC_MAIN = (nowState, action) => {

      if(action.reducer !== 'INSP_PROC_MAIN') {
        return {
          MAIN_WAIT   : nowState === undefined ? 0 : nowState.MAIN_WAIT,
          MAIN_TOTAL  : nowState === undefined ? 0 : nowState.MAIN_TOTAL,
          MAIN_WEIGHT : nowState === undefined ? 0 : nowState.MAIN_WEIGHT,
          BOT_TOTAL   : nowState === undefined ? 0 : nowState.BOT_TOTAL,

          DETAIL_SCALE: nowState === undefined ? '' : nowState.DETAIL_SCALE,
          DETAIL_CARNO: nowState === undefined ? '' : nowState.DETAIL_CARNO,
          DETAIL_WEIGHT: nowState === undefined ? '' : nowState.DETAIL_WEIGHT,
          DETAIL_DATE: nowState === undefined ? '' : nowState.DETAIL_DATE
        };
      }

      if(action.type === 'MAIN_WAIT'){

        return Object.assign({}, nowState, {
          MAIN_WAIT : action.MAIN_WAIT
        })
      }if(action.type === 'MAIN_TOTAL'){

        return Object.assign({}, nowState, {
          MAIN_TOTAL : action.MAIN_TOTAL
        })
      }if(action.type === 'MAIN_WEIGHT'){

        return Object.assign({}, nowState, {
          MAIN_WEIGHT : action.MAIN_WEIGHT
        })
      }if(action.type === 'BOT_TOTAL'){

        return Object.assign({}, nowState, {
          BOT_TOTAL : action.BOT_TOTAL
        })
      }if(action.type === 'DETAIL_SCALE'){

        return Object.assign({}, nowState, {
          DETAIL_SCALE : action.DETAIL_SCALE
        })
      }if(action.type === 'DETAIL_CARNO'){

        return Object.assign({}, nowState, {
          DETAIL_CARNO : action.DETAIL_CARNO
        })
      }if(action.type === 'DETAIL_WEIGHT'){

        return Object.assign({}, nowState, {
          DETAIL_WEIGHT : action.DETAIL_WEIGHT
        })
      }if(action.type === 'DETAIL_DATE'){

        return Object.assign({}, nowState, {
          DETAIL_DATE : action.DETAIL_DATE
        })
      }
    }

    gfs_injectAsyncReducer('INSP_PROC_MAIN', INSP_PROC_MAIN);
  }

  Retrieve = async () => {
    // const search_car_no = gfo_getInput(this.props.pgm, 'search_car_no').getValue();
    
    // console.log(gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_WAIT'));

    // YK_WEB_REQ('tally_process_pop.jsp')
    //   .then(e => {
    //     console.log(e);
    //   })

    gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WAIT', {MAIN_WAIT: 1});
    gfs_dispatch('INSP_PROC_MAIN', 'MAIN_TOTAL', {MAIN_TOTAL: 2});
    gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WEIGHT', {MAIN_WEIGHT: 3331333});
    gfs_dispatch('INSP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 15});


    const data = {'dataSend':[
                  {'date':'2021-06-24 13:39:00','vendor':'경원스틸(주)\/ 대경스틸(주)','itemFlag':'M1KDO0001','totalWgt':'43500','scaleNumb':'202106240215','carNumb':'광주88바5884'},
                  {'date':'2021-06-24 13:43:39','vendor':'(주)진광스틸\/ (주)진광스틸','itemFlag':'M1KDO0001','totalWgt':'36960','scaleNumb':'202106240218','carNumb':'경남80사5946'},
                  {'date':'2021-06-24 13:45:05','vendor':'(주)거산\/ (주)거산 동부산 지점','itemFlag':'M1KDO0001','totalWgt':'35020','scaleNumb':'202106240219','carNumb':'81버7666'},
                  {'rec':'1', 'date':'2021-06-24 14:21:42','vendor':'(주)우신\/ 주식회사 우신','itemFlag':'M1KDO0001','totalWgt':'43620','scaleNumb':'202106240230','carNumb':'경북86아4725'},
                  {'date':'2021-06-24 14:26:24','vendor':'(주)진광스틸\/ 금와산업','itemFlag':'M1KDO0002','totalWgt':'43800','scaleNumb':'202106240233','carNumb':'경남82사5143'},
                  {'date':'2021-06-24 14:34:09','vendor':'(주)대지에스텍\/ ㈜대지에스텍','itemFlag':'M1KDO0001','totalWgt':'36240','scaleNumb':'202106240236','carNumb':'경남82사3319'},
                  {'date':'2021-06-24 14:40:18','vendor':'(주)진광스틸\/ (주)진광스틸','itemFlag':'M1KDO0001','totalWgt':'31800','scaleNumb':'202106240241','carNumb':'부산94아3089'},
                  {'date':'2021-06-24 15:15:05','vendor':'(주)와이제이스틸\/ 강한스틸철','itemFlag':'M1KDO0002','totalWgt':'43100','scaleNumb':'202106240248','carNumb':'경북83아8533'},
                  {'date':'2021-06-24 15:42:51','vendor':'(주)와이제이스틸\/ 강한스틸철','itemFlag':'M1KDO0001','totalWgt':'43320','scaleNumb':'202106240255','carNumb':'경북82아8342'},
                  {'rec':'1','date':'2021-06-24 15:49:33','vendor':'(주)대지에스텍\/ ㈜대지에스텍','itemFlag':'M1KDO0001','totalWgt':'44040','scaleNumb':'202106240257','carNumb':'부산92아7287'}
                ]
              }['dataSend'];

    const sort = [];
    data.forEach(e => {
      if(e.rec === '1'){
        sort.unshift(e);
      }else{
        sort.push(e);
      }
    })

    const grid = gfg_getGrid(this.props.pgm, 'main10');
    grid.resetData(
      sort
    );
    gfg_setSelectRow(grid);
  }


  onSelectChange = (e) => {
    if(e === null) return;

    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: e.scaleNumb});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: e.carNumb});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: e.totalWgt});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: e.date});
  }

  render() {
    return (
      <Layout split='vertical'
              defaultSize = {'780'}>
        <div style={{width:'calc(100% - 2px)', height:'100%'}}>
          <div style={{background:'#25262B', width:'100%', height:'145', overflow:'auto'}}>
            <div style={{ display:'flex', background:'white', width:'768', height:'50', borderRadius:'7px', margin:'7px 0 0 5px'}}>
              <Input pgm         = {this.props.pgm}
                     id          = 'search_car_no'
                     placeHolder = '                                차량번호 검색'
                     borderWidth = '0'
                     height      = '40'
                     width       = '730'
                     marginTop   = '4px' 
                     outline     = 'none'
                     fontSize    = {30}/>
            </div>

            <div style={{display:'flex', marginTop:'20px', width:'770'}}>
              <div style={{background:'#25262B', width: '215', height:'46', borderRadius:'25px', marginLeft:'5px', border:'2px solid #68757D'}}>
                <img style={{height:'24', marginLeft:'12px', marginTop:'10px'}} src={require('../../../Image/yk_car.jpg').default} alt='yk_car'/> 
                <Mainspan flag={1} />
              </div>
              <div style={{background:'#25262B', width: '215', height:'46', borderRadius:'25px', marginLeft:'15px', border:'2px solid #68757D'}}>
                <img style={{height:'24', marginLeft:'12px', marginTop:'10px'}} src={require('../../../Image/yk_car.jpg').default} alt='yk_car'/> 
                <Mainspan flag={2} />
              </div>
              <div style={{background:'#25262B', width: '290', height:'46', borderRadius:'25px', marginLeft:'15px', border:'2px solid #68757D'}}>
                <img style={{height:'24', marginLeft:'12px', marginTop:'10px'}} src={require('../../../Image/yk_weight.jpg').default} alt='yk_weight'/> 
                <Mainspan flag={3} />
              </div>
            </div>
          </div>

          <div style={{width:'100%', height:'calc(100% - 190px)', overflow:'auto'}}>
            <Grid pgm={this.props.pgm}
                  id='main10'
                  selectionChange={(e) => this.onSelectChange(e)}
                  columns={[
                    columnInput({
                      name: 'scaleNumb',
                      header: '배차번호',
                      width : 105,
                      readOnly: true,
                      color : 'red',
                      align : 'center'
                    }),
                    columnCombobox({
                      name: 'itemFlag', 
                      header: '구분',
                      readOnly: true,
                      width   : 75,
                      data: [{
                        'code': 'M1KDO0001',
                        'name': '고철'
                      },{
                        'code': 'M1KDO0002',
                        'name': '분철'
                      }],
                      editor: {
                        value   : 'code',
                        display : 'name'
                      }
                    }),
                    columnInput({
                      name: 'carNumb',
                      header: '차량번호',
                      width : 110,
                      readOnly: true,
                      align : 'center'
                    }),   
                    columnDateTime({
                      name  : 'date',
                      header: '입차시간',
                      width : 130,
                      readOnly: true,
                      format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT'),
                      time  : 'HH:mm'
                    }),
                    columnInput({
                      name: 'vendor',
                      header: 'Vendor',
                      width : 190,
                      readOnly: true,
                      align : 'left'
                    }),
                    columnImage({
                      name: 'rec',
                      header: '녹화중',
                      width: 90,
                      imgItem:[
                        {'code':'0', 'value': ''},
                        {'code':'1', 'value': <GifPlayer height='34' width='100' gif={require('../../../Image/yk_rec.gif').default} autoplay/>}
                      ]
                    })
                  ]}
            />
          </div>
          
          {/* <div style={{background:'#D6DEE0', position:'absolute', float:'left', left:0, bottom:0, width:'calc(100% - 2px)', height:'45'}}> */}
          
          <div style={{background:'#D6DEE0',width:'100%', height:'45'}}>
            <img style={{height:'35', float:'left', marginLeft:'12px', margin:'7px 0 0 10px'}} src={require('../../../Image/yk_exclamation.jpg').default} alt='yk_exclamation'/> 
            <div style={{fontSize:'25', float:'left', height:'40', margin:'5px 0 8px 5px'}}>잔여차량</div>
            <Botspan />
          </div>
        </div>

        <div style={{width:'calc(100% - 2px)', height:'100%'}}>
          <div style={{background:'#25262B', width:'100%', height:'145', overflow:'auto'}}>

            <div style={{display:'flex', marginTop:'20px', width:'770'}}>
              <div style={{width:'270', marginLeft: '30px'}}>
                <Mainspan flag={5} fontSize={30}/>
              </div>
              <div style={{background:'#25262B', width: '155', height:'46', borderRadius:'25px', marginLeft:'5px', border:'2px solid #68757D'}}>
                <img style={{float:'left', height:'24', marginLeft:'12px', marginTop:'10px'}} src={require('../../../Image/yk_car.jpg').default} alt='yk_car'/> 
                <div style={{float:'left', color:'white', textAlign:'center', fontSize:'25', marginLeft:'10px', marginTop:'3px'}}>차량번호</div>

                <div style={{height:'50', width:'155', marginLeft:'160px', padding:'5px 0 0 10px'}}>
                  <Mainspan flag={6} fontSize={'25'} margin='0 0 0 0'/>
                </div>
              </div>
            </div>

            <div style={{display:'flex', marginTop:'5px', width:'770'}}>
              <div style={{background:'#25262B', width: '155', height:'46', borderRadius:'25px', marginLeft:'15px', border:'2px solid #68757D'}}>
                <img style={{float:'left', height:'24', marginLeft:'12px', marginTop:'10px'}} src={require('../../../Image/yk_04.png').default} alt='yk_04'/> 
                <div style={{float:'left', color:'white', textAlign:'center', fontSize:'25', marginLeft:'10px', marginTop:'3px'}}>총중량</div>

                <div style={{height:'50', width:'155', marginLeft:'160px', padding:'5px 0 0 10px'}}>
                  <Mainspan flag={7} fontSize={'25'} margin='0 0 0 0'/>
                </div>
              </div>
              <div style={{background:'#25262B', width: '155', height:'46', borderRadius:'25px', marginLeft:'130px', border:'2px solid #68757D'}}>
                <img style={{float:'left', height:'24', marginLeft:'12px', marginTop:'10px'}} src={require('../../../Image/yk_05.png').default} alt='yk_05'/> 
                <div style={{float:'left', color:'white', textAlign:'center', fontSize:'25', marginLeft:'10px', marginTop:'3px'}}>입차시간</div>

                <div style={{height:'50', width:'300', marginLeft:'160px', padding:'5px 0 0 10px'}}>
                  <Mainspan flag={8} fontSize={'25'} margin='0 0 0 0'/>
                </div>
              </div>
            </div>
          </div>

          <div style={{width:'100%', height:'calc(100% - 400px)'}}>
            <div style={{float:'left', width: '50%', height:'100%'}}>
              <img style={{height:'100%', width:'100%'}} src={require('../../../Image/yk_exclamation.jpg').default} alt='yk_exclamation'/> 
            </div>
            <div style={{float:'left', width:'50%', height:'100%'}}>
              <img style={{height:'100%', width:'100%'}} src={require('../../../Image/yk_05.png').default} alt='yk_05'/> 
            </div>
          </div>

          <div style={{width:'100%', height:'255'}}>
            <div style={{width:'100%', height:'25%', background:'red'}}>

            </div>
            <div style={{width:'100%', height:'25%', background:'green'}}>

            </div>
            <div style={{width:'100%', height:'25%', background:'blue'}}>

            </div>
            <div style={{width:'100%', height:'25%', background:'purple'}}>

            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default INSP_PROC;