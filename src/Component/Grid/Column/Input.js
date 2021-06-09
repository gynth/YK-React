import { gfg_getRow } from '../../../Method/Grid';
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
  const width     = props.width !== undefined ? props.width : 100;
  const password  = props.password !== undefined ? props.password : false;
  const align     = props.align !== undefined ? props.align : 'left';
  const valign    = props.valign !== undefined ? props.valign : 'middle';
  const resizable = props.resizable !== undefined ? props.resizable : true;
  const readOnly = props.readOnly !== undefined ? props.readOnly : true;

  const rtn = {name,
               header,
               width,
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
      readOnly
    }
  }

  rtn.renderer = {
    type   : InputRenderer,
    options: {
      password,
      align : props.align,
      valign: props.valign,
      onRender: props.onRender,
      readOnly
    }
  }

  return rtn;
}

class InputEditor {
  constructor(props) {
    const option = props.columnInfo.renderer.options;
    const el = document.createElement('input');
    el.setAttribute('style', `height:32px; 
                              border: 0px; 
                              display:table-cell; 
                              width:100%; 
                              padding:0px;
                              text-align:${option['align']}; 
                              vertical-align:${option['valign']};
                              ` )

    const password = option['password'];

    el.type  = password ? 'password' : 'text';
    el.value = String(props.value === null ? '' : props.value);
    if(password){
      el.passwordValue = el.value !== '><DF^K)AD*' && '><DF^K)AD*';
      el.value = el.passwordValue;
    }

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
    // console.log(option)
    const orgData = props.grid.dataManager.getOriginData();
    let org = orgData.length <= props.rowKey ? '' : props.grid.dataManager.getOriginData()[props.rowKey][props.columnInfo.name];
    if(org === null) org = '';
    const password = option['password'];

    let backGround = 'white';
    if(!password){
      if(String(org) !== String(props.value === null ? '' : props.value)) backGround = 'greenYellow'
    }

    this.el.type  = password ? 'password' : 'text';
    this.el.setAttribute('style', `height: 27px; 
                                   width:calc(100% - 5px); 
                                   padding: 0px 5px 0px 5px;
                                   border: 0px; 
                                   text-align:${option['align']}; 
                                   vertical-align:${option['valign']}; 
                                   background-color:${backGround};
                                   `)

    let value = String((props.value === null || props.value === undefined) ? '' : props.value);
    if(password){
      value = '><DF^K)AD*';
    }

    // this.el.value = String((props.value === null || props.value === undefined) ? '' : props.value);
    this.el.value = value
  }
}