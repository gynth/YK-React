//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_getAtt, gfc_showMask, gfc_hideMask, gfc_oracleRetrieve } from '../../../Method/Comm';
import { gfs_injectAsyncReducer, gfs_dispatch, gfs_getStoreValue } from '../../../Method/Store';
import { gfg_getGrid, gfg_getRow, gfg_appendRow, gfg_getModyfiedRow, gfg_setSelectRow, gfg_getRowCount } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import Layout from '../../../Component/Layout/Layout';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';
import { Number as columnNumber} from '../../../Component/Grid/Column/Number';

import Combobox from '../../../Component/Control/Combobox';

// import Mainspan from './Mainspan';
// import Botspan from '../Common/Botspan';

import { getDynamicSql_OracleTran } from '../../../db/Oracle/Oracle';
import { gfo_getCombo, gfo_getInput } from '../../../Method/Component';
//#endregion

let retData = [];
class COMM extends Component {
  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const COMM_MAIN = (nowState, action) => {

      if(action.reducer !== 'COMM_MAIN') {
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

    gfs_injectAsyncReducer('COMM_MAIN', COMM_MAIN);
    //#endregion
  }

  componentDidMount(){
    setTimeout(() => {
      this.Retrieve();
    }, 500);
  }

  callOracle = async(grid, rowStatus, file, fn, param, seq) => {
    let result = await getDynamicSql_OracleTran(
      grid,
      rowStatus,
      file,
      fn,
      param,
      seq
    ); 

    return result;
  }

  Delete = async () => {
    const mainGrid = gfg_getGrid(this.props.pgm, 'main10');
    const selectRow = gfg_getRow(mainGrid);
    if(selectRow === null){
      alert('선택된건이 없습니다.');
      return;
    }

    if(window.confirm('삭제하시겠습니까?') === false){
      return;
    }

    gfc_showMask();

    if(selectRow.phantom){
      mainGrid.removeRow(selectRow['rowKey']);
      return;
    }else{ 
      let reqGrid  = ['main10'];
      let reqRowStaus = ['D'];
      let reqFile     = ['COMM/COMM'];
      let reqFn       = ['ZM_IMS_CODE_DELETE_MAIN10'];
      let reqParam    = [{
        COP_CD     : selectRow.COP_CD,
        COMM_CD    : selectRow.COMM_CD
      }];
      let reqSeq      = [];
  
      let result = await this.callOracle(
        reqGrid,
        reqRowStaus,
        reqFile,
        reqFn,
        reqParam,
        reqSeq
      ); 
  
      if(result.data.result !== true){
        alert(gfc_getAtt(result.data.message));
        gfc_hideMask();
  
        return;
      }
    }

    const dtlGrid  = gfg_getGrid(this.props.pgm, 'detail10');
    dtlGrid.clear();
    mainGrid.clear();
    
    mainGrid.resetOriginData()
    mainGrid.restore();

    this.Retrieve();
    gfc_hideMask();
  }

  Save = async() => {
    const mainGrid = gfg_getGrid(this.props.pgm, 'main10');
    const dtlGrid = gfg_getGrid(this.props.pgm, 'detail10');

    if(gfg_getRowCount(mainGrid) === 0){
      alert('데이터가 없습니다.');
      return;
    }

    if(gfg_getRowCount(dtlGrid) === 0){
      alert('데이터가 없습니다.');
      return;
    }

    const mainMod = gfg_getModyfiedRow(mainGrid);
    const dtlMod = gfg_getModyfiedRow(dtlGrid);
    if(mainMod.length === 0 && dtlMod.length === 0){
      alert('추가되거나 수정된건 이 없습니다.');
      return;
    }

    gfc_showMask();

    let reqGrid      = [];
    let reqRowStatus = [];
    let reqFile      = [];
    let reqFn        = [];
    let reqParam     = [];
    let reqSeq       = [];
    mainMod.forEach(e => {
      if(e.COMM_CD === '' || e.COMM_CD === null){
        alert('필수입력값이 없습니다. > 코드');
        gfg_setSelectRow(mainGrid, 'COMM_CD', e.rowKey);
        gfc_hideMask();

        return;
      }
      if(e.COMM_NAM === '' || e.COMM_NAM === null){
        alert('필수입력값이 없습니다. > 코드명');
        gfg_setSelectRow(mainGrid, 'COMM_NAM', e.rowKey);
        gfc_hideMask();

        return;
      }
      if(e.USE_YN === '' || e.USE_YN === null){
        alert('필수입력값이 없습니다. > 사용여부');
        gfg_setSelectRow(mainGrid, 'USE_YN', e.rowKey);
        gfc_hideMask();

        return;
      }

      reqGrid.push('main10');
      reqRowStatus.push(e.rowStatus);
      reqFile.push('COMM/COMM');
      if(e.rowStatus === 'I'){
        reqFn.push('ZM_IMS_CODE_INSERT_MAIN10');
      }else{
        reqFn.push('ZM_IMS_CODE_UPDATE_MAIN10');
      }
      reqParam.push({
        COP_CD      : '10',
        COMM_CD     : e.COMM_CD,
        COMM_DTL_CD : '*',
        COMM_NAM    : e.COMM_NAM,
        USE_YN      : e.USE_YN,
        USER_ID     : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
      });

      reqSeq.push(e.rowKey);
    });

    dtlMod.forEach(e => {
      if(e.COMM_DTL_CD === '' || e.COMM_DTL_CD === null){
        alert('필수입력값이 없습니다. > 상세코드');
        gfg_setSelectRow(dtlGrid, 'COMM_DTL_CD', e.rowKey);
        gfc_hideMask();

        return;
      }

      if(e.COMM_DTL_NAM === '' || e.COMM_DTL_NAM === null){
        alert('필수입력값이 없습니다. > 상세코드명');
        gfg_setSelectRow(dtlGrid, 'COMM_DTL_NAM', e.rowKey);
        gfc_hideMask();

        return;
      }

      if(e.SORT_SEQ === '' || e.SORT_SEQ === null){
        alert('필수입력값이 없습니다. > 정렬순서');
        gfg_setSelectRow(dtlGrid, 'SORT_SEQ', e.rowKey);
        gfc_hideMask();

        return;
      }

      reqGrid.push('detail10');
      reqRowStatus.push(e.rowStatus);
      reqFile.push('COMM/COMM');
      if(e.rowStatus === 'I'){
        reqFn.push('ZM_IMS_CODE_INSERT_DETAIL10');
      }else{
        reqFn.push('ZM_IMS_CODE_UPDATE_DETAIL10');
      }

      reqParam.push({
        COP_CD      : '10',
        COMM_CD     : gfg_getRow(mainGrid).COMM_CD,
        COMM_NAM    : e.COMM_DTL_NAM,
        COMM_DTL_CD : e.COMM_DTL_CD,
        COMM_DTL_NAM: e.COMM_DTL_NAM,
        SORT_SEQ    : e.SORT_SEQ,
        USE_YN      : 'Y',
        USER_ID     : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
      });

      reqSeq.push(e.rowKey);
    });

    let result = await this.callOracle(reqGrid, reqRowStatus, reqFile, reqFn, reqParam, reqSeq);
    if(result.data.result !== true){
      alert(gfc_getAtt(result.data.message));

      const grid = gfg_getGrid(this.props.pgm, result.data.grid);
      gfg_setSelectRow(grid, result.data.grid === 'main10' ? 'COMM_CD' : 'COMM_DTL_CD', result.data.applyRow);

    
      this.Retrieve();

      return;
    }else{
      this.Retrieve();
    }
  }

  Insert = () => {
    const grid = gfg_getGrid(this.props.pgm, 'main10');

    const mod = gfg_getModyfiedRow(grid);
    if(mod.length > 0){
      alert('수정중인 내용이 있습니다. 저장부터 진행해주세요.');
    }else{
      const dtlGrid  = gfg_getGrid(this.props.pgm, 'detail10');
      dtlGrid.clear();

      gfg_appendRow(grid, grid.getRowCount(), {}, 'COMM_CD')
    }
  }

  DtlInsert = () => {
    const mainGrid = gfg_getGrid(this.props.pgm, 'main10');
    const dtlGrid = gfg_getGrid(this.props.pgm, 'detail10');

    const mainRow = gfg_getRow(mainGrid);
    if(mainRow === null){
      alert('선택된건이 없습니다.');
      return;
    }

    gfg_appendRow(dtlGrid, dtlGrid.getRowCount(), {}, 'COMM_DTL_CD');

  }

  Retrieve = async () => {

    const search_tp = gfo_getCombo(this.props.pgm, 'search_tp').getValue();
    const search_txt = gfo_getInput(this.props.pgm, 'search_txt').getValue();
    const mainGrid = gfg_getGrid(this.props.pgm, 'main10');
    const dtlGrid  = gfg_getGrid(this.props.pgm, 'detail10');
    mainGrid.clear();
    dtlGrid.clear();


    if(search_tp !== null && search_tp !== '' && search_txt !== ''){
      let main = retData.filter(e => {
        //코드
        if(search_tp === '1'){
          if(e.COMM_CD.toString().indexOf(search_txt) >= 0){
            return true;
          }else{
            return false;
          }
        }
        //코드명
        else if(search_tp === '2'){
          if(e.COMM_NAM.indexOf(search_txt) >= 0){
            return true;
          }else{
            return false;
          }
        }
      })
      mainGrid.resetData(main);
      mainGrid.resetOriginData()
      mainGrid.restore();
    }else{
      gfc_showMask();
  
      gfs_dispatch('COMM_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
  
      let reqGrid     = ['main10'];
      let reqRowStaus = ['R'];
      let reqFile     = ['COMM/COMM'];
      let reqFn       = ['ZM_IMS_CODE_SELECT_MAIN10'];
      let reqParam    = [{COMM_DTL_CD: '*'}];
      let reqSeq      = [];
  
      let result = await this.callOracle(
        reqGrid,
        reqRowStaus,
        reqFile,
        reqFn,
        reqParam,
        reqSeq
      ); 
  
      if(result.data.result !== true){
        alert(gfc_getAtt(result.data.message));
        gfc_hideMask();
  
        return;
      }
      
      let data = gfc_oracleRetrieve(result);
      
      mainGrid.resetData(data);
      mainGrid.resetOriginData()
      mainGrid.restore();
  
      gfg_setSelectRow(mainGrid);
      retData = mainGrid.getData();
  
      gfc_hideMask();
    }
  }


  onSelectChange = async (e) => {
    if(e === null) return;

    gfc_showMask();

    const dtlGrid = gfg_getGrid(this.props.pgm, 'detail10');
    dtlGrid.clear();

    gfs_dispatch('COMM_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});

    let reqGrid     = ['detail10'];
    let reqRowStaus = ['R'];
    let reqFile     = ['COMM/COMM'];
    let reqFn       = ['ZM_IMS_CODE_SELECT_DETAIL10'];
    let reqParam    = [{
      COP_CD : e.COP_CD,
      COMM_CD: e.COMM_CD
    }];
    let reqSeq      = [];

    let result = await this.callOracle(
      reqGrid,
      reqRowStaus,
      reqFile,
      reqFn,
      reqParam,
      reqSeq
    ); 

    if(result.data.result !== true){
      gfc_hideMask();

      return;
    }
    
    let data = gfc_oracleRetrieve(result);
    
    dtlGrid.resetData(data);
    gfg_setSelectRow(dtlGrid);

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
                            value   = 'CODE'
                            display = 'NAME'
                            width   = {124}
                            height  = {42}
                            emptyRow
                            data    = {[{
                              CODE: '1',
                              NAME: '코드'
                            },{
                              CODE: '2',
                              NAME: '코드명'
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
            <div className='grid' style={{paddingBottom:'0'}}>
              <div className='wp'>
                <div style={{width:'100%', height:'100%', overflow:'auto'}}>
                  
                  <Layout split       ='horizontal'
                          minSize     ={[54]}
                          defaultSize ={'40%'}
                  >
                    <Grid pgm={this.props.pgm}
                          id ='main10'
                          selectionChange={(e) => {
                            this.onSelectChange(e);
                          }}
                          rowHeight={30}
                          rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                          columns={[
                            columnInput({
                              name: 'COMM_CD',
                              header: '코드',
                              width : 180,
                              readOnly: false,
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
                              name: 'COMM_NAM',
                              header: '코드명',
                              width : 350,
                              readOnly: false,
                              align : 'left',
                              onRender: (value, control, rows) => {
                                if(rows.phantom){
                                  control.readOnly = false;
                                }else{
                                  control.readOnly = true;
                                }
                              }
                            }),   
                            columnCombobox({
                              name: 'USE_YN', 
                              header: '사용여부',
                              readOnly: false,
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

                    <Grid pgm={this.props.pgm}
                          id ='detail10'
                          rowHeight={30}
                          rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                          columns={[
                            columnInput({
                              name: 'COMM_DTL_CD',
                              header: '상세코드',
                              width : 180,
                              readOnly: false,
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
                              name: 'COMM_DTL_NAM',
                              header: '상세코드명',
                              width : 400,
                              readOnly: false,
                              align : 'left',
                              onRender: (value, control, rows) => {
                                if(rows.phantom){
                                  control.readOnly = false;
                                }else{
                                  control.readOnly = true;
                                }
                              }
                            }),
                            columnNumber({
                              name    : 'SORT_SEQ', 
                              header  : '정렬순서', 
                              width   : 100, 
                              readOnly: false
                            })
                          ]}
                    />
                  </Layout>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default COMM;