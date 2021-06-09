import React from 'react';
import PropTypes from 'prop-types';
import SplitterLayout from 'react-split-pane';

import './Layout.css';

const Layout = (props) => {
  return (
    <SplitterLayout primary= {props.split === 'horizontal' ? 'first' : 'second'}
                    style={{position: 'unset'}}
                    // minSize={'auto'}
                    minSize={props.minSize < 60 ? 60 : props.minSize}
                    maxSize={props.minSize < 60 ? -60 : props.minSize * -1}

                    split={props.split}
                    paneStyle={{backgroundColor:'#ffffff'}}
                    resizerStyle={{display:props.resizerStyle}}
                    percentage={props.percentage}
                    defaultSize={props.defaultSize}
                    
                    
                    step={1}
                    >
                    {props.children}
    </SplitterLayout>
  );
};
Layout.propTypes = {
  /** * 스플릿 방향  horizontal: 가로레이아웃구성 vertical: 세로레이아웃구성 */
  split       : PropTypes.oneOf(['horizontal', 'vertical']),
  
  /** * 스플리터 표시여부  unset: 표시O none: 표시X */
  resizerStyle: PropTypes.oneOf(['unset', 'none']),
  percentage  : PropTypes.bool,
  defaultSize : PropTypes.number,
  minSize     : PropTypes.number
};

Layout.defaultProps = {
  split       : 'horizontal',
  resizerStyle: 'unset',
  percentage  : false,
  defaultSize : 54,
  minSize     : 60
};

export default Layout;