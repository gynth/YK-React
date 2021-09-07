//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_showMask, gfc_hideMask, gfc_sleep } from '../../../Method/Comm';
import { gfs_injectAsyncReducer, gfs_dispatch } from '../../../Method/Store';
import { gfg_getGrid, gfg_setSelectRow } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';

import Combobox from '../../../Component/Control/Combobox';

// import Mainspan from './Mainspan';
import Botspan from '../Common/Botspan';

import { YK_WEB_REQ } from '../../../WebReq/WebReq';
//#endregion

class ENTR_PROC extends Component {
  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const ENTR_PROC_MAIN = (nowState, action) => {

      if(action.reducer !== 'ENTR_PROC_MAIN') {
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

    gfs_injectAsyncReducer('ENTR_PROC_MAIN', ENTR_PROC_MAIN);
    //#endregion
  }

  componentDidMount(){
    
  }

  Retrieve = async () => {

    gfc_showMask();
    gfs_dispatch('ENTR_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});

    const mainData = await YK_WEB_REQ(`tally_mstr_drive.jsp`);
    const main = mainData.data.dataSend;
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    grid.clear();
    
    if(main){

      grid.resetData(main);
      gfs_dispatch('ENTR_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: main.length});
      
      await gfc_sleep(100);

      gfg_setSelectRow(grid);
    }else{
      gfs_dispatch('ENTR_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
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
                              name: '등급'
                            },{
                              code: '4',
                              name: '사전등급'
                            },{
                              code: '5',
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
                        rowHeight={41}
                        rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                        columns={[
                          columnInput({
                            name: 'dispatchNumb',
                            header: '배차번호',
                            width : 120,
                            readOnly: true,
                            color : '#0063A9',
                            align : 'center',
                            fontSize: '18'
                          }),
                          columnInput({
                            name: 'carNumb',
                            header: '차량번호',
                            width : 160,
                            readOnly: true,
                            align : 'center',
                            fontSize: '18'
                          }),   
                          columnInput({
                            name: 'preItemGrade',
                            header: '사전등급',
                            width : 130,
                            readOnly: true,
                            align : 'left',
                            fontSize: '18'
                          }),
                          columnCombobox({
                            name: 'itemFlag', 
                            header: '등급',
                            readOnly: true,
                            fontSize: '18',
                            width   : 130,
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
                            name: 'vendor',
                            header: '업체명',
                            width : 300,
                            readOnly: true,
                            align : 'left',
                            fontSize: '18'
                          }),
                          columnInput({
                            name: 'loadaddr',
                            header: '상차주소',
                            width : 420,
                            readOnly: true,
                            align : 'left',
                            fontSize: '18'
                          }),
                          columnInput({
                            name: 'addr',
                            header: '주소',
                            width : 200,
                            readOnly: true,
                            align : 'left',
                            fontSize: '18'
                          }),
                        ]}
                  />
                </div>
              </div>
              <div className='grid_info'>
                <span className='title'>전체차량</span><Botspan reducer='ENTR_PROC_MAIN' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ENTR_PROC;