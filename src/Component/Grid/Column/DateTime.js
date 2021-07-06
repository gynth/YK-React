import moment from 'moment';
import { gfs_getStoreValue } from '../../../Method/Store';
import { gfg_setValue } from '../../../Method/Grid';

/**
 * name : 컬럼명
 * 
 * header : 헤더명
 * 
 * width(100) : Width
 * 
 * readOnly(true) : readOnly
 * 
 * format(설정값) : 날짜포맷
 * 
 * align(center(기본) | left | right) : 좌우정렬
 * 
 * valign(top | middle(기본) | bottom) : 상하정렬
 * 
 * resizable(true) : 컬럼넓이 조정여부
 * 
 * fontSize : 폰트크기
 * 
 * editor: { 
 * 
 * type: 'date' | 'month' | 'year'
 * 
 * timepicker: true | {
 *                      layoutType: 'tab',
 *                      inputType: 'spinbox'
 *                    }
 * 
 * timepicker: {
 *   layoutType: 'tab',
 *   inputType: 'spinbox'
 * }
 *
 * selectableRanges: [[new Date(2014, 3, 10), new Date(2014, 5, 20)]]
 * 
 * }
 */
export const DateTime = (props) => {
  const name      = props.name;
  const header    = props.header;
  const width     = props.width !== undefined ? props.width : 100;
  const readOnly  = props.readOnly !== undefined ? props.readOnly : true;
  let   format    = props.format !== undefined ? props.format : gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT');
  let   time      = props.time;
  const fontSize  = props.fontSize !== undefined ? props.fontSize : '13';
  const align     = props.align !== undefined ? props.align : 'center';
  const valign    = props.valign !== undefined ? props.valign : 'middle';
  const resizable = props.resizable !== undefined ? props.resizable : true;
  const editor    = props.editor;

  if(time !== undefined){ 
    time = time.replace(':ss', '').replace('ss', '');

    format += ' ' + time;
  }

  const rtn = {name,  
               header, 
               width, 
               align, 
               valign, 
               fontSize,
               resizable}

  if(!readOnly){
    rtn.editor = {
      type   : 'datePicker',
      options: {
        timepicker: (editor !== undefined && editor['timepicker'] !== undefined) && editor['timepicker'],
        selectableRanges: (editor !== undefined && editor['selectableRanges'] !== undefined) && editor['selectableRanges'],
        format,
        time,
        fontSize
      }
    }

    rtn.editor.options.format = format.replace('DD', 'dd');
    if(time !== undefined) rtn.editor.options.time = time;
  }

  rtn.renderer = {
    type   : DateTimeRenderer,
    options: {
      align,
      valign,
      readOnly,
      format,
      time,
      fontSize
    }
  }

  return rtn;
}

class DateTimeRenderer {
  constructor(props) {
    const el = document.createElement('input');

    this.el = el;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    const grid = props.grid;
    const name = props.columnInfo.name;
    const rowKey = props.rowKey;
    const height = grid.store.rowCoords.heights[rowKey];

    const option = props.columnInfo.renderer.options;

    let format = option.format;
    let time   = option.time;

    const orgData = props.grid.dataManager.getOriginData();
    let org = orgData.length <= props.rowKey ? '' : props.grid.dataManager.getOriginData()[props.rowKey][props.columnInfo.name];
    if(org !== ''){
      org = moment(org).format(format);
      if(org === 'Invalid date') org = props.value;
      if(org === null) org = '';
    }

    let value = moment(props.value).format(format);
    if(value === 'Invalid date') value = props.value === null ? '' : props.value;

    let backGround = 'white';
    if(org !== value){
      backGround = 'greenYellow';
      let cvFormat = 'yyyy-MM-DD';
      if(time !== undefined) cvFormat += ' ' + time;

      const gridValue = moment(props.value).format(cvFormat)
      gfg_setValue(grid, name, gridValue, rowKey);
    }

    this.el.type = 'text';
    // this.el.setAttribute('style', `height: 27px; display: table-cell; width:calc(100% - 5px); padding: 0px 0px 0px 5px; border: 0px; text-align:${option['align']}; vertical-align:${option['valign']}; background-color:${backGround};`)

    this.el.setAttribute('style', `height: ${height - 1}px; 
                                   width:100%; 
                                   display:table-cell; 
                                   border: 0px; 
                                   text-align:${option['align']}; 
                                   vertical-align:${option['valign']}; 
                                   font-size:${option['fontSize']}; 
                                   background-color:${backGround};`)

    this.el.value = value;
  }
}