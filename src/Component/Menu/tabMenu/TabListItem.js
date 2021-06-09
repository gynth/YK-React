import React from 'react';
import { jsonMaxValue, jsonRtn } from '../../../JSON/jsonControl';
import { useSelector } from 'react-redux';
import { gfs_getValue, gfs_dispatch } from '../../../Method/Store';

const onClick = (e) => {
  e.stopPropagation();
  const select = e.currentTarget.dataset;

  gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
    ({
      windowZindex: 0,
      activeWindow: {programId: select.pgm,
                     programNam: select.nam
                    }
    })
  );
}

const onCloseClick = (e) => {
  e.stopPropagation();
  const select = e.currentTarget.dataset;

  gfs_dispatch(select.pgm, 'DELPGM');

  gfs_dispatch('WINDOWFRAME_REDUCER', 'CLOSEWINDOW', 
    ({
      activeWindow: {programId: select.pgm
                    }
    })
  );
  
  let maxZindex = jsonMaxValue(gfs_getValue('WINDOWFRAME_REDUCER', 'windowState'), 'windowZindex');
  let selJson = jsonRtn(gfs_getValue('WINDOWFRAME_REDUCER', 'windowState'), 'windowZindex', maxZindex);
  
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
}

const TabListItem = (props) => {

  const activeWindow = useSelector((e) => {
    if(e.WINDOWFRAME_REDUCER === undefined) {
      return [{}]
    }else{
      return e.WINDOWFRAME_REDUCER.activeWindow
    }
  }, (p, n) => {
    return p.programId === n.programId;
  });

  return (
    <li className={activeWindow.programId === props.programId ? 'on' : ''} 
        data-pgm={props.programId}
        data-nam={props.programNam}
        onClick={e => onClick(e)}
        >
      <span>{props.programNam}</span>
      <button type='button' 
              className='close' 
              data-pgm={props.programId}
              data-nam={props.programNam}
              onClick={e => {onCloseClick(e)}}>닫기</button>
    </li>
  );
};

export default TabListItem;