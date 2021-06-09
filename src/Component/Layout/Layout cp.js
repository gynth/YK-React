import React from 'react';
import PropTypes from 'prop-types';
import { SplitPane } from "react-collapse-pane";

// import './Layout.css';

const Layout = (props) => {

  // const buttonPositionOffset = Number('Button Position Offset', 0, {
  //   min: -200,
  //   max: 200,
  //   range: true,
  // });
  // const collapseDirection = Select('Direction', { left: 'left', right: 'right' }, 'left');
  // const minSizes = Object('Minimum Sizes', [50, 50, 50, 50]);
  // const collapseTransition = Number('Collapse Transition Speed (ms)', 500);
  // const grabberSize = Number('Grabber Size (px)', 10, { min: 1, max: 100, range: true });
  // const buttonTransition = select(
  //   'Button Transition',
  //   {
  //     fade: 'fade',
  //     zoom: 'zoom',
  //     grow: 'grow',
  //     none: 'none',
  //   },
  //   'grow'
  // );

  let direction = props.direction;
  if(props.split === 'horizontal'){
    if(props.direction === undefined){
      direction = 'down';
    }
  }else{
    if(props.direction === undefined){
      direction = 'right';
    }
  }

  let beforeArrow = '';
  let afterArrow = '';
  if(direction === 'up'){
    beforeArrow = '⬆';
    afterArrow  = '⬇';
  }else if(direction === 'down'){ 
    beforeArrow = '⬇';
    afterArrow  = '⬆';
  }else if(direction === 'left'){
    beforeArrow = '⬅';
    afterArrow  = '➡';
  }else if(direction === 'right'){ 
    beforeArrow = '➡';
    afterArrow  = '⬅';
  }
  
  return (
    <SplitPane split={props.split}
              //  initialSizes={[60, 1000]}
               minSizes={[0, 1]}
              // minSizes={props.defaultSize}
              collapsedSizes={props.defaultSize}

              // initialSizes={props.defaultSize}
              collapseOptions={{
                  beforeToggleButton: <button>{beforeArrow}</button>,
                  afterToggleButton: <button>{afterArrow}</button>,
                  buttonTransition : 'zoom',
                  collapseDirection: direction
               }}
               resizerOptions={{
                 grabberSize: props.resizerStyle === 'unset' ? '1rem' : '0rem'
               }}
    >
      {props.children}
    </SplitPane>
  );
};
Layout.propTypes = {
  /** * 스플릿 방향  horizontal: 가로레이아웃구성 vertical: 세로레이아웃구성 */
  split       : PropTypes.oneOf(['horizontal', 'vertical']),
  
  /** * 스플리터 표시여부  unset: 표시O none: 표시X */
  resizerStyle: PropTypes.oneOf(['unset', 'none']),
  
  /** * 사이즈지정 [1, 1]: 비율로지정, [60, null] px로 지정 */
  defaultSize : PropTypes.array,
  
  direction   : PropTypes.oneOf(['left', 'right', 'up', 'down']),
};

Layout.defaultProps = {
  split       : 'horizontal',
  resizerStyle: 'unset'
};

export default Layout; 