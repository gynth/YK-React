import React from 'react';
import PropTypes from 'prop-types';

/*
ul태그는 굳이 이거 안쓰고 그냥 <ul>로 해도됨.
*/

const Ul = (props) => {

  return (
    <ul className={props.className}>
      {props.children}
    </ul>
  );
};

Ul.propTypes = {
  className: PropTypes.any,
  children : PropTypes.node
};

Ul.defaultProps = {
  className: undefined,
  children : undefined
};

export default Ul;