import moment from 'moment';
import PropTypes from 'prop-types';
import { Component, createRef } from 'react';
import DatePicker from 'tui-date-picker';
import { gfo_getDateTime } from '../../Method/Component';
import { gfc_getMultiLang } from '../../Method/Comm';
import { gfs_getStoreValue, gfs_dispatch } from '../../Method/Store';

class DateTime extends Component{
  dateTime;
  format;
  time;
  originalValue = '';

  state = {
    background: this.props.backgroundColor,
    value     : this.props.defaultValue
  }


  constructor(props){
    super(props)

    if(gfo_getDateTime(props.pgm, props.id) !== undefined){
      gfc_getMultiLang('dup', 'DateTime 아이디 중복입니다. > ' + props.pgm + ', ' + props.id);
      return 
    } 

    this.format = this.props.format !== undefined ? this.props.format : gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT');
    this.time = this.props.time;
    this.dateTimeRef = createRef();
    this.inputRef = createRef();

    this.format = this.format.replace('DD', 'dd');
    if(this.time !== undefined){ 
      this.time = this.time.replace(':ss', '').replace('ss', '');
  
      this.format += ' ' + this.time;
    }
    
    gfs_dispatch(props.pgm, 'INITDATETIME', 
      ({
        DateTime:{id      : props.id,
                  DateTime: this}
      })
    );
  }

  componentDidMount(){

    if(this.dateTimeRef !== undefined){

      this.dateTime = new DatePicker(this.dateTimeRef.current, {
        input: {
          element: this.inputRef.current,
          format : this.format
        },
        timePicker: this.props.timePicker
      });

      this.dateTime.on('close', e => {
        this.inputRef.current.focus();
      })
    }
  }

  onChangeBase = (e) => {
    let corValue = moment(e.target.value).format(this.format);
    this.dateTime.setDate(new Date(corValue));

    this.setState({
      defaultValue: corValue
    });
    this.props.onChange(e);
  }

  onBlurBase = (e) => {
    if(this.dateTime.isOpened() === false){
      this.props.onBlur(e.target.id, e.target.value, this.originalValue, this);
      
      if(e.target.value !== this.originalValue)
        this.originalValue = e.target.value;
    }
  }

  onFocusBase = (e) => {
    e.currentTarget.select();
    this.props.onFocus();
  }

  setValue = (value) => {    
    let corValue = moment(value).format(this.format);
    this.dateTime.setDate(new Date(corValue));

    this.setState({
      defaultValue: corValue
    });

    this.originalValue = corValue;
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
        <div className="tui-datepicker-input tui-datetime-input tui-has-focus">
          <input type='text' 
                 value       = {this.state.defaultValue || ''} 
                 placeholder = {this.props.placeHolder}
                 disabled    = {this.props.disabled}
                //  readOnly    = {this.props.readOnly}
                 readOnly    = {true}
                 autoFocus   = {this.props.autoFocus}
                 maxLength   = {this.props.maxLength}
                 id          = {this.props.id}
                 className   = {this.props.className}
                   
                 style={{fontSize    : this.props.fontSize,
                         color       : this.props.color,
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

                 onChange    = {e => this.onChangeBase(e)}
                 onBlur      = {e => this.onBlurBase(e)}
                 onFocus     = {e => this.onFocusBase(e)}
 
                 ref         = {this.inputRef} 
                 aria-label  = 'Date-Time' 
          />
          <span className="tui-ico-date"></span>
        </div>
        <div ref={this.dateTimeRef} style={{marginTop: '-1px'}}></div>
      </div>
    )
  };
};

DateTime.propTypes = {
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
  timePicker  : PropTypes.bool,

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

DateTime.defaultProps = {
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
  borderWidth : '0',
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
  timePicker  : false,

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

export default DateTime;