//#region Import
import './CSS/Grid.css';
// import './CSS/Date.css';
// import './CSS/Time.css';
// import 'tui-grid/dist/tui-grid.css';
import Draggable from 'react-draggable';

// import Grid from 'tui-grid';
import Grid from '@toast-ui/react-grid';

import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { gfs_getStoreValue, gfs_dispatch } from '../../Method/Store';
import { useResizeDetector } from 'react-resize-detector';

import { gfc_getMultiLang, gfc_getAtt, gfc_sleep, gfc_showMask, gfc_hideMask } from '../../Method/Comm';
import { gfg_getGrid } from '../../Method/Grid';
import React from 'react';
import ReactDOM from 'react-dom';
import { getSp_Oracle } from '../../db/Oracle/Oracle';
import xlsx from 'xlsx';
import moment from 'moment';
//#endregion

const RtnGrid = (props) => {

  let   frozenCount = props.frozenCount;
  const columns = props.columns;

  const setFrozenCount = (cnt) => {
    frozenCount = cnt;
  }

  const onResize = (width, height) => {
    const grid = gfg_getGrid(props.pgm, props.id);

    if(grid){
      try{
        if(Object.keys(grid).length > 0){
          // window.dispatchEvent(new Event('resize'));
          grid.setWidth(width);
          grid.setHeight(height);
        }
      }catch(err){
        console.log(err)
      }
    }
  };

  //#region 헤더 설정
  const setHeader = (columnId, columnNam, width, parent) => {
    let elementResizeDetectorMaker = require('element-resize-detector');
    let erd = elementResizeDetectorMaker();

    const divMain = document.createElement('div');
    divMain.style = `width: ${width}; height: 100%; top: 0; cursor:move; position: absolute; background: transparent;`;
    parent.appendChild(divMain);

    erd.listenTo(parent, function(element) {
      let width = element.clientWidth;
      divMain.style.width = width;
    });

    const divLeft = document.createElement('div');
    divLeft.style = `width: 50%; height: 100%; float:left; top: 0; background: transparent;`;
    divMain.appendChild(divLeft);

    const divRight = document.createElement('div');
    divRight.style = `width: 50%; height: 100%; float:left; top: 0; background: transparent;`;
    divMain.appendChild(divRight);

    ReactDOM.render(crtDraggable(columnId, 'LEFT', columnNam), divLeft);
    ReactDOM.render(crtDraggable(columnId, 'RIGHT', columnNam), divRight);
  }

  const setHeaderEach = async (columnId, columnNam, width) => {
    await gfc_sleep(200);        
    
    const header = gridRef.current.gridInst.el.querySelectorAll('div.tui-grid-header-area');   

    header.forEach(e => {
      const each = e.querySelectorAll('th.tui-grid-cell.tui-grid-cell-header');
      each.forEach(e => {
        if(e.dataset.columnName === columnId){
          setHeader(columnId, columnNam, width, e);
          return;
        }
      })
    })
  }
  //#endregion

  //#region 컬럼헤더 드래그
  const crtDraggable = (columnId, LR, columnNam) => {
    
    let drg = <Draggable axis='x'
                         handle={'.handle_' + LR}
                         position={{x:0, y:0}}
                         scale={1}
                              
                         onStop={(e1, e2) => {
                           const fromId = e2.node.dataset.id;
                           const toId = e1.target.dataset.id;
                           const lr = e1.target.dataset.lr;

                           if(fromId !== undefined){
                             if(toId !== undefined){
                               
                               if(fromId !== toId){
                                 const fromIndex = columns.findIndex(e => e.name === fromId);
                                 let toIndex = columns.findIndex(e => e.name === toId);
                                 if(lr === 'RIGHT') {
                                   toIndex = toIndex + 1;
                                 }
      
                                 const from = columns[fromIndex];
                                 columns.splice(toIndex, 0, from);

                                 if(fromIndex < toIndex){
                                   for(let i = 0; i < columns.length; i++){
                                     if(columns[i].name === from.name){
                                       columns.splice(i, 1);
                                       break;
                                     }
                                   }
                                 }else{
                                  for(let i = columns.length - 1; i >= 0; i--){
                                    if(columns[i].name === from.name){
                                      columns.splice(i, 1);
                                      break;
                                    }
                                  }
                                 }
                                 
                                 gridRef.current.getInstance().setColumns(columns);
                               }
                             }
                          }
                    }}
                  >
                  <div data-id={columnId} data-nam={columnNam} data-lr={LR} className={'handle_' + LR} style={{width:'99%', height:'100%'}} />
                </Draggable>;
    return drg;
  }
  //#endregion

  //#region 컬럼 틀고정(해제)
  const fixedFrame = (id, parent) => {
    if(id === '_number') return;

    let index = columns.findIndex(e => e.name === id);
    
    let nam = '틀고정';
    if(frozenCount > 0){
      if(frozenCount > index) nam = '틀고정해제';
    }

    const contextFixedUl = document.createElement('li');
    contextFixedUl.innerHTML = gfc_getAtt(nam);
    contextFixedUl.style = 'margin-top: 5px;';
    contextFixedUl.onclick = e => {
      //틀고정 해제인경우
      if(frozenCount > index){
        //1. 해당컬럼 확인
        const from = columns[index];

        //1-1. 기존컬럼삭제
        columns.splice(index, 1); 

        //2. 틀고정 설정을 한다.
        setFrozenCount(frozenCount - 1);
        gridRef.current.getInstance().setFrozenColumnCount(frozenCount);

        //2-1. 컬럼이동
        columns.splice(frozenCount, 0, from);
        gridRef.current.getInstance().setColumns(columns);
        
        setHeaderEach(from.name, from.header, from.width);
      }else{
        //1. 해당컬럼 확인
        const from = columns[index];

        //1-1. 기존컬럼삭제
        columns.splice(index, 1);

        //2. 틀고정 설정을 한다.
        setFrozenCount(frozenCount + 1);
        gridRef.current.getInstance().setFrozenColumnCount(frozenCount);

        //2-1. 컬럼이동
        columns.splice(frozenCount - 1, 0, from);
        gridRef.current.getInstance().setColumns(columns);
      }
    }
    
    parent.appendChild(contextFixedUl);
  }
  //#endregion

  //#region 그리드초기화
  const resetGrid = (parent) => {

    const contextInit = document.createElement('li');
    contextInit.innerHTML = gfc_getAtt('설정초기화');
    contextInit.onclick = () =>{

      const CRTCHR_NO = gfs_getStoreValue('USER_REDUCER', 'USER_ID');
      const PGM_ID    = props.pgm;
      const GRID_ID   = props.id;

      let param = [];
      param.push({
        sp   : `begin 
                  SP_ZM_PGM_GRID(
                    :p_ROWSTATUS,
                    :p_PGM_ID,
                    :p_GRID_ID,
                    :p_GRID_COL_NAM,
                    :p_HIDE_YN,
                    :p_LOCK_YN,
                    :p_WIDTH,
                    :p_SEQ,
                    :p_CRTCHR_NO,
                    
                    :p_select,
                    :p_SUCCESS,
                    :p_MSG_CODE,
                    :p_MSG_TEXT,
                    :p_COL_NAM
                  );
                end;
                `,
        data : {
          p_ROWSTATUS    : 'D',
          p_PGM_ID       : PGM_ID,
          p_GRID_ID      : GRID_ID,
          p_GRID_COL_NAM : '',
          p_HIDE_YN      : '',
          p_LOCK_YN      : '',
          p_WIDTH        : 0,
          p_SEQ          : 0,
          p_CRTCHR_NO    : CRTCHR_NO
        },
        errSeq: 0
      });

      getSp_Oracle(param).then((result) => {
        gridRef.current.getInstance().setColumns(props.columns);
        gridRef.current.getInstance().setFrozenColumnCount(props.frozenCount);

        if(result.data.SUCCESS === 'N'){
          alert('그리드 설정시 오류가 발생했습니다. > ' + props.pgm + ', ' + props.id);
        }
      });
    };

    parent.appendChild(contextInit);
  }
  //#endregion

  //#region 그리드 설정저장
  const saveGrid = (parent) => {

    const contextSave = document.createElement('li');
    contextSave.innerHTML = gfc_getAtt('설정저장');
    contextSave.style = 'margin-top: 5px;';

    contextSave.onclick = async() =>{

      const CRTCHR_NO = gfs_getStoreValue('USER_REDUCER', 'USER_ID');
      const PGM_ID    = props.pgm;
      const GRID_ID   = props.id;
      
      let seq = 1;
      let param = [];

      gridRef.current.getInstance().getColumns().forEach(e => {
        const GRID_COL_NAM = e.name;
        const HIDE_YN      = e.hidden ? 'Y' : 'N';
        const LOCK_YN      = frozenCount >= seq ? 'Y' : 'N';
        const WIDTH        = e.baseWidth;

        param.push({
          sp   : `begin 
                    SP_ZM_PGM_GRID(
                      :p_ROWSTATUS,
                      :p_PGM_ID,
                      :p_GRID_ID,
                      :p_GRID_COL_NAM,
                      :p_HIDE_YN,
                      :p_LOCK_YN,
                      :p_WIDTH,
                      :p_SEQ,
                      :p_CRTCHR_NO,
                      
                      :p_select,
                      :p_SUCCESS,
                      :p_MSG_CODE,
                      :p_MSG_TEXT,
                      :p_COL_NAM
                    );
                  end;
                  `,
          data : {
            p_ROWSTATUS    : 'I',
            p_PGM_ID       : PGM_ID,
            p_GRID_ID      : GRID_ID,
            p_GRID_COL_NAM : GRID_COL_NAM,
            p_HIDE_YN      : HIDE_YN,
            p_LOCK_YN      : LOCK_YN,
            p_WIDTH        : WIDTH,
            p_SEQ          : seq,
            p_CRTCHR_NO    : CRTCHR_NO
          },
          errSeq: 0
        })

        seq = seq + 1;
      })

      const select = await getSp_Oracle(param);
      if(select.data.SUCCESS === 'Y'){
        alert('저장되었습니다. > ' + props.pgm + ', ' + props.id);
      }else{
        alert('그리드 설정시 오류가 발생했습니다. > ' + props.pgm + ', ' + props.id);
      }
    };

    parent.appendChild(contextSave);
  }
  //#endregion

  const gridRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const { width, height, ref } = useResizeDetector({onResize});

  // const setFocusChange = () => {
  //   gridRef.current.getInstance().on('focusChange', (e) => {
  //     if(e.rowKey === e.prevRowKey){
  //       return false;
  //     }else{
  //       // gridRef.current.getInstance().setSelectionRange({
  //       //   start: [e.rowKey, 0],
  //       //   end: [e.rowKey, gridRef.current.getInstance().getColumns().length - 1]
  //       // });

  //       if(props.selectionChange !== undefined)
  //         props.selectionChange(gridRef.current.getInstance().getRow(e.rowKey));
  //     }
  //   })
  // }

  const Init = async() => {

    if(gfg_getGrid(props.pgm, props.id) !== undefined){
      gfc_getMultiLang('dup', '그리드 아이디 중복입니다. > ' + props.pgm + ', ' + props.id);
      return 
    }

    gridRef.current.getInstance().on('focusChange', (e) => {
      if(e.rowKey === e.prevRowKey){
        return false;
      }else{
        // gridRef.current.getInstance().setSelectionRange({
        //   start: [e.rowKey, 0],
        //   end: [e.rowKey, gridRef.current.getInstance().getColumns().length - 1]
        // });

        if(props.selectionChange !== undefined)
          props.selectionChange(gridRef.current.getInstance().getRow(e.rowKey));
      }
    })

    gridRef.current.getInstance().on('click', (e) => {
      if(e.targetType === 'columnHeader'){
        if(props.headerClick !== undefined){
          props.headerClick(e);
        }
      }
    })

    gridRef.current.getInstance().on('afterChange', (e) => {
      if(props.afterChange !== undefined)
        props.afterChange(e.changes[0]);
    })

    gridRef.current.getInstance().on('dblclick', (e) => {
      if(props.dblclick !== undefined){
        if(e.targetType !== 'etc'){
          props.dblclick(e.columnName);
        }
      }
    })

    gridRef.current.getInstance().on('mousedown', (e) => {
      if(e.targetType !== 'columnHeader'){
        if(e.nativeEvent.which === 3){
          const rowCount = gridRef.current.getInstance().getRowCount();
          if(rowCount < 1) return;

  
          e.nativeEvent.preventDefault()

          const contextDiv = document.createElement('div');
          contextDiv.id = props.pgm + '_' + props.id + '_contextmenu';
          contextDiv.style = 'position:fixed;width:150px; background: #fff;box-shadow:1px 1px 5px 0 rgba(0, 0, 0, 0.54)';


          const fDiv = document.getElementById(contextDiv.id);
          if(fDiv !== null){
            document.body.removeChild(fDiv);
          }
  
          document.addEventListener('click', () => {
            const fDiv = document.getElementById(contextDiv.id);
            if(fDiv !== null){
              document.body.removeChild(fDiv);
            }
          }); 
          document.body.appendChild(contextDiv);
          
          const contextChild = document.createElement('input');
          contextChild.style = 'width:148px; height:30; text-align:center; margin: 1 0 0 1';
          contextChild.value = 'Excel';
          contextChild.addEventListener('click', async() => {
            // console.log(gridRef.current.getInstance().getColumns())
            // const tag = gridRef.current.getInstance().getElement(0, 'COP_CD');
            // console.log(tag)
            // console.log(tag.firstChild.value)
            // console.log(gridRef.current.getInstance().getValue(0, 'COP_CD'))

            gfc_showMask();

            
            gridRef.current.getInstance().off('focusChange');

            let header = [];
            let headerWidth = [];
            let column = [];
            let rowData = [];
            let colWidth = [];
            let gridHeader = gridRef.current.getInstance().getColumns();
            for(let i = 0; i < gridHeader.length; i++){
              header.push(gridHeader[i].header);
              headerWidth.push(gridHeader[i].baseWidth)
              column.push(gridHeader[i].name);
              colWidth.push({ wpx : gridHeader[i].baseWidth / 2 })
              columns[i].width  = 2;
            }

            rowData.push(header);
            
            await gridRef.current.getInstance().setColumns(columns);
            
            for(let i = 0; i < rowCount; i++){
              let data = [];
              await gridRef.current.getInstance().focus(i);
              await gfc_sleep(1);
              for(let j = 0; j < header.length; j++){
                let value = '';
                let tag;
                try{
                  tag = await gridRef.current.getInstance().getElement(i, column[j]);
                  value = tag.firstChild.value;
                }catch(e){
                  value = '';
                }
                finally{
                  data.push(value);
                }
              }

              rowData.push(data);
            }

            for(let i = 0; i < gridHeader.length; i++){
              columns[i].width  = gridHeader[i].baseWidth;
            }

            await gridRef.current.getInstance().setColumns(columns);

            gridRef.current.getInstance().on('focusChange', (e) => {
              if(e.rowKey === e.prevRowKey){
                return false;
              }else{
                if(props.selectionChange !== undefined)
                  props.selectionChange(gridRef.current.getInstance().getRow(e.rowKey));
              }
            })

            gfc_hideMask();
            
            const book = xlsx.utils.book_new();
            const excelExport = xlsx.utils.aoa_to_sheet( rowData );
            
            // @breif CELL 넓이 지정
            
            excelExport["!cols"] = colWidth;
            // excelExport["!cols"] = [
            //       { wpx : 130 }   // A열            
            //     , { wpx : 100 }   // B열
            //     , { wpx : 80 }    // C열
            //     , { wch : 60 }    // D열
            // ]
            
            // @breif 첫번째 시트에 작성한 데이터를 넣는다.
            
            xlsx.utils.book_append_sheet( book, excelExport, "IMS" );
            xlsx.writeFile( book, `${moment(new Date()).format('YYYYMMDD_hhmmss')}.xlsx` ); 
          }); 
          contextDiv.appendChild(contextChild);
  
          // const contextUl = document.createElement('ul');
          // contextUl.style = 'width:148px; font-size:13;margin-top: 3px;';
          // contextDiv.appendChild(contextUl); 
  
          // //숨김
          // columnVisible(id, contextUl);
          
          if(e.nativeEvent.which === 3){
            let x = e.nativeEvent.pageX + 'px'; // 현재 마우스의 X좌표
            let y = e.nativeEvent.pageY + 'px'; // 현재 마우스의 Y좌표
            contextDiv.style.left = x;
            contextDiv.style.top = y;
          }
        }
      }
    })

    const CRTCHR_NO = gfs_getStoreValue('USER_REDUCER', 'USER_ID');
    const PGM_ID    = props.pgm;
    const GRID_ID   = props.id;

    let param = [];
    param.push({
      sp   : `begin 
                SP_ZM_PGM_GRID(
                  :p_ROWSTATUS,
                  :p_PGM_ID,
                  :p_GRID_ID,
                  :p_GRID_COL_NAM,
                  :p_HIDE_YN,
                  :p_LOCK_YN,
                  :p_WIDTH,
                  :p_SEQ,
                  :p_CRTCHR_NO,
                  
                  :p_select,
                  :p_SUCCESS,
                  :p_MSG_CODE,
                  :p_MSG_TEXT,
                  :p_COL_NAM
                );
              end;
              `,
      data : {
        p_ROWSTATUS    : 'R',
        p_PGM_ID       : PGM_ID,
        p_GRID_ID      : GRID_ID,
        p_GRID_COL_NAM : '',
        p_HIDE_YN      : '',
        p_LOCK_YN      : '',
        p_WIDTH        : 0,
        p_SEQ          : 0,
        p_CRTCHR_NO    : CRTCHR_NO
      },
      errSeq: 0
    });

    getSp_Oracle(param).then(async(e) => {
      
      const header = gridRef.current.gridInst.el.querySelectorAll('div.tui-grid-header-area');   
    
      for(let idx = 0; idx < header.length; idx++){
        header[idx].addEventListener('contextmenu', e => {
          let id = e.target.dataset.id;
          let nam = e.target.dataset.nam;
  
          if(id === undefined){
            id = e.target.dataset.columnName;
          }
  
          if(nam === undefined){
            nam = columns.find(e => e.name === id);
            if(nam !== undefined){
              nam = nam.header;
            }
          }
  
          if(nam === undefined) return;
  
          e.preventDefault()
          
          const contextDiv = document.createElement('div');
          contextDiv.id = props.pgm + '_' + props.id + '_contextmenu';
          contextDiv.style = 'position:fixed;width:150px; background: #fff;box-shadow:1px 1px 5px 0 rgba(0, 0, 0, 0.54)';
  
          const fDiv = document.getElementById(contextDiv.id);
          if(fDiv !== null){
            document.body.removeChild(fDiv);
          }
  
          document.addEventListener('click', () => {
            const fDiv = document.getElementById(contextDiv.id);
            if(fDiv !== null){
              document.body.removeChild(fDiv);
            }
          }); 
          document.body.appendChild(contextDiv);
          
          const contextChild = document.createElement('input');
          contextChild.style = 'width:148px; height:30; text-align:center; margin: 1 0 0 1';
          contextChild.value = nam;
          contextDiv.appendChild(contextChild);
  
          const contextUl = document.createElement('ul');
          contextUl.style = 'width:148px; font-size:13;margin-top: 3px;';
          contextDiv.appendChild(contextUl); 
  
          //설정 초기화
          resetGrid(contextUl);
  
          //설정 저장
          saveGrid(contextUl);
  
          //틀고정
          fixedFrame(id, contextUl);
  
          // //숨김
          // columnVisible(id, contextUl);
          
          if(e.which === 3){
            let x = e.pageX + 'px'; // 현재 마우스의 X좌표
            let y = e.pageY + 'px'; // 현재 마우스의 Y좌표
            contextDiv.style.left = x;
            contextDiv.style.top = y;
          }
        });
        
        const each = header[idx].querySelectorAll('th.tui-grid-cell.tui-grid-cell-header');
        
        for(let j = 0; j < each.length; j++){
          const columnId  = each[j].dataset.columnName;
          const columnNam = each[j].innerText;
          setHeader(columnId, columnNam, each[j].clientWidth, each[j]);
        }
      }

      if(e.data.SUCCESS === 'Y'){
        let frozen = 0;

        e.data.ROWS.forEach(e => {
          const index = columns.findIndex(e1 => e1.name === e.GRID_COL_NAM);
          const from = columns[index];

          from.width  = e.WIDTH * 1;
          from.hidden = e.HIDE_YN === 'N' ? false : true;

          if(e.SEQ - 1 !== index){
            columns.splice(index, 1);
            columns.splice(e.SEQ - 1, 0, from);
          }else{
            columns[index].width  = e.WIDTH * 1;
            columns[index].hidden = e.HIDE_YN === 'N' ? false : true;
          }
          

          if(e.LOCK_YN === 'Y') {
            frozen = frozen + 1;
          }
        })
        
        await gfc_sleep(500);
        gridRef.current.getInstance().setColumns(columns);
        gridRef.current.getInstance().setFrozenColumnCount(frozen);
        setFrozenCount(frozen);
      }
    })
        
    gfs_dispatch(props.pgm, 'INITGRID', 
      ({
        Grid:{id  : props.id,
              Grid: gridRef.current.getInstance(),
              // focusEvent: setFocusChange
        }
      })
    );

    return() => {
      gfs_dispatch(props.pgm, 'CLEARGRID', 
        ({
          id: props.id
        })
      );
    }
  }

  useEffect(() => {
    Init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <> 
      <div ref={ref} style={{marginLeft: '8px', width:'calc(100% - 17px)', height: 'calc(100% - 10px)'}}>
      {/* <div ref={ref} style={{width:'calc(100% - 10px)', height: 'calc(100% - 10px)', marginLeft: '5px', marginTop: '5px'}}> */}
        
        <Grid header        = {props.colHeader}
              selectionUnit = 'row'
              min
              minRowHeight  = {props.rowHeight < 34 ? 34 : props.rowHeight}
              rowHeight     = {props.rowHeight < 34 ? 34 : props.rowHeight}
              bodyHeight    = 'fitToParent'
              rowHeaders    = {props.rowHeaders !== null ? props.rowHeaders : undefined}
              scrollX       = {true}

              columns       = {props.columns}
              columnOptions = {{
                frozenCount: props.frozenCount,
                minWidth   : 1
              }}

              ref           = {gridRef}
        />
      </div>
    </>
  )
};

RtnGrid.propTypes = {
  pgm        : PropTypes.string.isRequired,
  id         : PropTypes.string.isRequired,
  columns    : PropTypes.array.isRequired,
  colHeader  : PropTypes.object,
  rowHeight  : PropTypes.number,
  rowHeader  : PropTypes.array,
  frozenCount: PropTypes.number
};

RtnGrid.defaultProps = {
  colHeader  :{
    height:32
  },
  rowHeight  :34,
  rowHeaders : [{ type: 'rowNum', width: 50 }],
  frozenCount: 0
};

export default RtnGrid;