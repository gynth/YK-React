//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_showMask, gfc_hideMask, gfc_getAtt } from '../../../Method/Comm';
import { gfs_injectAsyncReducer, gfs_dispatch, gfs_getStoreValue } from '../../../Method/Store';
import { gfg_getGrid, gfg_getRow, gfg_appendRow, gfg_getModyfiedRow, gfg_setSelectRow, gfg_getRowCount } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import Layout from '../../../Component/Layout/Layout';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';
import { Number as columnNumber} from '../../../Component/Grid/Column/Number';
import { Checkbox as columnCheckbox } from '../../../Component/Grid/Column/Checkbox';

import Combobox from '../../../Component/Control/Combobox';

// import Mainspan from './Mainspan';
// import Botspan from '../Common/Botspan';

import { getDynamicSql_Oracle } from '../../../db/Oracle/Oracle';
import { getSp_Oracle } from '../../../db/Oracle/Oracle';
import { YK_WEB_REQ } from '../../../WebReq/WebReq';
//#endregion

class USER extends Component {
  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const USER_MAIN = (nowState, action) => {

      if(action.reducer !== 'USER_MAIN') {
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

    gfs_injectAsyncReducer('USER_MAIN', USER_MAIN);
    //#endregion
  }

  componentDidMount(){
    
  }

  callOracle = async(file, fn, param) => {
    let result = await getDynamicSql_Oracle(
      file,
      fn,
      param
    ); 

    return result;
  }

  Delete = async() => {
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    const selectRow = gfg_getRow(grid);
    if(selectRow === null){
      alert('선택된건이 없습니다.');
      return;
    }

    if(selectRow.phantom){
      grid.removeRow(selectRow['rowKey']);
      return;
    }else{
      let param = [];
      param.push({
        sp   : `begin 
                  SP_ZM_IMS_USER_MAIN10(
                    :p_RowStatus,
  
                    :p_COP_CD,
                    :p_COP_CD_ORIG,
                    :p_IMS_ID,
                    :p_USER_NAM,
                    :p_USER_PWD,
                    :p_DEPT_NAM,
                    :p_ERP_ID,
                    :p_AREA_TP,
                    :p_AUT_TP,
                    :p_USE_YN,
                    :p_USER_ID,
                    
                    :p_select,
                    :p_SUCCESS,
                    :p_MSG_CODE,
                    :p_MSG_TEXT,
                    :p_COL_NAM
                  );
                end;
                `,
        data : {
          p_RowStatus  : 'D',
          p_COP_CD     : selectRow.COP_CD,
          p_COP_CD_ORIG: selectRow.COP_CD_ORIG,
          p_IMS_ID     : selectRow.IMS_ID,
          p_USER_NAM   : '',
          p_USER_PWD   : '',
          p_DEPT_NAM   : '',
          p_ERP_ID     : '',
          p_AREA_TP    : '',
          p_AUT_TP     : '',
          p_USE_YN     : '',
          p_USER_ID    : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
        },
        errSeq: 0
      })
      
      const result = await getSp_Oracle(param);
      if(result.data.SUCCESS !== 'Y'){
        alert(gfc_getAtt(result.data.MSG_CODE));
        gfc_hideMask();
  
        return;
      }else{
        alert(gfc_getAtt(result.data.MSG_CODE));
        
        this.Retrieve();
      }
    }
  }

  Save = async() => {
    const mainGrid = gfg_getGrid(this.props.pgm, 'main10');

    if(gfg_getRowCount(mainGrid) === 0){
      alert('데이터가 없습니다.');
      return;
    }

    const dtlMod = gfg_getModyfiedRow(mainGrid);
    if(dtlMod.length === 0){
      alert('추가되거나 수정된건 이 없습니다.');
      return;
    }

    let param = [];

    dtlMod.forEach(e => {
      param.push({
        sp   : `begin 
                  SP_ZM_IMS_USER_MAIN10(
                    :p_RowStatus,

                    :p_COP_CD,
                    :p_COP_CD_ORIG,
                    :p_IMS_ID,
                    :p_USER_NAM,
                    :p_USER_PWD,
                    :p_DEPT_NAM,
                    :p_ERP_ID,
                    :p_AREA_TP,
                    :p_AUT_TP,
                    :p_USE_YN,
                    :p_USER_ID,
                    
                    :p_select,
                    :p_SUCCESS,
                    :p_MSG_CODE,
                    :p_MSG_TEXT,
                    :p_COL_NAM
                  );
                end;
                `,
        data : {
          p_RowStatus  : e.rowStatus,
          p_COP_CD     : e.COP_CD,
          p_COP_CD_ORIG: e.COP_CD_ORIG,
          p_IMS_ID     : e.IMS_ID,
          p_USER_NAM   : e.USER_NAM,
          p_USER_PWD   : e.USER_PWD,
          p_DEPT_NAM   : e.DEPT_NAM,
          p_ERP_ID     : e.ERP_ID,
          p_AREA_TP    : e.AREA_TP,
          p_AUT_TP     : e.AUT_TP,
          p_USE_YN     : e.USE_YN,
          p_USER_ID    : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
        },
        errSeq: e.rowKey
      })
    })

    gfc_showMask();
    
    const result = await getSp_Oracle(param);
    if(result.data.SUCCESS !== 'Y'){
      alert(gfc_getAtt(result.data.MSG_CODE));
      gfg_setSelectRow(mainGrid, result.data.COL_NAM, result.data.SEQ);
      gfc_hideMask();

      return;
    }else{
      alert(gfc_getAtt(result.data.MSG_CODE));
      
      this.Retrieve();
    }
  }

  Insert = () => {
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    gfg_appendRow(grid, grid.getRowCount(), {USE_YN: 'Y'}, 'IMS_ID')
  }

  Retrieve = async () => {
    gfc_showMask();

    const mainGrid = gfg_getGrid(this.props.pgm, 'main10');
    mainGrid.clear();

    let param = [];
    param.push({
      sp   : `begin 
                SP_ZM_IMS_USER_MAIN10(
                  :p_RowStatus,

                  :p_COP_CD,
                  :p_COP_CD_ORIG,
                  :p_IMS_ID,
                  :p_USER_NAM,
                  :p_USER_PWD,
                  :p_DEPT_NAM,
                  :p_ERP_ID,
                  :p_AREA_TP,
                  :p_AUT_TP,
                  :p_USE_YN,
                  :p_USER_ID,
                  
                  :p_select,
                  :p_SUCCESS,
                  :p_MSG_CODE,
                  :p_MSG_TEXT,
                  :p_COL_NAM
                );
              end;
              `,
      data : {
        p_RowStatus  : 'R',
        p_COP_CD     : gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
        p_COP_CD_ORIG: gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
        p_IMS_ID     : '',
        p_USER_NAM   : '',
        p_USER_PWD   : '',
        p_DEPT_NAM   : '',
        p_ERP_ID     : '',
        p_AREA_TP    : '',
        p_AUT_TP     : '',
        p_USE_YN     : '',
        p_USER_ID    : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
      },
      errSeq: 0
    })
    
    const result = await getSp_Oracle(param);
    if(result.data.SUCCESS !== 'Y'){
      alert(gfc_getAtt(result.data.MSG_CODE));
      gfc_hideMask();

      return;
    }

    mainGrid.clear();

    // const test = [];
    // let row = 0;
    // for(let i = 0; i < 10000; i++){
    //   if(row > 7) row = 0;
    //   test.push(result.data.ROWS[row]);
    //   row += 1;
    // }

    // mainGrid.resetData(test);
    
    mainGrid.resetData(result.data.ROWS);
    mainGrid.resetOriginData()
    mainGrid.restore();

    gfg_setSelectRow(mainGrid);
    // gfg_setSelectRow(mainGrid);

    gfc_hideMask();
  }

  render() {

    return (
      <div className='win_body' style={{borderRadius:'0px', borderWidth:'0px 1px 0px 1px'}}>
        <div className='car_manager type3'>
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
                              name: '카메라IP'
                            },{
                              code: '2',
                              name: 'RTSP주소'
                            },{
                              code: '3',
                              name: 'RTSP포트'
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
            <div className='grid' style={{paddingBottom:'0'}}>
              <div className='wp'>
                <div style={{width:'100%', height:'100%', overflow:'auto'}}>
                  <Grid pgm={this.props.pgm}
                        id ='main10'
                        rowHeight={30}
                        rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                        columns={[
                          columnCombobox({
                            name: 'COP_CD', 
                            header: '회사코드',
                            value   : 'COMM_DTL_CD',
                            display : 'COMM_DTL_NAM',
                            width   : 150, 
                            fontSize: '18',
                            readOnly: false,
                            oracleData : getDynamicSql_Oracle(
                              'COMM/COMM',
                              'ZM_IMS_CODE_SELECT',
                              [{COMM_CD: '6'}]),
                            editor: {
                              value   : 'COMM_DTL_CD',
                              display : 'COMM_DTL_NAM'
                            },
                            onRender: (value, control, rows) => {
                              if(rows.phantom){
                                control.isDisabled = false;
                              }else{
                                control.isDisabled = true;
                              }
                            }
                          }),
                          columnInput({
                            name: 'IMS_ID',
                            header: '사용자ID',
                            width : 180,
                            readOnly: false,
                            fontSize: '18',
                            align : 'left',
                            onRender: (value, control, rows) => {
                              if(rows.phantom){
                                control.readOnly = false;
                              }else{
                                control.readOnly = true;
                              }
                            }
                          }),
                          columnInput({
                            name: 'USER_NAM',
                            header: '사용자명',
                            width : 350,
                            readOnly: false,
                            fontSize: '18',
                            align : 'left',
                            onRender: (value, control, rows) => {
                              if(rows.phantom){
                                control.readOnly = false;
                              }else{
                                control.readOnly = true;
                              }
                            }
                          }),   
                          columnInput({
                            name: 'USER_PWD',
                            header: '비밀번호',
                            width : 250,
                            readOnly: false,
                            align : 'left',
                            fontSize: '18',
                            password: true
                          }),   
                          columnInput({
                            name: 'DEPT_NAM',
                            header: '부서명',
                            width : 250,
                            readOnly: false,
                            fontSize: '18',
                            align : 'left'
                          }),   
                          columnInput({
                            name: 'ERP_ID',
                            header: 'ERP ID',
                            width : 250,
                            readOnly: false,
                            fontSize: '18',
                            align : 'left'
                          }),  
                          columnCombobox({
                            name: 'AREA_TP', 
                            header: '검수구역',
                            value   : 'itemCode',
                            display : 'item',
                            width   : 200, 
                            readOnly: false,
                            etcData : YK_WEB_REQ('tally_process_pop.jsp?division=P530', {}),
                            editor: {
                              value   : 'itemCode',
                              display : 'item'
                            },
                            fontSize: '18'
                          }),   
                          columnCombobox({
                            name: 'AUT_TP', 
                            header: '권한그룹',
                            value   : 'COMM_DTL_CD',
                            display : 'COMM_DTL_NAM',
                            width   : 150, 
                            fontSize: '18',
                            readOnly: false,
                            oracleData : getDynamicSql_Oracle(
                              'COMM/COMM',
                              'ZM_IMS_CODE_SELECT',
                              [{COMM_CD: '2'}]),
                            editor: {
                              value   : 'COMM_DTL_CD',
                              display : 'COMM_DTL_NAM',
                              emptyRow: true
                            }
                          }),
                          columnCombobox({
                            name: 'USE_YN', 
                            header: '사용여부',
                            readOnly: false,
                            fontSize: '18',
                            width   : 130,
                            data    : [{
                              'code': 'Y',
                              'name': 'Yes'
                            },{
                              'code': 'N',
                              'name': 'No'
                            }],
                            editor: {
                              value   : 'code',
                              display : 'name'
                            }
                          })
                        ]}
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default USER;