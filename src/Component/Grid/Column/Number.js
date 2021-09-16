import { gfg_getRow } from '../../../Method/Grid';
import { gfc_setNumberFormat, gfc_unNumberFormat } from '../../../Method/Comm';
import { gfs_getStoreValue } from '../../../Method/Store';

/**
 * name : 컬럼명
 * 
 * header : 헤더명
 * 
 * width(100) : Width
 * 
 * onRender: {(value, el, rows)}
 * 
 * readOnly(true): 리드온리
 * 
 * align(center | left | right(기본)) : 좌우정렬
 * 
 * valign(top | middle(기본) | bottom) : 상하정렬
 * 
 * resizable(true) : 컬럼넓이 조정여부
 * 
 * password(false) : 비밀번호여부
 */
export const Number = (props) => {
  const name      = props.name;
  const header    = props.header;
  const width     = props.width !== undefined ? props.width : 100;
  const align     = props.align !== undefined ? props.align : 'right';
  const valign    = props.valign !== undefined ? props.valign : 'middle';
  const fontSize  = props.fontSize !== undefined ? props.fontSize : '13';
  const resizable = props.resizable !== undefined ? props.resizable : true;
  const readOnly = props.readOnly !== undefined ? props.readOnly : true;

  const rtn = {name,
               header,
               width,
               align,
               valign,
               fontSize,
               resizable}

  // if(!readOnly){
    // rtn.editor = {
    //   type   : InputEditor,
    //   options: {
    //     align : props.align,
    //     valign: props.valign
    //   }
    // }

    // rtn.renderer = {
    //   type   : InputRenderer,
    //   options: {
    //     align : props.align,
    //     valign: props.valign
    //   }
    // }
  // }
  
  rtn.editor = {
    type   : NumberEditor,
    options: {
      align,
      valign,
      onRender: props.onRender,
      readOnly,
      fontSize
    }
  }

  rtn.renderer = {
    type   : NumberRenderer,
    options: {
      align,
      valign,
      onRender: props.onRender,
      readOnly,
      fontSize
    }
  }

  return rtn;
}

class NumberEditor {
  constructor(props) {
    const option = props.columnInfo.renderer.options;
    const el = document.createElement('input');
    el.setAttribute('style', `height:32px; 
                              border: 0px; 
                              display:table-cell; 
                              width:100%; 
                              padding:0px;
                              font-size:${option['fontSize']}; 
                              text-align:${option['align']}; 
                              vertical-align:${option['valign']};
                              ` )

    el.type  = 'text';
    let value = String(props.value === null ? '' : props.value);
    const NUM_FORMAT = gfs_getStoreValue('USER_REDUCER', 'NUM_FORMAT');
    const NUM_ROUND = gfs_getStoreValue('USER_REDUCER', 'NUM_ROUND');
    value = gfc_setNumberFormat(props.value, NUM_FORMAT, NUM_ROUND);
    if(value === undefined)
      value = '';

    el.value = value;

    if(option['readOnly']) el.readOnly = true;

    if(option['onRender'] !== undefined){
      const onRender = option.onRender;
      const rows = gfg_getRow(props.grid, props.rowKey);
      onRender(props.value, el, rows);
    }

    this.el = el;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    return gfc_unNumberFormat(this.el.value);
  }

  mounted() {
    this.el.select();
  }
}

class NumberRenderer {
  constructor(props) {
    const el = document.createElement('input');

    this.el = el;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {

    const option = props.columnInfo.renderer.options;
    const orgData = props.grid.dataManager.getOriginData();
    const grid = props.grid;
    const rowKey = props.rowKey;
    const height = grid.store.rowCoords.heights[rowKey];
    let org = orgData.length <= props.rowKey ? '' : props.grid.dataManager.getOriginData()[props.rowKey][props.columnInfo.name];
    if(org === null) org = '';
    const NUM_FORMAT = gfs_getStoreValue('USER_REDUCER', 'NUM_FORMAT');
    const NUM_ROUND = gfs_getStoreValue('USER_REDUCER', 'NUM_ROUND');
    org = gfc_setNumberFormat(org, NUM_FORMAT, NUM_ROUND);

    let value = String(props.value === null ? '' : props.value);
    value = gfc_setNumberFormat(value, NUM_FORMAT, NUM_ROUND)

    let backGround = 'white';
    if(org !== value) backGround = 'greenYellow'
    
    this.el.type  = 'text';
    this.el.setAttribute('style', `height: ${height - 1}px; 
                                   width:100%; 
                                   padding: 0px 5px 0px 5px;
                                   border: 0px; 
                                   text-align:${option['align']}; 
                                   vertical-align:${option['valign']}; 
                                   background-color:${backGround};
                                   font-size:${option['fontSize']}; 
                                   `);
                                  
    this.el.value = value;
  }
}