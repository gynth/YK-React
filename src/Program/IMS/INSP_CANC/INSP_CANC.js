//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_showMask, gfc_hideMask, gfc_yk_call_sp } from '../../../Method/Comm';
import { gfs_getStoreValue, gfs_injectAsyncReducer, gfs_dispatch, gfs_subscribe } from '../../../Method/Store';
import { gfo_getCombo, gfo_getInput } from '../../../Method/Component';
import { gfg_getGrid, gfg_setValue } from '../../../Method/Grid';
import { getDynamicSql_Oracle } from '../../../db/Oracle/Oracle';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { TextArea as columnTextArea } from '../../../Component/Grid/Column/TextArea';
import { Checkbox as columnCheckbox } from '../../../Component/Grid/Column/Checkbox';
import { DateTime as columnDateTime } from '../../../Component/Grid/Column/DateTime';

import Combobox from '../../../Component/Control/Combobox';

// import Mainspan from './Mainspan';
import Detailspan from '../Common/Detailspan';
import Botspan from '../Common/Botspan';
import Chit from './Chit';
import CompleteBtn from './CompleteBtn';
//#endregion

let retData = [];
class INSP_CANC extends Component {

  state = {
    wait_list: [],
    scaleNumb: ''
  }

  onTabChg = async() => {

  }

  //#region onActiveWindow 스토어 subscribe로 실행됨.
  onActiveWindow = () => {
    const activeWindow = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'activeWindow');
    if(activeWindow.programId === 'INSP_CANC'){
      this.onTabChg();
    }
  }
  //#endregion

  //#endregion

  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const INSP_CANC_MAIN = (nowState, action) => {

      if(action.reducer !== 'INSP_CANC_MAIN') {
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

    gfs_injectAsyncReducer('INSP_CANC_MAIN', INSP_CANC_MAIN);
    gfs_subscribe(this.onActiveWindow);
    //#endregion
  }

  Retrieve = async () => {


    const grid = gfg_getGrid(this.props.pgm, 'main10');
    const search_tp = gfo_getCombo(this.props.pgm, 'search_tp').getValue();
    const search_txt = gfo_getInput(this.props.pgm, 'search_txt').getValue();
    grid.clear();

    if(search_tp !== null && search_tp !== '' && search_txt !== ''){
      let main = retData.filter(e => {
        //계근번호
        if(search_tp === '1'){
          if(e.scaleNumb.toString().indexOf(search_txt) >= 0){
            return true;
          }else{
            return false;
          }
        }
        //차량번호
        else if(search_tp === '2'){
          if(e.vehicle_no.indexOf(search_txt) >= 0){
            return true;
          }else{
            return false;
          }
        }
        //사전등급
        else if(search_tp === '3'){
          if(e.pre_item_grade.indexOf(search_txt) >= 0){
            return true;
          }else{
            return false;
          }
        }
        //업체
        else if(search_tp === '4'){
          if(e.vendor_name.indexOf(search_txt) >= 0){
            return true;
          }else{
            return false;
          }
        }
      })
      grid.resetData(main);
      grid.resetOriginData()
      grid.restore();
    }else{
      gfc_showMask();
      const mainData = await gfc_yk_call_sp('SP_ZM_APPROVE_CANCEL');
      
      gfo_getInput(this.props.pgm, 'pre_item_grade').setValue(''); //사전등급
      gfo_getInput(this.props.pgm, 'iron_grade').setValue('');   //고철등급
      gfo_getInput(this.props.pgm, 'iron_grade_item_name').setValue('');   //상세고철등급
      gfo_getInput(this.props.pgm, 'reduce_wgt').setValue('');     //감량중량
      gfo_getInput(this.props.pgm, 'reduce_name').setValue(''); //감량사유
      gfo_getCombo(this.props.pgm, 'return_code').setValue('');      //반품구분
      gfo_getInput(this.props.pgm, 'return_gubun_name').setValue('');     //반품구분사유
      gfo_getCombo(this.props.pgm, 'return_reason').setValue('');      //취소사유
      gfo_getInput(this.props.pgm, 'return_reason_desc').setValue('');     //취소사유
  
      gfs_dispatch('INSP_CANC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: ''});
      gfs_dispatch('INSP_CANC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: ''});
      gfs_dispatch('INSP_CANC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: ''});
      gfs_dispatch('INSP_CANC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: ''});
  
      gfs_dispatch('INSP_CANC_MAIN', 'GRID_SCALE', {GRID_SCALE: ''});
  
      //계량증명서 여부 확인.
      gfs_dispatch('INSP_CANC_MAIN', 'CHIT_INFO', {
        scaleNumb: ''
      });
  
      if(mainData.data.SUCCESS === 'Y'){
        const main = mainData.data.ROWS;
        if(main){
          const dataMod = [];
          main.forEach(e => {
            dataMod.push({
              scaleNumb: e['DELIVERY_ID'],
              vehicle_no: e['VEHICLE_NO'],
              pre_item_grade: e['PRE_ITEM_GRADE'],
              iron_grade: e['IRON_GRADE'],
              iron_grade_item_name: e['IRON_GRADE_ITEM_NAME'],
              reduce_name	: e['REDUCE_NAME'],
              reduce_wgt: e['REDUCE_WGT'],
              return_gubun: e['RETURN_GUBUN'],
              return_gubun_name: e['RETURN_GUBUN_NAME'],
              inspector: e['INSPECTOR'],
              delivery_date: e['DELIVERY_DATE'],
              vendor_name: e['VENDOR_NAME'],
              inspect_time: e['INSPECT_TIME']
            })
          })
  
          grid.resetData(dataMod);
          gfs_dispatch('INSP_CANC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: main.length});
          
          // await gfc_sleep(100);
    
          // gfg_setSelectRow(grid);
        }else{
          gfs_dispatch('INSP_CANC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
        }
  
        retData = grid.getData();
      }else{
        gfs_dispatch('INSP_CANC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
      }

      gfc_hideMask();
    }
  }

  componentDidMount(){
    setTimeout(() => {
      this.Retrieve();
    }, 500);
  }

  onSelectChange = async (e) => {
    if(e === null) return;

    gfo_getInput(this.props.pgm, 'pre_item_grade').setValue(e.pre_item_grade); //사전등급
    gfo_getInput(this.props.pgm, 'iron_grade').setValue(e.iron_grade);   //고철등급
    gfo_getInput(this.props.pgm, 'iron_grade_item_name').setValue(e.iron_grade_item_name);   //상세고철등급
    gfo_getInput(this.props.pgm, 'reduce_wgt').setValue(e.reduce_wgt);     //감량중량
    gfo_getInput(this.props.pgm, 'reduce_name').setValue(e.reduce_name); //감량사유
    gfo_getCombo(this.props.pgm, 'return_code').setValue(e.return_gubun);      //반품구분
    gfo_getInput(this.props.pgm, 'return_gubun_name').setValue(e.return_gubun_name);     //반품구분사유

    gfs_dispatch('INSP_CANC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: e.scaleNumb});
    gfs_dispatch('INSP_CANC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: e.vehicle_no});
    gfs_dispatch('INSP_CANC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: e.net_weight});
    gfs_dispatch('INSP_CANC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: e.delivery_date});

    gfs_dispatch('INSP_CANC_MAIN', 'GRID_SCALE', {GRID_SCALE: e.scaleNumb});

    //계량증명서 여부 확인.
    gfs_dispatch('INSP_CANC_MAIN', 'CHIT_INFO', {
      scaleNumb: e.scaleNumb.toString(),
      date     : e.inspect_time
    });
  }

  render() {

    return (
      <div className='win_body' style={{borderRadius:'0px', borderWidth:'0px 1px 0px 1px'}}>
        <div className='car_manager type4' >
          <div style={{paddingBottom:'0'}} className='car_list'>
            <div className='search_line'>
              <div className='wp' >
                <div style={{position:'absolute', left:0, top:0, width:'124px', height:'42px', fontSize:'16px'}}>
                  <Combobox pgm     = {this.props.pgm}
                            id      = 'search_tp'
                            value   = 'CODE'
                            display = 'NAME'
                            width   = {124}
                            height  = {42}
                            emptyRow
                            data    = {[{
                              CODE: '1',
                              NAME: '계근번호'
                            },{
                              CODE: '2',
                              NAME: '차량번호'
                            },{
                              CODE: '3',
                              NAME: '등급'
                            },{
                              CODE: '4',
                              NAME: '업체'
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
                       onChange    = {(e) => {
                         this.Retrieve()
                       }}
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
                        rowHeight={46}
                        rowHeaders= {[{ type: 'rowNum', width: 40 }]}
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
    
                            for(let i = 0; i < grid.getRowCount(); i++){
                              gfg_setValue(grid, 'chk', grid.gridEl.dataset.checked, i);
                            }
                          }
                        }}
                        columns={[
                          columnCheckbox({
                            name: 'chk',
                            header: '선택',
                            width : 50,
                            readOnly: true,
                            align : 'center',
                            type: 'checkbox'
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
                            name: 'vehicle_no',
                            header: '차량번호',
                            width : 110,
                            readOnly: true,
                            align : 'center'
                          }),   
                          columnInput({
                            name: 'pre_item_grade',
                            header: '사전등급',
                            width : 135,
                            readOnly: true,
                            align : 'center'
                          }),   
                          columnInput({
                            name: 'iron_grade',
                            header: '등급',
                            width : 135,
                            readOnly: true,
                            align : 'center'
                          }),    
                          columnInput({
                            name: 'iron_grade_item_name',
                            header: '상세등급',
                            width : 135,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnInput({
                            name: 'reduce_name',
                            header: '감량사유',
                            width : 180,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnInput({
                            name: 'reduce_wgt',
                            header: '감량',
                            width : 80,
                            readOnly: true,
                            align : 'right'
                          }),
                          columnInput({
                            name: 'return_gubun_name',
                            header: '반품내용',
                            width : 200,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnInput({
                            name: 'inspector',
                            header: '검수자',
                            width : 100,
                            readOnly: true,
                            align : 'center'
                          }),  
                          columnDateTime({
                            name  : 'delivery_date',
                            header: '입고일자',
                            width : 120,
                            height: 38,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT')
                          }),
                          columnTextArea({
                            name: 'vendor_name',
                            header: 'Vendor',
                            width : 200,
                            height: 38,
                            readOnly: true,
                            align : 'left'
                          })
                        ]}
                  />
                </div>
              </div>
              <div className='grid_info'>
                <span className='title'>전체차량</span><Botspan reducer='INSP_CANC_MAIN' />
              </div>
            </div>
          </div>
          <div className='car_info'>
            <div className='title'><span>계근번호</span><Detailspan flag={1}  reducer='INSP_CANC_MAIN'/></div>

            <div className='input_list on' id={`content1_${this.props.pgm}`}>
            <ul>
                  <li>
                    <h5>취소사유</h5>
                    <div style={{marginBottom:'5px'}}>
                      <div style={{marginBottom:'5px'}}>
                        <Combobox pgm     = {this.props.pgm}
                              id      = 'return_reason'
                              value   = 'CODEID'
                              display = 'KORFNM'
                              oracleData = {getDynamicSql_Oracle(
                                 'Common/Common',
                                 'INSP_CANC_REASON',
                                 {}, {})}
                        />
                      </div>
                      <Input pgm     = {this.props.pgm}
                             id      = 'return_reason_desc'
                             width   = '100%'
                      />
                    </div>
                  </li>
                  <li>
                    <h5>사전등급</h5>
                      <Input pgm     = {this.props.pgm}
                             id      = 'pre_item_grade'
                             width   = '100%'
                             disabled
                      />
                  </li>
                  <li>
                    <h5>등급</h5>
                    <div style={{marginBottom:'5px'}}>
                      <Input pgm     = {this.props.pgm}
                             id      = 'iron_grade'
                             width   = '100%'
                             disabled
                      />
                    </div>
                    <Input pgm     = {this.props.pgm}
                            id      = 'iron_grade_item_name'
                            width   = '100%'
                            disabled
                    />
                  </li>
                  <li>
                    <h5>감량중량</h5>
                    <div style={{marginBottom:'5px'}}>
                      <Input pgm     = {this.props.pgm}
                              id      = 'reduce_wgt'
                              width   = '100%'
                              disabled
                      />
                    </div>
                    <Input pgm     = {this.props.pgm}
                            id      = 'reduce_name'
                            width   = '100%'
                            disabled
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
                    <h5>반품내용</h5>
                    <div style={{marginBottom:'5px'}}>
                      <div style={{marginBottom:'5px'}}>
                        <Combobox pgm     = {this.props.pgm}
                              id      = 'return_code'
                              value   = 'itemCode'
                              display = 'item'
                              isDisabled
                              oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                                p_division    : 'P110'
                              })}
                        />
                      </div>
                      <Input pgm     = {this.props.pgm}
                              id      = 'return_gubun_name'
                              width   = '100%'
                              disabled
                      />
                    </div>
                  </li>
                </ul>
              </div>
          </div>

          <div className='car_info'>
            <div className="top_btns">
              <button 
                type="button" 
                className="record"
                onClick={e => {
                  const scaleNumb = gfs_getStoreValue('INSP_CANC_MAIN', 'DETAIL_SCALE');
                  
                  if(scaleNumb === '' || scaleNumb === null){
                    alert('선택된 계근번호가 없습니다.');
                    return;
                  }

                  window.open(`HLSViewer?scaleNumb=${scaleNumb}`, `Snapshot`, 'width=1024, height=768, toolbar=no, menubar=no, scrollbars=no, resizable=yes' ); 
                }}><span>녹화영상</span></button>
              <button 
                type="button" 
                className="shot"
                onClick={e => {
                  const scaleNumb = gfs_getStoreValue('INSP_CANC_MAIN', 'DETAIL_SCALE');
                  
                  if(scaleNumb === '' || scaleNumb === null){
                    alert('선택된 계근번호가 없습니다.');
                    return;
                  }

                  window.open(`SnapShot?scaleNumb=${scaleNumb}`, `Snapshot`, 'width=1024, height=768, toolbar=no, menubar=no, scrollbars=no, resizable=yes' ); 
                }}><span>스냅샷</span></button>
            </div>
            <Chit pgm={this.props.pgm} id={'chit_memo'} reducer='INSP_CANC_MAIN'/>
              
            <CompleteBtn pgm='INSP_CANC'/>
          </div>
            {/* <div className='cctv_viewer'>
              <h4>녹화영상</h4>
              <div className='cctv_list'>
                <RecImage 
                  seq   = {1}
                  cam   = 'STD_CAM_OPEN' 
                  focus = 'STD_CAM_FOCUS' 
                  rec   = 'STD_CAM_REC' 
                  image = 'STD_CAM_IMG'/> 
                <RecImage
                  seq   = {2}
                  cam   = 'DUM_CAM_OPEN' 
                  focus = 'DUM_CAM_FOCUS' 
                  rec   = 'DUM_CAM_REC' 
                  image = 'DUM_CAM_IMG'/> 
              </div>
            </div> */}
        </div>
      </div>
    );
  }
}

export default INSP_CANC;