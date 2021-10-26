//#region import
import React, { Component } from 'react';
import lodash  from 'lodash';
import Input from '../../../Component/Control/Input';
import Checkbox from '../../../Component/Control/Checkbox';
import DateTime from '../../../Component/Control/DateTime';

import { gfc_initPgm, gfc_showMask, gfc_hideMask, gfc_chit_yn_YK, gfc_sleep, gfc_now, gfc_oracleRetrieve, gfc_yk_call_sp } from '../../../Method/Comm';
import { gfs_getStoreValue, gfs_injectAsyncReducer, gfs_dispatch } from '../../../Method/Store';
import { gfo_getCombo, gfo_getInput, gfo_getCheckbox, gfo_getDateTime } from '../../../Method/Component';
import { gfg_getGrid, gfg_setSelectRow } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Number as columnNumber } from '../../../Component/Grid/Column/Number';
import { Combobox as columnCombobox } from '../../../Component/Grid/Column/Combobox';
import { DateTime as columnDateTime } from '../../../Component/Grid/Column/DateTime';

import Combobox from '../../../Component/Control/Combobox';

// import Mainspan from './Mainspan';
import Detailspan from '../Common/Detailspan';
import Botspan from './Botspan';
import Chit from './Chit';
import TabList from './TabList';
import RecImage from '../Common/RecImage';

import { YK_WEB_REQ } from '../../../WebReq/WebReq';
import { getDynamicSql_Oracle } from '../../../db/Oracle/Oracle';
//#endregion

class DAILY_PROC extends Component {

  state = {
    wait_list: [],
    scaleNumb: '',
    detail_grade2: YK_WEB_REQ('tally_process_pop.jsp?division=P005', {})
  }

  //#endregion

  //#endregion

  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const DAILY_PROC_MAIN = (nowState, action) => {

      if(action.reducer !== 'DAILY_PROC_MAIN') {
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

    gfs_injectAsyncReducer('DAILY_PROC_MAIN', DAILY_PROC_MAIN);
    //#endregion
  }

  Init = async() => {
    gfo_getDateTime(this.props.pgm, 'search_fr_dt').setValue(await gfc_now());
    gfo_getDateTime(this.props.pgm, 'search_to_dt').setValue(await gfc_now());
    this.Retrieve();
  }

  componentDidMount(){
    this.Init();
  }
  
  Retrieve = async () => {

    gfc_showMask();

    gfo_getInput(this.props.pgm, 'detail_pre_grade').setValue(''); //사전등급
    gfo_getCombo(this.props.pgm, 'detail_grade1').setValue('');   //고철등급
    gfo_getCombo(this.props.pgm, 'detail_grade2').setValue('');   //상세고철등급
    gfo_getCombo(this.props.pgm, 'detail_subt').setValue('');     //감량중량
    gfo_getCombo(this.props.pgm, 'detail_subt_leg').setValue(''); //감량사유
    gfo_getCombo(this.props.pgm, 'detail_depr').setValue('');     //감가내역
    gfo_getCombo(this.props.pgm, 'detail_depr2').setValue('');    //감가비율
    gfo_getCombo(this.props.pgm, 'detail_car').setValue('');      //차종구분
    gfo_getCombo(this.props.pgm, 'detail_rtn').setValue('');      //반품구분
    gfo_getCombo(this.props.pgm, 'detail_rtn2').setValue('');     //반품구분사유
    gfo_getCheckbox(this.props.pgm, 'detail_warning').setValue('');  //경고

    gfs_dispatch('DAILY_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: ''});
    gfs_dispatch('DAILY_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: ''});
    gfs_dispatch('DAILY_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: ''});
    gfs_dispatch('DAILY_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: ''});

    gfs_dispatch('DAILY_PROC_MAIN', 'CHIT_INFO', {
      scaleNumb: ''
    });

    const fr_dt = gfo_getDateTime(this.props.pgm, 'search_fr_dt').getValue();
    const to_dt = gfo_getDateTime(this.props.pgm, 'search_to_dt').getValue();
    const search_tp = gfo_getCombo(this.props.pgm, 'search_tp').getValue();
    const search_txt = gfo_getInput(this.props.pgm, 'search_txt').getValue();

    // console.log(fr_dt.replace('-', '').replace('-', ''), to_dt.replace('-', '').replace('-', ''), car_no)

    getDynamicSql_Oracle(
      'Common/Common',
      'DAILY_PROC_MAIN',
      [{
        fr_dt: fr_dt.replace('-', '').replace('-', ''),
        to_dt: to_dt.replace('-', '').replace('-', ''),
        car_no: search_tp === '1' ? search_txt === '' ? '%' : search_txt : '%',
        vendor: search_tp === '2' ? search_txt === '' ? '%' : search_txt : '%'
      }]
    ).then(e => {
      let data = [];
      let sum = 0;
      for(let i = 0; i < e.data.rows.length; i++){
  
        let col = {};
        for(let j = 0; j < e.data.rows[i].length; j++){
          col[e.data.metaData[j].name] = e.data.rows[i][j];
          if(e.data.metaData[j].name === 'NET_WEIGHT'){
            sum += e.data.rows[i][j] * 1;
          }
        }
        data.push(col);
      }

      const grid = gfg_getGrid(this.props.pgm, 'main10');
      grid.clear();

      gfc_hideMask();

      if(data.length > 0){
        grid.resetData(data);

        gfs_dispatch('DAILY_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: data.length});
        gfs_dispatch('DAILY_PROC_MAIN', 'MAIN_WEIGHT', {MAIN_WEIGHT: sum})
        
        gfg_setSelectRow(grid);
      }
    })
  }


  onSelectChange = async (e) => {
    if(e === null) return;

    gfs_dispatch('DAILY_PROC_MAIN', 'GRID_SCALE', {GRID_SCALE: e.SCALENUMB});

    //기존 등록된 정보
    // const dtlInfo = await YK_WEB_REQ(`tally_process_f_sel.jsp?scaleNumb=${e.SCALENUMB}`);
    // if(!dtlInfo.data.dataSend){
    //   alert('검수정보를 불러올수 없습니다.');
    //   return;
    // }
    
    const dtlInfo = await gfc_yk_call_sp('SP_ZM_PROCESS_F_SEL', {
      P_SCALENUMB: e.SCALENUMB
    });
    
    if(dtlInfo.data.SUCCESS === 'N'){
      alert('검수정보를 불러올수 없습니다.');
      return;
    }

    gfo_getInput(this.props.pgm, 'detail_pre_grade').setValue(e.PRE_IRON_GRADE_NAME); //사전등급
    gfo_getCombo(this.props.pgm, 'detail_grade1').setValue(dtlInfo.data.ROWS[0].IRON_GRADE);   //고철등급
    const detail_grade2 = gfo_getCombo(this.props.pgm, 'detail_grade2');
    await detail_grade2.onReset({etcData:  YK_WEB_REQ(`tally_process_pop.jsp?division=${dtlInfo.data.ROWS[0].IRON_GRADE}`, {})});
    detail_grade2.setValue(dtlInfo.data.ROWS[0].IRON_GRADE_ITEM);   //상세고철등급
    gfo_getCombo(this.props.pgm, 'detail_subt').setValue(dtlInfo.data.ROWS[0].REDUCE_WGT);     //감량중량
    gfo_getCombo(this.props.pgm, 'detail_subt_leg').setValue(dtlInfo.data.ROWS[0].REDUCE_WGT_REASON_CODE); //감량사유
    gfo_getCombo(this.props.pgm, 'detail_depr').setValue(dtlInfo.data.ROWS[0].DISCOUNT_CODE);     //감가내역
    // gfo_getCombo(this.props.pgm, 'detail_depr2').setValue(dtlInfo.data.ROWS[0].DISCOUNT_CODE);    //감가비율
    gfo_getCombo(this.props.pgm, 'detail_car').setValue(dtlInfo.data.ROWS[0].CAR_TYPE);      //차종구분
    gfo_getCombo(this.props.pgm, 'detail_rtn').setValue(dtlInfo.data.ROWS[0].RETURN_CODE);      //반품구분
    gfo_getCombo(this.props.pgm, 'detail_rtn2').setValue(dtlInfo.data.ROWS[0].RETURN_GUBUN);     //반품구분사유
    gfo_getCheckbox(this.props.pgm, 'detail_warning').setValue(dtlInfo.data.ROWS[0].WARNING);  //경고

    gfs_dispatch('DAILY_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: e.SCALENUMB});
    
    gfs_dispatch('DAILY_PROC_MAIN', 'CHIT_INFO', {
      scaleNumb: e.SCALENUMB.toString(),
      date     : e.INSPECT_TIME
    });
  }

  render() {

    return (
      <div className='win_body' style={{borderRadius:'0px', borderWidth:'0px 1px 0px 1px'}}>
        <div className='car_manager' >
          <div style={{paddingBottom:'0'}} className='car_list'>
            <div className='search_line'>
              <div className='wp type2' >
                <div style={{position:'absolute', left:0, top:0, width:'360px', height:'42px', fontSize:'16px'}}>
                  <div>
                    <DateTime pgm={this.props.pgm}
                              id='search_fr_dt' />                  
                    <DateTime pgm={this.props.pgm}
                              id='search_to_dt' />
                  </div>
                  <Combobox pgm     = {this.props.pgm}
                            id      = 'search_tp'
                            value   = 'CODE'
                            display = 'NAME'
                            width   = {124}
                            height  = {42}
                            emptyRow
                            data    = {[{
                              CODE: '1',
                              NAME: '차량번호'
                            },{
                              CODE: '2',
                              NAME: '업체명'
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
                       onKeyDown   = {(e) => {
                        if(e.keyCode === 13){
                          this.Retrieve()
                        }
                       }}
                />
              </div>
            </div>
            <div className='grid'>
              <div className='wp'>
                <div style={{width:'100%', height:'100%', overflow:'auto'}}>
                  <Grid pgm={this.props.pgm}
                        id ='main10'
                        selectionChange={(e) => this.onSelectChange(e)}
                        rowHeight={41}
                        rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                        columns={[
                          columnInput({
                            name: 'SCALENUMB',
                            header: '계근번호',
                            width : 160,
                            readOnly: true,
                            color : '#0063A9',
                            align : 'center'
                          }),
                          columnInput({
                            name: 'VENDOR_NAME',
                            header: '업체명',
                            width : 180,
                            readOnly: true,
                            align : 'left'
                          }),   
                          columnInput({
                            name: 'REAL_VENDER_NAME',
                            header: '실공급사',
                            width : 180,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnInput({
                            name: 'ATTRIBUTE3',
                            header: '확정자',
                            width : 100,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnInput({
                            name: 'MOBILE_INSPECT_USER',
                            header: '검수자',
                            width : 100,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnInput({
                            name: 'VEHICLE_NO',
                            header: '차량번호',
                            width : 180,
                            readOnly: true,
                            align : 'center'
                          }),
                          columnCombobox({
                            name: 'CAR_TYPE', 
                            header: '차량종류',
                            value   : 'itemCode',
                            display : 'item',
                            width   : 120, 
                            readOnly: false,
                            etcData : YK_WEB_REQ('tally_process_pop.jsp?division=P700', {}),
                            editor: {
                              value   : 'itemCode',
                              display : 'item'
                            }
                          }),
                          columnNumber({
                            name: 'TAKE_WGT',
                            header: '총중량',
                            width : 150,
                            readOnly: true,
                            align : 'right'
                          }),
                          columnNumber({
                            name: 'EMPTY_WGT',
                            header: '공차중량',
                            width : 150,
                            readOnly: true,
                            align : 'right'
                          }),
                          columnNumber({
                            name: 'REAL_WGT',
                            header: '실중량',
                            width : 150,
                            readOnly: true,
                            align : 'right'
                          }),
                          columnNumber({
                            name: 'REDUCE_WGT',
                            header: '감량',
                            width : 150,
                            readOnly: true,
                            align : 'right'
                          }),
                          columnNumber({
                            name: 'NET_WEIGHT',
                            header: '입고중량',
                            width : 150,
                            readOnly: true,
                            align : 'right'
                          }),
                          // columnInput({
                          //   name: 'IRON_GRADE',
                          //   header: '등급코드',
                          //   width : 200,
                          //   readOnly: true,
                          //   align : 'left'
                          // }),
                          columnInput({
                            name: 'PRE_IRON_GRADE_NAME',
                            header: '사전등급',
                            width : 200,
                            readOnly: true,
                            align : 'center'
                          }),
                          columnInput({
                            name: 'IRON_GRADE_NAME',
                            header: '확정등급',
                            width : 200,
                            readOnly: true,
                            align : 'center'
                          }),
                          columnNumber({
                            name: 'DISCOUNT_AMOUNT',
                            header: '감가',
                            width : 150,
                            readOnly: true,
                            align : 'right'
                          }),
                          columnInput({
                            name: 'IRON_RATE',
                            header: '비율',
                            width : 150,
                            readOnly: true,
                            align : 'right'
                          }),
                          columnInput({
                            name: 'IRON_GRADE_ITEM_NAME',
                            header: '고철종류',
                            width : 250,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnInput({
                            name: 'LOAD_AREA_ADDR',
                            header: '상차주소',
                            width : 250,
                            readOnly: true,
                            align : 'left'
                          }),
                          // columnInput({
                          //   name: 'RETURN_GUBUN',
                          //   header: '반품구분',
                          //   width : 200,
                          //   readOnly: true,
                          //   align : 'left'
                          // }),
                          columnInput({
                            name: 'RETURN_GUBUN_NAME',
                            header: '반품구분명',
                            width : 200,
                            readOnly: true,
                            align : 'left'
                          }),
                          // columnInput({
                          //   name: 'RETURN_CODE',
                          //   header: '반품코드',
                          //   width : 200,
                          //   readOnly: true,
                          //   align : 'left'
                          // }),
                          columnInput({
                            name: 'RETURN_CODE_NAME',
                            header: '반품코드명',
                            width : 200,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnDateTime({
                            name  : 'DELIVERY_DATE',
                            header: '입고일자',
                            width : 200,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT')
                          }),
                          columnInput({
                            name: 'ITEM_NO',
                            header: '품목코드',
                            width : 200,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnCombobox({
                            name: 'SECTOR_CODE', 
                            header: '하차구역',
                            value   : 'itemCode',
                            display : 'item',
                            width   : 200, 
                            readOnly: false,
                            etcData : YK_WEB_REQ('tally_process_pop.jsp?division=P530', {}),
                            editor: {
                              value   : 'itemCode',
                              display : 'item'
                            }
                          }),
                          columnInput({
                            name: 'SCRP_ORD_NO',
                            header: '배차번호',
                            width : 180,
                            readOnly: true,
                            align : 'center'
                          })
                        ]}
                  />
                </div>
              </div>
              <div className='grid_info'>
                <span className='title'>전체차량</span><Botspan reducer='DAILY_PROC_MAIN' column='BOT_TOTAL' />
                <span className='title' style={{paddingLeft:'50px'}}>입고량</span><Botspan reducer='DAILY_PROC_MAIN' column='MAIN_WEIGHT' />
              </div>
            </div>
          </div>
          <div id={`car_info_${this.props.pgm}`} className='car_info' style={{paddingBottom:'0'}}>
            <div className='title'><span>계근번호</span><Detailspan flag={1}  reducer='DAILY_PROC_MAIN'/></div>

            <TabList pgm={this.props.pgm} id={this.props.id} reducer='DAILY_PROC_MAIN'/>

            <div className='tab_content' id='tabMain'>
              <div className='input_list on' id={`content1_${this.props.pgm}`}>
                <ul>
                  <li>
                    <h5>사전등급</h5>
                      <Input pgm     = {this.props.pgm}
                             id      = 'detail_pre_grade'
                             width   = '100%'
                             readOnly
                      />
                  </li>
                  <li>
                    <h5>등급책정</h5>
                    <div style={{marginBottom:'5px'}}>
                      <Combobox pgm     = {this.props.pgm}
                                id      = 'detail_grade1'
                                value   = 'itemCode'
                                display = 'item'
                                isDisabled
                                placeholder = '고철등급 검색'
                                height  = {42}
                                oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                                  p_division    : 'P005'
                                })}
                      />
                    </div>
                    <Combobox pgm     = {this.props.pgm}
                              id      = 'detail_grade2'
                              value   = 'itemCode'
                              display = 'item'
                              isDisabled
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
                            oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                              p_division    : 'P535'
                            })}
                            isDisabled
                      />
                    </div>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_subt_leg'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '감량사유 검색'
                          oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                            p_division    : 'P620'
                          })}
                          isDisabled
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
                            oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                              p_division    : 'P130'
                            })}
                            isDisabled
                      />
                    </div>
                    <Combobox pgm = {this.props.pgm}
                          id      = 'detail_depr2'
                          value   = 'CODE'
                          display = 'NAME'
                          placeholder = '감가비율'
                          isDisabled
                          data    = {[{
                            'CODE': '10',
                            'NAME': '10%'
                          },{
                            'CODE': '20',
                            'NAME': '20%'
                          },{
                            'CODE': '30',
                            'NAME': '30%'
                          },{
                            'CODE': '40',
                            'NAME': '40%'
                          },{
                            'CODE': '50',
                            'NAME': '50%'
                          },{
                            'CODE': '60',
                            'NAME': '60%'
                          },{
                            'CODE': '70',
                            'NAME': '70%'
                          },{
                            'CODE': '80',
                            'NAME': '80%'
                          },{
                            'CODE': '90',
                            'NAME': '90%'
                          },{
                            'CODE': '100',
                            'NAME': '100%'
                          }]}
                          // emptyRow
                    />
                  </li>
                  <li>
                    <h5>하차구역</h5>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_out'
                          value   = 'itemCode'
                          display = 'itemCode'
                          placeholder = '차종선택'
                          oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                            p_division    : 'P530'
                          })}
                  />
                  </li>
                  <li>
                    <h5>차종구분</h5>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_car'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '차종선택'
                          oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                            p_division    : 'P700'
                          })}
                          isDisabled
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
                            oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                              p_division    : 'P110'
                            })}
                            isDisabled
                    />
                  </div>
                  <Combobox pgm     = {this.props.pgm}
                            id      = 'detail_rtn2'
                            value   = 'itemCode'
                            display = 'item'
                            oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                              p_division    : 'P120'
                            })}
                            isDisabled
                    />
                  </li>
                  <li>
                    <h5>경고</h5>
                    <Checkbox pgm   = {this.props.pgm}
                              id    = 'detail_warning'
                              width = '30px'
                              height= '30px'
                              disabled

                    />
                  </li>
                </ul>
              </div>
              
              <Chit pgm={this.props.pgm} id={'chit_memo'} reducer='DAILY_PROC_MAIN'/>
              


              
            </div>




          </div>
            <div className='cctv_viewer'>
              <h4>녹화영상</h4>
              <div className='cctv_list'>
                  <RecImage 
                    seq     = {1}
                    reducer = 'DAILY_PROC_MAIN'
                    cam     = 'STD_CAM_OPEN' 
                    focus   = 'STD_CAM_FOCUS' 
                    rec     = 'STD_CAM_REC' 
                    image   = 'STD_CAM_IMG'/> 
                  <RecImage 
                    seq     = {2}
                    reducer = 'DAILY_PROC_MAIN'
                    cam     = 'DUM_CAM_OPEN' 
                    focus   = 'DUM_CAM_FOCUS' 
                    rec     = 'DUM_CAM_REC' 
                    image   = 'DUM_CAM_IMG'/> 
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default DAILY_PROC;