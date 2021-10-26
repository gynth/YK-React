//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';
import DateTime from '../../../Component/Control/DateTime';

import { gfc_initPgm, gfc_showMask, gfc_hideMask, gfc_getAtt } from '../../../Method/Comm';
import { gfs_injectAsyncReducer, gfs_getStoreValue } from '../../../Method/Store';
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
//#endregion

class NOTICE extends Component {
  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const NOTICE_MAIN = (nowState, action) => {

      if(action.reducer !== 'NOTICE_MAIN') {
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

    gfs_injectAsyncReducer('NOTICE_MAIN', NOTICE_MAIN);
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

  Delete = () => {
    // const grid = gfg_getGrid(this.props.pgm, 'main10');
    // const selectRow = gfg_getRow(grid);
    // if(selectRow === null){
    //   alert('선택된건이 없습니다.');
    //   return;
    // }

    // if(selectRow.phantom){
    //   grid.removeRow(selectRow['rowKey']);
    //   return;
    // }else{
    //   this.callOracle(
    //     'Common/Common',
    //     'ZM_IMS_CAMERA_DELETE',
    //     [{
    //       AREA_TP: selectRow.AREA_TP,
    //       CAMERA_IP: selectRow.CAMERA_IP
    //     }]
    //   )
    // }
    
    // grid.resetOriginData()
    // grid.restore();

    // this.Retrieve();
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

    const dtlMod = gfg_getModyfiedRow(dtlGrid);
    if(dtlMod.length === 0){
      alert('추가되거나 수정된건 이 없습니다.');
      return;
    }

    let param = [];

    dtlMod.forEach(e => {
      param.push({
        sp   : `begin 
                  SP_ZM_IMS_NOTICE_DETAIL10(
                    :p_COP_CD,
                    :p_RowStatus,
                    :p_NOTICE_GRP,
                    :p_NOTICE_ID,
                    :p_NOTICE_NAM,
                    :p_USE_YN,
                    :p_PGM_ID,
                    :p_PGM_ROOT,
                    :p_NOTICE_SEQ, 
                    :p_RETAUT_YN,
                    :p_INSAUT_YN,
                    :p_SAVAUT_YN,
                    :p_DELAUT_YN,
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
          p_COP_CD    : gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
          p_RowStatus : e.rowStatus,
          p_NOTICE_GRP  : gfg_getRow(mainGrid).NOTICE_ID,
          p_NOTICE_ID   : e.NOTICE_ID,
          p_NOTICE_NAM  : e.NOTICE_NAM,
          p_USE_YN    : e.USE_YN,
          p_PGM_ID    : e.PGM_ID,
          p_PGM_ROOT  : e.PGM_ROOT,
          p_NOTICE_SEQ  : e.NOTICE_SEQ,
          p_RETAUT_YN : e.RETAUT_YN,
          p_INSAUT_YN : e.INSAUT_YN,
          p_SAVAUT_YN : e.SAVAUT_YN,
          p_DELAUT_YN : e.DELAUT_YN,
          p_USER_ID   : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
        },
        errSeq: e.rowKey
      })
    })

    gfc_showMask();
    
    const result = await getSp_Oracle(param);
    if(result.data.SUCCESS !== 'Y'){
      alert(gfc_getAtt(result.data.MSG_CODE));
      gfg_setSelectRow(dtlGrid, result.data.COL_NAM, result.data.SEQ);
      gfc_hideMask();

      return;
    }else{
      alert(gfc_getAtt(result.data.MSG_CODE));
      
      this.Retrieve();
    }
  }


  DtlDelete = async (e) => {

    const mainGrid = gfg_getGrid(this.props.pgm, 'main10');
    const detailGrid = gfg_getGrid(this.props.pgm, 'detail10');
    const selectRow = gfg_getRow(detailGrid);
    if(selectRow === null){
      alert('선택된건이 없습니다.');
      return;
    }

    if(selectRow.phantom){
      detailGrid.removeRow(selectRow['rowKey']);
      return;
    }else{

      if(window.confirm('삭제하시겠습니까?') === false){
        return;
      }

      gfc_showMask();

      let param = [];
      param.push({
        sp   : `begin 
                  SP_ZM_IMS_NOTICE_DETAIL10(
                    :p_COP_CD,
                    :p_RowStatus,
                    :p_NOTICE_GRP,
                    :p_NOTICE_ID,
                    :p_NOTICE_NAM,
                    :p_USE_YN,
                    :p_PGM_ID,
                    :p_PGM_ROOT,
                    :p_NOTICE_SEQ, 
                    :p_RETAUT_YN,
                    :p_INSAUT_YN,
                    :p_SAVAUT_YN,
                    :p_DELAUT_YN,
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
          p_COP_CD    : gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
          p_RowStatus : 'D',
          p_NOTICE_GRP  : gfg_getRow(mainGrid).NOTICE_ID,
          p_NOTICE_ID   : gfg_getRow(detailGrid).NOTICE_ID,
          p_NOTICE_NAM  : '',
          p_USE_YN    : '',
          p_PGM_ID    : '',
          p_PGM_ROOT  : '',
          p_NOTICE_SEQ  : '',
          p_RETAUT_YN : '',
          p_INSAUT_YN : '',
          p_SAVAUT_YN : '',
          p_DELAUT_YN : '',
          p_USER_ID   : ''
        },
        errSeq: 0
      })
      
      const result = await getSp_Oracle(param);
      if(result.data.SUCCESS !== 'Y'){
        alert(gfc_getAtt(result.data.MSG_CODE));
        gfc_hideMask();
  
        return;
      }
  
      detailGrid.removeRow(selectRow['rowKey']);
      gfc_hideMask();
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

    gfg_appendRow(dtlGrid, dtlGrid.getRowCount(), { RETAUT_YN:'Y', INSAUT_YN: 'Y', SAVAUT_YN: 'Y', DELAUT_YN: 'Y'}, 'NOTICE_ID');

  }

  Retrieve = async () => {
    gfc_showMask();

    const mainGrid = gfg_getGrid(this.props.pgm, 'main10');
    const dtlGrid  = gfg_getGrid(this.props.pgm, 'detail10');
    mainGrid.clear();
    dtlGrid.clear();

    let param = [];
    param.push({
      sp   : `begin 
                SP_ZM_IMS_NOTICE_MAIN10(
                  :p_COP_CD,
                  :p_RowStatus,
                  
                  :p_select,
                  :p_SUCCESS,
                  :p_MSG_CODE,
                  :p_MSG_TEXT,
                  :p_COL_NAM
                );
              end;
              `,
      data : {
        p_COP_CD    : gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
        p_RowStatus : 'R'
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

    mainGrid.resetData(result.data.ROWS);
    mainGrid.resetOriginData()
    mainGrid.restore();

    gfg_setSelectRow(mainGrid);
    // gfg_setSelectRow(mainGrid);

    gfc_hideMask();
  }
  
  onSelectChange = async (e) => {
    const dtlGrid  = gfg_getGrid(this.props.pgm, 'detail10');
    dtlGrid.clear();
    
    gfc_showMask();

    let param = [];
    param.push({
      sp   : `begin 
                SP_ZM_IMS_NOTICE_DETAIL10(
                  :p_COP_CD,
                  :p_RowStatus,
                  :p_NOTICE_GRP,
                  :p_NOTICE_ID,
                  :p_NOTICE_NAM,
                  :p_USE_YN,
                  :p_PGM_ID,
                  :p_PGM_ROOT,
                  :p_NOTICE_SEQ, 
                  :p_RETAUT_YN,
                  :p_INSAUT_YN,
                  :p_SAVAUT_YN,
                  :p_DELAUT_YN,
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
        p_COP_CD    : gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
        p_RowStatus : 'R',
        p_NOTICE_GRP  : e.NOTICE_ID,
        p_NOTICE_ID   : '',
        p_NOTICE_NAM  : '',
        p_USE_YN    : '',
        p_PGM_ID    : '',
        p_PGM_ROOT  : '',
        p_NOTICE_SEQ  : 0,
        p_RETAUT_YN : '',
        p_INSAUT_YN : '',
        p_SAVAUT_YN : '',
        p_DELAUT_YN : '',
        p_USER_ID   : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
      },
      errSeq: 0
    })
    
    const result = await getSp_Oracle(param);
    if(result.data.SUCCESS !== 'Y'){
      gfc_hideMask();

      return;
    }

    const grid = gfg_getGrid(this.props.pgm, 'detail10');
    grid.resetData(result.data.ROWS);
    gfg_setSelectRow(grid);

    gfc_hideMask();
  }

  render() {

    return (
      <div className='win_body' style={{borderRadius:'0px', borderWidth:'0px 1px 0px 1px'}}>
        <div className='car_manager type3'>
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
                            value   = 'code'
                            display = 'name'
                            width   = {124}
                            height  = {42}
                            emptyRow
                            data    = {[{
                              code: '1',
                              name: '작성자'
                            },{
                              code: '2',
                              name: '제목'
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
                />
              </div>
            </div>
            <div className='grid' style={{paddingBottom:'0'}}>
              <div className='wp'>
                <div style={{width:'100%', height:'100%', overflow:'auto'}}>
                  <Layout split       ='vertical'
                          minSize     ={[54]}
                          defaultSize ={'30%'}
                  >
                    <Grid pgm={this.props.pgm}
                          id ='main10'
                          selectionChange={(e) => {
                            this.onSelectChange(e);
                          }}
                          rowHeight={30}
                          rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                          columns={[
                            columnCombobox({
                              name: 'NOTICE_ID', 
                              header: '메뉴그룹',
                              value   : 'COMM_DTL_CD',
                              display : 'COMM_DTL_NAM',
                              width   : 150, 
                              readOnly: true,
                              oracleData : getDynamicSql_Oracle(
                                'COMM/COMM',
                                'ZM_IMS_CODE_SELECT',
                                [{COMM_CD: '1'}]),
                              editor: {
                                value   : 'COMM_DTL_CD',
                                display : 'COMM_DTL_NAM'
                              }
                            }),
                            columnInput({
                              name: 'NOTICE_NAM',
                              header: '메뉴그룹명',
                              width : 250,
                              readOnly: true,
                              align : 'left',
                            })
                          ]}
                    />

                    <div style={{width:'50%', height:'100%', background:'yellow'}}>
                      <div style={{width:'100%', height:'30px'}}>
                        <span style={{width:'100%', height:'30px'}}>작성자</span>
                      </div>
                    </div>
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

export default NOTICE;