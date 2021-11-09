import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { gfo_getTextarea } from '../../Method/Component';
import { gfc_getMultiLang } from '../../Method/Comm';
import { gfs_dispatch } from '../../Method/Store';

class TextArea extends Component{
  originalValue = '';

  state = {
    background: this.props.backgroundColor,
    value     : this.props.defaultValue, 
    defaultValue: this.props.defaultValue
  }

  constructor(props){
    super(props)

    if(gfo_getTextarea(props.pgm, props.id) !== undefined){
      gfc_getMultiLang('dup', 'TextArea 아이디 중복입니다. > ' + props.pgm + ', ' + props.id);
      return 
    } 

    this.textareaRef = createRef();

    gfs_dispatch(props.pgm, 'INITTEXTAREA', 
      ({
        Textarea: {id      : props.id,
          Textarea: this}
      })
    );
  }

  componentWillUnmount(){
    gfs_dispatch(this.props.pgm, 'CLEARTEXTAREA', 
      ({
        id: this.props.id
      })
    );
  }

  onBlurBase = (e) => {
    this.props.onBlur(e.target.id, e.target.value, this.originalValue, this);
    
    if(e.target.value !== this.originalValue)
      this.originalValue = e.target.value;
  }

  onChangeBase = (e) => {
    this.setState({
      defaultValue: e.target.value
    });
    this.props.onChange(e);
  }

  onKeyDownBase = (e) => {
    if(this.props.onKeyDown !== undefined)
      this.props.onKeyDown(e);
  }

  onKeyUpBase = (e) => {
    if(this.props.onKeyUp !== undefined)
    this.props.onKeyUp(e);
  }

  setValue = (value) => {    
    this.setState({
      defaultValue: value
    });

    this.originalValue = value;
  }

  getValue = () => {
    return this.textareaRef.current.value === undefined ? '' : this.textareaRef.current.value
  }

  setBackGroundColor = (e) => {
    this.setState({
      background: e
    })
  }
 
  render(){
    return (
        <div className='item'>
          <textarea 
                 pgm       = {this.props.pgm}
                 id        = {this.props.id}
                 value     = {this.state.defaultValue || ''}

                 style     = {this.props.style}
                 onChange  = {e => this.onChangeBase(e)}
                 onKeyDown = {e => this.onKeyDownBase(e)}
                 onKeyUp   = {e => this.onKeyUpBase(e)}
                 onBlur    = {e => this.onBlurBase(e)}
                 
                 ref={this.textareaRef}
                 autoComplete = 'off'
              >
          </textarea>
        </div>
    )
  }
};

TextArea.propTypes = {
  pgm         : PropTypes.string.isRequired,
  id          : PropTypes.string.isRequired,

  onChange     : PropTypes.func
};

TextArea.defaultProps = {
  id          : undefined,

  onChange     : (e) => {}
};

export default TextArea;