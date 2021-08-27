import { gfg_getRow, gfg_setValue } from '../../../Method/Grid';
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
 * valign(top | middle(기본) | bottom) : 상하정렬
 * 
 * resizable(true) : 컬럼넓이 조정여부
 * 
 * password(false) : 비밀번호여부
 */
export const Checkbox = (props) => {
  const name      = props.name;
  const header    = props.header;
  const width     = props.width !== undefined ? props.width : '100%';
  const color     = props.color !== undefined ? props.color : 'black';
  const fontSize  = props.fontSize !== undefined ? props.fontSize : '13';
  const password  = props.password !== undefined ? props.password : false;
  const align     = props.align !== undefined ? props.align : 'left';
  const valign    = props.valign !== undefined ? props.valign : 'middle';
  const resizable = props.resizable !== undefined ? props.resizable : true;
  const readOnly = props.readOnly !== undefined ? props.readOnly : true;

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
    //   type   : CheckboxEditor,
    //   options: {
    //     align : props.align,
    //     valign: props.valign
    //   }
    // }

    // rtn.renderer = {
    //   type   : CheckboxRenderer,
    //   options: {
    //     align : props.align,
    //     valign: props.valign
    //   }
    // }
  // }
  
  rtn.editor = {
    type   : CheckboxEditor,
    options: {
      password,
      align : props.align,
      valign: props.valign,
      onRender: props.onRender,
      readOnly,
      color,
      fontSize
    }
  }

  rtn.renderer = {
    type   : CheckboxRenderer,
    options: {
      password,
      align : props.align,
      valign: props.valign,
      onRender: props.onRender,
      readOnly,
      color,
      fontSize
    }
  }

  return rtn;
}

class CheckboxEditor {
  constructor(props) {
    const option = props.columnInfo.renderer.options;
    const el = document.createElement('input');
    el.type = 'checkbox';
    el.addEventListener('click', e => {
      // const value = e.target.checked ? 'on' : 'off';
      // el.value = value;
      // gfg_setValue(props.grid, props.columnInfo.name, value);
      if(e.target.checked){
        el.value = true;
        gfg_setValue(props.grid, props.columnInfo.name, true);
      }else{
        el.value = props.value;
        gfg_setValue(props.grid, props.columnInfo.name, props.value);
      }
    })
    el.setAttribute('style', `height: 20px; 
                              width : 30px;
                              margin-left: 5px;
                              margin-top: 9px;
                              text-align: center;
                              vertical-align:middle;`);

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

class CheckboxRenderer {
  constructor(props) {
    const el = document.createElement('input');
    el.type = 'checkbox';
    el.addEventListener('click', e => {
      // const value = e.target.checked ? 'on' : 'off';
      // el.value = value;
      // gfg_setValue(props.grid, props.columnInfo.name, value);
      if(e.target.checked){
        el.value = true;
        gfg_setValue(props.grid, props.columnInfo.name, true);
      }else{
        el.value = props.value;
        gfg_setValue(props.grid, props.columnInfo.name, props.value);
      }
    })

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

    let backGround = 'white';

    const value = props.value;

    if(value === true || value === 'true' || value === 'Y' || value === 'y' || value === '1' || value === 1){
      this.el.checked = true;
    }else{
      this.el.checked = false;
    }

    this.el.setAttribute('style', `height: 20px; 
                                   width : 30px;
                                   vertical-align:middle;
    `);
                                  //  width:calc(100% - 5px); 
                                  //  padding: 0px 5px 0px 5px;
                                  //  text-align:${option['align']}; 
                                  //  vertical-align:${option['valign']}; 
                                   
                                  //  `)

    // let value = String((props.value === null || props.value === undefined) ? '' : props.value);

    // this.el.value = String((props.value === null || props.value === undefined) ? '' : props.value);
    // this.el.value = value
  }
}