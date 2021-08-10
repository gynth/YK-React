import { gfg_getRow } from '../../../Method/Grid';
/**
 * name : 컬럼명
 * 
 * header : 헤더명
 * 
 * width(100) : Width
 * 
 * color : 폰트색상
 * 
 * fontSize : 폰트크기
 * 
 * onRender: {(value, el, rows)}
 * 
 * readOnly(true): 리드온리
 * 
 * align(center | left(기본) | right) : 좌우정렬
 * 
 * height: 높이(자동조절이 안되고 되게 하려면 번거로운게 많아서 rowHeight와 이걸로 조절)
 * 
 * resizable(true) : 컬럼넓이 조정여부
 */
export const TextArea = (props) => {
  const name      = props.name;
  const header    = props.header;
  const width     = props.width !== undefined ? props.width : '100%';
  const color     = props.color !== undefined ? props.color : 'black';
  const fontSize  = props.fontSize !== undefined ? props.fontSize : '13';
  const align     = props.align !== undefined ? props.align : 'left';
  const height    = props.height;
  const resizable = props.resizable !== undefined ? props.resizable : true;
  const readOnly = props.readOnly !== undefined ? props.readOnly : true;

  const rtn = {name,
               header,
               width,
               height,
               color,
               fontSize,
               align,
               resizable,
              //  filter:{
              //    type: 'text',
              //    operator: 'OR'
              //  }
              }

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
    type   : InputEditor,
    options: {
      align : props.align,
      height,
      onRender: props.onRender,
      readOnly,
      color,
      fontSize
    }
  }

  rtn.renderer = {
    type   : InputRenderer,
    options: {
      align : props.align,
      height,
      onRender: props.onRender,
      readOnly,
      color,
      fontSize
    }
  }

  return rtn;
}

class InputEditor {
  constructor(props) {
    const option = props.columnInfo.renderer.options;
    const height = option.height;
    const el = document.createElement('textarea');
    el.setAttribute('style', `height: ${height}px; 
                              min-height:${height}px; 
                              border: none; 
                              outline: none;
                              display:table-cell; 
                              width:100%; 
                              padding:0px;
                              resize:none;
                              color:${option['color']};
                              font-size:${option['fontSize']}; 
                              text-align:${option['align']}; 
                              ` )
    el.value = String(props.value === null ? '' : props.value);

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
    // console.log(this.props.grid.store.data.rawData[0].COP_CD)
    // this.props.grid.setValue(0, 'SAP_CD', '10')
    return this.el.value;
  }

  mounted() {
    this.el.select();
  }
}

class InputRenderer {
  constructor(props) {
    const el = document.createElement('textarea');

    this.el = el;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    // store.subscribe((e1, e2) => console.log(store.getState()))

    const option = props.columnInfo.renderer.options;
    // const grid = props.grid;
    // const rowKey = props.rowKey;
    const height = option.height;
    const orgData = props.grid.dataManager.getOriginData();
    let org = orgData.length <= props.rowKey ? '' : props.grid.dataManager.getOriginData()[props.rowKey][props.columnInfo.name];
    if(org === null) org = '';

    let backGround = 'white';
    if(String(org) !== String(props.value === null ? '' : props.value)) backGround = 'greenYellow'

    this.el.setAttribute('style', `height: ${height}px; 
                                   min-height:${height}px; 
                                   width:calc(100% - 5px); 
                                   border: none; 
                                   outline: none;
                                   text-align:${option['align']}; 
                                   background-color:${backGround};
                                   color:${option['color']};
                                   font-size:${option['fontSize']}; 
                                   resize: none;
                                   `)

    let value = String((props.value === null || props.value === undefined) ? '' : props.value);
    this.el.value = value
  }
}