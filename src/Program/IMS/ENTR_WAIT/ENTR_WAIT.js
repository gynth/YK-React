//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_showMask, gfc_hideMask, gfc_sleep } from '../../../Method/Comm';
import { gfs_injectAsyncReducer, gfs_dispatch, gfs_getStoreValue } from '../../../Method/Store';
import { gfg_getGrid, gfg_setSelectRow, gfg_appendRow } from '../../../Method/Grid';
import { gfo_getCombo, gfo_getInput } from '../../../Method/Component';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';

import Combobox from '../../../Component/Control/Combobox';

// import Mainspan from './Mainspan';
import Botspan from '../Common/Botspan';

import { YK_WEB_REQ } from '../../../WebReq/WebReq';
//#endregion

class ENTR_WAIT extends Component {
  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const ENTR_WAIR_MAIN = (nowState, action) => {

      if(action.reducer !== 'ENTR_WAIR_MAIN') {
        return {
          BOT_TOTAL    : nowState === undefined ? 0 : nowState.BOT_TOTAL,
        };
      }

      if(action.type === 'BOT_TOTAL'){

        return Object.assign({}, nowState, {
          BOT_TOTAL : action.BOT_TOTAL
        })
      }
    }

    gfs_injectAsyncReducer('ENTR_WAIR_MAIN', ENTR_WAIR_MAIN);
    //#endregion
  }

  
  mainGrid = () => {
    const grid = gfg_getGrid(this.props.pgm, 'main10');

    YK_WEB_REQ(`tally_mstr_drive_wait.jsp`).then(e => {
      const main = e.data.dataSend;

      if(main){
        const search_tp = gfo_getCombo(this.props.pgm, 'search_tp').getValue();
        const search_txt = gfo_getInput(this.props.pgm, 'search_txt').getValue();
    
        const data = main.filter(e => {
          if(search_tp !== null && search_tp !== ''){
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
              if(e.itemGrade.indexOf(search_txt) >= 0){
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
          }else{
            return true;
          }
        })

        if(data.length > 0){
          
          //기존 그리드에서 SCRP_ORD_NO기준으로 데이터가 없으면 추가한다.
          for(let i = 0; i < data.length; i++){
            const SCRP_ORD_NO = data[i].SCRP_ORD_NO;

            const oldData = grid.getData().find(e => e.SCRP_ORD_NO === SCRP_ORD_NO);
            if(!oldData){
              gfg_appendRow(grid, grid.getRowCount(), {
                SCRP_ORD_NO,
                VENDOR: data[i].VENDOR,
                LOAD_AREA_ADDR: data[i].LOAD_AREA_ADDR,
                VEHL_NO: data[i].VEHL_NO,
                DRIVER_NM: data[i].DRIVER_NM,
                DRIVER_CELL_NO: data[i].DRIVER_CELL_NO
              }, 'SCRP_ORD_NO', false);

              grid.resetOriginData()
            }
          }

          //새로운 정보 기준으로 데이터가 지워졌으면 삭제한다.
          for(let i = 0; i < grid.getData().length; i++){
            const SCRP_ORD_NO =  grid.getData()[i].SCRP_ORD_NO;

            const newData = data.find(e => e.SCRP_ORD_NO === SCRP_ORD_NO)
            if(!newData){
              grid.removeRow(i);
            }
          }

          if(gfs_getStoreValue('ENTR_WAIR_MAIN', 'BOT_TOTAL') !== data.length)
            gfs_dispatch('ENTR_WAIR_MAIN', 'BOT_TOTAL', {BOT_TOTAL: data.length});
        }else{
          grid.clear();
          if(gfs_getStoreValue('ENTR_WAIR_MAIN', 'BOT_TOTAL') !== 0)
            gfs_dispatch('ENTR_WAIR_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
        }
      }else{
        grid.clear();
        if(gfs_getStoreValue('ENTR_WAIR_MAIN', 'BOT_TOTAL') !== 0)
          gfs_dispatch('ENTR_WAIR_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
      }
    })
  }

  // componentDidMount(){
  //   // this.Retrieve();
    
  //   this.mainGridInterval = setInterval(e => {
  //     this.mainGrid();
  //   }, 2000)
  // }

  // componentWillUnmount(){
  //   clearInterval(this.mainGridInterval);
  // }

  Retrieve = async () => {

    gfc_showMask();
    gfs_dispatch('ENTR_WAIR_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});

    const mainData = await YK_WEB_REQ(`tally_mstr_drive_wait.jsp`);
    const main = mainData.data.dataSend;
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    grid.clear();
    
    if(!main) {
      gfc_hideMask();
      return;
    }

    const search_tp = gfo_getCombo(this.props.pgm, 'search_tp').getValue();
    const search_txt = gfo_getInput(this.props.pgm, 'search_txt').getValue();

    const data = main.filter(e => {
      if(search_tp !== null && search_tp !== ''){
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
          if(e.itemGrade.indexOf(search_txt) >= 0){
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
        
      }else{
        return true;
      }
    })

    if(data.length > 0){

      grid.resetData(data);
      gfs_dispatch('ENTR_WAIR_MAIN', 'BOT_TOTAL', {BOT_TOTAL: data.length});
      
      await gfc_sleep(100);

      gfg_setSelectRow(grid);
    }else{
      gfs_dispatch('ENTR_WAIR_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
    }

    gfc_hideMask();
  }

  render() {

    return (
      <div className='win_body' style={{borderRadius:'0px', borderWidth:'0px 1px 0px 1px'}}>
        <div className='car_manager type3' >
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
                              name: '배차번호'
                            },{
                              code: '2',
                              name: '차량번호'
                            },{
                              code: '3',
                              name: '사전등급'
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
                        rowHeight={41}
                        rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                        columns={[
                          columnInput({
                            name: 'SCRP_ORD_NO',
                            header: '배차번호',
                            width : 160,
                            readOnly: true,
                            color : '#0063A9',
                            align : 'center'
                          }),
                          columnInput({
                            name: 'VENDOR',
                            header: '공급사/실공급사',
                            width : 250,
                            readOnly: true,
                            align : 'left'
                          }),   
                          columnInput({
                            name: 'LOAD_AREA_ADDR',
                            header: '실상차지주소',
                            width : 250,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnInput({
                            name: 'VEHL_NO',
                            header: '차량번호',
                            width : 300,
                            readOnly: true,
                            align : 'center'
                          }),
                          columnInput({
                            name: 'DRIVER_NM',
                            header: '운전자명',
                            width : 120,
                            readOnly: true,
                            align : 'center'
                          }),
                          columnInput({
                            name: 'DRIVER_CELL_NO',
                            header: '운전자휴대폰번호',
                            width : 150,
                            readOnly: true,
                            align : 'center'
                          }),
                        ]}
                  />
                </div>
              </div>
              <div className='grid_info'>
                <span className='title'>전체차량</span><Botspan reducer='ENTR_WAIR_MAIN' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ENTR_WAIT;