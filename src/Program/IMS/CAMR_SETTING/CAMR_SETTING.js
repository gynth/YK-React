//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_showMask, gfc_hideMask } from '../../../Method/Comm';
import { gfs_injectAsyncReducer, gfs_dispatch } from '../../../Method/Store';
import { gfg_getGrid, gfg_getRow, gfg_appendRow, gfg_getModyfiedRow } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';
import { Number as columnNumber }  from '../../../Component/Grid/Column/Number';

import Combobox from '../../../Component/Control/Combobox';

// import Mainspan from './Mainspan';
import Botspan from '../Common/Botspan';

import { getDynamicSql_Oracle } from '../../../db/Oracle/Oracle';
import { TOKEN, YK_WEB_REQ } from '../../../WebReq/WebReq';
import { gfo_getCombo, gfo_getInput } from '../../../Method/Component';
//#endregion

class CAMR_SETTING extends Component {
  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const CAMR_SETTING_MAIN = (nowState, action) => {

      if(action.reducer !== 'CAMR_SETTING_MAIN') {
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

    gfs_injectAsyncReducer('CAMR_SETTING_MAIN', CAMR_SETTING_MAIN);
    //#endregion
  }

  componentDidMount(){
    setTimeout(() => {
      this.Retrieve();
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
  Delete = () => {
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
      this.callOracle(
        'Common/Common',
        'ZM_IMS_CAMERA_DELETE',
        [{
          AREA_TP: selectRow.AREA_TP,
          CAMERA_IP: selectRow.CAMERA_IP
        }]
      )
    }
    
    grid.resetOriginData()
    grid.restore();

    this.Retrieve();
  }

  Save = async() => {
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    const mod = gfg_getModyfiedRow(grid);
    if(mod.length === 0){
      alert('추가되거나 수정된 건 이 없습니다.');
    }

    mod.forEach(e => {
      let FN = '';
      if(e.rowStatus === 'I'){
        FN = 'ZM_IMS_CAMERA_INSERT';
      }else{
        FN = 'ZM_IMS_CAMERA_UPDATE';
      }
      this.callOracle(
        'Common/Common',
        FN,
        [{
          AREA_TP: e.AREA_TP,
          CAMERA_IP: e.CAMERA_IP,
          CAMERA_NAM: e.CAMERA_NAM,
          RTSP_ADDR: e.RTSP_ADDR,
          SEQ: e.SEQ,
          CAMERA_PORT: e.CAMERA_PORT,
          CAMERA_NUMBER: e.CAMERA_NUMBER,
          SNAPSHOT_TIME: e.SNAPSHOT_TIME,
          REC_YN : e.REC_YN,
          USE_YN : e.USE_YN,
          MILESTONE_GUID: e.MILESTONE_GUID,
          MILESTONE_NAME: e.MILESTONE_NAME
        }]
      )
    });
    
    grid.resetOriginData()
    grid.restore();
    
    // this.Retrieve();
  }

  Insert = () => {
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    gfg_appendRow(grid, grid.getRowCount(), {}, 'AREA_TP')
  }

  Retrieve = async () => {

    gfc_showMask();
    gfs_dispatch('CAMR_SETTING_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});

    const search_tp = gfo_getCombo(this.props.pgm, 'search_tp').getValue();
    const search_txt = gfo_getInput(this.props.pgm, 'search_txt').getValue();

    let AREA_TP = '%';
    let CAMERA_IP = '%';

    if(search_tp !== null && search_tp !== '' && search_txt !== ''){
      if(search_tp === '1'){
        AREA_TP = `%${search_txt}%`;
      }else{
        CAMERA_IP = `%${search_txt}%`;
      }
    }

    const result = await this.callOracle('Common/Common', 'ZM_IMS_CAMERA_SELECT', [{
      AREA_TP,
      CAMERA_IP
    }]);
    
    let data = [];
    for(let i = 0; i < result.data.rows.length; i++){

      let col = {};
      for(let j = 0; j < result.data.rows[i].length; j++){
        col[result.data.metaData[j].name] = result.data.rows[i][j];
      }
      data.push(col);
    }
    
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    grid.resetData(data);

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
                              NAME: '하차구역'
                            },{
                              CODE: '2',
                              NAME: '카메라IP'
                            }]}
                  />
                </div>
                <div>
                  <Input pgm         = {this.props.pgm}
                        id          = 'search_txt'
                        height      = '42'
                        placeHolder = '검색어를 입력하세요'
                        paddingLeft = '14'
                        width       = '90%'
                        type        = 'textarea'
                        onChange    = {(e) => {
                          this.Retrieve()
                        }}
                        //  padding-bottom:2px; padding-left:14px; border:none; font-size:22px;
                  />
                </div>
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
                          columnCombobox({
                            name: 'AREA_TP', 
                            header: '하차구역',
                            value   : 'itemCode',
                            display : 'item',
                            width   : 200, 
                            readOnly: false,
                            etcData : YK_WEB_REQ('tally_process_pop.jsp?division=P530', {}),
                            editor: {
                              value   : 'itemCode',
                              display : 'item'
                            },
                            fontSize: '18',
                            onRender: (value, control, rows) => {
                              if(rows.phantom){
                                control.readOnly = false;
                              }else{
                                control.readOnly = true;
                              }
                            }
                          }),
                          columnInput({
                            name: 'CAMERA_IP',
                            header: '카메라IP',
                            width : 180,
                            readOnly: false,
                            color : '#0063A9',
                            align : 'left',
                            fontSize: '18',
                            onRender: (value, control, rows) => {
                              if(rows.phantom){
                                control.readOnly = false;
                              }else{
                                control.readOnly = true;
                              }
                            }
                          }),
                          columnInput({
                            name: 'CAMERA_NAM',
                            header: '카메라이름',
                            width : 230,
                            readOnly: false,
                            color : '#0063A9',
                            align : 'left',
                            fontSize: '18',
                            onRender: (value, control, rows) => {
                              if(rows.phantom){
                                control.readOnly = false;
                              }else{
                                control.readOnly = true;
                              }
                            }
                          }),
                          columnInput({
                            name: 'RTSP_ADDR',
                            header: 'RTSP주소',
                            width : 250,
                            readOnly: false,
                            color : '#0063A9',
                            align : 'left',
                            fontSize: '18',
                            onRender: (value, control, rows) => {
                              if(rows.phantom){
                                control.readOnly = false;
                              }else{
                                control.readOnly = true;
                              }
                            }
                          }),
                          columnInput({
                            name: 'CAMERA_PORT',
                            header: '카메라포트',
                            width : 130,
                            readOnly: true,
                            align : 'right',
                            fontSize: '18',
                            onRender: (value, control, rows) => {
                              if(rows.phantom){
                                control.readOnly = false;
                              }else{
                                control.readOnly = true;
                              }
                            }
                          }),   
                          columnInput({
                            name: 'CAMERA_NUMBER',
                            header: '카메라위치',
                            width : 100,
                            readOnly: true,
                            align : 'right',
                            fontSize: '18',
                            onRender: (value, control, rows) => {
                              if(rows.phantom){
                                control.readOnly = false;
                              }else{
                                control.readOnly = true;
                              }
                            }
                          }),   
                          columnNumber({
                            name    : 'SNAPSHOT_TIME', 
                            header  : '스냅샷주기', 
                            width   : 100, 
                            readOnly: false,
                            fontSize: '18'
                          }),   
                          columnInput({
                            name: 'SEQ',
                            header: '구성순서',
                            width : 120,
                            readOnly: false,
                            align : 'right',
                            fontSize: '18'
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
                          }),   
                          columnCombobox({
                            name: 'REC_YN', 
                            header: '녹화여부',
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
                          }),
                          columnInput({
                            name: 'MILESTONE_GUID',
                            header: '마일스톤Guid',
                            width : 250,
                            readOnly: false,
                            color : '#0063A9',
                            align : 'left',
                            fontSize: '18',
                            onRender: (value, control, rows) => {
                              if(rows.phantom){
                                control.readOnly = false;
                              }else{
                                control.readOnly = true;
                              }
                            }
                          }),
                          columnInput({
                            name: 'MILESTONE_NAME',
                            header: '마일스톤Name',
                            width : 250,
                            readOnly: false,
                            color : '#0063A9',
                            align : 'left',
                            fontSize: '18',
                            onRender: (value, control, rows) => {
                              if(rows.phantom){
                                control.readOnly = false;
                              }else{
                                control.readOnly = true;
                              }
                            }
                          })
                        ]}
                  />
                </div>
              </div>
              <div className='grid_info'>
                <span className='title'>전체</span><Botspan reducer='CAMR_SETTING_MAIN' />
                <input 
                  style={{display:'block', height: 30, float:'right', marginTop:'8', marginRight:'20'}} 
                  type='button' 
                  value='디바이스'
                  onClick={async e => {
                    const milestone = await TOKEN({});
                    const device = milestone.data.DEVICE;

                    let msg = '';

                    for(let i = 0; i < device.length; i++){
                      msg += `Start ----- Guid: ${device[i].Guid},`;
                      msg += `Name: ${device[i].Name} ----- End   `;
                    }

                    alert(msg);
                  }}></input>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CAMR_SETTING;