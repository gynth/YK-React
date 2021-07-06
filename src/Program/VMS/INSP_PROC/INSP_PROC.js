import React, { Component } from 'react';

import Layout from '../../../Component/Layout/Layout';
import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_showMask, gfc_hideMask } from '../../../Method/Comm';
import { gfs_getStoreValue, gfs_injectAsyncReducer, gfs_dispatch } from '../../../Method/Store';
import { gfo_getInput, gfo_getCombo } from '../../../Method/Component';
import { gfg_getGrid, gfg_setSelectRow } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Image as columnImage } from '../../../Component/Grid/Column/Image';
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';
import { DateTime as columnDateTime } from '../../../Component/Grid/Column/DateTime';
import { TextArea as columnTextArea } from '../../../Component/Grid/Column/TextArea';

import Combobox from '../../../Component/Control/Combobox';

import Mainspan from './Mainspan';
import Botspan from './Botspan';
import RecImage from './RecImage';

import GifPlayer from 'react-gif-player';
import { Timer } from 'timer-node';

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
          MAIN_WAIT    : nowState === undefined ? 0 : nowState.MAIN_WAIT,
          MAIN_TOTAL   : nowState === undefined ? 0 : nowState.MAIN_TOTAL,
          MAIN_WEIGHT  : nowState === undefined ? 0 : nowState.MAIN_WEIGHT,
          BOT_TOTAL    : nowState === undefined ? 0 : nowState.BOT_TOTAL,
 
          DETAIL_SCALE : nowState === undefined ? '' : nowState.DETAIL_SCALE,
          DETAIL_CARNO : nowState === undefined ? '' : nowState.DETAIL_CARNO,
          DETAIL_WEIGHT: nowState === undefined ? '' : nowState.DETAIL_WEIGHT,
          DETAIL_DATE  : nowState === undefined ? '' : nowState.DETAIL_DATE,

          STD_CAM_OPEN : nowState === undefined ? false : nowState.STD_CAM_OPEN,
          DUM_CAM_OPEN : nowState === undefined ? false : nowState.DUM_CAM_OPEN,

          STD_CAM_FOCUS: nowState === undefined ? false : nowState.STD_CAM_FOCUS,
          DUM_CAM_FOCUS: nowState === undefined ? false : nowState.DUM_CAM_FOCUS,

          STD_CAM_REC  : nowState === undefined ? {
                                                    rec     : false,
                                                    car     : '',
                                                    time    : '00:00',
                                                    timer   : new Timer(),
                                                    interval: undefined
                                                  } : nowState.STD_CAM_REC,
          DUM_CAM_REC  : nowState === undefined ? {
                                                    rec     : false,
                                                    car     : '',
                                                    time    : '00:00',
                                                    timer   : new Timer(),
                                                    interval: undefined
                                                  } : nowState.DUM_CAM_REC
        };
      }

      if(action.type === 'MAIN_WAIT'){

        return Object.assign({}, nowState, {
          MAIN_WAIT : action.MAIN_WAIT
        })
      }else if(action.type === 'MAIN_TOTAL'){

        return Object.assign({}, nowState, {
          MAIN_TOTAL : action.MAIN_TOTAL
        })
      }else if(action.type === 'MAIN_WEIGHT'){

        return Object.assign({}, nowState, {
          MAIN_WEIGHT : action.MAIN_WEIGHT
        })
      }else if(action.type === 'BOT_TOTAL'){

        return Object.assign({}, nowState, {
          BOT_TOTAL : action.BOT_TOTAL
        })
      }else if(action.type === 'DETAIL_SCALE'){

        return Object.assign({}, nowState, {
          DETAIL_SCALE : action.DETAIL_SCALE
        })
      }else if(action.type === 'DETAIL_CARNO'){

        return Object.assign({}, nowState, {
          DETAIL_CARNO : action.DETAIL_CARNO
        })
      }else if(action.type === 'DETAIL_WEIGHT'){

        return Object.assign({}, nowState, {
          DETAIL_WEIGHT : action.DETAIL_WEIGHT
        })
      }else if(action.type === 'DETAIL_DATE'){

        return Object.assign({}, nowState, {
          DETAIL_DATE : action.DETAIL_DATE
        })
      }else if(action.type === 'STD_CAM_OPEN'){

        return Object.assign({}, nowState, {
          STD_CAM_OPEN : action.STD_CAM_OPEN
        })
      }else if(action.type === 'DUM_CAM_OPEN'){

        return Object.assign({}, nowState, {
          DUM_CAM_OPEN : action.DUM_CAM_OPEN
        })
      }else if(action.type === 'STD_CAM_FOCUS'){

        return Object.assign({}, nowState, {
          STD_CAM_FOCUS : action.STD_CAM_FOCUS
        })
      }else if(action.type === 'DUM_CAM_FOCUS'){

        return Object.assign({}, nowState, {
          DUM_CAM_FOCUS : action.DUM_CAM_FOCUS
        })
      }else if(action.type === 'STD_CAM_REC'){

        return Object.assign({}, nowState, {
          STD_CAM_REC : {rec  : action.rec,
                         car  : action.car,
                         time : nowState.STD_CAM_REC.time,
                         timer: nowState.STD_CAM_REC.timer}
        })
      }else if(action.type === 'DUM_CAM_REC'){

        return Object.assign({}, nowState, {
          DUM_CAM_REC : {rec  : action.rec,
                         car  : action.car,
                         time : nowState.DUM_CAM_REC.time,
                         timer: nowState.DUM_CAM_REC.timer}
        })
      }else if(action.type === 'STD_CAM_REC_TIME'){

        return Object.assign({}, nowState, {
          STD_CAM_REC : {rec     : nowState.STD_CAM_REC.rec,
                         car     : action.car,
                         time    : action.time,
                         timer   : nowState.STD_CAM_REC.timer,
                         interval: action.interval}
        })
      }else if(action.type === 'DUM_CAM_REC_TIME'){

        return Object.assign({}, nowState, {
          DUM_CAM_REC : {rec     : nowState.DUM_CAM_REC.rec,
                         car     : action.car,
                         time    : action.time,
                         timer   : nowState.DUM_CAM_REC.timer,
                         interval: action.interval}
        })
      }
    }

    gfs_injectAsyncReducer('INSP_PROC_MAIN', INSP_PROC_MAIN);
  }

  Retrieve = async () => {
    // const search_car_no = gfo_getInput(this.props.pgm, 'search_car_no').getValue();
    
    // console.log(gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_WAIT'));

    gfc_showMask();

    let req = await YK_WEB_REQ('tally_process_pop.jsp?division=P005');
    // console.log(req);

    // gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WAIT', {MAIN_WAIT: 1});
    // gfs_dispatch('INSP_PROC_MAIN', 'MAIN_TOTAL', {MAIN_TOTAL: 2});
    // gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WEIGHT', {MAIN_WEIGHT: 3331333});

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
                  {'rec':'1','date':'2021-06-24 15:49:33','vendor':'(주)대지에스텍\/ ㈜대지에스텍','itemFlag':'M1KDO0001','totalWgt':'44040','scaleNumb':'202106240257','carNumb':'부산92아7287'

                  ,
                  _attributes: {
                    checked: true, // A checkbox is already checked while rendering
                    className: {
                      // Add class name on a row
                      row: ['red']
                    }
                  }
                }
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
    // gfg_setSelectRow(grid);

    // gfs_dispatch('INSP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: sort.length});

    gfc_hideMask();
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
      <div className='win_body' style={{borderRadius:'0px', borderWidth:'0px 1px 0px 1px'}}>
        <div className='car_manager'>
          <div className='car_list'>
            <div className='search_line'>
              <div className='wp'>
                <div style={{position:'absolute', left:0, top:0, width:'124px', height:'42px', fontSize:'16px'}}>
                  <Combobox pgm     = {this.props.pgm}
                            id      = 'search_tp'
                            value   = 'code'
                            display = 'name'
                            width   = {124}
                            height  = {42}
                            emptyRow
                            data    = {[{
                              code: '1',
                              name: '배차번호'
                            },{
                              code: '2',
                              name: '차량번호'
                            },{
                              code: '3',
                              name: '등급'
                            },{
                              code: '4',
                              name: '업체'
                            }]}
                  />
                </div>
                <Input pgm         = {this.props.pgm}
                       id          = 'search_txt'
                       height      = '42'
                       placeHolder = '검색어를 입력하세요'
                       paddingLeft = '14'
                       width       = '100%'
                       type        = 'textarea'
                      //  padding-bottom:2px; padding-left:14px; border:none; font-size:22px;
                        />
                <button>검색</button>
              </div>
            </div>
            <div className='grid'>
              <div className='wp'>
                <div style={{width:'100%', height:'100%', overflow:'auto'}}>
                  <Grid pgm={this.props.pgm}
                        id ='main10'
                        selectionChange={(e) => this.onSelectChange(e)}
                        rowHeight={45}
                        columns={[
                          columnInput({
                            name: 'scaleNumb',
                            header: '배차번호',
                            width : 140,
                            readOnly: true,
                            color : '#0063A9',
                            align : 'center',
                            fontSize: '18'
                          }),
                          columnInput({
                            name: 'carNumb',
                            header: '차량번호',
                            width : 130,
                            readOnly: true,
                            align : 'center',
                            fontSize: '18'
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
                          columnTextArea({
                            name  : 'date',
                            header: '입차시간',
                            width : 130,
                            readOnly: true,
                            valign:'middle',
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
                              {'code':'1', 'value': <GifPlayer height='30' width='100' gif={require('../../../Image/yk_rec01.gif').default} autoplay/>}
                            ]
                          })
                        ]}
                  />
                </div>
              </div>
              <div className='grid_info'>
                <span className='title'>잔여차량</span><span className='value'>10</span>
              </div>
            </div>
            <div className='total_info'>
              <ul>
                <li><span className='title'>잔류 차량</span><span className='value'>10</span></li>
                <li><span className='title'>전체 검수 차량</span><span className='value'>55</span></li>
                <li><span className='title'>입고량(KG)</span><span className='value'>777,440</span></li>
              </ul>
            </div>
          </div>
          <div className='car_info'>
            <div className='title'><span>배차번호</span>202106170007</div>
            <div className='detail'>
              <ul>
                <li><span className='t'>차량번호</span>부산92아7287</li>
                <li><span className='t'>총중량(KG)</span>44,800</li>
                <li><span className='t'>입차시간</span>2021-06-17 06:08:21</li>
              </ul>
            </div>
            <div className='detail2'>
              <ul>
                <li>
                  <h5>등급책정</h5>
                  <select>
                    <option>고철등급 검색</option>
                  </select>
                  <input type='text' />
                </li>
                <li>
                  <h5>감량중량</h5>
                  <select>
                    <option>감량중량 검색(KG)</option>
                  </select>
                </li>
                <li>
                  <h5>감가내역</h5>
                  <select>
                    <option>감가내역 검색</option>
                  </select>
                </li>
                <li>
                  <h5>하차구역</h5>
                  <select>
                    <option>하차구역 검색(SECTOR)</option>
                  </select>
                </li>
                <li>
                  <h5>차종구분</h5>
                  <select>
                    <option>차종 선택</option>
                  </select>
                </li>
                <li>
                  <h5>반품구분</h5>
                  <select>
                    <option>일부,전량 선택</option>
                  </select>
                </li>
              </ul>
            </div>
            <div className='complete_btn'>
              <button type='button'><span>등록완료</span></button>
            </div>
          </div>
          <div className='cctv_viewer'>
            <h4>실시간 CCTV</h4>
            <div className='cctv_list'>
              <div className='cctv'>
                <div className='viewer'>
                  {/* 뷰어 공간 */}
                </div>
                <div className='controller'>
                  <button type='' className='left'>왼쪽</button>
                  <button type='' className='top'>위쪽</button>
                  <button type='' className='down'>아래</button>
                  <button type='' className='right'>오른쪽</button>
                  <span className='sep'>
                    <button type='' className='plus'>확대</button>
                    <button type='' className='minus'>축소</button>
                  </span>
                </div>
              </div>
              <div className='cctv'>
                <div className='viewer'>
                  {/* 뷰어 공간 */}
                </div>
                <div className='controller'>
                  <button type='' className='left'>왼쪽</button>
                  <button type='' className='top'>위쪽</button>
                  <button type='' className='down'>아래</button>
                  <button type='' className='right'>오른쪽</button>
                  <span className='sep'>
                    <button type='' className='plus'>확대</button>
                    <button type='' className='minus'>축소</button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='search_line'>
          <div className='line first'>
            <label>기준년도</label><input type='text' /><input type='text' />
            <label>거래처</label><input type='text' />
            <label>아이템</label><input type='text' />
          </div>
          <div className='line'>
            <label>기준년도</label><input type='text' /><input type='text' />
            <label>거래처</label><input type='text' />
            <label>아이템</label><input type='text' />
          </div>
        </div>
        <div className='detail_box'>
          <h5><span className='bu'></span><span className='text'>상세정보</span></h5>
          <table className='data_table'>
            <tbody>
              <tr>
                <th>상세입력란</th>
                <td><input type='text' /></td>
              </tr>
              <tr>
                <th>상세입력란</th>
                <td><textarea></textarea></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default INSP_PROC;