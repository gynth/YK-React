import React, { useMemo } from 'react';
import { Rnd } from 'react-rnd';
import { useSelector } from 'react-redux';
import { gfs_getStoreValue, gfs_dispatch } from '../Method/Store';
import PropTypes from 'prop-types';
import './WindowFrame.css';
import { jsonMaxValue, jsonRtn } from '../JSON/jsonControl';
//#region 이벤트 정의
const onWindowClick = (programId, programNam) => {
  
  gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
    ({
      windowZindex: 0,
      activeWindow: {programId,
                     programNam
                    }
    })
  );
};

const onWindowCloseClick = (programId) => {
  gfs_dispatch('WINDOWFRAME_REDUCER', 'CLOSEWINDOW', 
    ({
      activeWindow: {programId
                    }
    })
  );

  gfs_dispatch(programId, 'DELPGM'
  );

  let maxZindex = jsonMaxValue(gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState'), 'windowZindex');
  let selJson = jsonRtn(gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState'), 'windowZindex', maxZindex);
  
  if(selJson !== undefined){
    gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
      ({
        windowZindex: 0,
        activeWindow: {programId : selJson[0]['programId'],
                       programNam: selJson[0]['programNam']
                      }
      })
    );
  }
};

const onResizeClick = (type, programId, programNam) => {
  gfs_dispatch('WINDOWFRAME_REDUCER', type, 
    ({
      windowZindex: 0,
      activeWindow: {programId,
                     programNam
                    }
    })
  );
};

const onResize = (programId, programNam) => {
  gfs_dispatch('WINDOWFRAME_REDUCER', 'RESIZESTART', 
    ({
      windowZindex: 0,
      activeWindow: {programId,
                     programNam
                    },
      resizing    : true
    })
  );
};

const onResizeStop = (width, height, x, y, programId, programNam) => {
  gfs_dispatch('WINDOWFRAME_REDUCER', 'RESIZEWINDOW', 
    ({
      windowZindex: 0,
      activeWindow: {programId,
                     programNam
                    },
      width       : width,
      height      : height,
      X           : x,
      Y           : y,
      resizing    : false
    })
  );
};

const onDrag = (programId, programNam, width) => {
  if(width !== '100%'){  
    gfs_dispatch('WINDOWFRAME_REDUCER', 'DRAGSTART', 
      ({
        windowZindex: 0,
        activeWindow: {programId,
                      programNam
                      },
        dragging    : true
      })
    );
  }
};

const onDragStop = (x, y, width, programId, programNam) => {
  if(width !== '100%'){
    gfs_dispatch('WINDOWFRAME_REDUCER', 'DRAGWINDOW', 
      ({
        windowZindex: 0,
        activeWindow: {programId,
                       programNam
                      },
        X           : x,
        Y           : y,
        dragging    : false
      })
    );
  }
};
//#endregion

const applyWindow = (programId, programNam) => {
  // if(programId === 'ED000') return <PgmTest pgm={programId} nam={programNam}/>
  // else if (programId === 'ED010') return <PgmTest2 pgm={programId} nam={programNam}/>
  // else if (programId === 'ED050') return <Menu pgm={programId} nam={programNam}/>

  if(programId === 'COMM'){
    const pgm = require(`../Program/COMM/${programId}/${programId}.js`);
    return <pgm.default pgm={programId} nam={programNam} />
  }else if(programId === 'MENU'){
    const pgm = require(`../Program/COMM/${programId}/${programId}.js`);
    return <pgm.default pgm={programId} nam={programNam} />
  }else if(programId === 'AUTH'){
    const pgm = require(`../Program/COMM/${programId}/${programId}.js`);
    return <pgm.default pgm={programId} nam={programNam} />
  }else if(programId === 'USER'){
    const pgm = require(`../Program/COMM/${programId}/${programId}.js`);
    return <pgm.default pgm={programId} nam={programNam} />
  }else{
    const pgm = require(`../Program/IMS/${programId}/${programId}.js`);
  
    return <pgm.default pgm={programId} nam={programNam} />
  }
}

const WindowFrame = (props) => {
  const window = useMemo(() => applyWindow(props.programId, props.programNam), [props.programId, props.programNam])

  const windowState = useSelector((e) => e.WINDOWFRAME_REDUCER.windowState, (p, n) => {
    // return JSON.stringify(p) === JSON.stringify(n);
    const before = jsonRtn(n, 'programId', props.programId);
    const after = jsonRtn(p, 'programId', props.programId);
    
    let result = true;

    if(before[0].programId !== after[0].programId) result = false;
    else if(before[0].windowZindex !== after[0].windowZindex) result = false;
    else if(before[0].windowWidth !== after[0].windowWidth) result = false;
    else if(before[0].windowHeight !== after[0].windowHeight) result = false;
    else if(before[0].X !== after[0].X) result = false;
    else if(before[0].Y !== after[0].Y) result = false;
    else if(before[0].resizing !== after[0].resizing) result = false;
    else if(before[0].dragging !== after[0].dragging) result = false;

    return result
  });
  const activeWindow = useSelector((e) => e.WINDOWFRAME_REDUCER.activeWindow, (p, n) => {
    return p.programId === n.programId;
  });
  const thisValue = jsonRtn(windowState, 'programId', props.programId);

  if(thisValue !== undefined){
    const windowWidth  = thisValue[0]['windowWidth'];
    const windowHeight = thisValue[0]['windowHeight'];
    const x  = thisValue[0]['X'];
    const y = thisValue[0]['Y'];
    const isWindow = (activeWindow['programId'] === props.programId) ? true : false;
    const resizing = thisValue[0]['resizing'];
    const dragging = thisValue[0]['dragging'];

    
    return (
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: '100%',
          height: '100%'
        }}
        size={{
          width: windowWidth,
          height: windowHeight
        }}
        position={{
          x: x,
          y: y
        }}
        style={{zIndex: thisValue[0]['windowZindex']}}
        minWidth={60}
        minHeight={60}
        bounds='parent'
        // enableResizing= {windowWidth === '100%' ? false : true}
        enableResizing={false}
        dragHandleClassName='win_header'
        onResize={() => onResize(props.programId, props.programNam)}
        onResizeStop= {(e, dir, ref, delta, position) => onResizeStop(delta.width, delta.height, position.x, position.y, props.programId, props.programNam)}
        onDrag={() => onDrag(props.programId, props.programNam, windowWidth)}
        onDragStop= {(e, data) => onDragStop(data.x, data.y, windowWidth, props.programId, props.programNam) }>
 
        <div style={{width:'100%', boxShadow: isWindow && '0px 1px 5px 1px gray',
                     borderStyle: ((resizing || dragging) && windowWidth !== '100%') && 'dotted', 
                     borderColor: ((resizing || dragging) && windowWidth !== '100%') && 'gray'}} 
             className='content'
             onMouseUp={(e) => onWindowClick(props.programId, props.programNam)}>
        
          <div className='win_header' style={{cursor:'move'}}
              //  onDoubleClick={(e) => onResizeClick(windowWidth === '100%' ? 'MINIMIZEWINDOW' : 'MAXIMIZEWINDOW', props.programId, props.programNam)}
               >
            <h4>[{props.programId}] {props.programNam}</h4>
            
            <div className='win_controller'>
              {/* <button type='button' className='min'
                      onMouseDown={e => e.stopPropagation()}>
              </button>
              
              <button type='button' className='max'
                      onClick={() => onResizeClick(windowWidth === '100%' ? 'MINIMIZEWINDOW' : 'MAXIMIZEWINDOW', props.programId, props.programNam)}  
                      onMouseDown={e => e.stopPropagation()}>
              </button> */}

              <button type='button' className='close' 
                      onClick={() => onWindowCloseClick(props.programId)}
                      onMouseDown={e => e.stopPropagation()} >
              </button>
            </div>
          </div>

          {/* <div className='win_body' style={{position:'relative', display: ((resizing || dragging) && windowWidth !== '100%') && 'none'}}> */}
          <div className='win_body' style={{display: ((resizing || dragging) && windowWidth !== '100%') && 'none'}}>
            {/* <PgmTest pgm={props.programId} nam={props.programNam}/> */}
            {window}
          </div>
        </div>
        
      </Rnd>
    );
  }else{
    return null;
  }
};

WindowFrame.propTypes = {
  programId: PropTypes.string.isRequired
};

WindowFrame.defaultProps = {

};

// export default connect(mapStateToProps, mapDispatchToProps) (WindowFrame);
//커넥트 사용시 RND가 적용되지 않아서 커넥트 없이 리덕스 사용.
export default WindowFrame;