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

import { gfc_getMultiLang, gfc_getAtt } from '../../Method/Comm';
import { gfg_getGrid } from '../../Method/Grid';
import React from 'react';
import ReactDOM from 'react-dom';

import { getDynamicSql_Mysql_temp } from '../../db/Mysql/Mysql';

const RtnGrid = (props) => {

  let   frozenCount = props.frozenCount;
  const columns = props.columns;

  const onResize = (width) => {
    window.dispatchEvent(new Event('resize'));
    const grid = gfg_getGrid(props.pgm, props.id);
    if(grid) grid.setWidth(width);
    // grid.setHeight(height);
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
  //#endregion

  //#region 컬럼헤더 드래그
  const crtDraggable = (columnId, LR, columnNam) => {
    
    let drg = <Draggable axis='x'
                         handle={'.handle_' + LR}
                         position={{x:0, y:0}}
                         scale={1}
                              
                            //  onStart={e => console.log(e)}
                            // onStart={ e => console.log(e)}
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
        frozenCount = frozenCount - 1;
        gridRef.current.getInstance().setFrozenColumnCount(frozenCount);

        //2-1. 컬럼이동
        columns.splice(frozenCount, 0, from);
        gridRef.current.getInstance().setColumns(columns);
      }else{
        //1. 해당컬럼 확인
        const from = columns[index];

        //2. 틀고정 설정을 한다.
        frozenCount = frozenCount + 1;
        gridRef.current.getInstance().setFrozenColumnCount(frozenCount);

        //1-1. 기존컬럼삭제
        columns.splice(index, 1);

        //2-1. 컬럼이동
        columns.splice(frozenCount - 1, 0, from);
        gridRef.current.getInstance().setColumns(columns);
      }
    }
    
    parent.appendChild(contextFixedUl);
  }
  //#endregion

  //#region 컬럼숨김(해제)
  const columnVisible = (id, parent) => {
    if(id === '_number') return;
    
    const contextVisible = document.createElement('li');
    contextVisible.innerHTML = gfc_getAtt('숨기기');
    contextVisible.style = 'margin-top: 5px;';
    contextVisible.onclick = () => {
      const index = columns.findIndex(e => e.name === id);

      //컬럼순서 때문에 숨김처리시 제일뒤로 보낸다.
      const from = columns[index];

      columns.splice(index, 1);
      columns.splice(columns.length, 0, from);

      gridRef.current.getInstance().hideColumn(id);
      from.hidden = true;
      gridRef.current.getInstance().setColumns(columns);

      if(frozenCount > index){
        frozenCount = frozenCount - 1;
        gridRef.current.getInstance().setFrozenColumnCount(frozenCount);
      }
    }

    parent.appendChild(contextVisible);

    const hide = columns.filter(e => e.hidden);

    if(hide.length > 0){

      const contextShow = document.createElement('li');
      contextShow.innerHTML = gfc_getAtt('숨기기 취소');
      contextShow.style = 'margin-top: 5px;';

      const contextShowUl = document.createElement('ul');
      contextShowUl.style = 'margin-top: 5px;';
      contextShow.appendChild(contextShowUl);

      const onShow = (id, parentId) => {
        
        const index = columns.findIndex(e => e.name === id);
        const parentIndex = columns.findIndex(e => e.name === parentId);
        const from = columns[index];

        columns.splice(index, 1);
        columns.splice(frozenCount === 0 ? parentIndex + 1 : frozenCount, 0, from);

        gridRef.current.getInstance().showColumn(id);
        from.hidden = false;
        gridRef.current.getInstance().setColumns(columns);

        gridRef.current.getInstance().setFrozenColumnCount(frozenCount);
      }

      for(let idx in hide){

        const contextShowUlLi = document.createElement('li');
        contextShowUlLi.innerHTML = gfc_getAtt(hide[idx].header);
        contextShowUlLi.style = 'margin-top: 5px;';
        contextShowUlLi.onclick = (e) => onShow(hide[idx].name, id);
        contextShowUl.appendChild(contextShowUlLi);
        
        parent.appendChild(contextShow);
      }
    }
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

      // let query = `DELETE FROM zm_pgm_grid 
      //              WHERE USER_ID = '${CRTCHR_NO}' 
      //              AND   PGM_ID  = '${PGM_ID}'  
      //              AND   GRID_ID = '${GRID_ID}' `;

      let query = `CALL SP_PGM_GRID('D', 
                                    '${CRTCHR_NO}',
                                    '${PGM_ID}',
                                    '${GRID_ID}',
                                    '',
                                    '',
                                    '',
                                    0,
                                    0,  @a);`;
  
      getDynamicSql_Mysql_temp(
        'Common/Common.js',
        'user',
        [{}],
        query
      ).then(
        e => {
          if(e.statusText === 'OK'){
            gridRef.current.getInstance().setColumns(props.columns);
            gridRef.current.getInstance().setFrozenColumnCount(props.frozenCount);
          }
        }
      )
    };

    parent.appendChild(contextInit);
  }
  //#endregion

  //#region 그리드 설정저장
  const saveGrid = (parent) => {

    const contextSave = document.createElement('li');
    contextSave.innerHTML = gfc_getAtt('설정저장');
    contextSave.style = 'margin-top: 5px;';

    contextSave.onclick = () =>{

      const CRTCHR_NO = gfs_getStoreValue('USER_REDUCER', 'USER_ID');
      const PGM_ID    = props.pgm;
      const GRID_ID   = props.id;
      
      let seq = 1;
      columns.forEach(e => {
        const GRID_COL_NAM = e.name;
        const HIDE_YN      = e.hidden ? 'Y' : 'N';
        const LOCK_YN      = frozenCount >= seq ? 'Y' : 'N';
        const WIDTH        = e.baseWidth;

        let query = `CALL SP_PGM_GRID('I', 
                                      '${PGM_ID}',
                                      '${GRID_ID}',
                                      '${GRID_COL_NAM}',
                                      '${HIDE_YN}',
                                      '${LOCK_YN}',
                                      '${WIDTH}',
                                      '${seq}',
                                      '${CRTCHR_NO}',
                                      @a);`;

        seq = seq + 1;
        
        getDynamicSql_Mysql_temp(
          'Common/Common.js',
          'user',
          [{}],
          query
        ).then(
          e => {
            if(e.statusText === 'OK'){
              // gridRef.current.getInstance().setColumns(props.columns);
              // gridRef.current.getInstance().setFrozenColumnCount(props.frozenCount);
            }
          }
        )
      })

      // let query = `CALL SP_PGM_GRID('D', 
      //                               '${CRTCHR_NO}',
      //                               '${PGM_ID}',
      //                               '${GRID_ID}',
      //                               '',
      //                               '',
      //                               '',
      //                               0,
      //                               0,  @a);`;
  
      // getDynamicSql_Mysql_temp(
      //   'Common/Common.js',
      //   'user',
      //   [{}],
      //   query
      // ).then(
      //   e => {
      //     if(e.statusText === 'OK'){
      //       gridRef.current.getInstance().setColumns(props.columns);
      //       gridRef.current.getInstance().setFrozenColumnCount(props.frozenCount);
      //     }
      //   }
      // )
    };

    parent.appendChild(contextSave);
  }
  //#endregion

  const gridRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const { width, height, ref } = useResizeDetector({onResize});

  useEffect(() => {
    if(gfg_getGrid(props.pgm, props.id) !== undefined){
      gfc_getMultiLang('dup', '그리드 아이디 중복입니다. > ' + props.pgm + ', ' + props.id);
      return 
    }

    const CRTCHR_NO = gfs_getStoreValue('USER_REDUCER', 'USER_ID');
    const PGM_ID    = props.pgm;
    const GRID_ID   = props.id;

    let query = `DELETE FROM zm_pgm_grid 
    WHERE USER_ID = '${CRTCHR_NO}' 
    AND   PGM_ID  = '${PGM_ID}'  
    AND   GRID_ID = '${GRID_ID}' `;

    getDynamicSql_Mysql_temp(
      'Common/Common.js',
      'user',
      [{}],
      query
    ).then(
      e => {
        if(e.statusText === 'OK'){
          gridRef.current.getInstance().on('focusChange', (e) => {
            if(e.rowKey === e.prevRowKey)
              return false
            else
              props.selectionChange(gridRef.current.getInstance().getRow(e.rowKey))
          })
      
          gridRef.current.getInstance().on('afterChange', (e) => {
            props.afterChange(e.changes[0])
          })
         
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
      
              //숨김
              columnVisible(id, contextUl);
              
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
      
          //디비에 저장된 값이 있으면 바로 세팅
          // const aaa = gridRef.current.getInstance().getColumns();
          // gridRef.current.getInstance().setColumns(props.columns);



          
          gfs_dispatch(props.pgm, 'INITGRID', 
            ({
              Grid:{id  : props.id,
                    Grid: gridRef.current.getInstance()}
            })
          );

        }else{
          gfc_getMultiLang('dup', '그리드 설정시 오류가 발생했습니다. > ' + props.pgm + ', ' + props.id);
        }
      }
    )    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <> 
      <div ref={ref} style={{position:'absolute', width:'calc(100% - 10px)', height: 'calc(100% - 10px)', marginLeft: '5px', marginTop: '5px'}}>
        {/* <div ref={gridRef} style={{overflow:'hidden',position:'absolute'}} /> */}
        <Grid header        = {props.colHeader}
              selectionUnit = 'row'
              minRowHeight  = {props.rowHeight < 34 ? 34 : props.rowHeight}
              rowHeight     = {props.rowHeight < 34 ? 34 : props.rowHeight}
              bodyHeight    = 'fitToParent'
              rowHeaders    = {props.rowHeaders !== null ? props.rowHeaders : undefined}
              scrollX       = {true}

              columns       = {props.columns}
              columnOptions = {{
                frozenCount: props.frozenCount
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