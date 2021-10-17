//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_showMask, gfc_hideMask, gfc_sleep, gfc_yk_call_sp } from '../../../Method/Comm';
import { gfs_injectAsyncReducer, gfs_dispatch, gfs_getStoreValue } from '../../../Method/Store';
import { gfo_getCombo, gfo_getInput } from '../../../Method/Component';
import { gfg_getGrid, gfg_setSelectRow, gfg_setValue, gfg_appendRow, gfg_getColumn } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Number as columnNumber } from '../../../Component/Grid/Column/Number';
import { Checkbox as columnCheckbox } from '../../../Component/Grid/Column/Checkbox';
import { DateTime as columnDateTime } from '../../../Component/Grid/Column/DateTime';

import Combobox from '../../../Component/Control/Combobox';

// import Mainspan from './Mainspan';
import Detailspan from '../Common/Detailspan';
import Botspan from './Botspan';
import CompleteBtn from './CompleteBtn';
//#endregion

class SHIP_PROC extends Component {

  state = {
    wait_list: [],
    device: []
  }

  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const SHIP_PROC_MAIN = (nowState, action) => {

      if(action.reducer !== 'SHIP_PROC_MAIN') {
        return {
          MAIN_WAIT    : nowState === undefined ? 0 : nowState.MAIN_WAIT,
          MAIN_TOTAL   : nowState === undefined ? 0 : nowState.MAIN_TOTAL,
          MAIN_WEIGHT  : nowState === undefined ? 0 : nowState.MAIN_WEIGHT,
          TOTAL_WEIGHT : nowState === undefined ? 0 : nowState.TOTAL_WEIGHT,
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
      }else if(action.type === 'TOTAL_WEIGHT'){

        return Object.assign({}, nowState, {
          TOTAL_WEIGHT : action.TOTAL_WEIGHT
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

    gfs_injectAsyncReducer('SHIP_PROC_MAIN', SHIP_PROC_MAIN);
    //#endregion
  }

  componentDidMount(){
    this.Retrieve();
  }

  Retrieve = async () => {

    gfc_showMask();

    const mainData = await gfc_yk_call_sp(`SP_ZM_SHIP_WAIT`);
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    grid.clear();

    if(mainData.data.SUCCESS === 'Y'){

      const main = mainData.data.ROWS;
    
      const dataMod = [];
      main.forEach(e => {
        dataMod.push({
          scaleNumb: e['DELIVERY_ID'].toString(),
          vendorname: e['VENDOR_NAME'],
          cars_no: e['CARS_NO'],
          netweight: e['NET_WEIGHT'],
          deliverydate: e['DELIVERY_DATE'],
          empty_time: e['EMPTY_TIME'],
          empty_wgt: e['EMPTY_WGT'],
          iron_grade: e['IRON_GRADE'],
          inspect_user: e['INSPECT_USER']
        })
      })

      if(main){
        
        grid.resetData(dataMod);
        gfs_dispatch('SHIP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: main.length});
        
        await gfc_sleep(100);
  
        gfg_setSelectRow(grid);
      }else{
        gfs_dispatch('SHIP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
      }
    }else{
      gfs_dispatch('SHIP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
    } 

    gfc_hideMask();
  }

  sumWeight = () => {
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    const data = grid.getData();

    let TOTAL_WEIGHT = 0;
    for(let i = 0; i < data.length; i++){
      if(data[i].chk === 'Y'){
        TOTAL_WEIGHT += data[i].netweight * 1;
      }
    }

    
    gfs_dispatch('SHIP_PROC_MAIN', 'TOTAL_WEIGHT', {
      TOTAL_WEIGHT
    })
  }

  onSelectChange = async (e) => {
    if(e === null) return;

    gfs_dispatch('SHIP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: e.scaleNumb});
    gfs_dispatch('SHIP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: e.vendorname});
    gfs_dispatch('SHIP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: e.netweight});
    gfs_dispatch('SHIP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: e.deliverydate});

    //기존 등록된 정보
    const dtlInfo = await gfc_yk_call_sp('SP_ZM_PROCESS_F_SEL', {
      P_SCALENUMB: e.scaleNumb
    });
    
    if(dtlInfo.data.SUCCESS === 'Y'){

      gfo_getCombo(this.props.pgm, 'detail_grade1').setValue(dtlInfo.data.ROWS[0].IRON_GRADE);   //고철등급
      const detail_grade2 = gfo_getCombo(this.props.pgm, 'detail_grade2');
      await detail_grade2.onReset({oracleSpData:  gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
        p_division    : dtlInfo.data.ROWS[0].IRON_GRADE
      })});
      detail_grade2.setValue(dtlInfo.data.ROWS[0].IRON_GRADE_ITEM);   //상세고철등급
      gfo_getCombo(this.props.pgm, 'detail_subt').setValue(dtlInfo.data.ROWS[0].REDUCE_WGT);     //감량중량
      gfo_getCombo(this.props.pgm, 'detail_subt_leg').setValue(dtlInfo.data.ROWS[0].REDUCE_WGT_REASON_CODE); //감량사유
      gfo_getCombo(this.props.pgm, 'detail_depr').setValue(dtlInfo.data.ROWS[0].DISCOUNT_CODE);     //감가내역
      // gfo_getCombo(this.props.pgm, 'detail_depr2').setValue(dtlInfo.data.ROWS[0].DISCOUNT_CODE);    //감가비율
      gfo_getCombo(this.props.pgm, 'detail_car').setValue(dtlInfo.data.ROWS[0].CAR_TYPE);      //차종구분
      gfo_getCombo(this.props.pgm, 'detail_out').setValue(dtlInfo.data.ROWS[0].SECTOR_CODE);      //하차구역
      gfo_getCombo(this.props.pgm, 'detail_rtn').setValue(dtlInfo.data.ROWS[0].RETURN_CODE);      //반품구분
      gfo_getCombo(this.props.pgm, 'detail_rtn2').setValue(dtlInfo.data.ROWS[0].RETURN_GUBUN);     //반품구분사유
    }else{
      gfo_getCombo(this.props.pgm, 'detail_grade1').setValue('');   //고철등급
      const detail_grade2 = gfo_getCombo(this.props.pgm, 'detail_grade2').setValue('');   //고철등급
      gfo_getCombo(this.props.pgm, 'detail_subt').setValue('');     //감량중량
      gfo_getCombo(this.props.pgm, 'detail_subt_leg').setValue(''); //감량사유
      gfo_getCombo(this.props.pgm, 'detail_depr').setValue('');     //감가내역
      // gfo_getCombo(this.props.pgm, 'detail_depr2').setValue('');    //감가비율
      gfo_getCombo(this.props.pgm, 'detail_car').setValue('');      //차종구분
      gfo_getCombo(this.props.pgm, 'detail_out').setValue('');      //하차구역
      gfo_getCombo(this.props.pgm, 'detail_rtn').setValue('');      //반품구분
      gfo_getCombo(this.props.pgm, 'detail_rtn2').setValue('');     //반품구분사유
    }
  }

  render() {

    return (
      <div className='win_body' style={{borderRadius:'0px', borderWidth:'0px 1px 0px 1px'}}>
        <div className='car_manager type2' >
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
              </div>
            </div>
            <div className='grid'>
              <div className='wp'>
                <div style={{width:'100%', height:'100%', overflow:'auto'}}>
                  <Grid pgm={this.props.pgm}
                        id ='main10'
                        selectionChange={(e) => this.onSelectChange(e)}
                        headerClick={(e) => {
                          if(e.columnName === 'chk'){
                            const grid = gfg_getGrid(this.props.pgm, 'main10');
                            if(grid.gridEl.dataset.checked === undefined){
                              grid.gridEl.dataset.checked = 'Y';
                            }else if(grid.gridEl.dataset.checked === 'Y'){
                              grid.gridEl.dataset.checked = 'N';
                            }else{
                              grid.gridEl.dataset.checked = 'Y';
                            }
    
                            let TOTAL_WEIGHT = 0;
                            for(let i = 0; i < grid.getRowCount(); i++){
                              gfg_setValue(grid, 'chk', grid.gridEl.dataset.checked, i);

                              if(grid.gridEl.dataset.checked === 'Y'){
                                TOTAL_WEIGHT += grid.getData()[i].netweight * 1;
                              }
                            }

                            gfs_dispatch('SHIP_PROC_MAIN', 'TOTAL_WEIGHT', {
                              TOTAL_WEIGHT
                            })
                          }
                        }}
                        rowHeight={41}
                        rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                        columns={[
                          columnCheckbox({
                            name: 'chk',
                            header: '선택',
                            width : 50,
                            readOnly: true,
                            align : 'center',
                            type: 'checkbox',
                            checkedChange: () => {
                              this.sumWeight()
                            }
                          }),
                          columnInput({
                            name: 'scaleNumb',
                            header: '계근번호',
                            width : 120,
                            readOnly: true,
                            color : '#0063A9',
                            align : 'center'
                          }),
                          columnInput({
                            name: 'vendorname',
                            header: '업체명',
                            width : 250,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnInput({
                            name: 'cars_no',
                            header: '차량번호',
                            width : 150,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnNumber({
                            name    : 'netweight', 
                            header  : '무게(KG)', 
                            width   : 130, 
                            readOnly: false
                          }),
                          columnDateTime({
                            name  : 'deliverydate',
                            header: '입차일자',
                            width : 100,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT')
                          }),
                          columnDateTime({
                            name  : 'empty_time',
                            header: '공차계량시간',
                            width : 120,
                            height: 38,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT'),
                            time  : 'HH:mm:ss'
                          }),
                          columnNumber({
                            name    : 'empty_wgt', 
                            header  : '공차계량값', 
                            width   : 130, 
                            readOnly: false
                          }),
                          columnInput({
                            name: 'iron_grade',
                            header: '판정등급',
                            width : 180,
                            readOnly: true,
                            align : 'center'
                          }),
                          columnInput({
                            name: 'inspect_user',
                            header: '판정(검수)',
                            width : 180,
                            readOnly: true,
                            align : 'center'
                          })
                        ]}
                  />
                </div>
              </div>
              <div className='grid_info'>
                <span className='title'>전체차량</span><Botspan column='BOT_TOTAL' reducer='SHIP_PROC_MAIN' />
                <span className='title' style={{paddingLeft:'50px'}}>입고량</span><Botspan reducer='DAILY_PROC_MAIN' column='TOTAL_WEIGHT' />
              </div>
            </div>
          </div>
          <div style={{paddingBottom:'90px', paddingTop:'60px'}} className='car_info'>
            <div className='title'><span>계근번호</span><Detailspan flag={1}  reducer='SHIP_PROC_MAIN'/></div>

            <div className='tab_content' id='tabMain'>
              <div className='input_list on' id={`content1_${this.props.pgm}`}>
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
                                oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                                  p_division    : 'P005'
                                })}
                                onChange = {async (e) => {
                                  const combo = gfo_getCombo(this.props.pgm, 'detail_grade2');
                                  combo.setValue(null);
                                  combo.setDisabled(true);

                                  if(e !== undefined && e.value !== ''){
                                    await combo.onReset({oracleSpData:  gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                                      p_division    : e.value
                                    })});
                                    combo.setDisabled(false);
                                  }else{
                                    combo.setDisabled(true);
                                  }
                                }}
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
                            onChange = {async (e) => {
                              const combo = gfo_getCombo(this.props.pgm, 'detail_subt_leg');
                              combo.setValue(null);
                              combo.setDisabled(true);

                              if(e === undefined) return;

                              if(e.value !== '0'){
                                await combo.onReset({oracleSpData:  gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                                  p_division    : e.value
                                })});
                                combo.setDisabled(false);
                              }
                            }}
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
                            emptyRow
                            onChange = {async (e) => {
                              const combo = gfo_getCombo(this.props.pgm, 'detail_depr2');
                              combo.setValue(null);

                              if(e === undefined) return;

                              if(e !== undefined && e.value !== ''){
                                combo.setDisabled(false);
                              }else{
                                combo.setDisabled(true);
                              }
                            }}
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
                          placeholder = '하차구역 검색(SECTOR)'
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
                            emptyRow
                            onChange = {e => {
                              const combo = gfo_getCombo(this.props.pgm, 'detail_rtn2');
                              combo.setValue(null);

                              if(e === undefined) return;

                              if(e.value === ''){
                                combo.setDisabled(true);
                              }else{
                                combo.setDisabled(false);
                              }
                              // combo.onReset({etcData:  YK_WEB_REQ(`tally_process_pop.jsp?division=${e.value}`, {})});
                            }}
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
                  {/* <li>
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
                  </li> */}
                </ul>
              </div>


              
            </div>
            
            <CompleteBtn pgm={this.props.pgm}/>



          </div>
        </div>
      </div>
    );
  }
}

export default SHIP_PROC;