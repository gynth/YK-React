import React from 'react';
import Select from 'react-select';
import { gfs_dispatch } from '../../Method/Store';
import PropTypes from 'prop-types';
// import { getDynamicSql_Mysql } from '../../db/Mysql/Mysql.js';
import { Component } from 'react';
import { gfo_getCombo } from '../../Method/Component';
import { gfc_getMultiLang } from '../../Method/Comm';

class Combobox extends Component{
  originalValue = '';

  state = {
    value: '',
    optionList: [],
    data: this.props.data,
    etcData: this.props.etcData,
    oracleData: this.props.oracleData,
    oracleSpData: this.props.oracleSpData,
    isDisabled: this.props.isDisabled
  }

  width = 0

  ComboCreate = async(props) => {
    this.options = []
    let result = {};

    if(this.state.data !== undefined){
      result.data = {};
      result.data.result = true;
      result.data.data = this.state.data;
    }else if(this.state.etcData !== undefined){
      result = await this.state.etcData;
      if(Object.keys(result.data) !== 'result'){
        result.data.result = true;
        result.data.data = result.data[Object.keys(result.data)[0]];
        delete result.data[Object.keys(result.data)[0]];
      }
    }else if(this.state.oracleData !== undefined){
      result = await this.state.oracleData;
      if(Object.keys(result.data) !== 'result'){
        result.data.result = true;
        let data = [];
        for(let i = 0; i < result.data.rows.length; i++){
    
          let col = {};
          for(let j = 0; j < result.data.rows[i].length; j++){
            col[result.data.metaData[j].name.toUpperCase()] = result.data.rows[i][j];
          }
          data.push(col);
        }

        result.data.data = data;
      }
    }else if(this.state.oracleSpData !== undefined){
      result = await this.state.oracleSpData;
      if(result.data.SUCCESS === 'Y'){
        result.data.result = true;
        let data = [];
        for(let i = 0; i < result.data.ROWS.length; i++){
    
          let col = {};
          col = result.data.ROWS[i];
          data.push(col);
        }

        result.data.data = data;
      }
    }else{
      // result = await getDynamicSql_Mysql(
      //   props.location,
      //   props.fn,
      //   [props.param]
      // );
    }

    try{
      if(result.data.result){
        
        for(let idx in result.data.data){
          let canvas = document.createElement("canvas");
          let context = canvas.getContext("2d");
          context.font = props.fontSize + "px bold";
          let metrics = context.measureText(result.data.data[idx][props.value.toUpperCase()]);

          if(this.width < metrics.width + 10) {
            if(props.fontSize >= 9)
              this.width = Math.ceil(metrics.width) + 25
            else
              this.width = Math.ceil(metrics.width) + 20
          };
        }

        for(let idx in result.data.data){
          let arrValue = {};

          const value = result.data.data[idx][props.value.toUpperCase()];
          arrValue['value'] = value;

          const text = result.data.data[idx][props.display.toUpperCase()];
          // arrValue['labelText'] = setCode(value, maxCode) + text;
          
          arrValue['label'] = text;

          for(let idx2 in props.field){
            arrValue[props.field[idx2]] = result.data.data[idx][props.field[idx2]];
          }

          if(props.emptyRow){
            if(idx === '0'){
              this.options.push({'value': '', 'label': ''})
            }
          }

          this.options.push(arrValue)
        }

        this.setState({
          optionList: this.options
        })
      }
    }catch{
      let arrValue   = {};
      arrValue['value'] = '';
      // arrValue['labelText']  = '';
      arrValue['label']  = '';
      this.options.push(arrValue)
    }
  }

  constructor(props){
    super(props)

    if(gfo_getCombo(props.pgm, props.id) !== undefined){
      gfc_getMultiLang('dup', '?????? ????????? ???????????????. > ' + props.pgm + ', ' + props.id);
      return 
    } 
  }

  componentWillUnmount(){
    gfs_dispatch(this.props.pgm, 'CLEARCOMBO', 
      ({
        id: this.props.id
      })
    );
  }

  componentDidMount(){

    this.ComboCreate(this.props);

    gfs_dispatch(this.props.pgm, 'INITCOMBO', 
      ({
        Combo  : {id   : this.props.id,
                  Combo: this}
      })
    );
  }

  //#region ?????????  
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
      height: this.props.height,
      textAlign: this.align,
      backgroundColor: this.state.isDisabled === true && '#FAFAFA',
      borderColor:'#B5B5B5'
    }),

    valueContainer: (base) => ({
      ...base,
      padding:0,
      margin: '0px 0px 0px 5px'
      // zIndex: 100
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
      // width: this.width > this.props.width ? this.width : this.props.width, //?????? this.props.width??? ????????? ?????? ?????? ??????
      zIndex: 1000
      // width: 400
    }),

    option: (base, state) => ({
      ...base,
      ...this.dot(state.data.value)
    }),
  
    singleValue: (base) => ({
      ...base,
      margin: '0px 0px 0px 4px',
      color: this.state.isDisabled === true && 'black',
      // ...dot()
    }),

    placeholder: (base) => ({
      ...base,
      margin: '0px 0px 0px 4px',
      // display: isFoucs //'none', 'flex'
    })
  }

  onReset = async (e) => {
    const Key = Object.keys(e);
    const value = e[Key];
    let values = {};

    values[Key] = await value;
    
    this.setState(
      values
    )

    await this.ComboCreate(this.props);
  }

  onFocusBase = (e) => {
    if(this.props.onFocus !== undefined){
      this.props.onFocus(this.ComboCreate);
    }
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

  onChangeBase = (e) => {
    if(this.props.onChange !== undefined){
      this.props.onChange(e);
    }
  }

  getValue = () => {
    const value = this.ref.current.state.value;
    if(value === null) return null;
    if(value === undefined) return null;

    return value.value;
  }

  getLabel = () => {
    const label = this.ref.current.state.value;
    if(label === null) return null;
    if(label === undefined) return null;

    return label.label;
  }

  setValue = (value) => {
    if(value === null || value === undefined){
      this.ref.current.select.setValue('');
    }else{
      this.ref.current.select.setValue(this.options.find(e => {
        if(e.value !== undefined)
          return e.value.toString() === value.toString()
      }));
    }
  }

  setFilter = (value) => {
    console.log(value);
  }

  setDisabled = (value) => {
    this.setState({
      isDisabled: value
    })
  }
  
  render(){
    this.ref = React.createRef();

    return (
      // <div style={{zIndex:1000}} className='item'>
      <div className='item'>
        {this.props.label !== '' && this.props.label !== undefined &&
          <div style={{float:'left', marginRight:'3px'}}>
            <label htmlFor={this.props.id}>{this.props.label}</label>
          </div>
        }
  
        <Select options      = {this.state.optionList}
                styles       = {this.customStyles}
                placeholder  = {this.props.placeholder}
                menuPlacement= 'auto'
                ref          = {this.ref}
                isDisabled   = {this.state.isDisabled}
                // isOptionDisabled={(option) => option.disabled}
                onBlur       = {e => this.onBlurBase(e)}
                onFocus      = {e => this.onFocusBase(e)}
                onChange     = {e => this.onChangeBase(e)}
                
                // menuIsOpen
                  
                  // inputId={this.props.id}
                  // filterOption={null}
  
                
                  // // defaultValue={option[1]} //?????? ?????????????????? ?????? ????????????
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
  // location    : PropTypes.string.isRequired,
  // fn          : PropTypes.string.isRequired,
  // field       : PropTypes.array.isRequired,

  width       : PropTypes.number,
  height      : PropTypes.number,
  fontSize    : PropTypes.number,
  label       : PropTypes.string,
  menuIsOpen  : PropTypes.bool,
  isDisabled  : PropTypes.bool,
  isRtl       : PropTypes.bool,
  isSearchable: PropTypes.bool,
  isMulti     : PropTypes.bool,
  blurInputOnSelect: PropTypes.bool,
  closeMenuOnSelect: PropTypes.bool,
  placeholder : PropTypes.string,

  onChange    : PropTypes.func,
  onMenuOpen  : PropTypes.func,
  onMenuClose : PropTypes.func,
  onFocus     : PropTypes.func,
  onBlur      : PropTypes.func
};

Combobox.defaultProps = {
  // width       : 150,
  height      : 23,
  fontSize    : 14,
  label       : '',
  menuIsOpen  : false,
  isDisabled  : false,
  isRtl       : false,
  isSearchable: true,
  isMulti     : false,
  blurInputOnSelect: false,
  closeMenuOnSelect: false,
  placeholder : '',

  onChange    : (e) => {},
  onMenuOpen  : () => {},
  onMenuClose : () => {},
  onFocus     : (e) => {},
  onBlur      : (e) => {}
};

export default Combobox;