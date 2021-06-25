import { gfg_getRow } from '../../../Method/Grid';
import ReactDOM from 'react-dom';
/**
 * name : 컬럼명
 * 
 * header : 헤더명
 * 
 * width(100) : Width
 * 
 * onRender: {(value, el, rows)}
 * 
 * resizable(true) : 컬럼넓이 조정여부
 * 
 * imgItem: {}
 */
export const Image = (props) => {
  const name      = props.name;
  const header    = props.header;
  const width     = props.width !== undefined ? props.width : 100;
  const resizable = props.resizable !== undefined ? props.resizable : true;
  const readOnly  = true;
  const imgItem   = props.imgItem;

  const rtn = {name,
               header,
               width,
               resizable,
               imgItem
              }
  
  rtn.renderer = {
    type   : ImageRenderer,
    options: {
      align : props.align,
      valign: props.valign,
      onRender: props.onRender,
      readOnly,
      imgItem
    }
  }

  return rtn;
}

class ImageRenderer {
  constructor(props) {
    const el = document.createElement('div');

    this.el = el;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    const option = props.columnInfo.renderer.options;
    const imgItem = option.imgItem;

    // let value = String((props.value === null || props.value === undefined) ? '' : props.value);   
    // this.el.appendChild(imgItem[1].value);
    ReactDOM.render(imgItem[1].value, this.el);


    // this.el.setAttribute('style', `height: 27px; 
    //                                width:calc(100% - 5px); 
    //                                background-color:white;
    //                                padding: 0px 5px 0px 5px;
    //                                border: 0px; 
    //                               `)
    // this.el.value = value
  }
}