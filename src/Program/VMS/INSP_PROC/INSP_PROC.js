import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_showMask, gfc_hideMask, gfc_addClass, gfc_removeClass, gfc_hasClass, gfc_test } from '../../../Method/Comm';
import { gfs_getStoreValue, gfs_injectAsyncReducer, gfs_dispatch, gfs_subscribe } from '../../../Method/Store';
import { gfo_getInput, gfo_getCombo } from '../../../Method/Component';
import { gfg_getGrid, gfg_setSelectRow } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Image as columnImage } from '../../../Component/Grid/Column/Image';
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';
import { TextArea as columnTextArea } from '../../../Component/Grid/Column/TextArea';

import Combobox from '../../../Component/Control/Combobox';

import Mainspan from './Mainspan';
import Detailspan from './Detailspan';
import Botspan from './Botspan';
import RecImage from './RecImage';

import GifPlayer from 'react-gif-player';
import { Timer } from 'timer-node';

import { YK_WEB_REQ } from '../../../WebReq/WebReq';
import { TOKEN, MILESTONE } from '../../../WebReq/WebReq';
import { throttle } from 'lodash';

class INSP_PROC extends Component {

  milestoneInfo = async() => {

    // 선택된 공정의 카메라를 찾아서 스트리밍 받는다
    // 지금은 하드코딩 되어있지만 나중엔 로컬스토리지와 콤보박스를 써서 선택된 공정의 아이피를 가지고 카메라를 가져온다.
    // 1. 선택된 공정의 카메라 정보를 가지고온다.
    // const milestone = TOKEN({reqAddr: 'LOGIN', MilestoneIP: gfs_getStoreValue('CAMERA_REDUCER', 'MilestoneIP')});
    const milestone = await TOKEN({});
    this.token  = milestone.data.TOKEN;
    this.device = milestone.data.DEVICE;
    if(this.token === ''){
      alert('마일스톤 서버에 접속할 수 없습니다.'); 
    }else if(this.device === ''){
      alert('마일스톤 서버에 접속할 수 없습니다.');
    }
  }

  onActiveWindow = () => {
    const activeWindow = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'activeWindow');
    if(activeWindow.programId === 'INSP_PROC'){
      if(window.onkeydown === null){
        window.onkeydown = e => this.onKeyDown(e);
        window.onmousewheel = e => this.onMouseWheel(e);
      }
    }else{
      if(window.onkeydown !== null){
        window.onkeydown = null;
        window.onmousewheel = null;
      }
    }
  }

  state = {
    wait_list: []
  }

  debounceKeyDown = throttle((e, device) => {
    let ptz = '';
    if(e.keyCode === 37) ptz = 'left';
    else if(e.keyCode === 38) ptz = 'up';
    else if(e.keyCode === 39) ptz = 'right';
    else if(e.keyCode === 40) ptz = 'down';

    if(ptz !== ''){
      MILESTONE({reqAddr: 'PTZ',
      device: device.Guid,
      ptz})
    }
  }, 1000);

  debounceMouseWheel = throttle((e, device) => {
    let ptz = '';
    if(e.deltaX === -0){
      if (e.wheelDelta > 0){
        ptz = 'zoomin';
      }else{
        ptz = 'zoomout';
      }
    }

    if(ptz !== ''){
      MILESTONE({reqAddr: 'PTZ',
      device: device.Guid,
      ptz})
    }
  }, 1000);

  onKeyDown = (e) => {
    e.stopPropagation();

    const STD_CAM_FOCUS = gfs_getStoreValue('INSP_PROC_MAIN', 'STD_CAM_FOCUS');
    const DUM_CAM_FOCUS = gfs_getStoreValue('INSP_PROC_MAIN', 'DUM_CAM_FOCUS');
    
    if(STD_CAM_FOCUS || DUM_CAM_FOCUS){
      this.debounceKeyDown(e, STD_CAM_FOCUS ? this.device[0] : this.device[1]);
    }
  }

  onMouseWheel = (e) => {
    e.stopPropagation();

    const STD_CAM_FOCUS = gfs_getStoreValue('INSP_PROC_MAIN', 'STD_CAM_FOCUS');
    const DUM_CAM_FOCUS = gfs_getStoreValue('INSP_PROC_MAIN', 'DUM_CAM_FOCUS');
    
    if(STD_CAM_FOCUS || DUM_CAM_FOCUS){
      this.debounceMouseWheel(e, STD_CAM_FOCUS ? this.device[0] : this.device[1]);
    }
  }

  constructor(props){
    super(props)
    gfc_initPgm(props.pgm, props.nam, this)
    this.milestoneInfo();

    //#region 리듀서
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

          STD_CAM_IMG  : nowState === undefined ? null : nowState.STD_CAM_IMG,
          DUM_CAM_IMG  : nowState === undefined ? null : nowState.DUM_CAM_IMG,

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
      }else if(action.type === 'STD_CAM_IMG'){

        return Object.assign({}, nowState, {
          STD_CAM_IMG : action.STD_CAM_IMG
        })
      }else if(action.type === 'DUM_CAM_IMG'){

        return Object.assign({}, nowState, {
          DUM_CAM_IMG : action.DUM_CAM_IMG
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
    gfs_subscribe(this.onActiveWindow);
    //#endregion

  }

  Retrieve = async () => {
    // const search_car_no = gfo_getInput(this.props.pgm, 'search_car_no').getValue();
    
    // console.log(gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_WAIT'));

    gfc_showMask();

    const headData = await YK_WEB_REQ('tally_mstr_header.jsp');
    const header = headData.data.dataSend;
    if(header){
      gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WAIT', {MAIN_WAIT: header[0].rCar});
      gfs_dispatch('INSP_PROC_MAIN', 'MAIN_TOTAL', {MAIN_TOTAL: header[0].eCar});
      gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WEIGHT', {MAIN_WEIGHT: header[0].eKg});
    }else{
      gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WAIT', {MAIN_WAIT: 0});
      gfs_dispatch('INSP_PROC_MAIN', 'MAIN_TOTAL', {MAIN_TOTAL: 0});
      gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WEIGHT', {MAIN_WEIGHT: 0});
    }

    const mainData = await YK_WEB_REQ('tally_mstr_wait.jsp');
    const main = mainData.data.dataSend;
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    if(main){

    }else{

    }

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

    grid.resetData(
      sort
    );

    gfg_setSelectRow(grid);
    gfs_dispatch('INSP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: sort.length});
    gfc_hideMask();
  }


  onSelectChange = (e) => {
    if(e === null) return;

    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: e.scaleNumb});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: e.carNumb});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: e.totalWgt});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: e.date});
  }

  tabButton(tabIndex){
    let tabList = ['tab1','tab2']
    let contentList = ['content1','content2']
    let btnList = ['btn1','btn2']
    let tabMaxIndex = 2;
    for(let i = 0; i < tabMaxIndex; i++){
      if(i === tabIndex){
        if(gfc_hasClass(document.getElementById(tabList[i]),'on') === false){
          gfc_addClass(document.getElementById(tabList[i]),'on');
          gfc_addClass(document.getElementById(contentList[i]),'on');
          gfc_addClass(document.getElementById(btnList[i]),'on');
        }
      }else{
        gfc_removeClass(document.getElementById(tabList[i]),'on');
        gfc_removeClass(document.getElementById(contentList[i]),'on');
        gfc_removeClass(document.getElementById(btnList[i]),'on');
      }
    }
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
                        rowHeight={46}
                        rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                        columns={[
                          columnInput({
                            name: 'scaleNumb',
                            header: '배차번호',
                            width : 155,
                            readOnly: true,
                            color : '#0063A9',
                            align : 'center',
                            fontSize: '18'
                          }),
                          columnInput({
                            name: 'carNumb',
                            header: '차량번호',
                            width : 135,
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
                            width : 80,
                            height: 38,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT'),
                            time  : 'HH:mm'
                          }),
                          columnTextArea({
                            name: 'vendor',
                            header: 'Vendor',
                            width : 150,
                            height: 38,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnImage({
                            name: 'rec',
                            header: '녹화중',
                            width: 70,
                            imgItem:[
                              {'code':'0', 'value': ''},
                              {'code':'1', 'value': <GifPlayer height='30' width='65' gif={require('../../../Image/yk_rec01.gif').default} autoplay/>}
                            ]
                          })
                        ]}
                  />
                </div>
              </div>
              <div className='grid_info'>
                <span className='title'>잔여차량</span><Botspan />
              </div>
            </div>
            <div className='total_info'>
              <ul>
                <li><span className='title'>잔류 차량</span><Mainspan flag={1} /></li>
                <li><span className='title'>전체 검수 차량</span><Mainspan flag={2} /></li>
                <li><span className='title'>입고량(KG)</span><Mainspan flag={3} /></li>
              </ul>
            </div>
          </div>
          <div className='car_info'>
            <div className='title'><span>배차번호</span><Detailspan flag={1} /></div>
            <div className='detail'>
              <ul>
                <li><span className='t'>차량번호</span><Detailspan flag={2} /></li>
                <li><span className='t'>총중량(KG)</span><Detailspan flag={3} /></li>
                <li><span className='t'>입차시간</span><Detailspan flag={4} /></li>
                <li><button onClick={() => gfs_dispatch('INSP_PROC_MAIN', 'STD_CAM_REC', {rec: true, car: '1234'})}>on1</button>
                    <button onClick={() => gfs_dispatch('INSP_PROC_MAIN', 'STD_CAM_REC', {rec: false, car: '1234'})}>off1</button>
                    <button onClick={() => gfs_dispatch('INSP_PROC_MAIN', 'DUM_CAM_REC', {rec: true, car: '1234'})}>on2</button>
                    <button onClick={() => gfs_dispatch('INSP_PROC_MAIN', 'DUM_CAM_REC', {rec: false, car: '1234'})}>off2</button>
                    <button onClick={async () => {
                      
                      console.log(await gfc_test());

                    }}>loop</button>
                </li>
              </ul>
            </div>
            <div className='tab_list'>
              <button type='button' id='tab1' className='tab on' onClick={() => this.tabButton(0)}>검수입력</button>
              <button type='button' id='tab2' className='tab' onClick={() => this.tabButton(1)}><span className='doc'>메모있음</span>계량증명서</button>
            </div>
            <div className='tab_content'>
              <div className='input_list on' id='content1'>
                <ul>
                  <li>
                    <h5>등급책정</h5>
                    <div style={{marginBottom:'5px'}}>
                      <Combobox pgm     = {this.props.pgm}
                                id      = 'detail_grade1'
                                value   = 'itemCode'
                                display = 'item'
                                placeholder = '고철등급 검색'
                                height  = {42}

                                onFocus = {ComboCreate => {
                                  YK_WEB_REQ('tally_process_pop.jsp?division=P005', {})
                                    .then(res => {
                                      ComboCreate({data   : res.data.dataSend,
                                                  value  : 'itemCode',
                                                  display: 'item'});
                                    })
                                }}
                      />
                    </div>
                    <Combobox pgm     = {this.props.pgm}
                              id      = 'detail_grade2'
                              value   = 'itemCode'
                              display = 'item'

                              onFocus = {ComboCreate => {
                                const value = gfo_getCombo(this.props.pgm, 'detail_grade1').getValue();
                                if(value === null) return;

                                YK_WEB_REQ(`tally_process_pop.jsp?division=${value}`, {})
                                  .then(res => {
                                    ComboCreate({data   : res.data.dataSend,
                                                value  : 'itemCode',
                                                display: 'item'});
                                  })
                              }}
                    />
                  </li>
                  <li>
                    <h5>감량중량</h5>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_subt'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '감량중량 검색(KG)'

                          onFocus = {ComboCreate => {
                            YK_WEB_REQ('tally_process_pop.jsp?division=P535', {})
                              .then(res => {
                                ComboCreate({data   : res.data.dataSend,
                                            value  : 'itemCode',
                                            display: 'item',
                                            emptyRow: true});
                              })
                          }}
                  />
                  </li>
                  <li>
                    <h5>감량사유</h5>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_subt_leg'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '감량사유 검색'

                          onFocus = {ComboCreate => {
                            YK_WEB_REQ('tally_process_pop.jsp?division=P620', {})
                              .then(res => {
                                ComboCreate({data   : res.data.dataSend,
                                            value  : 'itemCode',
                                            display: 'item',
                                            emptyRow: true});
                              })
                          }}
                  />
                  </li>
                  <li>
                    <h5>감가내역</h5>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_depr'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '감가내역 검색'

                          onFocus = {ComboCreate => {
                            YK_WEB_REQ('tally_process_pop.jsp?division=P130', {})
                              .then(res => {
                                ComboCreate({data   : res.data.dataSend,
                                            value  : 'itemCode',
                                            display: 'item',
                                            emptyRow: true});
                              })
                          }}
                  />
                  </li>
                  <li>
                    <h5>하차구역</h5>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_out'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '하차구역 검색(SECTOR)'

                          onFocus = {ComboCreate => {
                            YK_WEB_REQ('tally_process_pop.jsp?division=P530', {})
                              .then(res => {
                                ComboCreate({data   : res.data.dataSend,
                                            value  : 'itemCode',
                                            display: 'item',});
                              })
                          }}
                  />
                  </li>
                  <li>
                    <h5>차종구분</h5>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_car'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '차종선택'

                          onFocus = {ComboCreate => {
                            YK_WEB_REQ('tally_process_pop.jsp?division=P700', {})
                              .then(res => {
                                ComboCreate({data   : res.data.dataSend,
                                            value  : 'itemCode',
                                            display: 'item'});
                              })
                          }}
                  />
                  </li>
                  <li>
                    <h5>반품구분</h5>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_rtn'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '일부,전량 선택'

                          onFocus = {ComboCreate => {
                            YK_WEB_REQ('tally_process_pop.jsp?division=P110', {})
                              .then(res => {
                                ComboCreate({data   : res.data.dataSend,
                                            value  : 'itemCode',
                                            display: 'item',
                                            emptyRow: true});
                              })
                          }}
                  />
                  </li>
                  <li>
                    <h5>경고</h5>
                    <Combobox pgm = {this.props.pgm}
                          id      = 'detail_warning'
                          value   = 'code'
                          display = 'name'
                          placeholder = '경고'
                          data    = {[{
                            'code': 'Y',
                            'name': '경고'
                          }]}
                          emptyRow
                  />
                  </li>
                </ul>
              </div>
              <div className="data_list" id="content2">
                <div className="doc">
                  <h5>계 량 증 명 서</h5>
                  <ul>
                    <li>
                      <span className="t">일&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;시</span>
                      <span className="v">2021-06-17 06:02:02</span>
                    </li>
                    <li>
                      <span className="t">계량번호</span>
                      <span className="v">202106170001</span>
                    </li>
                    <li>
                      <span className="t">차량번호</span>
                      <span className="v">경남 81사7885</span>
                    </li>
                    <li>
                      <span className="t">업&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;체</span>
                      <span className="v">(주)거산</span>
                    </li>
                    <li>
                      <span className="t">제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;품</span>
                      <span className="v">원재료.철강.국내분철</span>
                    </li>
                    <li>
                      <span className="t">입차중량</span>
                      <span className="v">44,420</span>
                    </li>
                    <li>
                      <span className="t">지&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;역</span>
                      <span className="v">부산</span>
                    </li>
                    <li>
                      <span className="t">검&nbsp;&nbsp;수&nbsp;&nbsp;자</span>
                      <span className="v">유명훈</span>
                    </li>
                  </ul>
                </div>
                <div className="memo">
                  <h5>MEMO</h5>
                  <textarea></textarea>
                </div>
              </div>
            </div>
            <div className='complete_btn'>
              <button type='button' id="btn1" className='on'><span>등록완료</span></button>
              <button type='button' id="btn2"><span>계량증명서저장</span></button>
            </div>
          </div>
            <div className='cctv_viewer'>
              <h4>실시간 CCTV</h4>
              <div className='cctv_list'>
          {/* <div style={{width:'100%', height:'calc(100% - 360px)'}}> */}
              <RecImage ip='10.10.136.112' cam='STD_CAM_OPEN' focus='STD_CAM_FOCUS' rec='STD_CAM_REC' image='STD_CAM_IMG'/>
              <RecImage ip='10.10.136.128' cam='DUM_CAM_OPEN' focus='DUM_CAM_FOCUS' rec='DUM_CAM_REC' image='DUM_CAM_IMG'/>
          {/* </div> */}
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default INSP_PROC;