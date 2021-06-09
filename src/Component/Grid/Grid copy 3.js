import './CSS/Grid.css';
// import './CSS/Date.css';
// import './CSS/Time.css';
// import 'tui-grid/dist/tui-grid.css';
import Draggable from 'react-draggable';
// import { elementResizeDetectorMaker } from 'element-resize-detector';

import ReactDOM from 'react-dom';

import Grid from 'tui-grid';

import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import {store} from '../../Store/Store';
import { useResizeDetector } from 'react-resize-detector';

import { gfc_getMultiLang } from '../../Method/Comm';
import { gfg_getGrid } from '../../Method/Grid';
import React from 'react';

const RtnGrid = (props) => {
  const [column, setColumn] = useState(props.columns);

  const onResize = (width) => {
    window.dispatchEvent(new Event('resize'));
    const grid = gfg_getGrid(props.pgm, props.id);
    if(grid) grid.setWidth(width);
    // grid.setHeight(height);
  };

  const gridRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const { width, height, ref } = useResizeDetector({onResize});

  useEffect(() => {
    if(gfg_getGrid(props.pgm, props.id) !== undefined){
      gfc_getMultiLang('dup', '그리드 아이디 중복입니다. > ' + props.pgm + ', ' + props.id);
      return 
    }

    const gridMain = new Grid({
      el           : gridRef.current,     
      columns      : column,
      header       : props.colHeader,
      selectionUnit: 'row',
      minRowHeight : props.rowHeight < 34 ? 34 : props.rowHeight,
      rowHeight    : props.rowHeight < 34 ? 34 : props.rowHeight,
      bodyHeight   : 'fitToParent',
      rowHeaders   :  props.rowHeaders !== null ? props.rowHeaders : undefined
    })

    gridMain.on('focusChange', (e) => {
      if(e.rowKey === e.prevRowKey)
        return false
      else
        props.selectionChange(gridMain.getRow(e.rowKey))
    })

    gridMain.on('afterChange', (e) => {
      props.afterChange(e.changes[0])
    })

    
    const div = document.createElement('div');
    div.id = props.pgm + '_' + props.id + '_contextmenu';
    div.style = 'display:none;position:fixed;width:150px; height:200px; background: #fff;box-shadow:1px 1px 5px 0 rgba(0, 0, 0, 0.54)';
    document.body.appendChild(div);
    document.addEventListener("click", function(e) {div.style.display = 'none'});
   
    const header = gridRef.current.querySelectorAll('div.tui-grid-header-area');     
    
    for(let idx = 0; idx < header.length; idx++){
      header[idx].addEventListener('contextmenu', e => {
        e.preventDefault()
        
        if(e.which === 3){
          let x = e.pageX + 'px'; // 현재 마우스의 X좌표
          let y = e.pageY + 'px'; // 현재 마우스의 Y좌표
          div.style.display = 'block';
          div.style.left = x;
          div.style.top = y;
        }
      });

      let elementResizeDetectorMaker = require("element-resize-detector");
      let erd = elementResizeDetectorMaker();

      //No. 컬럼은 숨김처리해도 idx===0이기 때문에 No가아닌 나머지 컬럼만 적용하면됨.
      if(idx === 1){
        const each = header[idx].querySelectorAll('th.tui-grid-cell.tui-grid-cell-header');
        
        for(let j = 0; j < each.length; j++){
          const columnName = each[j].dataset.columnName;

          const div = document.createElement('div');
          div.id = props.pgm + '_' + props.id + '_' + columnName;
          div.style = `width: ${each[j].clientWidth}; height: 100%; top: 0; cursor:move; position: absolute; background: transparent;`;
          each[j].appendChild(div);

          erd.listenTo(each[j], function(element) {
            let width = element.clientWidth;
            div.style.width = width;
          });

          let child = <Draggable axis='x'
                                 handle='.handle'
                                 position={null}
                                 scale={1}
                                
                                //  onStart={e => e.target.style.transform = 'translate(0px, 0px)'}
                                // onStart={ e => console.log(e)}
                                 onStop={e => {
                                   setColumn(column.shift());
                                   gridMain.refreshLayout();
                                  //  console.log(column)
                                  //  const orgX = e.target.dataset.move;
                                  //  console.log(e)
                                  //  e.target.style.transform = 'translate(0%, 0%)';
                                   // e.target.offsetLeft= orgX;
                                   // console.log(e)
                                  //  e.x = 456;
                                 }}>
                        <div data-move={100} className='handle' style={{position:'absolute', width:'99%', height:'100%'}}>
                          
                        </div>
                      </Draggable>;

          ReactDOM.render(child, div);
          
        }
      }

      // header[idx].draggable='true';
      // header[idx].style.cursor = 'move';



      // let span = document.createElement('span');
      // header[idx].appendChild(span);

      // header[idx].addEventListener('ondragstart', e => {
      //   e.preventDefault();
      //   console.log(e);
      // });
    }

    // gridMain.on('mousedown', (e) => {

    //   let column = '_number';
    //   if(props.rowHeaders === null){
    //     column = gridMain.getColumns()[0].name;
    //   }

    //   e.instance.el.addEventListener('contextmenu', e => e.preventDefault());

    //   if(e.columnName === column){
    //     if(e.targetType === 'columnHeader'){
    //       if(e.nativeEvent.which === 3){
    //         alert(';aa')
    //       }
    //     }
    //   }
    // })

    // gridMain.on('onGridUpdated', (e) => {
    //   console.log(e.instance.store)
    //   store.dispatch({
    //     reducer: props.pgm,
    //     type   : 'INITSTORE',
    //     Grid   : {  
    //       id   : props.id,
    //       Grid : gridMain,
    //       Store: e.instance.store
    //     }
    //   }) 
    // })

    // Grid.applyTheme('clean');

    // gridMain.on('focusChange', (ev) => {
    //   gridMain.setSelectionRange({
    //     start: [ev.rowKey, 0],
    //     end: [ev.rowKey, gridMain.getColumns().length]
    //   });
    // }); 
         
    store.dispatch({
      reducer: props.pgm,
      type   : 'INITGRID',
      Grid   : {  
        id  : props.id,
        Grid: gridMain
      }
    }) 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <> 
      <div ref={ref} style={{ width:'calc(100% - 10px)', height: 'calc(100% - 10px)', marginLeft: '5px', marginTop: '5px'}}>
        <div ref={gridRef} style={{overflow:'hidden',position:'absolute'}} />
      </div>
    </>
  )
};

RtnGrid.propTypes = {
  pgm       : PropTypes.string.isRequired,
  id        : PropTypes.string.isRequired,
  columns   : PropTypes.array.isRequired,
  colHeader : PropTypes.object,
  rowHeight : PropTypes.number,
  rowHeaders: PropTypes.array
};

RtnGrid.defaultProps = {
  colHeader:{
    height:32
  },
  rowHeight:34,
  rowHeaders: [{ type: 'rowNum', width: 50 }]
};

export default RtnGrid;