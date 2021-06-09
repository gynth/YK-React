import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SplitterLayout from 'react-split-pane';

import './Layout.css';

let chgSize = '50%';
const Layout = (props) => {
  const [size, setSize] = useState(props.defaultSize);
  const [style, setStyle] = useState({backgroundColor:'#ffffff', transition:'all 0.5s ease-in-out'});

  let direction;
  if(props.direction === undefined){
    if(props.split === 'horizontal'){
      direction = 'down';
    }else{
      direction = 'left';
    }
  }else{
    direction = props.direction;
  }

  const onColpaseClick = (e) => {
    const btnDirection = e.target.dataset.direction;

    if(btnDirection === 'left'){
      e.target.dataset.direction = 'right';
      e.target.innerText = '▶';

      if(direction === 'left'){
        setSize(chgSize);
      }else{
        setSize(props.defaultSize)
      }
    }else if(btnDirection === 'right'){
      e.target.dataset.direction = 'left';
      e.target.innerText = '◀';

      if(direction === 'right'){
        setSize(chgSize);
      }else{
        setSize(props.defaultSize)
      }
    }else if(btnDirection === 'up'){
      e.target.dataset.direction = 'down';
      e.target.innerText = '▼';

      if(direction === 'up'){
        setSize(chgSize);
      }else{
        setSize(props.defaultSize)
      }
    }else if(btnDirection === 'down'){
      e.target.dataset.direction = 'up';
      e.target.innerText = '▲';

      if(direction === 'down'){
        setSize(chgSize);
      }else{
        setSize(props.defaultSize)
      }
    }
  }

  const onChange = (e) => {
    if(e !== undefined) chgSize = e;
  }

  const onDragStarted = (e) => {
    setStyle({backgroundColor:'#ffffff'});
  }

  const onDragFinished = (e) => {
    setStyle({backgroundColor:'#ffffff', transition:'all 0.5s ease-in-out'});
  }

  return (
    <SplitterLayout primary= {props.primary}
                    style={{position: 'unset'}}
                    minSize={(props.minSize !== undefined && props.minSize !== null) ? props.minSize[0] : 1}
                    maxSize={(props.minSize !== undefined && props.minSize !== null) ? props.minSize[1] * -1 : -1}

                    direction={direction}
                    split={props.split}
                    // paneStyle={{backgroundColor:'#ffffff', transition:'all 0.5s ease-in-out'}}
                    paneStyle={style}
                    resizerStyle={{display:props.resizerStyle}}
                    percentage={props.percentage}

                    defaultSize={props.defaultSize}
                    size={size} 
                    
                    onColpaseClick={e => onColpaseClick(e)}
                    onChange={e => onChange(e)}
                    onDragStarted={e => onDragStarted(e)}
                    onDragFinished={e => onDragFinished(e)}
                    
                    step={1}
                    >
                    {props.children}
    </SplitterLayout>
  );
};
Layout.propTypes = {
  /** * 기준DIV */
  //primary: PropTypes.oneOf(['first', 'second']),
  primary: PropTypes.oneOf(['first', 'second']),

  /** * 스플릿 방향  horizontal: 가로레이아웃구성 vertical: 세로레이아웃구성 */
  // split       : PropTypes.oneOf(['horizontal', 'vertical']),
  split: PropTypes.string,
  
  /** * 스플리터 표시여부  unset: 표시O none: 표시X */
  resizerStyle: PropTypes.oneOf(['unset', 'none']),
  percentage  : PropTypes.bool,
  minSize     : PropTypes.array,
  direction   : PropTypes.string
};

Layout.defaultProps = {
  primary: 'first',
  // split       : 'horizontal',
  resizerStyle: 'unset',
  percentage  : false,
  defaultSize : 1
};

export default Layout;