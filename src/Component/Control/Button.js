import React from 'react';
import PropTypes from 'prop-types';

const Button = (props) => {
  const btnStyle = {
    width       : props.width,
    height      : props.height,
    fontSize    : props.fontSize,
    color       : props.color,
    borderWidth : props.borderWidth,
    borderColor : props.colborderColoror,
    borderRadius: props.borderRadius,
    outline     : props.outline,
    float       : props.float,
    backgroundColor: props.backgroundColor
  }

  return (
    <button className={props.className}
            style={btnStyle} 
            type={props.type}
            disabled={props.disabled}
            onClick={props.onClick}>
      {props.children}
      {props.value}
    </button>
  );
};

Button.propTypes = {
  type        : PropTypes.string,
  value       : PropTypes.string,
  fontSize    : PropTypes.number,
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
  float       : PropTypes.string,
  disabled    : PropTypes.bool,
  children    : PropTypes.node,
  backgroundColor: PropTypes.string,

  className   : PropTypes.any,
  onClick     : PropTypes.func
};

Button.defaultProps = {
  type        : "button",
  value       : undefined,
  fontSize    : undefined,
  width       : '100px',
  height      : '23px',
  margin      : '0 auto',
  marginTop   : '0 auto',
  marginRight : '0 auto',
  marginBottom: '0 auto',
  marginLeft  : '0 auto',
  borderWidth : undefined,
  borderColor : undefined,
  borderRadius: undefined,
  outLine     : undefined,
  float       : undefined,
  disabled    : false,
  children    : undefined,
  color       : "black",
  backgroundColor: undefined,
  className   : undefined,
  
  onClick : (e) => {}
};

export default Button;