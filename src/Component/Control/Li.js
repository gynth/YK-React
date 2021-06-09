import React from 'react';
import PropTypes from 'prop-types';

/*
li태그는 굳이 이거 안쓰고 그냥 <li>로 해도됨.
*/

const Li = (props) => {

  return (
    <li className={props.className}>
      {props.children}
    </li>
  );
};

Li.propTypes = {
  className: PropTypes.any,
  children : PropTypes.node
};

Li.defaultProps = {
  className: undefined,
  children : undefined
};

export default Li;