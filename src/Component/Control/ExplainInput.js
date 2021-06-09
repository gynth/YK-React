/*로그인 화면에서 사용자 아이디 입력하는 Input*/
import React from 'react';
import PropTypes from 'prop-types';

const ExplainInput = (props) => {

  const placeholder   = props.placeholder;
  const height        = props.height;
  const smallFontSize = props.smallFontSize;

  const parentBorder  = props.parentBorder; //#DBDBDB, black
  const smallVisible  = props.smallVisible; //hidden, visible
  const location      = props.location; // 21%, 44%

  return (
    <div style={{height:height, width:props.width, borderRadius:'2px', border:'1px solid ' + parentBorder, margin:props.margin, marginTop: props.marginTop, marginRight: props.marginRight, marginBottom: props.marginBottom, marginLeft: props.marginLeft, background:'#fafafa'}}>
      <label style={{position:'relative', display:'block', width:'95%', height:'100%'}} >
        <span style={{visibility:smallVisible, fontSize:smallFontSize, position:'absolute', color:'#8e8e8e', margin:'0px 0px 0px 10px'}}>{placeholder}</span>
        <input onFocus={props.onFocus} onBlur={props.onBlur} onChange={props.onChange}
          style={{outline:'none', top:location, margin:'0px 0px 0px 10px', position:'absolute', color:'black', width:'90%', height:'50%', border:'0px', backgroundColor:'#fafafa'}} placeholder={placeholder}
          type={props.type}
          name={props.name}>
        </input>
      </label>
    </div>
  );
};

ExplainInput.propTypes = {
  name         : PropTypes.string,
  placeholder  : PropTypes.string,
  width        : PropTypes.string,
  height       : PropTypes.string,
  margin       : PropTypes.string,
  marginTop    : PropTypes.string,
  marginRight  : PropTypes.string,
  marginBottom : PropTypes.string,
  marginLeft   : PropTypes.string,
  smallFontSize: PropTypes.string,
  smallVisible : PropTypes.string,
  parentBorder : PropTypes.string,
  location     : PropTypes.string,
  onFocus      : PropTypes.func,
  onBlur       : PropTypes.func,
  onChange     : PropTypes.func
};

ExplainInput.defaultProps = {
  name         : undefined,
  placeholder  : '',
  width        : '150px',
  height       : '23px',
  margin       : '0 auto',
  marginTop    : '0 auto',
  marginRight  : '0 auto',
  marginBottom : '0 auto',
  marginLeft   : '0 auto',
  smallFontSize: '0.1em',
  smallVisible : 'hidden',
  parentBorder : '#DBDBDB',
  location     : '21%',
  onFocus      : (e) => {},
  onBlur       : (e) => {},
  onChange     : (e) => {}
};

export default ExplainInput;