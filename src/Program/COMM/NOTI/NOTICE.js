//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';
import DateTime from '../../../Component/Control/DateTime';

import { gfc_initPgm, gfc_showMask, gfc_hideMask, gfc_getAtt, gfc_now, gfc_oracleRetrieve, gfc_file_upload, gfc_folder_delete, gfc_file_delete } from '../../../Method/Comm';
import { gfs_injectAsyncReducer, gfs_getStoreValue } from '../../../Method/Store';
import { gfg_getGrid, gfg_getRow, gfg_appendRow, gfg_getModyfiedRow, gfg_setSelectRow, gfg_getRowCount, gfg_setValue } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import Layout from '../../../Component/Layout/Layout';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';
import { Number as columnNumber} from '../../../Component/Grid/Column/Number';
import { Checkbox as columnCheckbox } from '../../../Component/Grid/Column/Checkbox';
import { DateTime as columnDateTime } from '../../../Component/Grid/Column/DateTime';

import Combobox from '../../../Component/Control/Combobox';

// import Mainspan from './Mainspan';
// import Botspan from '../Common/Botspan';

import { getDynamicSql_Oracle } from '../../../db/Oracle/Oracle';
import { getSp_Oracle } from '../../../db/Oracle/Oracle';
import { gfo_getDateTime, gfo_getInput, gfo_getTextarea } from '../../../Method/Component';
import moment from 'moment';
import TextArea from '../../../Component/Control/TextArea';
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

  Init = async() => {
    const now = await gfc_now();
    gfo_getDateTime(this.props.pgm, 'search_fr_dt').setValue(now);
    gfo_getDateTime(this.props.pgm, 'search_to_dt').setValue(now);
    gfo_getDateTime(this.props.pgm, 'appl_fr_dt').setValue(now);
    gfo_getDateTime(this.props.pgm, 'appl_to_dt').setValue(moment(now).add(7, 'days'));
    
    // this.Retrieve();
  }

  componentDidMount(){
    setTimeout(() => {
      this.Init();
    }, 500);
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
    const mainGrid = gfg_getGrid(this.props.pgm, 'main10');
    const dtlGrid = gfg_getGrid(this.props.pgm, 'detail10');
    const selectRow = gfg_getRow(mainGrid);
    if(selectRow === null){
      alert('선택된건이 없습니다.');
      return;
    }

    if(selectRow.phantom){
      mainGrid.removeRow(selectRow['rowKey']);
      dtlGrid.clear();

      gfo_getInput(this.props.pgm, 'NOTICE_NAM').setValue('');
      gfo_getInput(this.props.pgm, 'NOTICE').setValue('');
      return;
    }else{
      if(window.confirm('삭제 하시겠습니까?') === false){
        return;
      }

      const folderDel = await gfc_folder_delete(selectRow.NOTICE_NO);
      if(folderDel.data !== 'OK'){
        alert('첨부파일 삭제에 실패했습니다.');
        return;
      }

      let param = [];
      param.push({
        sp   : `begin 
                    SP_ZM_IMS_NOTICE_MAIN10(
                    :p_RowStatus,
                    :p_COP_CD,
                    :p_NOTICE_NO,
                    :p_NOTICE_NAM,
                    :p_NOTICE,
                    :p_APPL_FR_DT,
                    :p_APPL_TO_DT,
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
          p_RowStatus : 'D',
          p_COP_CD    : gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
          p_NOTICE_NO : selectRow.NOTICE_NO,
          p_NOTICE_NAM: '',
          p_NOTICE    : '',
          p_APPL_FR_DT: '',
          p_APPL_TO_DT: '',
          p_USER_ID   : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
        },
        errSeq: 0
      })
      
      const result = await getSp_Oracle(param);
      if(result.data.SUCCESS !== 'Y'){
        alert(gfc_getAtt(result.data.MSG_CODE));
        gfc_hideMask();
  
        return;
      }
    
      mainGrid.resetOriginData()
      mainGrid.restore();
  
      this.Retrieve();
    }
  }

  Save = async() => {
    const mainGrid = gfg_getGrid(this.props.pgm, 'main10');
    const dtlGrid = gfg_getGrid(this.props.pgm, 'detail10');

    const selectRow = gfg_getRow(mainGrid);
    if(selectRow === null){
      alert('선택된건이 없습니다.');
      return;
    }

    if(gfg_getRowCount(mainGrid) === 0){
      alert('데이터가 없습니다.');
      return;
    }

    const mainMod = gfg_getModyfiedRow(mainGrid);
    const dtlMod = gfg_getModyfiedRow(dtlGrid);
    if(mainMod.length === 0 && dtlMod.length === 0){
      alert('추가되거나 수정된건 이 없습니다.');
      return;
    }

    const APPL_FR_DT = gfo_getDateTime(this.props.pgm, 'appl_fr_dt').getValue();
    const APPL_TO_DT = gfo_getDateTime(this.props.pgm, 'appl_to_dt').getValue();

    const NOTICE = gfo_getTextarea(this.props.pgm, 'NOTICE');

    let mainRowStatus = 'U';
    let NOTICE_NO = selectRow.NOTICE_NO;
    if(selectRow.phantom){
      const notiResult = await getDynamicSql_Oracle(
        'Common/Common',
        'NOTICE_SEQ',
        [{COP_CD: gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
          APPL_FR_DT 
        }]
      )
  
      if(notiResult.data.rows.length === 0){
        alert('공지사항 채번에 실패했습니다.');
        return;
      }

      mainRowStatus = 'I';
      NOTICE_NO = `${moment(APPL_FR_DT).format('YYYYMMDD')}${notiResult.data.rows[0][0]}`;
    }

    gfc_showMask();

    if(this.fileInfo.length > 0){
      const upload = await gfc_file_upload(this.fileInfo, NOTICE_NO);
      if(upload.data === undefined){
        alert('첨부할수없는 파일이 있습니다.');
        gfc_hideMask();
        return;
      }
      if(upload.data.message !== 'Uploaded the file successfully'){
        alert(`파일 업로드에 실패했습니다. ${upload.data.message}`);
        gfc_hideMask();
        return;
      }
    }

    if(mainMod.length > 0){
      let mainParam = [];
      mainParam.push({
        sp   : `begin 
                  SP_ZM_IMS_NOTICE_MAIN10(
                    :p_RowStatus,
                    :p_COP_CD,
                    :p_NOTICE_NO,
                    :p_NOTICE_NAM,
                    :p_NOTICE,
                    :p_APPL_FR_DT,
                    :p_APPL_TO_DT,
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
          p_RowStatus : mainRowStatus,
          p_NOTICE_NO : NOTICE_NO,
          p_NOTICE_NAM: selectRow.NOTICE_NAM,
          p_NOTICE    : NOTICE.getValue(),
          p_APPL_FR_DT: APPL_FR_DT,
          p_APPL_TO_DT: APPL_TO_DT,
          p_USER_ID   : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
        },
        errSeq: selectRow.rowKey
      })
  
      const mainResult = await getSp_Oracle(mainParam);
      if(mainResult.data.SUCCESS !== 'Y'){
        alert(gfc_getAtt(mainResult.data.MSG_CODE));
        // gfg_setSelectRow(mainGrid, result.data.COL_NAM, result.data.SEQ);
        gfc_hideMask();
  
        return;
      }else{
        // alert(gfc_getAtt(mainResult.data.MSG_CODE));
        
        // this.Retrieve();
      }
    }

    if(dtlMod.length > 0){
      let dtlParam = [];

      dtlMod.forEach(e => {
        dtlParam.push({
          sp   : `begin 
                    SP_ZM_IMS_NOTICE_DETAIL10(
                      :p_RowStatus,
                      :p_COP_CD,
                      :p_NOTICE_NO,
                      :p_SEQ,
                      :p_FILE_ROOT,
                      :p_FILE_NAM,
                      :p_FILE_SIZE,
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
            p_COP_CD     : gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
            p_NOTICE_NO  : NOTICE_NO,
            p_SEQ        : e.rowKey + 1,
            p_FILE_ROOT  : `F:/IMS/Notice/${NOTICE_NO}/${e.FILE_NAM}`,
            p_FILE_NAM   : e.FILE_NAM,
            p_FILE_SIZE  : e.FILE_SIZE,
            p_USER_ID    : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
          },
          errSeq: e.rowKey
        })
      })
      
      const dtlResult = await getSp_Oracle(dtlParam);
      if(dtlResult.data.SUCCESS !== 'Y'){
        alert(gfc_getAtt(dtlResult.data.MSG_CODE));
        // gfg_setSelectRow(mainGrid, result.data.COL_NAM, result.data.SEQ);
        gfc_hideMask();
  
        return;
      }else{
      }
    }

    alert('저장되었습니다.');
    this.Retrieve();
  }


  DtlDelete = async (e) => {
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
      if(window.confirm('삭제 하시겠습니까?') === false){
        return;
      }

      const folderDel = await gfc_file_delete(selectRow.NOTICE_NO, selectRow.FILE_NAM);
      if(folderDel.data !== 'OK'){
        alert('첨부파일 삭제에 실패했습니다.');
        return;
      }

      let param = [];
      param.push({
        sp   : `begin 
                  SP_ZM_IMS_NOTICE_DETAIL10(
                    :p_RowStatus,
                    :p_COP_CD,
                    :p_NOTICE_NO,
                    :p_SEQ,
                    :p_FILE_ROOT,
                    :p_FILE_NAM,
                    :p_FILE_SIZE,
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
          p_RowStatus : 'D',
          p_COP_CD    : gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
          p_NOTICE_NO : selectRow.NOTICE_NO,
          p_SEQ       : selectRow.SEQ,
          p_FILE_ROOT : '',
          p_FILE_NAM  : '',
          p_FILE_SIZE : 0,
          p_USER_ID   : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
        },
        errSeq: 0
      })
      
      const result = await getSp_Oracle(param);
      if(result.data.SUCCESS !== 'Y'){
        alert(gfc_getAtt(result.data.MSG_CODE));
        gfc_hideMask();
  
        return;
      }
    }
  }

  Insert = () => {
    const mainGrid = gfg_getGrid(this.props.pgm, 'main10');
    this.onSelectChange(gfg_getRow(mainGrid))
    

    return;
    const APPL_FR_DT = gfo_getDateTime(this.props.pgm, 'appl_fr_dt').getValue();
    const APPL_TO_DT = gfo_getDateTime(this.props.pgm, 'appl_to_dt').getValue();

    gfg_appendRow(mainGrid, mainGrid.getRowCount(), {APPL_FR_DT, APPL_TO_DT}, null, true);

    gfo_getInput(this.props.pgm, 'NOTICE_NAM').setFocus();
  }

  DtlInsert = () => {
    const mainGrid = gfg_getGrid(this.props.pgm, 'main10');
    const dtlGrid = gfg_getGrid(this.props.pgm, 'detail10');

    const mainRow = gfg_getRow(mainGrid);
    if(mainRow === null){
      alert('선택된건이 없습니다.');
      return;
    }

    gfg_appendRow(dtlGrid, dtlGrid.getRowCount(), {}, null, true);
  }

  Retrieve = async () => {
    this.fileInfo = [];
    gfc_showMask();

    gfo_getInput(this.props.pgm, 'NOTICE_NAM').setValue('');
    gfo_getTextarea(this.props.pgm, 'NOTICE').setValue('');

    const mainGrid = gfg_getGrid(this.props.pgm, 'main10');
    const dtlGrid  = gfg_getGrid(this.props.pgm, 'detail10');
    mainGrid.clear();
    dtlGrid.clear();

    const p_from_date = gfo_getDateTime(this.props.pgm, 'search_fr_dt').getValue();
    const p_to_date = gfo_getDateTime(this.props.pgm, 'search_to_dt').getValue();
    let param = [];
    param.push({
      sp   : `begin 
                  SP_ZM_IMS_NOTICE_MAIN10(
                  :p_RowStatus,
                  :p_COP_CD,
                  :p_NOTICE_NO,
                  :p_NOTICE_NAM,
                  :p_NOTICE,
                  :p_APPL_FR_DT,
                  :p_APPL_TO_DT,
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
        p_RowStatus : 'R',
        p_COP_CD    : gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
        p_NOTICE_NO : '',
        p_NOTICE_NAM: '',
        p_NOTICE    : '',
        p_APPL_FR_DT: p_from_date,
        p_APPL_TO_DT: p_to_date,
        // p_APPL_FR_DT: '',
        // p_APPL_TO_DT: '',
        p_USER_ID   : gfs_getStoreValue('USER_REDUCER', 'USER_ID')
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
    this.fileInfo = [];
    const dtlGrid  = gfg_getGrid(this.props.pgm, 'detail10');
    dtlGrid.clear();
    
    gfc_showMask();

    gfo_getDateTime(this.props.pgm, 'appl_fr_dt').setValue(e.APPL_FR_DT);
    gfo_getDateTime(this.props.pgm, 'appl_to_dt').setValue(e.APPL_TO_DT);
    gfo_getInput(this.props.pgm, 'NOTICE_NAM').setValue(e.NOTICE_NAM);
    gfo_getTextarea(this.props.pgm, 'NOTICE').setValue(e.NOTICE);

    let param = [];
    param.push({
      sp   : `begin 
                SP_ZM_IMS_NOTICE_DETAIL10(
                  :p_RowStatus,
                  :p_COP_CD,
                  :p_NOTICE_NO,
                  :p_SEQ,
                  :p_FILE_ROOT,
                  :p_FILE_NAM,
                  :p_FILE_SIZE,
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
        p_RowStatus : 'R',
        p_COP_CD    : gfs_getStoreValue('USER_REDUCER', 'COP_CD'),
        p_NOTICE_NO : e.NOTICE_NO,
        p_SEQ       : 0,
        p_FILE_ROOT : '',
        p_FILE_NAM  : '',
        p_FILE_SIZE : 0,
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

  onBlur = (id, value, originalValue) => {
    if(value !== originalValue){
      const grid = gfg_getGrid(this.props.pgm, 'main10');
      let column = '';

      if(id === 'NOTICE_NAM') column = 'NOTICE_NAM';
      if(id === 'NOTICE') column = 'NOTICE';
      if(id === 'appl_fr_dt') column = 'APPL_FR_DT';
      if(id === 'appl_to_dt') column = 'APPL_TO_DT';
      if(id === 'NOTICE') column = 'NOTICE';

      gfg_setValue(grid, column, value);
    }
  }

  fileInfo = [];
  onFileUpload(event) {
    event.preventDefault();
    if(event.target.files.length > 0){
      const file = event.target.files[0];
      const size = file.size;
      const name = file.name;

      if(size > 10000000){
        alert('10Mb 이상의 파일은 업로드 할 수 없습니다.');
        return;
      }
  
      const grid = gfg_getGrid(this.props.pgm, 'detail10');
      this.fileInfo[gfg_getRow(grid).rowKey] = file;
  
      gfg_setValue(grid, 'FILE_NAM', name);
      gfg_setValue(grid, 'FILE_SIZE', size);
    }
  }

  render() {

    return (
      <div className='win_body' style={{borderRadius:'0px', borderWidth:'0px 1px 0px 1px'}}>
        <div className='car_manager notice'>
          <div className='car_list'>
            <div className='search_line'>
              <div className='wp'>
                <DateTime pgm={this.props.pgm}
                          id='search_fr_dt'
                /> 
                <span className='sep'>~</span>                
                <DateTime pgm={this.props.pgm}
                          id='search_to_dt'
                />
              </div>
            </div>
            <div className='grid' style={{paddingBottom:'0px'}}>
              <div className='wp'>
                <div style={{width:'100%', height:'100%', overflow:'auto'}}>
                  <Grid pgm={this.props.pgm}
                        id ='main10'
                        selectionChange={(e) => this.onSelectChange(e)}
                        rowHeight={41}
                        rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                        columns={[
                          columnInput({
                            name: 'NOTICE_NAM',
                            header: '공지사항제목',
                            width : 300,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnDateTime({
                            name  : 'APPL_FR_DT',
                            header: '게시시작일',
                            width : 100,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT')
                          }),
                          columnDateTime({
                            name  : 'APPL_TO_DT',
                            header: '게시종료일',
                            width : 100,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT')
                          }),
                          columnInput({
                            name: 'CRTCHR_NO',
                            header: '생성자',
                            width : 100,
                            readOnly: true,
                            align : 'center'
                          }),
                          columnDateTime({
                            name  : 'CRT_DT',
                            header: '생성일시',
                            width : 120,
                            height: 38,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT'),
                            time  : 'HH:mm:ss'
                          }),
                          columnInput({
                            name: 'UPDCHR_NO',
                            header: '수정자',
                            width : 100,
                            align : 'center'
                          }),
                          columnDateTime({
                            name  : 'UPD_DT',
                            header: '수정일시',
                            width : 120,
                            height: 38,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT'),
                            time  : 'HH:mm:ss'
                          })
                        ]}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='notice_detail'>
              <div className='title'>공지사항 제목
                <div className='date'>            
                  <DateTime pgm={this.props.pgm}
                            id='appl_fr_dt'          
                            onBlur={(id, value, originalValue, input) => this.onBlur(id, value, originalValue, input)} 
                  />
                  <span>~</span>            
                  <DateTime pgm={this.props.pgm}
                            id='appl_to_dt'          
                            onBlur={(id, value, originalValue, input) => this.onBlur(id, value, originalValue, input)} 
                  />
                </div>
              </div>
              <Input 
                pgm={this.props.pgm} 
                id='NOTICE_NAM' 
                type='text' 
                className='subject' 
                onBlur={(id, value, originalValue, input) => this.onBlur(id, value, originalValue, input)} 
              />
              <div className='title'>공지사항 내용</div>
              <TextArea 
                pgm={this.props.pgm}
                id='NOTICE'          
                onBlur={(id, value, originalValue, input) => this.onBlur(id, value, originalValue, input)} 
              />
              {/* <button 
                type='button' 
                className='file_btn'
                onClick={e => {
                  console.log(e)
                }}
              >파일등록</button> */}
              <div className='file_box'>
                <div style={{width:'100%', height:'calc(100% - 500px)', margin:'5px 0 5px 0', overflow:'auto'}}>
                  <Grid pgm={this.props.pgm}
                        id ='detail10'
                        rowHeight={41}
                        rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                        columns={[
                          columnInput({
                            name: 'FILE',
                            header: '파일',
                            width : 80,
                            readOnly: true,
                            align : 'center',
                            type: 'file',
                            onChange: (e) => {
                              this.onFileUpload(e);
                            },
                            onShow: (control, value, rows) => {
                              if(rows.phantom){
                                control.style.display = 'block';
                              }else{
                                control.style.display = 'none';
                              }
                            }
                          }),
                          columnInput({
                            name: 'FILE_NAM',
                            header: '파일명',
                            width : 200,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnInput({
                            name: 'FILE_SIZE',
                            header: '크기',
                            width : 180,
                            readOnly: true,
                            align : 'center'
                          }),
                          columnDateTime({
                            name  : 'CRT_DT',
                            header: '등록일시',
                            width : 120,
                            height: 38,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT'),
                            time  : 'HH:mm:ss'
                          })
                        ]}
                  />
                </div>
              </div>
            </div>

        </div>
      </div>
    );
  }
}

export default NOTICE;