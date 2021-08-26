//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_showMask, gfc_hideMask, gfc_chit_yn_YK, gfc_sleep } from '../../../Method/Comm';
import { gfs_getStoreValue, gfs_injectAsyncReducer, gfs_dispatch, gfs_subscribe } from '../../../Method/Store';
import { gfo_getCombo, gfo_getInput, gfo_getTextarea } from '../../../Method/Component';
import { gfg_getGrid, gfg_setSelectRow } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Image as columnImage } from '../../../Component/Grid/Column/Image';
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';
import { TextArea as columnTextArea } from '../../../Component/Grid/Column/TextArea';

import Combobox from '../../../Component/Control/Combobox';

// import Mainspan from './Mainspan';
import Detailspan from '../Common/Detailspan';
import Botspan from '../Common/Botspan';
import Chit from '../Common/Chit/Chit';
import CompleteBtn from './CompleteBtn';
import TabList from './TabList';
import RecImage from './RecImage';

import { YK_WEB_REQ } from '../../../WebReq/WebReq';
import { TOKEN, MILESTONE } from '../../../WebReq/WebReq';
//#endregion

class DISP_PROC extends Component {

  state = {
    wait_list: [],
    device: []
  }

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
    }else{
      let ipArr = ['10.10.136.112', '10.10.136.128'];
      let rtspUrl = ['rtsp://admin:admin13579@10.10.136.112:554/profile2/media.smp', 'rtsp://admin:pass@10.10.136.128:554/video1'];
      let rtspPort = [3100, 3101];
      let infoArr = [];

      ipArr.forEach(e => {
        const camera = this.device.find(e1 => e1.Name.indexOf(e) >= 0);
        if(camera){
          infoArr.push({camera, rtspUrl, rtspPort}); 
        }
      })

      if(infoArr.length > 0){
        this.setState(this.state.device = infoArr);
      }
    }
  }

  onTabChg = async() => {

    await gfc_sleep(200);

    const activeWindow = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'activeWindow');
    if(activeWindow.programId !== 'DISP_PROC'){
      return;
    }

    const carNumb = gfs_getStoreValue('DISP_PROC_MAIN', 'DETAIL_CARNO');
    if(carNumb !== undefined && carNumb !== ''){

      const befCarNumb = gfo_getInput(this.props.pgm, 'search_txt').getValue();

      if(befCarNumb !== carNumb){
        gfo_getInput(this.props.pgm, 'search_txt').setValue(carNumb);
        await gfc_sleep(100);
        
        this.Retrieve();

        //차량번호, 총중량, 입차시간 세팅
        const scaleNumb = gfs_getStoreValue('DISP_PROC_MAIN', 'DETAIL_SCALE');
        const totalWgt = gfs_getStoreValue('DISP_PROC_MAIN', 'DETAIL_WEIGHT');
        const date = gfs_getStoreValue('DISP_PROC_MAIN', 'DETAIL_DATE');

        gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: scaleNumb});
        gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: carNumb});
        gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: totalWgt});
        gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: date});
      }
    }
  }

  //#region onActiveWindow 스토어 subscribe로 실행됨.
  onActiveWindow = () => {
    const activeWindow = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'activeWindow');
    if(activeWindow.programId === 'DISP_PROC'){
      this.onTabChg();
    }
  }
  //#endregion

  //#endregion

  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const DISP_PROC_MAIN = (nowState, action) => {

      if(action.reducer !== 'DISP_PROC_MAIN') {
        return {
          MAIN_WAIT    : nowState === undefined ? 0 : nowState.MAIN_WAIT,
          MAIN_TOTAL   : nowState === undefined ? 0 : nowState.MAIN_TOTAL,
          MAIN_WEIGHT  : nowState === undefined ? 0 : nowState.MAIN_WEIGHT,
          BOT_TOTAL    : nowState === undefined ? 0 : nowState.BOT_TOTAL,
          PROC_WAIT    : nowState === undefined ? 0 : nowState.PROC_WAIT,
          DEPT_WAIT    : nowState === undefined ? 0 : nowState.DEPT_WAIT,
          ENTR_WAIT    : nowState === undefined ? 0 : nowState.ENTR_WAIT,
 
          DETAIL_SCALE : nowState === undefined ? '' : nowState.DETAIL_SCALE,
          DETAIL_CARNO : nowState === undefined ? '' : nowState.DETAIL_CARNO,
          DETAIL_WEIGHT: nowState === undefined ? '' : nowState.DETAIL_WEIGHT,
          DETAIL_DATE  : nowState === undefined ? '' : nowState.DETAIL_DATE,

          GRID_SCALE   : nowState === undefined ? '' : nowState.GRID_SCALE,

          STD_CAM_IMG  : nowState === undefined ? null : nowState.STD_CAM_IMG,
          DUM_CAM_IMG  : nowState === undefined ? null : nowState.DUM_CAM_IMG,

          STD_CAM_OPEN : nowState === undefined ? false : nowState.STD_CAM_OPEN,
          DUM_CAM_OPEN : nowState === undefined ? false : nowState.DUM_CAM_OPEN,

          STD_CAM_FOCUS: nowState === undefined ? false : nowState.STD_CAM_FOCUS,
          DUM_CAM_FOCUS: nowState === undefined ? false : nowState.DUM_CAM_FOCUS,

          STD_CAM_REC  : nowState === undefined ? {
                                                    rec     : false,
                                                    time    : '00:00'
                                                  } : nowState.STD_CAM_REC,
          DUM_CAM_REC  : nowState === undefined ? {
                                                    rec     : false,
                                                    time    : '00:00'
                                                  } : nowState.DUM_CAM_REC,

          CHIT_MEMO    : nowState === undefined ? '' : nowState.CHIT_MEMO,
          
          CHIT_INFO    : nowState === undefined ? {
                                                    date     : '',
                                                    scaleNumb: '',
                                                    carNumb  : '',
                                                    vender   : '',
                                                    itemFlag : '',
                                                    Wgt      : '',
                                                    loc      : '',
                                                    user     : '',
                                                    chit     : 'N',
                                                  } : nowState.CHIT_INFO
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
      }else if(action.type === 'PROC_WAIT'){

        return Object.assign({}, nowState, {
          PROC_WAIT : action.PROC_WAIT
        })
      }else if(action.type === 'DEPT_WAIT'){

        return Object.assign({}, nowState, {
          DEPT_WAIT : action.DEPT_WAIT
        })
      }else if(action.type === 'ENTR_WAIT'){

        return Object.assign({}, nowState, {
          ENTR_WAIT : action.ENTR_WAIT
        })
      }else if(action.type === 'DETAIL_SCALE'){

        return Object.assign({}, nowState, {
          DETAIL_SCALE : action.DETAIL_SCALE
        })
      }else if(action.type === 'GRID_SCALE'){

        return Object.assign({}, nowState, {
          GRID_SCALE : action.GRID_SCALE
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
          STD_CAM_REC : {
            rec  : action.rec,
            //  car  : action.car,
            time : nowState.STD_CAM_REC.time
          }
        })
      }else if(action.type === 'DUM_CAM_REC'){

        return Object.assign({}, nowState, {
          DUM_CAM_REC : {
            rec  : action.rec,
            //  car  : action.car,
            time : nowState.DUM_CAM_REC.time
          }
        })
      }else if(action.type === 'STD_CAM_REC_TIME'){

        return Object.assign({}, nowState, {
          STD_CAM_REC : {
            rec     : nowState.STD_CAM_REC.rec,
            //  car     : action.car,
            time    : action.time
          }
        })
      }else if(action.type === 'DUM_CAM_REC_TIME'){

        return Object.assign({}, nowState, {
          DUM_CAM_REC : {
            rec     : nowState.DUM_CAM_REC.rec,
            //  car     : action.car,
            time    : action.time
          }
        })
      }else if(action.type === 'CHIT_INFO_ITEM_FLAG'){

        return Object.assign({}, nowState, {
          CHIT_INFO : {
            date     :  nowState.CHIT_INFO.date,
            scaleNumb:  nowState.CHIT_INFO.scaleNumb,
            carNumb  :  nowState.CHIT_INFO.carNumb,
            vender   :  nowState.CHIT_INFO.vender,
            itemFlag :  action.itemFlag,
            Wgt      :  nowState.CHIT_INFO.Wgt,
            loc      :  nowState.CHIT_INFO.loc,
            user     :  nowState.CHIT_INFO.user,
            chit     :  nowState.CHIT_INFO.chit
          }
        })
      }else if(action.type === 'CHIT_INFO'){

        return Object.assign({}, nowState, {
          CHIT_INFO : {
            date     : action.date,
            scaleNumb: action.scaleNumb,
            carNumb  : action.carNumb,
            vender   : action.vender,
            itemFlag : action.itemFlag,
            Wgt      : action.Wgt,
            loc      : action.loc,
            user     : action.user,
            chit     : action.chit
          }
        })
      }else if(action.type === 'CHIT_MEMO'){
        return Object.assign({}, nowState, {
          CHIT_MEMO : action.CHIT_MEMO
        })
      }
    }

    gfs_injectAsyncReducer('DISP_PROC_MAIN', DISP_PROC_MAIN);
    gfs_subscribe(this.onActiveWindow);
    //#endregion
  }

  componentDidMount(){
    this.milestoneInfo();
  }

  Retrieve = async () => {

    gfc_showMask();

    const mainData = await YK_WEB_REQ('tally_mstr_pass.jsp');
    const main = mainData.data.dataSend;
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    if(main){
      grid.resetData(main);
      gfs_dispatch('DISP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: main.length});
      
      await gfc_sleep(100);

      gfg_setSelectRow(grid);
    }else{
      gfs_dispatch('DISP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
    }

    gfc_hideMask();
  }


  onSelectChange = async (e) => {
    if(e === null) return;

    gfs_dispatch('DISP_PROC_MAIN', 'GRID_SCALE', {GRID_SCALE: e.scaleNumb});

    //계량증명서 여부 확인.
    const chitYn = await gfc_chit_yn_YK(e.scaleNumb);
    gfs_dispatch('DISP_PROC_MAIN', 'CHIT_INFO', {
      chit     : chitYn.data
    });
  }

  render() {

    return (
      <div className='win_body' style={{borderRadius:'0px', borderWidth:'0px 1px 0px 1px'}}>
        <div className='car_manager' >
          <div style={{paddingBottom:'0'}} className='car_list'>
            <div className='search_line'>
              <div className='wp' >
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
                              name: '계근번호'
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
                       readOnly
                      //  padding-bottom:2px; padding-left:14px; border:none; font-size:22px;
                />
              </div>
            </div>
            <div className='grid'>
              <div className='wp'>
                <div style={{width:'100%', height:'100%', overflow:'auto'}}>
                  <Grid pgm={this.props.pgm}
                        id ='main10'
                        selectionChange={(e) => this.onSelectChange(e)}
                        dblclick={(e) => this.dblclick(e)}
                        rowHeight={46}
                        rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                        columns={[
                          columnInput({
                            name: 'scaleNumb',
                            header: '계근번호',
                            width : 120,
                            readOnly: true,
                            color : '#0063A9',
                            align : 'center'
                          }),
                          columnInput({
                            name: 'carNumb',
                            header: '차량번호',
                            width : 110,
                            readOnly: true,
                            align : 'center'
                          }),   
                          columnInput({
                            name: 'itemGrade',
                            header: '사전등급',
                            width : 135,
                            readOnly: true,
                            align : 'center'
                          }),   
                          // columnCombobox({
                          //   name: 'itemFlag', 
                          //   header: '구분',
                          //   readOnly: true,
                          //   width   : 75,
                          //   data: [{
                          //     'code': 'M1KDO0001',
                          //     'name': '고철'
                          //   },{
                          //     'code': 'M1KDO0002',
                          //     'name': '분철'
                          //   }],
                          //   editor: {
                          //     value   : 'code',
                          //     display : 'name'
                          //   }
                          // }),
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
                          })
                        ]}
                  />
                </div>
              </div>
              <div className='grid_info'>
                <span className='title'>전체차량</span><Botspan reducer='DISP_PROC_MAIN' />
              </div>
            </div>
          </div>
          <div style={{paddingBottom:'10px', paddingTop:'260px'}} className='car_info'>
            <div className='title'><span>계근번호</span><Detailspan flag={1}  reducer='DISP_PROC_MAIN'/></div>
            <div style={{height:'130px'}} className='detail'>
              <ul>
                <li><span className='t'>차량번호</span><Detailspan flag={2}  reducer='DISP_PROC_MAIN'/></li>
                <li><span className='t'>총중량(KG)</span><Detailspan flag={3} reducer='DISP_PROC_MAIN' /></li>
                <li><span className='t'>입차시간</span><Detailspan flag={4}  reducer='DISP_PROC_MAIN'/></li> 
              </ul>
            </div>


            <TabList pgm={this.props.pgm} id={this.props.id} reducer='DISP_PROC_MAIN'/>


            <div className='tab_content' id='tabMain'>
              <div className='input_list on' id={`content1_${this.props.pgm}`}>
                <ul>
                  <li>
                    <h5>사전등급</h5>
                      <Input pgm     = {this.props.pgm}
                             id      = 'detail_pre_grade'
                             width   = '100%'
                             disabled
                      />
                  </li>
                  <li>
                    <h5>등급책정</h5>
                    <div style={{marginBottom:'5px'}}>
                      <Combobox pgm     = {this.props.pgm}
                                id      = 'detail_grade1'
                                value   = 'itemCode'
                                display = 'item'
                                placeholder = '고철등급 검색'
                                height  = {42}
                                data    = ''
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
                              data    = ''
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
                    <div style={{marginBottom:'5px'}}>
                      <Combobox pgm     = {this.props.pgm}
                            id      = 'detail_subt'
                            value   = 'itemCode'
                            display = 'item'
                            placeholder = '감량중량 검색(KG)'
                            data    = ''
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
                    </div>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_subt_leg'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '감량사유 검색'
                          data    = ''
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
                    <div style={{marginBottom:'5px'}}>
                      <Combobox pgm     = {this.props.pgm}
                            id      = 'detail_depr'
                            value   = 'itemCode'
                            display = 'item'
                            placeholder = '감가내역 검색'
                            data    = ''
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
                    </div>
                    <Combobox pgm = {this.props.pgm}
                          id      = 'detail_depr2'
                          value   = 'code'
                          display = 'name'
                          placeholder = '감가비율'
                          data    = {[{
                            'code': '10',
                            'name': '10%'
                          },{
                            'code': '20',
                            'name': '20%'
                          },{
                            'code': '30',
                            'name': '30%'
                          },{
                            'code': '40',
                            'name': '40%'
                          },{
                            'code': '50',
                            'name': '50%'
                          },{
                            'code': '60',
                            'name': '60%'
                          },{
                            'code': '70',
                            'name': '70%'
                          },{
                            'code': '80',
                            'name': '80%'
                          },{
                            'code': '90',
                            'name': '90%'
                          },{
                            'code': '100',
                            'name': '100%'
                          }]}
                          emptyRow
                    />
                  </li>
                  {/* <li>
                    <h5>하차구역</h5>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_out'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '하차구역 검색(SECTOR)'
                          data    = ''
                          onFocus = {ComboCreate => {
                            YK_WEB_REQ('tally_process_pop.jsp?division=P530', {})
                              .then(res => {
                                ComboCreate({data   : res.data.dataSend,
                                            value  : 'itemCode',
                                            display: 'item'});
                              })
                          }}
                  />
                  </li> */}
                  <li>
                    <h5>차종구분</h5>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_car'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '차종선택'
                          data    = ''
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
                    <div style={{marginBottom:'5px'}}>
                      <Combobox pgm     = {this.props.pgm}
                            id      = 'detail_rtn'
                            value   = 'itemCode'
                            display = 'item'
                            placeholder = '일부,전량 선택'
                            data    = ''
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
                  </div>
                  <Combobox pgm     = {this.props.pgm}
                            id      = 'detail_rtn2'
                            value   = 'itemCode'
                            display = 'item'
                            data    = ''
                            onFocus = {ComboCreate => {
                              const value = gfo_getCombo(this.props.pgm, 'detail_rtn').getValue();
                              if(value === null) return;

                              YK_WEB_REQ(`tally_process_pop.jsp?division=P120`, {})
                                .then(res => {
                                  ComboCreate({data   : res.data.dataSend,
                                              value  : 'itemCode',
                                              display: 'item'});
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
              
              <Chit pgm={this.props.pgm} id={'chit_memo'} reducer='DISP_PROC_MAIN'/>
              


              
            </div>




          </div>
            <div className='cctv_viewer'>
              <h4>녹화영상</h4>
              <div className='cctv_list'>
                {this.state.device[0] !== undefined && 
                  <RecImage device={this.state.device[0].camera.Guid} 
                            Name={this.state.device[0].camera.Name}
                            rtspUrl={this.state.device[0].rtspUrl[0]}
                            rtspPort={this.state.device[0].rtspPort[0]}
                            cam='STD_CAM_OPEN' 
                            focus='STD_CAM_FOCUS' 
                            rec='STD_CAM_REC' 
                            image='STD_CAM_IMG'/> 
                }
                {this.state.device[1] !== undefined && 
                  <RecImage device={this.state.device[1].camera.Guid} 
                            Name={this.state.device[1].camera.Name}
                            rtspUrl={this.state.device[1].rtspUrl[1]}
                            rtspPort={this.state.device[1].rtspPort[1]}
                            cam='DUM_CAM_OPEN' 
                            focus='DUM_CAM_FOCUS' 
                            rec='DUM_CAM_REC' 
                            image='DUM_CAM_IMG'/> 
                }
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default DISP_PROC;