import React from 'react';
import Select from 'react-select';
import ReactDOM from 'react-dom';
import { getDynamicSql_Mysql } from '../../../db/Mysql/Mysql';

import { gfc_sleep } from '../../../Method/Comm';

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
 * fontSize :  폰트크기
 * 
 * onRender: {(value, el, rows)}
 * 
 * align(center(기본) | left | right) : 좌우정렬
 * 
 * valign(top | middle(기본) | bottom) : 상하정렬
 * 
 * resizable(true) : 컬럼넓이 조정여부
 * 
 * data([{}]) : 데이터직접입력
 * 
 * editor: { 
 * 
 *   location: 
 * 
 *   fn:
 * 
 *   value:
 * 
 *   display: 
 * 
 *   field: []
 * 
 *   parma: {}
 * 
 *   emptyRow:
 * 
 *   onFilter: (e) => { }
 *
 * }
 */
// export const Combobox = (name, header, width = 100, readOnly = false, editor, align = 'left', valign = 'middle', resizable = true) => {
export const Combobox = (props) => {
  const name      = props.name;
  const header    = props.header;
  const width     = props.width !== undefined ? props.width : 100;
  const readOnly  = props.readOnly !== undefined ? props.readOnly : true;
  const fontSize  = props.fontSize !== undefined ? props.fontSize : '13';
  const align     = props.align !== undefined ? props.align : 'center';
  const valign    = props.valign !== undefined ? props.valign : 'middle';
  const resizable = props.resizable !== undefined ? props.resizable : false;
  const data      = props.data !== undefined ? props.data : undefined;
  const etcData   = props.etcData !== undefined ? props.etcData : undefined;
  const editor    = props.editor;

  const rtn = {name,  
               header, 
               width, 
               align, 
               valign, 
               resizable,
               fontSize,
               data,
               etcData}

  const queryResult = new ComboInit({
    location: editor !== undefined ? editor.location : '',
    fn      : editor !== undefined ? editor.fn : '',
    value   : editor !== undefined ? editor.value : '',
    display : editor !== undefined ? editor.display : '',
    field   : editor !== undefined ? editor.field : '',
    param   : editor !== undefined ? editor.param : '',
    emptyRow: editor !== undefined ? editor.emptyRow : '',
    fontSize: editor !== undefined ? editor.fontSize : '13',
    data,
    etcData
  });

  // rtn.editor = {
  //   type   : 'select',
  //   options: {
  //     listItems: queryResult.optionList
  //   }
  // }

  if(!readOnly){
    rtn.editor = {
      type   : ComboEditor,
      data,
      etcData,
      options: {
        align,
        fontSize,
        queryResult,
        onRender: props.onRender,
        onFilter: editor !== undefined ? editor.onFilter : ''
      }
    }
  }

  rtn.renderer = {
    type   : ComboboxRenderer,
    data,
    etcData,
    options: {
      align,
      valign,
      fontSize,
      onRender: props.onRender,
      listItems: queryResult.optionList
    }
  }

  return rtn;
}

class ComboEditor {
  constructor(props){
    const option   = props.columnInfo.editor.options;
    const align    = option.align;
    const queryResult = option.queryResult;
    let optionList = option.queryResult.optionList;
    const width = queryResult.width;
    const onFilter = option.onFilter;

    if(onFilter !== undefined && onFilter !== '') optionList = onFilter(optionList)
    
    const dot = (text) => ({
      display: 'flex',
    
      ':before': {
        content: '"' + text + '"',
        fontWeight:'bold',
        width: width
      },
    });

    const customStyles = {
      container: (base) => ({
        ...base,
        flex : 1,
        width: props.width === undefined ? '100%' : props.width,
        // width: '100%',
        margin:0
      }),
    
      control: (base) => ({
        ...base,
        margin:0,
        textAlign: align
      }),
  
      valueContainer: (base) => ({
        ...base,
        padding:0
      }),
  
      indicatorsContainer: (base) => ({
        ...base,
        padding: 0,
        // display: isFoucs //'none', 'flex'
      }),
      
      input: (base) => ({
        ...base,
        margin: '0px 0px 0px 3px'
      }),
      menu: (base, e2) => ({
        ...base,  
        marginTop: 1,
        // width: '100%',
        width: ComboInit.width > props.width ? ComboInit.width : props.width,
        zIndex: 1000,
        fontSize: option.fontSize
      }),
  
      option: (base, state) => ({
        ...base,
        ...dot(state.data.value)
      }),
   
      singleValue: (base) => ({
        ...base,
        margin: '0px 0px 0px 4px',
        fontSize: option.fontSize
        // ...dot()
      }),
  
      placeholder: (base) => ({
        ...base,
        margin: '0px 0px 0px 4px',
        // display: isFoucs //'none', 'flex'
      })
    }

    // const onBlur = async(e) => {
    //   await gfc_sleep(10);

    //   var event = document.createEvent("Events");
    //   event.initEvent('keydown', true, true);
    //   event.keyCode = 9;
    //   this.el.dispatchEvent(event);
    // }

    const init = async(e) => {

      this.ref = React.createRef();
      this.grid = props.grid;
  
      const el = document.createElement('div'); 
      const combo = <Select options={optionList}
                            styles={customStyles}
                            defaultValue={optionList.find(e => e.value === props.value)}
                            
                            isMulti={false}
                            ref={this.ref}
                            placeholder=''
                            menuPlacement='auto'

                            // isDisabled
                            // defaultMenuIsOpen
  
                            // blurInputOnSelect={true}
                            // onBlur={(e) => onBlur(e)}
                            // onFocus={e => console.log(e)}
                            // onMenuOpen={e => console.log(e)}                            
                            
  
  
                            // onMenuClose={e => this.setBlur()}
                            // onChange={e => this.setBlur()}
                            
                            // blurInputOnSelect={true}
                            // filterOption={null} 
                            //  onChange={(e) => onChangeBase(e)}
                          
                            //  // defaultValue={option[1]} //이건 이방법뿐인듯 따로 기능구현
                            //  onFocus={(e) => onFocusBase(e)}
                            //  onBlur={(e) => onBlurBase(e)}
                          
                            //  onInputChange={(value, action) => onInputChangeBase(value, action)}
                        />;
      ReactDOM.render(combo, el)
      this.el = el;

      if(option['onRender'] !== undefined){
        // const onRender = option.onRender;
        // const rows = gfg_getRow(props.grid, props.rowKey);
        // onRender(props.value, combo.ref.current, rows);
        combo.ref.current.select.isDisabled = true;
      }

      const input = combo._self.el.getElementsByTagName('input');
      if(input !== undefined && input !== null){
        await gfc_sleep(50);
        input[0].focus();
      }

      // combo._self.el.children[0].children[1].children[0].children[1].children[0].children[0].focus();

      // console.log(combo._self.el.children[0].children[1].children[0].children[1].children[0].children[0]);
      // console.log(combo._self.el.getElementsByTagName('input')[0]);
    }

    init();
  }

  getElement() {
    return this.el;
  }

  getValue() {
    let value = this.ref.current.state.value;

    if(value === null) value = '';
    else value = this.ref.current.state.value.value;

    return value;
  }

  mounted() {
    // this.el.select();
  }
}

class ComboInit {

  optionList = []
  width = 0

  ComboCreate = async(props) => {
    let result = {};

    if(props.data !== undefined){
      result.data = {};
      result.data.result = true;
      result.data.data = props.data;
    }else if(props.etcData !== undefined){
      result = await props.etcData;
      if(Object.keys(result.data) !== 'result'){
        result.data.result = true;
        result.data.data = result.data[Object.keys(result.data)[0]];
        delete result.data[Object.keys(result.data)[0]];
      }
    }else{
      result = await getDynamicSql_Mysql(
        props.location,
        props.fn,
        [props.param]
      );
    }
    
    try{
      if(result.data.result){
        
        for(let idx in result.data.data){
          let canvas = document.createElement("canvas");
          let context = canvas.getContext("2d");
          context.font = (props.fontSize === undefined ? '13' : props.fontSize) + "px bold";
          let metrics = context.measureText(result.data.data[idx][props.value] );

          if(this.width < metrics.width + 10) {
            if(props.fontSize >= 9)
              this.width = Math.ceil(metrics.width) + 25
            else
              this.width = Math.ceil(metrics.width) + 20
          };
        }

        for(let idx in result.data.data){
          let arrValue = {};

          const value = result.data.data[idx][props.value];
          arrValue['value'] = value;

          const text = result.data.data[idx][props.display];
          // arrValue['labelText'] = setCode(value, maxCode) + text;
          
          arrValue['label'] = text;

          for(let idx2 in props.field){
            arrValue[props.field[idx2]] = result.data.data[idx][props.field[idx2]];
          }

          if(props.emptyRow){
            if(idx === '0'){
              // this.optionList.push({'value': '', 'labelText': setCode('', maxCode) + '', 'label': ''})
              this.optionList.push({'value': '', 'label': ''})
            }
          }

          this.optionList.push(arrValue)
        }
      }
    }catch{
      let arrValue   = {};
      arrValue['value'] = '';
      // arrValue['labelText']  = '';
      arrValue['label']  = '';
      this.optionList.push(arrValue)
    }
  }

  constructor(props){
    this.ComboCreate(props);
  }
}

class ComboboxRenderer {
  constructor(props) {
    //이것때문에 이상현상발생 null에 첫select의 값이 들어감 나중에 이상시 이것한번 체크
    // if(props.columnInfo.defaultValue === undefined) props.columnInfo.defaultValue = props.value;
    const el = document.createElement('input');

    this.el = el;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    const option = props.columnInfo.renderer.options;
    const grid = props.grid;
    const rowKey = props.rowKey;
    const height = grid.store.rowCoords.heights[rowKey];
    let value = props.value;
    if(value === undefined || value === null) value = ''; else value = value.toString();

    const listItems = props.columnInfo.renderer.options.listItems.filter(e => e.value === value);
    if(listItems.length > 0) {
      this.el.value = listItems[0].label;
    }else{
      this.el.value = value;
    }

    const orgData = props.grid.dataManager.getOriginData();
    let org = orgData.length <= props.rowKey ? '' : props.grid.dataManager.getOriginData()[props.rowKey][props.columnInfo.name];
    if(org === undefined || org === null) org = '';

    let backGround = 'white';
    if(org.toString() !== value.toString()) {
      backGround = 'greenYellow'
    }
    
    this.el.type = 'text';
    // this.el.setAttribute('style', `height:33px; margin:0 5px 0 5px; text-align:${option['align']}; border: 0px; background-color:${backGround};display:table-cell; width:calc(100% - 10px);`)
    // this.el.setAttribute('style', `height: ${height - 1}px; 
    this.el.setAttribute('style', `height: ${height - 1}px; 
                                   width:100%; 
                                   padding: 0px 5px 0px 5px;
                                   text-align:${option['align']}; 
                                   border: 0px; 
                                   background-color:${backGround};
                                   display:table-cell; 
                                   font-size:${option['fontSize']};`)
  }
}