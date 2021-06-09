import React, { Component } from 'react';
import Grid from '../../Component/Grid/Grid';
import Layout from '../../Component/Layout/Layout';

import { gfc_initPgm, gfc_getAtt, gfc_getMultiLang } from '../../Method/Comm';
import { gfg_getGrid, gfg_appendRow, gfg_setValue, gfg_setSelectRow } from '../../Method/Grid';
import { gfo_getInput, gfo_getCombo, gfo_getDateTime, gfo_getNumber } from '../../Method/Component';
import { gfs_getValue } from '../../Method/Store';
import { getCallSP_Mysql } from '../../db/Mysql/Mysql';

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

import store from "../../Store/Store.js";

class Menu extends Component {
    constructor(props){
        super(props)
        gfc_initPgm(props.pgm, props.nam, this);
    }
    Retrieve = () => {
        const menu_id = gfo_getInput(this.props.pgm, 'search_menu_id').getValue();
        const menu_nam = gfo_getInput(this.props.pgm, 'search_menu_nam').getValue();
        const menu_use = gfo_getCombo(this.props.pgm, 'search_menu_use').getValue();                

        getCallSP_Mysql(
            [{SP        : 'SP_MENU_ED050',
              ROWSTATUS : 'R',
              COP_CD    : '10', 
              MENU_ID   : menu_id,
              MENU_NAM  : menu_nam,
              USE_YN    : menu_use,
              MENU_LEVEL  : 0,
              MENU_GRP_YN : '0',
              UP_MENU_ID  : '',
              PGM_ID      : '',
              MENU_SEQ    : 0,
              RETAUT_YN : '',
              INSAUT_YN : '',
              SAVAUT_YN : '',
              DELAUT_YN : '',
              PRNAUT_YN : '',
              EXEAUT_YN : '',
              APPAUT_YN : '',
              XLSAUT_YN : '',
              ETCAUT_YN : '',
              UPDCHR_NO : '',
            }]
        ).then(
            e=>{
                const MSG_CODE = e.data.MSG_CODE;
                const MSG_TEXT = e.data.MSG_TEXT;
                if (e.data.result){
                    const grid = gfg_getGrid(this.props.pgm, 'main50');
                    grid.resetData(e.data.data);
                    gfg_setSelectRow(grid);
                  }
                  else{
                  }                  
                  gfc_getMultiLang(MSG_CODE, MSG_TEXT);
            }
        )
    }

    Insert = () => {
        const grid = gfg_getGrid(this.props.pgm, 'main50');
        gfg_appendRow(grid, grid.getRowCount(), {}, 'MENU_NAM')
    }
    Save = () => {

        const grid = gfg_getGrid(this.props.pgm, 'main50');
        getCallSP_Mysql(
            [],
            [{grid,
              SP          : 'SP_MENU_ED050',
              COP_CD    : '10',              
              MENU_ID     : 'VARCHAR',
              MENU_NAM    : 'VARCHAR',
              USE_YN      : 'VARCHAR',
              MENU_LEVEL  : 'DECIMAL',
              MENU_GRP_YN : 'VARCHAR',
              UP_MENU_ID  : 'VARCHAR',
              PGM_ID      : 'VARCHAR',
              MENU_SEQ    : 'INT',
              RETAUT_YN : 'VARCHAR',
              INSAUT_YN : 'VARCHAR',
              SAVAUT_YN : 'VARCHAR',
              DELAUT_YN : 'VARCHAR',
              PRNAUT_YN : 'VARCHAR',
              EXEAUT_YN : 'VARCHAR',
              APPAUT_YN : 'VARCHAR',
              XLSAUT_YN : 'VARCHAR',
              ETCAUT_YN : 'VARCHAR',
              UPDCHR_NO : 'VARCHAR'
            }],
            [{
                UPDCHR_NO : gfs_getValue('USER_REDUCER', 'USER_ID') //gfs_getValue
            }]
        ).then(
            e=>{
                const MSG_CODE = e.data.MSG_CODE;
                const MSG_TEXT = e.data.MSG_TEXT;
                if (e.data.result){
                    grid.resetOriginData()
                    grid.restore();
                  }
                  else{
                    const COL_NAM = e.data.COL_NAM;
                    const ROW_KEY = e.data.ROW_KEY;
          
                    gfg_setSelectRow(grid, COL_NAM, ROW_KEY);
                  }                  
                  gfc_getMultiLang(MSG_CODE, MSG_TEXT);
            }
        )
    }
    Delete = () => {
        const grid = gfg_getGrid(this.props.pgm, 'main50');
        getCallSP_Mysql(
            [],
            [{grid,
              SP          : 'SP_MENU_ED050',
              COP_CD    : '10',              
              MENU_ID     : 'VARCHAR',
              MENU_NAM    : 'VARCHAR',
              USE_YN      : 'VARCHAR',
              MENU_LEVEL  : 'DECIMAL',
              MENU_GRP_YN : 'VARCHAR',
              UP_MENU_ID  : 'VARCHAR',
              PGM_ID      : 'VARCHAR',
              MENU_SEQ    : 'INT',
              RETAUT_YN : 'VARCHAR',
              INSAUT_YN : 'VARCHAR',
              SAVAUT_YN : 'VARCHAR',
              DELAUT_YN : 'VARCHAR',
              PRNAUT_YN : 'VARCHAR',
              EXEAUT_YN : 'VARCHAR',
              APPAUT_YN : 'VARCHAR',
              XLSAUT_YN : 'VARCHAR',
              ETCAUT_YN : 'VARCHAR',
              UPDCHR_NO : 'VARCHAR'
            }],
            [{
                UPDCHR_NO : gfs_getValue('USER_REDUCER', 'USER_ID') //gfs_getValue
            }],
            true
        ).then(
            e => {
              const MSG_CODE = e.data.MSG_CODE;
              const MSG_TEXT = e.data.MSG_TEXT;
              const ROW_KEY = e.data.ROW_KEY;
      
              if(e.data.result){
                grid.removeRow(ROW_KEY);
                grid.resetOriginData();
                grid.restore();
                gfc_getMultiLang(MSG_CODE, MSG_TEXT);
              }else{
                if (MSG_CODE === 'PHANTOM'){
      
                }else{
                  gfc_getMultiLang(MSG_CODE, MSG_TEXT);
                }
              }
            }
          )
    }

    onSelectChange = (e) => {
        if(e === null) return;
        gfo_getNumber(this.props.pgm, 'detail_menu_seq').setValue(e.MENU_SEQ);
        gfo_getInput(this.props.pgm, 'detail_menu_comment').setValue(e.BIGO);
        gfo_getInput(this.props.pgm, 'detail_crt_no').setValue(e.CRTCHR_NO);
        gfo_getDateTime(this.props.pgm, 'detail_crt_dt').setValue(e.CRT_DT);
        gfo_getInput(this.props.pgm, 'detail_up_no').setValue(e.UPDCHR_NO);
        gfo_getDateTime(this.props.pgm, 'detail_up_dt').setValue(e.UPD_DT);        
      }
    
      afterChange = (e) => {
      }

    render(){
        return (
        <Layout split   ='horizontal'
                minSize     ={[54]}
                defaultSize ={54}
                resizerStyle='none' >
        <SearchDiv>
            <Input pgm={this.props.pgm}
                    id='search_menu_id'
                    label={gfc_getAtt('메뉴 ID')}
            >
            </Input>
            <Input pgm={this.props.pgm}
                    id='search_menu_nam'
                    label={gfc_getAtt('메뉴 이름')}>
            </Input>

            <Combobox pgm={this.props.pgm}
                        id='search_menu_use'
                        location= 'Common/Common.js'
                        fn      = 'use_yn'
                        value   = 'USE_YN'
                        display = 'YN_STR'
                        field   = {[]}
                        param   = {[]}
                        width   = {100}
                        emptyRow= {true}>
            </Combobox>            
        </SearchDiv>

            <Layout primary     = 'second'
                    split   ='vertical'
                    defaultSize = {'0%'}
                    direction   = 'left'
            >
                <Grid pgm={this.props.pgm}
                  id='main50'
                  selectionChange={(e) => this.onSelectChange(e)}
                  afterChange={(e) => this.afterChange(e)}
                  columns = {[
                                columnInput({name    : 'MENU_ID', 
                                            header  : gfc_getAtt('메뉴ID'), 
                                            width   : 120, 
                                            readOnly: false
                                        }),
                                columnInput({name    : 'MENU_NAM', 
                                            header  : gfc_getAtt('메뉴명'), 
                                            width   : 120, 
                                            readOnly: false
                                        }),
                                columnCombobox({name: 'USE_YN', 
                                                header: gfc_getAtt('사용여부'),
                                                readOnly: false,
                                                width   : 150,
                                                editor: {
                                                    location: 'Common/Common.js',
                                                    fn      : 'use_yn',
                                                    value   : 'USE_YN',
                                                    display : 'YN_STR',
                                                    field   : [],
                                                    param   : {},
                                                    emptyRow: true,
                                                    }
                                                }),
                                columnNumber({name : 'MENU_LEVEL',
                                              header: gfc_getAtt('메뉴단계'),
                                              readOnly : false,
                                            }),
                                columnCombobox({name: 'RETAUT_YN', 
                                                header: gfc_getAtt('조회권한'),
                                                readOnly: false,
                                                width   : 150,
                                                editor: {
                                                    location: 'Common/Common.js',
                                                    fn      : 'use_yn',
                                                    value   : 'USE_YN',
                                                    display : 'YN_STR',
                                                    field   : [],
                                                    param   : {},
                                                    emptyRow: true,
                                                    }
                                                }),   
                                columnCombobox({name: 'INSAUT_YN', 
                                                header: gfc_getAtt('등록권한'),
                                                readOnly: false,
                                                width   : 150,
                                                editor: {
                                                    location: 'Common/Common.js',
                                                    fn      : 'use_yn',
                                                    value   : 'USE_YN',
                                                    display : 'YN_STR',
                                                    field   : [],
                                                    param   : {},
                                                    emptyRow: true,
                                                    }
                                                }),
                                columnCombobox({name: 'SAVAUT_YN', 
                                                header: gfc_getAtt('저장권한'),
                                                readOnly: false,
                                                width   : 150,
                                                editor: {
                                                    location: 'Common/Common.js',
                                                    fn      : 'use_yn',
                                                    value   : 'USE_YN',
                                                    display : 'YN_STR',
                                                    field   : [],
                                                    param   : {},
                                                    emptyRow: true,
                                                    }
                                                }),       
                                columnCombobox({name: 'DELAUT_YN', 
                                                header: gfc_getAtt('삭제권한'),
                                                readOnly: false,
                                                width   : 150,
                                                editor: {
                                                    location: 'Common/Common.js',
                                                    fn      : 'use_yn',
                                                    value   : 'USE_YN',
                                                    display : 'YN_STR',
                                                    field   : [],
                                                    param   : {},
                                                    emptyRow: true,
                                                    }
                                                }),   
                                columnCombobox({name: 'PRNAUT_YN', 
                                                header: gfc_getAtt('출력권한'),
                                                readOnly: false,
                                                width   : 150,
                                                editor: {
                                                    location: 'Common/Common.js',
                                                    fn      : 'use_yn',
                                                    value   : 'USE_YN',
                                                    display : 'YN_STR',
                                                    field   : [],
                                                    param   : {},
                                                    emptyRow: true,
                                                    }
                                                }),   
                                columnCombobox({name: 'EXEAUT_YN', 
                                                header: gfc_getAtt('실행권한'),
                                                readOnly: false,
                                                width   : 150,
                                                editor: {
                                                    location: 'Common/Common.js',
                                                    fn      : 'use_yn',
                                                    value   : 'USE_YN',
                                                    display : 'YN_STR',
                                                    field   : [],
                                                    param   : {},
                                                    emptyRow: true,
                                                    }
                                                }),   
                                columnCombobox({name: 'APPAUT_YN', 
                                                header: gfc_getAtt('결재권한'),
                                                readOnly: false,
                                                width   : 150,
                                                editor: {
                                                    location: 'Common/Common.js',
                                                    fn      : 'use_yn',
                                                    value   : 'USE_YN',
                                                    display : 'YN_STR',
                                                    field   : [],
                                                    param   : {},
                                                    emptyRow: true,
                                                    }
                                                }),   
                                columnCombobox({name: 'XLSAUT_YN', 
                                                header: gfc_getAtt('엑셀권한'),
                                                readOnly: false,
                                                width   : 150,
                                                editor: {
                                                    location: 'Common/Common.js',
                                                    fn      : 'use_yn',
                                                    value   : 'USE_YN',
                                                    display : 'YN_STR',
                                                    field   : [],
                                                    param   : {},
                                                    emptyRow: true,
                                                    }
                                                }),   
                                columnCombobox({name: 'ETCAUT_YN', 
                                                header: gfc_getAtt('기타권한'),
                                                readOnly: false,
                                                width   : 150,
                                                editor: {
                                                    location: 'Common/Common.js',
                                                    fn      : 'use_yn',
                                                    value   : 'USE_YN',
                                                    display : 'YN_STR',
                                                    field   : [],
                                                    param   : {},
                                                    emptyRow: true,
                                                    }
                                                }),   
                                columnNumber({name : 'MENU_SEQ',
                                              header: gfc_getAtt('메뉴 SEQ'),
                                              width : 0,
                                              readOnly : true,                                              
                                              }),
                                columnInput({name  : 'BIGO', 
                                             header: gfc_getAtt('코멘트'), 
                                             width : 0,
                                             readOnly: true
                                             }),
                                columnInput({name  : 'CRTCHR_NO', 
                                             header: gfc_getAtt('생성자'), 
                                             width : 0,
                                             readOnly: true,
                                             align   : 'center'
                                            }),
                                
                                columnDateTime({name  : 'CRT_DT',
                                                header: gfc_getAtt('생성일자'),
                                                width : 0,
                                                format: gfs_getValue('USER_REDUCER', 'YMD_FORMAT'),
                                                time  : 'HH:mm',
                                                editor: { 
                                                 timepicker: true
                                                }
                                              }),
                                
                                columnInput({name  : 'UPDCHR_NO', 
                                             header: gfc_getAtt('수정자'), 
                                             width : 0,
                                             readOnly: true
                                            }),
  
                                columnDateTime({name  : 'UPD_DT',
                                                header: gfc_getAtt('수정일시'),
                                                width : 0,
                                                format: gfs_getValue('USER_REDUCER', 'YMD_FORMAT'),
                                                time  : 'HH:mm',
                                                readOnly: true
                                              })
                        
                  ]}>

                </Grid>
                <DetailDiv title={gfc_getAtt('상세정보')}>
                    <tr>
                        <th>{gfc_getAtt('메뉴 SEQ')}</th>
                        <td>
                            <Number pgm={this.props.pgm}
                                    id='detail_menu_seq'>
                            </Number>
                        </td>
                    </tr>
                    <tr>
                        <th>{gfc_getAtt('비고')}</th>
                        <td>
                        <Input pgm={this.props.pgm}
                                    id='detail_menu_comment'>
                            </Input>
                        </td>
                    </tr>
                    <tr>
                        <th>{gfc_getAtt('생성자')}</th>
                        <td>
                        <Input pgm={this.props.pgm}
                                    id='detail_crt_no'
                                    readOnly={true}>
                            </Input>
                        </td>
                        <th>{gfc_getAtt('생성일')}</th>
                        <td>
                            <DateTime pgm={this.props.pgm}
                                        id='detail_crt_dt'
                                        format= {`${gfs_getValue('USER_REDUCER', 'YMD_FORMAT')} HH:mm`}
                                        readOnly={true}>
                            </DateTime>
                        </td>
                    </tr>
                    <tr>
                        <th>{gfc_getAtt('갱신자')}</th>
                        <td>
                        <Input pgm={this.props.pgm}
                                    id='detail_up_no'
                                    readOnly={true}>
                            </Input>
                        </td>
                        <th>{gfc_getAtt('갱신일')}</th>
                        <td>
                            <DateTime pgm={this.props.pgm}
                                        id='detail_up_dt'
                                        format= {`${gfs_getValue('USER_REDUCER', 'YMD_FORMAT')} HH:mm`}
                                        readOnly={true}>                                            
                            </DateTime>
                        </td>
                    </tr>
                </DetailDiv>

            </Layout>
        </Layout>
        );
    }
}

export default Menu;