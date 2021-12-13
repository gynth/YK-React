//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';
import Checkbox from '../../../Component/Control/Checkbox';

import { gfc_initPgm, gfc_yk_call_sp, gfc_showMask, gfc_hideMask, gfc_ftp_file_yn_YK, gfc_sleep } from '../../../Method/Comm';
import { gfs_getStoreValue, gfs_injectAsyncReducer, gfs_dispatch, gfs_subscribe } from '../../../Method/Store';
import { gfo_getCombo, gfo_getInput, gfo_getCheckbox } from '../../../Method/Component';
import { gfg_getGrid, gfg_setSelectRow, gfg_appendRow } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { TextArea as columnTextArea } from '../../../Component/Grid/Column/TextArea';
import { DateTime as columnDateTime } from '../../../Component/Grid/Column/DateTime';

import Combobox from '../../../Component/Control/Combobox';

// import Mainspan from './Mainspan';
import Detailspan from '../Common/Detailspan';
import Botspan from '../Common/Botspan';
import Chit from '../Common/Chit/Chit';
import CompleteBtn from './CompleteBtn';
import TabList from './TabList';
import RecImage from '../Common/RecImage';
//#endregion

let retData = [];
class DISP_PROC extends Component {

  state = {
    wait_list: [],
    scaleNumb: ''
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
    //#endregion
  }

  
  mainGrid = async() => {

    try{
      const grid = gfg_getGrid(this.props.pgm, 'main10');
      const search_tp = gfo_getCombo(this.props.pgm, 'search_tp').getValue();
      const search_txt = gfo_getInput(this.props.pgm, 'search_txt').getValue();
      

      if(search_tp !== null && search_tp !== '' && search_txt !== ''){
        let main = retData.filter(e => {
          //계근번호
          if(search_tp === '1'){
            if(e.scaleNumb.indexOf(search_txt) >= 0){
              return true;
            }else{
              return false;
            }
          }
          //차량번호
          else if(search_tp === '2'){
            if(e.carNumb.indexOf(search_txt) >= 0){
              return true;
            }else{
              return false;
            }
          }
          //사전등급
          else if(search_tp === '3'){
            if(e.preItemGrade.indexOf(search_txt) >= 0){
              return true;
            }else{
              return false;
            }
          }
          //업체
          else if(search_tp === '4'){
            if(e.vendor.indexOf(search_txt) >= 0){
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
        const select = await gfc_yk_call_sp('SP_ZM_MSTR_PASS');
        if(select.data.SUCCESS === 'Y'){
          const main = select.data.ROWS;
    
          
          const dataMod = [];
          main.forEach(e => {
            dataMod.push({
              scaleNumb: e['DELIVERY_ID'].toString(),
              carNumb: e['VEHICLE_NO'],
              preItemGrade: e['PRE_ITEM_GRADE'],
              itemGrade: e['ITEM_GRADE'],
              date: e['CREATION_DATE'],
              lastDate: e['LASTDATE'],
              vendor: e['VENDOR_NAME']
            })
          })
      
          if(dataMod.length > 0){
            
            //기존 그리드에서 scaleNumb기준으로 데이터가 없으면 추가한다.
            for(let i = 0; i < dataMod.length; i++){
              const scaleNumb = dataMod[i].scaleNumb;
    
              const oldData = grid.getData().find(e => e.scaleNumb === scaleNumb);
              if(!oldData){
                gfg_appendRow(grid, grid.getRowCount(), {
                  scaleNumb,
                  carNumb: dataMod[i].carNumb,
                  preItemGrade: dataMod[i].preItemGrade,
                  itemGrade: dataMod[i].itemGrade,
                  date: dataMod[i].date,
                  lastDate: dataMod[i].lastDate,
                  vendor: dataMod[i].vendor
                }, 'scaleNumb', false);
              }
            }
    
            //새로운 정보 기준으로 데이터가 지워졌으면 삭제한다.
            for(let i = 0; i < grid.getData().length; i++){
              const scaleNumb =  grid.getData()[i].scaleNumb;
    
              const newData = dataMod.find(e => e.scaleNumb === scaleNumb)
              if(!newData){
                grid.removeRow(i);
    
                //지워진 데이터가 기존에 선택된 데이터 이면 초기화 한다.
                const selectScaleNumb = gfs_getStoreValue('DISP_PROC_MAIN', 'DETAIL_SCALE');
                if(scaleNumb === selectScaleNumb){
                  gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: ''});
                  gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: ''});
                  gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: '0'});
                  gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: ''});
                }
              }
            }
    
            retData = grid.getData();
            grid.resetOriginData();
            grid.restore();
    
            const scaleNumb = gfs_getStoreValue('DISP_PROC_MAIN', 'DETAIL_SCALE');
            if(scaleNumb !== ''){
              const row = grid.getData().find(e => e.scaleNumb === scaleNumb);
              if(row){
                gfg_setSelectRow(grid, 'scaleNumb', row.rowKey, true);
              }
            }
            
            if(gfs_getStoreValue('DISP_PROC_MAIN', 'BOT_TOTAL') !== dataMod.length)
              gfs_dispatch('DISP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: dataMod.length});
          }else{
            grid.clear();
            if(gfs_getStoreValue('DISP_PROC_MAIN', 'BOT_TOTAL') !== 0)
              gfs_dispatch('DISP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
          }
        }else{
          grid.clear();
          if(gfs_getStoreValue('DISP_PROC_MAIN', 'BOT_TOTAL') !== 0)
            gfs_dispatch('DISP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
        }
      }

      
    }catch(e){

    }
  }

  componentDidMount(){
    this.mainGridInterval = setInterval(e => {
      this.mainGrid();
    }, 5000)

    this.Retrieve();
  }

  componentWillUnmount(){
    clearInterval(this.mainGridInterval);
  }

  // Retrieve = async () => {

  //   gfc_showMask();

  //   gfo_getInput(this.props.pgm, 'detail_pre_grade').setValue(''); //사전등급
  //   gfo_getCombo(this.props.pgm, 'detail_grade1').setValue('');   //고철등급
  //   gfo_getCombo(this.props.pgm, 'detail_grade2').setValue('');   //상세고철등급
  //   gfo_getCombo(this.props.pgm, 'detail_subt').setValue('');     //감량중량
  //   gfo_getCombo(this.props.pgm, 'detail_subt_leg').setValue(''); //감량사유
  //   gfo_getCombo(this.props.pgm, 'detail_depr').setValue('');     //감가내역
  //   gfo_getCombo(this.props.pgm, 'detail_depr2').setValue('');    //감가비율
  //   gfo_getCombo(this.props.pgm, 'detail_car').setValue('');      //차종구분
  //   gfo_getCombo(this.props.pgm, 'detail_rtn').setValue('');      //반품구분
  //   gfo_getCombo(this.props.pgm, 'detail_rtn2').setValue('');     //반품구분사유
  //   gfo_getCheckbox(this.props.pgm, 'detail_warning').setValue('');  //경고

  //   gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: ''});
  //   gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: ''});
  //   gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: ''});
  //   gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: ''});

  //   gfs_dispatch('DISP_PROC_MAIN', 'CHIT_INFO', {
  //     chit     : false,
  //     scaleNumb: ''
  //   });

  //   const grid = gfg_getGrid(this.props.pgm, 'main10');
  //   const data = [{
  //     scaleNumb: '202110070001',
  //     carNumb  : '68무6308',
  //     preItemGrade: '사전등급',
  //     itemGrade   : '검수등급',
  //     date        : new Date(),
  //     lastDate    : new Date(),
  //     vendor      : '벤더'
  //   },{
  //     scaleNumb: '202110070002',
  //     carNumb  : '68무6308',
  //     preItemGrade: '사전등급',
  //     itemGrade   : '검수등급',
  //     date        : new Date(),
  //     lastDate    : new Date(),
  //     vendor      : '벤더'
  //   }]

  //   if(data.length > 0){
  //     grid.resetData(data);
  //     gfs_dispatch('DISP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: data.length});
      
  //     await gfc_sleep(100);

  //     gfg_setSelectRow(grid);
  //   }else{
  //     gfs_dispatch('DISP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
  //   }

  //   gfc_hideMask();
  // }

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

    gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: ''});
    gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: ''});
    gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: ''});
    gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: ''});

    gfs_dispatch('DISP_PROC_MAIN', 'CHIT_INFO', {
      chit     : false,
      scaleNumb: ''
    });

    this.mainGrid();

    gfc_hideMask();
  }


  onSelectChange = async (e) => {
    if(e === null) return;

    gfs_dispatch('DISP_PROC_MAIN', 'GRID_SCALE', {GRID_SCALE: e.scaleNumb});

    //계량증명서 정보여부
    const chitInfoYn = await gfc_yk_call_sp('SP_ZM_CHIT', {
      P_SCALENUMB: e.scaleNumb
    });

    if(chitInfoYn.data.SUCCESS === 'N'){
      alert('계량증명서 정보가 없습니다.');
      gfc_hideMask();
      return;
    }

    //기존 등록된 정보
    const dtlInfo = await gfc_yk_call_sp('SP_ZM_PROCESS_F_SEL', {
      P_SCALENUMB: e.scaleNumb
    });
    
    if(dtlInfo.data.SUCCESS === 'N'){
      alert('검수정보를 불러올수 없습니다.');
      return;
    }

    gfo_getInput(this.props.pgm, 'detail_pre_grade').setValue(e.preItemGrade); //사전등급
    gfo_getCombo(this.props.pgm, 'detail_grade1').setValue(dtlInfo.data.ROWS[0].IRON_GRADE);   //고철등급
    const detail_grade2 = gfo_getCombo(this.props.pgm, 'detail_grade2');
    await detail_grade2.onReset({oracleSpData:  gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
      p_division    : dtlInfo.data.ROWS[0].IRON_GRADE
    })});
    detail_grade2.setValue(dtlInfo.data.ROWS[0].IRON_GRADE_ITEM);   //상세고철등급
    gfo_getCombo(this.props.pgm, 'detail_subt').setValue(dtlInfo.data.ROWS[0].REDUCE_WGT);     //감량중량
    gfo_getCombo(this.props.pgm, 'detail_subt_leg').setValue(dtlInfo.data.ROWS[0].REDUCE_WGT_REASON_CODE); //감량사유
    gfo_getCombo(this.props.pgm, 'detail_depr').setValue(dtlInfo.data.ROWS[0].DISCOUNT_CODE);     //감가내역
    gfo_getCombo(this.props.pgm, 'detail_depr2').setValue(dtlInfo.data.ROWS[0].DISCOUNT_RATE);    //감가비율
    gfo_getCombo(this.props.pgm, 'detail_car').setValue(dtlInfo.data.ROWS[0].CAR_TYPE);      //차종구분
    gfo_getCombo(this.props.pgm, 'detail_out').setValue(dtlInfo.data.ROWS[0].SECTOR_CODE);      //하차구역
    gfo_getCombo(this.props.pgm, 'detail_rtn').setValue(dtlInfo.data.ROWS[0].RETURN_GUBUN);      //반품구분
    gfo_getCombo(this.props.pgm, 'detail_rtn2').setValue(dtlInfo.data.ROWS[0].RETURN_CODE);     //반품구분사유
    gfo_getCheckbox(this.props.pgm, 'detail_warning').setValue(dtlInfo.data.ROWS[0].WARNING);  //경고
    gfo_getInput(this.props.pgm, 'detail_rain').setValue(dtlInfo.data.ROWS[0].RAIN); //강수량

    gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: e.scaleNumb});
    gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: e.carNumb});
    gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: e.totalWgt});
    gfs_dispatch('DISP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: e.date});

    //계량증명서 여부 확인.
    const chitYn = await gfc_ftp_file_yn_YK(e.scaleNumb);

    gfs_dispatch('DISP_PROC_MAIN', 'CHIT_INFO', {
      date     : chitInfoYn.data.ROWS[0].CREATION_DATE,
      scaleNumb: chitInfoYn.data.ROWS[0].DELIVERY_ID.toString(),
      carNumb  : chitInfoYn.data.ROWS[0].VEHICLE_NO,
      vender   : chitInfoYn.data.ROWS[0].VENDOR_NAME,
      itemFlag : e.itemGrade,
      Wgt      : chitInfoYn.data.ROWS[0].TOTAL_WEIGHT,
      loc      : chitInfoYn.data.ROWS[0].AREA,
      user     : gfs_getStoreValue('USER_REDUCER', 'USER_NAM'),
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
                              NAME: '사전등급'
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
                       // onKeyDown   = {(e) => {
                       //   if(e.keyCode === 13){
                       //     this.Retrieve()
                       //   }
                       // }}
                       onChange    = {(e) => {
                         if(e.target.value.length > 0)
                           this.Retrieve()
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
                            name: 'preItemGrade',
                            header: '사전등급',
                            width : 120,
                            readOnly: true,
                            align : 'center'
                          }),     
                          columnInput({
                            name: 'itemGrade',
                            header: '판정등급',
                            width : 120,
                            readOnly: true,
                            align : 'center'
                          }), 
                          columnDateTime({
                            name  : 'date',
                            header: '입차시간',
                            width : 120,
                            height: 38,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT'),
                            time  : 'HH:mm:ss'
                          }),
                          columnDateTime({
                            name  : 'lastDate',
                            header: '검수시간',
                            width : 120,
                            height: 38,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT'),
                            time  : 'HH:mm:ss'
                          }),
                          columnTextArea({
                            name: 'vendor',
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
                <span className='title'>전체차량</span><Botspan reducer='DISP_PROC_MAIN' />
              </div>
            </div>
          </div>
          <div id={`car_info_${this.props.pgm}`} className='car_info'>
            <div className='title'><span>계근번호</span><Detailspan flag={1}  reducer='DISP_PROC_MAIN'/></div>



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
                                // await combo.onReset({oracleSpData:  gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                                //   p_division    : e.value
                                // })});
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
                  <li>
                    <h5>경고</h5>
                    <Checkbox pgm   = {this.props.pgm}
                              id    = 'detail_warning'
                              width = '30px'
                              height= '30px'

                    />
                  </li>
                  <li>
                    <h5>강수량</h5>
                      <Input pgm     = {this.props.pgm}
                             id      = 'detail_rain'
                             width   = '100%'
                             disabled
                      />
                  </li>
                </ul>
              </div>
              
              <Chit pgm={this.props.pgm} id={'chit_memo'} reducer='DISP_PROC_MAIN'/>
              


              
            </div>
            <CompleteBtn pgm={this.props.pgm}/>




          </div>
            <div className='cctv_viewer' style={{overflow: 'auto'}}>
              <h4>녹화영상</h4>
              <div className='cctv_list'>
                  <RecImage 
                    seq     = {1}
                    reducer = 'DISP_PROC_MAIN'
                    rec     = 'STD_CAM_REC'/> 
                  <RecImage 
                    seq     = {2}
                    reducer = 'DISP_PROC_MAIN'
                    rec     = 'DUM_CAM_REC'/> 
                  <RecImage 
                    seq     = {3}
                    reducer = 'DISP_PROC_MAIN'
                    rec     = 'DUM_CAM_REC'/> 
                  <RecImage 
                    seq     = {4}
                    reducer = 'DISP_PROC_MAIN'
                    rec     = 'DUM_CAM_REC'/> 
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default DISP_PROC;