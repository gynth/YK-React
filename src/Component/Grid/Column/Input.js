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
 * onBackGround: {(value, el)}
 * 
 * readOnly(true): 리드온리
 * 
 * align(center | left(기본) | right) : 좌우정렬
 * 
 * valign(top | middle(기본) | bottom) : 상하정렬
 * 
 * resizable(true) : 컬럼넓이 조정여부
 * 
 * password(false) : 비밀번호여부
 */
export const Input = (props) => {
  const name      = props.name;
  const header    = props.header;
  const width     = props.width !== undefined ? props.width : '100%';
  const color     = props.color !== undefined ? props.color : 'black';
  const fontSize  = props.fontSize !== undefined ? props.fontSize : '13';
  const password  = props.password !== undefined ? props.password : false;
  const align     = props.align !== undefined ? props.align : 'left';
  const valign    = props.valign !== undefined ? props.valign : 'middle';
  const resizable = props.resizable !== undefined ? props.resizable : true;
  const readOnly  = props.readOnly !== undefined ? props.readOnly : true;
  const type      = props.type !== undefined ? props.type : 'text';

  const rtn = {name,
               header,
               width,
               color,
               fontSize,
               align,
               valign,
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
      password,
      align : props.align,
      valign: props.valign,
      onRender: props.onRender,
      onChange: props.onChange,
      onBackGround: props.onBackGround,
      type,
      readOnly,
      color,
      fontSize
    }
  }

  rtn.renderer = {
    type   : InputRenderer,
    options: {
      password,
      align : props.align,
      valign: props.valign,
      onRender: props.onRender,
      onChange: props.onChange,
      onBackGround: props.onBackGround,
      onShow: props.onShow,
      type,
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
    const el = document.createElement('input');
    el.setAttribute('style', `height:100%; 
                              border: 0px; 
                              display:table-cell; 
                              width:100%; 
                              padding:0px;
                              color:${option['color']};
                              font-size:${option['fontSize']}; 
                              text-align:${option['align']}; 
                              vertical-align:${option['valign']};
                              ` )

    const password = option['password'];
    const type = option['type'];

    el.type  = password ? 'password' : type;
    el.value = String(props.value === null ? '' : props.value);
    if(password){
      el.passwordValue = el.value !== '><DF^K)AD*' && '><DF^K)AD*';
      el.value = el.passwordValue;
    }

    if(option['readOnly']) el.readOnly = true;

    // if(option['onChange'] !== undefined){
    //   el.addEventListener('change', option['onChange']);
    // }

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
    const el = document.createElement('input');

    this.el = el;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    // store.subscribe((e1, e2) => console.log(store.getState()))

    const option = props.columnInfo.renderer.options;
    const grid = props.grid;
    const rowKey = props.rowKey;
    const height = grid.store.rowCoords.heights[rowKey];
    // console.log(option)
    const orgData = props.grid.dataManager.getOriginData();
    let org = orgData.length <= props.rowKey ? '' : props.grid.dataManager.getOriginData()[props.rowKey][props.columnInfo.name];
    if(org === null) org = '';
    const password = option['password'];
    const type = option['type'];

    let backGround = 'white';
    if(!password){
      if(String(org) !== String(props.value === null ? '' : props.value)) {
        backGround = 'greenYellow'
      }
    }

    this.el.type  = password ? 'password' : type;
    // this.el.setAttribute('style', `height: 100%; 
    this.el.setAttribute('style', `height: ${height - 1}px; 
                                   width:100%; 
                                   padding: 0px 5px 0px 5px;
                                   border: 0px; 
                                   text-align:${option['align']}; 
                                   vertical-align:${option['valign']}; 
                                   background-color:${backGround};
                                   color:${option['color']};
                                   font-size:${option['fontSize']}; 
                                   `)

    if(option['onChange'] !== undefined){
      this.el.addEventListener('change', (e) => option['onChange'](e));
    }

    if(option['onBackGround'] !== undefined){
      const onBackGround = option.onBackGround;
      onBackGround(props.value, this.el);
    }

    if(option['onShow'] !== undefined){
      const rows = gfg_getRow(props.grid, props.rowKey);
      option['onShow'](this.el, props.value, rows);
    }

    let value = String((props.value === null || props.value === undefined) ? '' : props.value);
    if(password){
      value = '><DF^K)AD*';
    }

    // this.el.value = String((props.value === null || props.value === undefined) ? '' : props.value);
    this.el.value = value
  }
}