import './CSS/Grid.css';
// import './CSS/Date.css';
// import './CSS/Time.css';
// import 'tui-grid/dist/tui-grid.css';

import Grid from 'tui-grid';

import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import {store} from '../../Store/Store';
import { useResizeDetector } from 'react-resize-detector';

import { gfc_getMultiLang } from '../../Method/Comm';
import { gfg_getGrid } from '../../Method/Grid';

import GridCtMenu from './ContextMenu/GridCtMenu';

const RtnGrid = (props) => {

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
      columns      : props.columns,
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

    gridMain.on('mousedown', (e) => {

      let column = '_number';
      if(props.rowHeaders === null){
        column = gridMain.getColumns()[0].name;
      }

      e.instance.el.addEventListener('contextmenu', e => e.preventDefault());

      if(e.columnName === column){
        if(e.targetType === 'columnHeader'){
          if(e.nativeEvent.which === 3){
            alert('right click');
          }
        }
      }
    })

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
      <GridCtMenu />
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