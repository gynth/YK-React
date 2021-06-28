import React from 'react';
import Select from 'react-select';
import { gfs_dispatch } from '../../Method/Store';
import PropTypes from 'prop-types';
import { getDynamicSql_Mysql } from '../../db/Mysql/Mysql.js';
import { Component } from 'react';
import { gfo_getCombo } from '../../Method/Component';
import { gfc_getMultiLang } from '../../Method/Comm';

class Combobox extends Component{
  originalValue = '';

  state = {
    value: ''
  }

  optionList = []
  width = 0

  ComboCreate = async(props) => {
    let result = {};

    if(props.data === undefined){
      result = await getDynamicSql_Mysql(
        props.location,
        props.fn,
        [props.param]
      );
    }else{
      result.data = {};
      result.data.result = true;
      result.data.data = props.data;
    }

    try{
      if(result.data.result){
        
        for(let idx in result.data.data){
          let canvas = document.createElement("canvas");
          let context = canvas.getContext("2d");
          context.font = props.fontSize + "px bold";
          let metrics = context.measureText(result.data.data[idx][props.value]);

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
    super(props)

    if(gfo_getCombo(props.pgm, props.id) !== undefined){
      gfc_getMultiLang('dup', '콤보 아이디 중복입니다. > ' + props.pgm + ', ' + props.id);
      return 
    } 

    this.ComboCreate(props);

    gfs_dispatch(props.pgm, 'INITCOMBO', 
      ({
        Combo  : {id   : props.id,
                  Combo: this}
      })
    );
  }

  //#region 스타일  
  dot = (text) => ({
    display: 'flex',
  
    ':before': {
      content: '"' + text + '"',
      fontWeight:'bold',
      width: this.width
    },
  });

  customStyles = {
    container: (base) => ({
      ...base,
      flex : 1,
      width: this.props.width === undefined ? '100%' : this.props.width,
      // width: '100%',
      margin:0
    }),
  
    control: (base) => ({
      ...base,
      margin:0,
      height: 34,
      textAlign: this.align
    }),

    valueContainer: (base) => ({
      ...base,
      padding:0,
      zIndex: 100
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
      // width: this.width,
      width: '100%',
      zIndex: 100
      // width: 400
    }),

    option: (base, state) => ({
      ...base,
      ...this.dot(state.data.value)
    }),
  
    singleValue: (base) => ({
      ...base,
      margin: '0px 0px 0px 4px',
      // ...dot()
    }),

    placeholder: (base) => ({
      ...base,
      margin: '0px 0px 0px 4px',
      // display: isFoucs //'none', 'flex'
    })
  }

  onBlurBase = (e) => {
    const value = this.ref.current.state.value;
    if(value === null) return;
    if(value === undefined) return;

    const curValue = value.value;
    this.props.onBlur(this.props.id, curValue, this.originalValue, this);
    
    if(curValue !== this.originalValue)
      this.originalValue = curValue;
  }

  getValue = () => {
    const value = this.ref.current.state.value;
    if(value === null) return null;
    if(value === undefined) return null;

    return value.value;
  }

  setValue = (value) => {
    this.ref.current.select.setValue(this.optionList.find(e => e.value === value));
  } 
  
  render(){
    this.ref = React.createRef();

    return (
      <div style={{zIndex:1000}} className='item'>
        {this.props.label !== '' && this.props.label !== undefined &&
          <div style={{float:'left', marginRight:'3px'}}>
            <label htmlFor={this.props.id}>{this.props.label}</label>
          </div>
        }
  
        <Select options      = {this.optionList}
                styles       = {this.customStyles}
                placeholder  = ''
                menuPlacement= 'auto'
                ref          = {this.ref}
                onBlur       = {e => this.onBlurBase(e)}
                // menuIsOpen
                  
                  // inputId={this.props.id}
                  // filterOption={null}
  
                  // onChange={(e) => onChangeBase(e)}
                
                  // // defaultValue={option[1]} //이건 이방법뿐인듯 따로 기능구현
                  // onFocus={(e) => onFocusBase(e)}
                  // onBlur={(e) => onBlurBase(e)}
                
                  // onInputChange={(value, action) => onInputChangeBase(value, action)}
        />
      </div>
    );
  }
}

Combobox.propTypes = {
  pgm         : PropTypes.string.isRequired,
  id          : PropTypes.string.isRequired,
  value       : PropTypes.string.isRequired,
  display     : PropTypes.string.isRequired,
  location    : PropTypes.string.isRequired,
  fn          : PropTypes.string.isRequired,
  field       : PropTypes.array.isRequired,

  width       : PropTypes.number,
  height      : PropTypes.number,
  fontSize    : PropTypes.number,
  label       : PropTypes.string,
  menuIsOpen  : PropTypes.bool,
  isRtl       : PropTypes.bool,
  isSearchable: PropTypes.bool,
  isMulti     : PropTypes.bool,
  blurInputOnSelect: PropTypes.bool,
  closeMenuOnSelect: PropTypes.bool,

  onChange    : PropTypes.func,
  onMenuOpen  : PropTypes.func,
  onMenuClose : PropTypes.func,
  onFocus     : PropTypes.func,
  onBlur      : PropTypes.func
};

Combobox.defaultProps = {
  // width       : 150,
  height      : 23,
  fontSize    : 12,
  label       : '',
  menuIsOpen  : false,
  isRtl       : false,
  isSearchable: true,
  isMulti     : false,
  blurInputOnSelect: false,
  closeMenuOnSelect: false,

  onChange    : (e) => {},
  onMenuOpen  : () => {},
  onMenuClose : () => {},
  onFocus     : (e) => {},
  onBlur      : (e) => {}
};

export default Combobox;