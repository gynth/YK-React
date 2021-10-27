//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_showMask, gfc_hideMask, gfc_sleep, gfc_yk_call_sp } from '../../../Method/Comm';
import { gfs_injectAsyncReducer, gfs_dispatch, gfs_getStoreValue } from '../../../Method/Store';
import { gfg_getGrid, gfg_setSelectRow, gfg_appendRow } from '../../../Method/Grid';
import { gfo_getCombo, gfo_getInput } from '../../../Method/Component';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';

import Combobox from '../../../Component/Control/Combobox';

// import Mainspan from './Mainspan';
import Botspan from '../Common/Botspan';

//#endregion

let retData = [];
class ENTR_WAIT extends Component {
  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const ENTR_WAIT_MAIN = (nowState, action) => {

      if(action.reducer !== 'ENTR_WAIT_MAIN') {
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

    gfs_injectAsyncReducer('ENTR_WAIT_MAIN', ENTR_WAIT_MAIN);
    //#endregion
  }

  componentDidMount(){
    setTimeout(() => {
      this.Retrieve();
    }, 500);
  }

  // componentWillUnmount(){
  //   clearInterval(this.mainGridInterval);
  // }

  Retrieve = async () => {

    gfs_dispatch('ENTR_WAIT_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
    
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    const search_tp = gfo_getCombo(this.props.pgm, 'search_tp').getValue();
    const search_txt = gfo_getInput(this.props.pgm, 'search_txt').getValue();
    grid.clear();

    if(search_tp !== null && search_tp !== '' && search_txt !== ''){
      let main = retData.filter(e => {
        //계근번호
        if(search_tp === '1'){
          if(e.SCRP_ORD_NO.indexOf(search_txt) >= 0){
            return true;
          }else{
            return false;
          }
        }
        //공급사
        else if(search_tp === '2'){
          if(e.VENDOR.indexOf(search_txt) >= 0){
            return true;
          }else{
            return false;
          }
        }
        //차량번호
        else if(search_tp === '3'){
          if(e.VEHL_NO.indexOf(search_txt) >= 0){
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
      const mainData = await gfc_yk_call_sp(`SP_ZM_MSTR_DRIVE_WAIT`);
      if(mainData.data.SUCCESS === 'Y'){
        const main = mainData.data.ROWS;
        
        if(!main) {
          gfc_hideMask();
          return;
        }
    
        if(main.length > 0){
    
          grid.resetData(main);
          gfs_dispatch('ENTR_WAIT_MAIN', 'BOT_TOTAL', {BOT_TOTAL: main.length});
          
          await gfc_sleep(100);
    
          gfg_setSelectRow(grid);
        }else{
          gfs_dispatch('ENTR_WAIT_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
        }
        
        retData = grid.getData();
    
        gfc_hideMask();
      }else{
        gfs_dispatch('ENTR_WAIT_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
        gfc_hideMask();
      }
    }
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
                            value   = 'CODE'
                            display = 'NAME'
                            width   = {124}
                            height  = {42}
                            emptyRow
                            data    = {[{
                              CODE: '1',
                              NAME: '배차번호'
                            },{
                              CODE: '2',
                              NAME: '공급사'
                            },{
                              CODE: '3',
                              NAME: '차량번호'
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
                <span className='title'>전체차량</span><Botspan reducer='ENTR_WAIT_MAIN' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ENTR_WAIT;