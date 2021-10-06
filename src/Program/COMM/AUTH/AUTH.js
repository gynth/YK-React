//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_showMask, gfc_hideMask, gfc_getAtt, gfc_sleep } from '../../../Method/Comm';
import { gfs_injectAsyncReducer, gfs_dispatch, gfs_getStoreValue } from '../../../Method/Store';
import { gfg_getGrid, gfg_getRow, gfg_appendRow, gfg_setValue, gfg_getModyfiedRow, gfg_setSelectRow, gfg_getRowCount } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import Layout from '../../../Component/Layout/Layout';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
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

class AUTH extends Component {
  selectedTab = 0;

  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const AUTH_MAIN = (nowState, action) => {

      if(action.reducer !== 'AUTH_MAIN') {
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

    gfs_injectAsyncReducer('AUTH_MAIN', AUTH_MAIN);
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
    let mainGrid;

    if(this.selectedTab === 0){
      mainGrid = gfg_getGrid(this.props.pgm, 'main10');
    }else{
      mainGrid = gfg_getGrid(this.props.pgm, 'main20');
    }

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
                  SP_ZM_IMS_AUTH_DETAIL10(
                    :p_COP_CD,
                    :p_RowStatus,
                    :p_MENU_ID,
                    :p_GRP_USER_ID,
                    :p_CD_GBN,
  
                    :p_PGMAUT_YN,
                    :p_RETAUT_YN,
                    :p_INSAUT_YN,
                    :p_SAVAUT_YN,
                    :p_DELAUT_YN,
                    :p_PTZAUT_YN,
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
          p_COP_CD     : gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
          p_RowStatus  : e.rowStatus,
          p_MENU_ID    : e.MENU_ID,
          p_GRP_USER_ID: gfg_getRow(mainGrid).AUTH_CD,
          p_CD_GBN     : this.selectedTab === 0 ? 'G' : 'I',
          p_PGMAUT_YN : e.PGMAUT_YN === null ? 'N' : e.PGMAUT_YN,
          p_RETAUT_YN : e.RETAUT_YN === null ? 'N' : e.RETAUT_YN,
          p_INSAUT_YN : e.INSAUT_YN === null ? 'N' : e.INSAUT_YN,
          p_SAVAUT_YN : e.SAVAUT_YN === null ? 'N' : e.SAVAUT_YN,
          p_DELAUT_YN : e.DELAUT_YN === null ? 'N' : e.DELAUT_YN,
          p_PTZAUT_YN : e.DELAUT_YN === null ? 'N' : e.DELAUT_YN,
          p_USER_ID   : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
        },
        errSeq: e.rowKey
      })
    })

    // dtlMod.forEach(e => {
    //   param.push({
    //     sp   : `begin 
    //               SP_ZM_IMS_AUTH_DETAIL10(
    //                 :p_COP_CD,
    //                 :p_RowStatus,
    //                 :p_MENU_ID,
    //                 :p_GRP_USER_ID,
    //                 :p_CD_GBN

    //                 :p_RETAUT_YN,
    //                 :p_INSAUT_YN,
    //                 :p_SAVAUT_YN,
    //                 :p_DELAUT_YN,
    //                 :p_PTZAUT_YN,
    //                 :p_USER_ID,
                    
    //                 :p_select,
    //                 :p_SUCCESS,
    //                 :p_MSG_CODE,
    //                 :p_MSG_TEXT,
    //                 :p_COL_NAM
    //               );
    //             end;
    //             `,
    //     data : {
    //       p_COP_CD     : '10',
    //       p_RowStatus  : 'R',
    //       p_MENU_ID    : '',
    //       p_GRP_USER_ID: '10',
    //       p_CD_GBN     : '',

    //       p_RETAUT_YN : '',
    //       p_INSAUT_YN : '',
    //       p_SAVAUT_YN : '',
    //       p_DELAUT_YN : '',
    //       p_PTZAUT_YN : '',
    //       p_USER_ID   : '1989'

    //       // p_COP_CD     : gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
    //       // p_RowStatus  : e.rowStatus,
    //       // p_MENU_ID    : e.MENU_ID,
    //       // p_GRP_USER_ID: gfg_getRow(mainGrid).AUTH_CD,
    //       // p_CD_GBN     : this.selectedTab === 0 ? 'G' : 'I',

    //       // p_RETAUT_YN : e.RETAUT_YN === null ? 'N' : e.RETAUT_YN,
    //       // p_INSAUT_YN : e.INSAUT_YN === null ? 'N' : e.INSAUT_YN,
    //       // p_SAVAUT_YN : e.SAVAUT_YN === null ? 'N' : e.SAVAUT_YN,
    //       // p_DELAUT_YN : e.DELAUT_YN === null ? 'N' : e.DELAUT_YN,
    //       // p_PTZAUT_YN : e.PTZAUT_YN === null ? 'N' : e.PTZAUT_YN,
    //       // p_USER_ID   : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
    //     },
    //     errSeq: e.rowKey
    //   })
    // })

    gfc_showMask();
    
    const result = await getSp_Oracle(param);
    if(result.data.SUCCESS !== 'Y'){
      alert(gfc_getAtt(result.data.MSG_CODE) + '>' + result.data.MSG_TEXT);
      gfg_setSelectRow(dtlGrid, result.data.COL_NAM, result.data.SEQ);
      gfc_hideMask();

      return;
    }else{
      alert(gfc_getAtt(result.data.MSG_CODE));
      
      this.Retrieve();
    }
  }

  Retrieve = async () => {
    if(this.selectedTab === 0){

      gfc_showMask();

      const mainGrid = gfg_getGrid(this.props.pgm, 'main10');
      const dtlGrid  = gfg_getGrid(this.props.pgm, 'detail10');
      mainGrid.clear();
      dtlGrid.clear();
  
      let param = [];
      param.push({
        sp   : `begin 
                  SP_ZM_IMS_AUTH_MAIN10(
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

      mainGrid.resetData(result.data.ROWS);
      mainGrid.resetOriginData()
      mainGrid.restore();
      gfg_setSelectRow(mainGrid);
    }else{

      gfc_showMask();

      const mainGrid = gfg_getGrid(this.props.pgm, 'main20');
      const dtlGrid  = gfg_getGrid(this.props.pgm, 'detail10');
      mainGrid.clear();
      dtlGrid.clear();
  
      let param = [];
      param.push({
        sp   : `begin 
                  SP_ZM_IMS_AUTH_MAIN20(
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

      mainGrid.resetData(result.data.ROWS);
      mainGrid.resetOriginData()
      mainGrid.restore();
      gfg_setSelectRow(mainGrid);
    }

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
                SP_ZM_IMS_AUTH_DETAIL10(
                  :p_COP_CD,
                  :p_RowStatus,
                  :p_MENU_ID,
                  :p_GRP_USER_ID,
                  :p_CD_GBN,

                  :p_PGMAUT_YN,
                  :p_RETAUT_YN,
                  :p_INSAUT_YN,
                  :p_SAVAUT_YN,
                  :p_DELAUT_YN,
                  :p_PTZAUT_YN,
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
        p_COP_CD     : gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
        p_RowStatus  : 'R',
        p_MENU_ID    : '',
        p_GRP_USER_ID: e.AUTH_CD,
        p_CD_GBN     : '',

        p_PGMAUT_YN  : '',
        p_RETAUT_YN  : '',
        p_INSAUT_YN  : '',
        p_SAVAUT_YN  : '',
        p_DELAUT_YN  : '',
        p_PTZAUT_YN  : '',
        p_USER_ID    : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
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
                  <Layout split       ='vertical'
                          minSize     ={[54]}
                          defaultSize ={'30%'}
                  >
                    <Tabs 
                      onSelect={async e => {
                        this.selectedTab = e;

                        await gfc_sleep(100);

                        this.Retrieve();
                      }}
                    >
                      <TabList>
                        <Tab>그룹</Tab>
                        <Tab>사용자</Tab>
                      </TabList>

                      <TabPanel
                        style={{height:'calc(100% - 41px)'}}>
                        <Grid pgm={this.props.pgm}
                              id ='main10'
                              selectionChange={(e) => {
                                this.onSelectChange(e);
                              }}
                              rowHeight={30}
                              rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                              columns={[
                                columnInput({
                                  name: 'AUTH_CD',
                                  header: '그룹ID',
                                  width : 100,
                                  readOnly: true,
                                  align : 'center',
                                }),
                                columnInput({
                                  name: 'AUTH_NAM',
                                  header: '그룹명',
                                  width : 250,
                                  readOnly: true,
                                  align : 'left',
                                })
                              ]}
                        />
                      </TabPanel>
                      <TabPanel
                        style={{height:'calc(100% - 41px)'}}
                      >
                        <Grid pgm={this.props.pgm}
                              id ='main20'
                              selectionChange={(e) => {
                                this.onSelectChange(e);
                              }}
                              rowHeight={30}
                              rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                              columns={[
                                columnInput({
                                  name: 'AUTH_CD',
                                  header: '사용자ID',
                                  width : 100,
                                  readOnly: true,
                                  align : 'center',
                                }),
                                columnInput({
                                  name: 'AUTH_NAM',
                                  header: '사용자명',
                                  width : 250,
                                  readOnly: true,
                                  align : 'left',
                                }),   
                                columnCombobox({
                                  name: 'AUT_TP', 
                                  header: '권한그룹',
                                  value   : 'COMM_DTL_CD',
                                  display : 'COMM_DTL_NAM',
                                  width   : 150, 
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
                                })
                              ]}
                        />
                      </TabPanel>
                    </Tabs>

                    <Grid pgm={this.props.pgm}
                          id ='detail10'
                          rowHeight={30}
                          rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                          headerClick={(e) => {
                            const column = e.columnName;
                            if(column !== 'chk' && column !== 'MENU_ID' && column !== 'MENU_NAM'){
                              const grid = gfg_getGrid(this.props.pgm, 'detail10');
                              if(grid.gridEl.dataset[column] === undefined){
                                grid.gridEl.dataset[column] = 'Y';
                              }else if(grid.gridEl.dataset[column] === 'Y'){
                                grid.gridEl.dataset[column] = 'N';
                              }else{
                                grid.gridEl.dataset[column] = 'Y';
                              }
      
                              for(let i = 0; i < grid.getRowCount(); i++){
                                gfg_setValue(grid, column, grid.gridEl.dataset[column], i);
                              }
                            }
                          }}
                          columns={[
                            columnInput({
                              name: 'MENU_ID',
                              header: '메뉴ID',
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
                              name: 'MENU_NAM',
                              header: '메뉴명',
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
                            columnCheckbox({
                              name: 'PGMAUT_YN',
                              header: '사용',
                              width : 50,
                              readOnly: true,
                              align : 'center',
                              type: 'checkbox'
                            }), 
                            columnCheckbox({
                              name: 'RETAUT_YN',
                              header: '조회',
                              width : 50,
                              readOnly: true,
                              align : 'center',
                              type: 'checkbox'
                            }),
                            columnCheckbox({
                              name: 'INSAUT_YN',
                              header: '등록',
                              width : 50,
                              readOnly: true,
                              align : 'center',
                              type: 'checkbox'
                            }),
                            columnCheckbox({
                              name: 'SAVAUT_YN',
                              header: '저장',
                              width : 50,
                              readOnly: true,
                              align : 'center',
                              type: 'checkbox'
                            }),
                            columnCheckbox({
                              name: 'DELAUT_YN',
                              header: '삭제',
                              width : 50,
                              readOnly: true,
                              align : 'center',
                              type: 'checkbox'
                            }),   
                            // columnCheckbox({
                            //   name: 'PTZAUT_YN',
                            //   header: 'PTZ',
                            //   width : 50,
                            //   readOnly: true,
                            //   align : 'center',
                            //   type: 'checkbox'
                            // }),
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

export default AUTH;