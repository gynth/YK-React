//#region Import
import React, { Component } from 'react';

import { store } from '../../Store/Store';

import Grid from '../../Component/Grid/Grid';
import Layout from '../../Component/Layout/Layout';

import { gfc_initPgm, gfc_getAtt, gfc_getMultiLang } from '../../Method/Comm';
import { gfg_getGrid, gfg_appendRow, gfg_getModyfiedRow, gfg_getRow, gfg_setValue, gfg_setSelectRow } from '../../Method/Grid';
import { gfo_getInput, gfo_getCombo, gfo_getDateTime, gfo_getNumber } from '../../Method/Component';
import { gfs_getStoreValue } from '../../Method/Store';
import { getDynamicSql_Mysql, getDynamicSql_Mysql_temp, getCallSP_Mysql } from '../../db/Mysql/Mysql';

import { Number as columnNumber } from '../../Component/Grid/Column/Number';
import { Input as columnInput } from '../../Component/Grid/Column/Input';
import { DateTime as columnDateTime } from '../../Component/Grid/Column/DateTime';
import { Combobox as columnCombobox} from '../../Component/Grid/Column/Combobox';

import SearchDiv from '../../Component/Control/SearchDiv';
import DetailDiv from '../../Component/Control/DetailDiv';

import Input from '../../Component/Control/Input';
import Combobox from '../../Component/Control/Combobox';
import DateTime from '../../Component/Control/DateTime';
import Number from '../../Component/Control/Number';

//#endregion

class PgmTest extends Component{

  constructor(props){
    super(props)
    gfc_initPgm(props.pgm, props.nam, this)
    // grid.on('selection', (e1, e2, e3) => {
    //   console.log(e1, e2, e3)
    // });
  }

  //#region 공용이벤트 구성

  Retrieve = () => {
    const USER_NAM = gfo_getInput(this.props.pgm, 'search_user_nam').getValue()
    const USER_ID = gfo_getInput(this.props.pgm, 'search_user_id').getValue()

    getCallSP_Mysql(
      [{SP         : 'SP_ED000_TEST',
        ROWSTATUS  : 'R',
        COP_CD     : '',
        USER_ID,
        USER_NAM,
        USER_AGE   : 0,
        PASS_CD    : '',
        USER_CLS_CD: '',
        UPDCHR_NO  : '',
        SAP_CD     : '',
        CRT_DT     : null
      }]
    ).then(
      e => {
        const MSG_CODE = e.data.MSG_CODE;
        const MSG_TEXT = e.data.MSG_TEXT;

        if(e.data.result){
          const grid = gfg_getGrid(this.props.pgm, 'main10');
          grid.resetData(e.data.data);
          gfg_setSelectRow(grid);
        }else{
        }
        
        gfc_getMultiLang(MSG_CODE, MSG_TEXT);
      }
    )
  }

  Insert = () => {
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    gfg_appendRow(grid, grid.getRowCount(), {}, 'USER_NAM')
  }

  Save = () => {
    const grid = gfg_getGrid(this.props.pgm, 'main10');    
    
    getCallSP_Mysql(
      [],
      [{grid,
        SP          : 'SP_ED000_TEST',
        COP_CD      : 'VARCHAR',
        USER_ID     : 'VARCHAR',
        USER_NAM    : 'VARCHAR',
        USER_AGE    : 'INT',
        PASS_CD     : 'VARCHAR',
        USER_CLS_CD : 'VARCHAR',
        UPDCHR_NO   : 'VARCHAR',
        SAP_CD      : 'VARCHAR',
        CRT_DT      : 'DATE'
      }],
      [{
        UPDCHR_NO : gfs_getStoreValue('USER_REDUCER', 'USER_ID') //gfs_getStoreValue
      }]
    ).then(
      e => {
        const MSG_CODE = e.data.MSG_CODE;
        const MSG_TEXT = e.data.MSG_TEXT;

        if(e.data.result){
          grid.resetOriginData()
          grid.restore();
        }else{
          const COL_NAM = e.data.COL_NAM;
          const ROW_KEY = e.data.ROW_KEY;

          gfg_setSelectRow(grid, 'USER_NAM', ROW_KEY);
        }
        
        gfc_getMultiLang(MSG_CODE, MSG_TEXT);
      }
    )

    // const modRows = gfg_getModyfiedRow(grid)
    // for(let idx in modRows){
    //   const rowStatus   = modRows[idx]['rowStatus'];
    //   const COP_CD      = modRows[idx]['COP_CD'];
    //   const USER_ID     = modRows[idx]['USER_ID'];
    //   const USER_NAM    = modRows[idx]['USER_NAM'];
    //   const USER_CLS_CD = modRows[idx]['USER_CLS_CD'];
    //   const SAP_CD      = modRows[idx]['SAP_CD'];
    //   const PASS_CD     = modRows[idx]['PASS_CD'];
    //   const USER_AGE    = modRows[idx]['USER_AGE'];
    //   const CRT_DT      = modRows[idx]['CRT_DT'];
    //   // const DEPT_NAM   = modRows[idx]['DEPT_NAM'];
    //   const UPDCHR_NO = store.getState()['USER_REDUCER'].USER_ID;
      
    //   let query;
    //   if(rowStatus === 'U'){
    //     query = 'UPDATE zm_user ' +
    //             '   SET USER_NAM = \'' + USER_NAM + '\' ' +
    //             '      ,SAP_CD   = \'' + SAP_CD + '\' ' +
    //             '      ,USER_CLS_CD   = \'' + USER_CLS_CD + '\' ' +
    //             // '      ,DEPT_NAM   = \'' + DEPT_NAM + '\' ' +
    //             '      ,UPD_DT   = NOW() ' +
    //             '      ,UPDCHR_NO  = \'' + UPDCHR_NO + '\' ' +
    //             '      ,USER_AGE  = \'' + USER_AGE + '\' ' +
    //             '      ,CRT_DT  = \'' + CRT_DT + '\' ' +
    //             ' WHERE USER_ID = \'' + USER_ID + '\' ' +
    //             '   AND COP_CD  = \'' + COP_CD + '\' ' ;
    //   }else{
    //     query = 'INSERT zm_user ' +
    //             '(COP_CD ' +
    //             ',USER_ID ' +
    //             ',USER_NAM ' +
    //             ',PASS_CD ' +
    //             ',USE_YN ' +
    //             ',USER_AGE ' +
    //             ',USER_CLS_CD ' +
    //             // ',DEPT_NAM ' +
    //             ',SAP_CD ' +
    //             ',CRT_DT ' +
    //             ',CRTCHR_NO ' +
    //             ',UPD_DT ' +
    //             ',UPDCHR_NO) ' +
    //             'VALUES ' +
    //             '(10' +
    //             ',\'' + USER_ID  + '\' ' +
    //             ',\'' + USER_NAM + '\' ' +
    //             ',\'' + PASS_CD  + '\' ' +
    //             ',1'                         +
    //             ',\'' + USER_AGE  + '\' ' +
    //             ',\'' + USER_CLS_CD  + '\' ' +
    //             // ',\'' + DEPT_NAM  + '\' ' +
    //             ',\'' + SAP_CD       + '\' ' +
    //             ',NOW()                  ' +
    //             ',\'' + UPDCHR_NO       + '\' ' +
    //             ',NOW()                  ' +
    //             ',\'' + UPDCHR_NO       + '\' )';
    //   }

    //   getDynamicSql_Mysql_temp(
    //     'Common/Common.js',
    //     'user',
    //     [{}],
    //     query
    //   ).then(
    //     e => {
    //       grid.resetOriginData()
    //       grid.restore();
    //     }
    //   )
    // }
  }

  Delete = () => {
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    // gf_getPhantomRow(grid, 0);
    // console.log(grid.getFocusedCell())
    const selectRow = gfg_getRow(grid)
    if(selectRow === null){
      alert(gfc_getAtt('선택된건이 없습니다.'))
      return;
    }

    if(selectRow['phantom']){
      grid.removeRow(selectRow['rowKey'])
      return;
    }

    if(window.confirm(gfc_getAtt('선택된행을 삭제 하시겠습니까?')) === true){
      const COP_CD    = selectRow['COP_CD'];
      const USER_ID   = selectRow['USER_ID'];

      let query = 'DELETE FROM zm_user WHERE COP_CD = \'' + COP_CD + '\' AND USER_ID = \'' + USER_ID + '\'';

      getDynamicSql_Mysql_temp(
        'Common/Common.js',
        'user',
        [{}],
        query
      ).then(
        e => {
          grid.removeRow(selectRow['rowKey'])
          grid.resetOriginData()
          grid.restore();
        }
      )
    }
  }
  //#endregion

  onSelectChange = (e) => {
    if(e === null) return;
    
    gfo_getInput(this.props.pgm, 'detail_user_nam').setValue(e.USER_NAM);
    gfo_getNumber(this.props.pgm, 'detail_user_age').setValue(e.USER_AGE);
    gfo_getInput(this.props.pgm, 'detail_user_id').setValue(e.USER_ID);
    gfo_getInput(this.props.pgm, 'detail_pass_cd').setValue(e.PASS_CD);

    gfo_getCombo(this.props.pgm, 'detail_user_cls_cd').setValue(e.USER_CLS_CD);
    gfo_getCombo(this.props.pgm, 'detail_sap_cd').setValue(e.SAP_CD);

    gfo_getDateTime(this.props.pgm, 'detail_crt_dt').setValue(e.CRT_DT);
  }

  afterChange = (e) => {
    if(e.columnName === 'USER_NAM'){
      gfo_getInput(this.props.pgm, 'detail_user_nam').setValue(e.value)
    }else if(e.columnName === 'USER_AGE'){
      gfo_getNumber(this.props.pgm, 'detail_user_age').setValue(e.value)
    }else if(e.columnName === 'USER_ID'){
      gfo_getInput(this.props.pgm, 'detail_user_id').setValue(e.value)
    }else if(e.columnName === 'PASS_CD'){
      gfo_getInput(this.props.pgm, 'detail_pass_cd').setValue(e.value)
    }else if(e.columnName === 'USER_CLS_CD'){
      gfo_getCombo(this.props.pgm, 'detail_user_cls_cd').setValue(e.value)
    }else if(e.columnName === 'SAP_CD'){
      gfo_getCombo(this.props.pgm, 'detail_sap_cd').setValue(e.value)
    }else if(e.columnName === 'CRT_DT'){
      gfo_getDateTime(this.props.pgm, 'detail_crt_dt').setValue(e.value)
    }
  }

  onBlur = (id, value, originalValue) => {
    if(value !== originalValue){
      const grid = gfg_getGrid(this.props.pgm, 'main10');
      let column = '';

      if(id === 'detail_user_nam') column = 'USER_NAM';
      if(id === 'detail_user_age') column = 'USER_AGE';
      if(id === 'detail_user_id') column = 'USER_ID';
      if(id === 'detail_pass_cd') column = 'PASS_CD';
      if(id === 'detail_user_cls_cd') column = 'USER_CLS_CD';
      if(id === 'detail_sap_cd') column = 'SAP_CD';
      if(id === 'detail_crt_dt') column = 'CRT_DT';

      gfg_setValue(grid, column, value);
    }
  }

  render(){
    return (
      <Layout split       ='horizontal'
              minSize     ={[54]}
              defaultSize ={54}
              resizerStyle='none' 
      >
        <SearchDiv>
            <Input pgm={this.props.pgm}
                   id='search_user_nam'
                   label={gfc_getAtt('사용자명')} />
            <Input pgm={this.props.pgm}
                   id='search_user_id'
                   label={gfc_getAtt('사용자ID')} />
                   
        </SearchDiv>
        <Layout primary     = 'second'
                split       = 'vertical'
                defaultSize = {'0%'}
                direction   = 'left'>
            <Grid pgm={this.props.pgm}
                  id='main10'
                  selectionChange={(e) => this.onSelectChange(e)}
                  afterChange={(e) => this.afterChange(e)}
                  columns = {[
                              columnInput({name    : 'USER_NAM', 
                                           header  : gfc_getAtt('사용자명'), 
                                           width   : 120, 
                                           readOnly: false
                                          }),
                              
                              columnCombobox({name: 'USER_CLS_CD', 
                                              header: gfc_getAtt('사용자구분'),
                                              readOnly: false,
                                              width   : 150,
                                              editor: {
                                                location: 'Common/Common.js',
                                                fn      : 'comm',
                                                value   : 'UID_NO',
                                                display : 'MINOR_NAM',
                                                field   : [],
                                                param   : {
                                                  major_id: 'Z003'
                                                },
                                                emptyRow: true,
                                                // onFilter: (e) => { 
                                                //   return e.filter(e => e.value === 'Z003A')
                                                // }
                                              }
                                            }),
                              
                              columnNumber({name    : 'USER_AGE', 
                                            header  : gfc_getAtt('나이'), 
                                            width   : 120, 
                                            readOnly: false
                                          }),
                              
                              columnCombobox({name: 'SAP_CD', 
                                              header: gfc_getAtt('사업장'),
                                              readOnly: false,
                                              width   : 200,
                                              editor: {
                                                location: 'Common/Common.js',
                                                fn      : 'sap_cd',
                                                value   : 'SAP_CD',
                                                display : 'SAP_NAM',
                                                field   : [],
                                                param   : {},
                                                emptyRow: true
                                              }
                                            }),

                              columnInput({name  : 'USER_ID', 
                                           header: gfc_getAtt('사용자ID'), 
                                           width : 120,
                                           onRender: (value, control, rows) => {
                                             if(rows.phantom){
                                               control.readOnly = false;
                                             }else{
                                               control.readOnly = true;
                                             }
                                           }
                                          }),

                              columnInput({name  : 'PASS_CD', 
                                           header: gfc_getAtt('비밀번호'), 
                                           width : 120,
                                           password: true,
                                           readOnly: false
                                          //  onRender: (value, control, rows) => {
                                          //    if(rows.phantom){
                                          //      control.readOnly = false;
                                          //    }else{
                                          //      control.readOnly = true;
                                          //    }
                                          //  }
                                          }),
                              
                              columnInput({name  : 'DEPT_NAM', 
                                           header: gfc_getAtt('부서명'), 
                                           width : 170
                                          }),
                              
                              columnInput({name  : 'CRTCHR_NAM', 
                                           header: gfc_getAtt('생성자'), 
                                           width : 120,
                                           readOnly: true,
                                           align   : 'center'
                                          }),
                              
                              columnDateTime({name  : 'CRT_DT',
                                              header: gfc_getAtt('생성일자'),
                                              width : 150,
                                              format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT'),
                                              time  : 'HH:mm',
                                              editor: { 
                                               timepicker: true
                                              }
                                            }),
                              
                              columnInput({name  : 'UPD_NAM', 
                                           header: gfc_getAtt('수정자'), 
                                           width : 120,
                                           readOnly: true
                                          }),

                              columnDateTime({name  : 'UPD_DT',
                                              header: gfc_getAtt('수정일시'),
                                              width : 150,
                                              format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT'),
                                              // time  : 'HH:mm',
                                              readOnly: true
                                            })
                            ]}
            />
          <DetailDiv title={gfc_getAtt('사용자등록')}>

            <tr>
              <th>{gfc_getAtt('사용자명')}</th>
              <td style={{width:'250'}}>
                <Input pgm={this.props.pgm}
                       id='detail_user_nam'
                       onBlur={(id, value, originalValue, input) => this.onBlur(id, value, originalValue, input)} 
                />
              </td>

              <th>{gfc_getAtt('사용자구분')}</th>
              <td>
                <Combobox pgm={this.props.pgm}
                          id='detail_user_cls_cd'
                          location= 'Common/Common.js'
                          fn      = 'comm'
                          value   = 'UID_NO'
                          display = 'MINOR_NAM'
                          field   = {[]}
                          width   = {100}
                          param   = {
                            {major_id: 'Z003'}
                          }
                          emptyRow= {true} 
                          onBlur={(id, value, originalValue, input) => this.onBlur(id, value, originalValue, input)} />
              </td>
            </tr>

            <tr>
              <th>{gfc_getAtt('나이')}</th>
              <td style={{width:'250'}}>
                <Number pgm={this.props.pgm}
                        id='detail_user_age'
                        num_format={gfs_getStoreValue('USER_REDUCER', 'NUM_FORMAT')}
                        num_round ={gfs_getStoreValue('USER_REDUCER', 'NUM_ROUND')}  
                        onBlur={(id, value, originalValue, input) => this.onBlur(id, value, originalValue, input)} 
                />
              </td>

              <th>{gfc_getAtt('사업장')}</th>
              <td>
                <Combobox pgm={this.props.pgm}
                          id='detail_sap_cd'
                          location= 'Common/Common.js'
                          fn      = 'sap_cd'
                          value   = 'SAP_CD'
                          display = 'SAP_NAM'
                          field   = {[]}
                          width   = {100}
                          param   = {
                            []
                          }
                          emptyRow= {true} 
                          onBlur={(id, value, originalValue, input) => this.onBlur(id, value, originalValue, input)} />
              </td>
            </tr>

            <tr>
              <th>{gfc_getAtt('사용자ID')}</th>
              <td style={{width:'250'}}>
                <Input pgm={this.props.pgm}
                       id='detail_user_id' 
                       onBlur={(id, value, originalValue, input) => this.onBlur(id, value, originalValue, input)} 
                />
              </td>

              <th>{gfc_getAtt('비밀번호')}</th>
              <td>
                <Input pgm={this.props.pgm}
                       id='detail_pass_cd'
                       type='password' 
                       onBlur={(id, value, originalValue, input) => this.onBlur(id, value, originalValue, input)} 
                />
              </td>
            </tr>

            <tr>
              <th>{gfc_getAtt('생성일자')}</th>
              <td style={{width:'250'}}>
                <DateTime pgm        = {this.props.pgm}
                          id         = 'detail_crt_dt' 
                          format     = {`${gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT')} HH:mm`}
                          timePicker = {true}
                          onBlur     = {(id, value, originalValue, input) => this.onBlur(id, value, originalValue, input)} 
                />
              </td>
            </tr>
            
          </DetailDiv>
        </Layout>
      </Layout>
    );
  }
};

export default PgmTest;