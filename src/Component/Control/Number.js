import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { gfo_getNumber } from '../../Method/Component';
import { gfc_getMultiLang, gfc_setNumberFormat, gfc_unNumberFormat } from '../../Method/Comm';
import { gfs_getStoreValue, gfs_dispatch } from '../../Method/Store';

class Number extends Component{
  isNumber = require('is-number');
  originalValue = '';

  state = {
    background: this.props.backgroundColor,
    value     : this.props.defaultValue, 
    defaultValue: this.props.defaultValue
  }

  constructor(props){
    super(props)

    if(gfo_getNumber(props.pgm, props.id) !== undefined){
      gfc_getMultiLang('dup', '넘버 아이디 중복입니다. > ' + props.pgm + ', ' + props.id);
      return 
    } 

    this.inputRef = createRef();

    gfs_dispatch(props.pgm, 'INITNUMBER', 
      ({
        Number: {id    : props.id,
                 Number: this}
      })
    );
  }

  onChangeBase = (e) => {  
    // if(e.nativeEvent.data !== null){

    //   if(e.nativeEvent.data === '.' ||
    //   (e.nativeEvent.data >= 0 && e.nativeEvent.data <= 9)){
     
        let value = e.target.value;

        this.setState({
           defaultValue: value
        });
 
         this.props.onChange(e);
      // }
    // }
  }

  onBlurBase = (e) => {
    // let value = e.target.value.replace(' ', '');    
    // if(isNaN(value)){
      this.setState({
        defaultValue: gfc_setNumberFormat(this.originalValue, this.props.num_format, this.props.num_round)
      });
    // }

    this.props.onBlur(e.target.id, gfc_unNumberFormat(e.target.value), this.originalValue, this);
    
    if(e.target.value !== this.originalValue)
      this.originalValue = e.target.value;
  }

  onFocusBase = (e) => {
    e.currentTarget.select();
    this.props.onFocus();
  }

  setValue = (value) => {    
    this.setState({
      defaultValue: gfc_setNumberFormat(value, this.props.num_format, this.props.num_round)
    });

    this.originalValue = value;
  }

  getValue = () => {
    return this.inputRef.current.value === undefined ? 0 : gfc_unNumberFormat(this.inputRef.current.value)
  }

  setBackGroundColor = (e) => {
    this.setState({
      background: e
    })
  }
 
  render(){
    return (
        <div className='item'>
          {this.props.label !== undefined &&
            <label htmlFor={this.props.id}>
              {`${this.props.label}\u00A0`}
            </label>
          }
          <input type        = {this.props.type}
                //  defaultValue= {this.props.defaultValue}
                //  defaultValue= {this.state.defaultValue}
                 value       = {this.state.defaultValue || ''}
                 placeholder = {this.props.placeHolder}
                 disabled    = {this.props.disabled}
                 readOnly    = {this.props.readOnly}
                 autoFocus   = {this.props.autoFocus}
                 maxLength   = {this.props.maxLength}
                 id          = {this.props.id}
                 className   = {this.props.className}
                   
                 style={{fontSize    : this.props.fontSize,
                         color       : this.props.color,
                        //  background  : this.props.backgroundColor,
                         background  : this.state.background,
                         width       : this.props.width,
                         height      : this.props.height,
                         margin      : this.props.margin,
                         marginTop   : this.props.marginTop,
                         marginRight : this.props.marginRight,
                         marginBottom: this.props.marginBottom,
                         marginLeft  : this.props.marginLeft,
                         borderWidth : this.props.borderWidth,
                         borderColor : this.props.borderColor,
                         borderRadius: this.props.borderRadius,
                         outline     : this.props.outline}}
 
                 onBlur       = {e => this.onBlurBase(e)}
                 onChange     = {e => this.onChangeBase(e)}
                 onClick      = {this.props.onClick}
                 onCopy       = {this.props.onCopy}
                 onCut        = {this.props.onCut}
                 onDoubleClick= {this.props.onDoubleClick}
                 onFocus      = {e => this.onFocusBase(e)}
                 onPaste      = {this.props.onPaste}
                 onKeyDown    = {this.props.onPaste}
                 onKeyPress   = {this.props.onPaste}
                 onKeyUp      = {this.props.onPaste}
                 onLoad       = {this.props.onPaste}
                 onMouseDown  = {this.props.onPaste}
                 onMouseUp    = {this.props.onPaste}

                 ref={this.inputRef}
                 autoComplete = 'off'
              >
              {this.props.child}
            </input>
        </div>
    )
  }
};

Number.propTypes = {
  pgm         : PropTypes.string.isRequired,
  id          : PropTypes.string.isRequired,
  label       : PropTypes.string,
  type        : PropTypes.string,
  defaultValue: PropTypes.string,
  placeHolder : PropTypes.string,
  fontSize    : PropTypes.number,
  color       : PropTypes.string,
  width       : PropTypes.string,
  height      : PropTypes.string,
  margin      : PropTypes.string,
  marginTop   : PropTypes.string,
  marginRight : PropTypes.string,
  marginBottom: PropTypes.string,
  marginLeft  : PropTypes.string,
  borderWidth : PropTypes.string,
  borderColor : PropTypes.string,
  borderRadius: PropTypes.string,
  outLine     : PropTypes.string,
  readOnly    : PropTypes.bool,
  disabled    : PropTypes.bool,
  children    : PropTypes.node,
  backgroundColor: PropTypes.string,
  autoFoucs   : PropTypes.bool,
  maxLength   : PropTypes.number,
  className   : PropTypes.any,
  num_format  : PropTypes.string,
  num_round   : PropTypes.string,

  onBlur       : PropTypes.func,
  onChange     : PropTypes.func,
  onClick      : PropTypes.func,
  onCopy       : PropTypes.func,
  onCut        : PropTypes.func,
  onDoubleClick: PropTypes.func,
  onFocus      : PropTypes.func,
  onPaste      : PropTypes.func,
  onKeyDown    : PropTypes.func,
  onKeyPress   : PropTypes.func,
  onKeyUp      : PropTypes.func,
  onLoad       : PropTypes.func,
  onMouseDown  : PropTypes.func,
  onMouseUp    : PropTypes.func
};

Number.defaultProps = {
  id          : undefined,
  label       : undefined,
  type        : 'text',
  defaultValue: undefined,
  placeHolder : undefined,
  fontSize    : undefined,
  color       : 'black',
  width       : undefined,
  height      : undefined,
  margin      : '0 auto',
  marginTop   : '0 auto',
  marginRight : '0 auto',
  marginBottom: '0 auto',
  marginLeft  : '0 auto',
  borderWidth : undefined,
  borderColor : undefined,
  borderRadius: undefined,
  outLine     : undefined,
  readOnly    : false,
  disabled    : false,
  children    : undefined,
  backgroundColor: undefined,
  autoFocus   : false,
  maxLength   : undefined,
  className   : undefined,
  num_format  : gfs_getStoreValue('USER_REDUCER', 'NUM_FORMAT'),
  num_round   : gfs_getStoreValue('USER_REDUCER', 'NUM_ROUND'),

  onBlur       : (e) => {},
  onChange     : (e) => {},
  onClick      : (e) => {},
  onCopy       : (e) => {},
  onCut        : (e) => {},
  onDoubleClick: (e) => {},
  onFocus      : (e) => {},
  onPaste      : (e) => {},
  onKeyDown    : (e) => {},
  onKeyPress   : (e) => {},
  onKeyUp      : (e) => {},
  onLoad       : (e) => {},
  onMouseDown  : (e) => {},
  onMouseUp    : (e) => {}
};

export default Number;