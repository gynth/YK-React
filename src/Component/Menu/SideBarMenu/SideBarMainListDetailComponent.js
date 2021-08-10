import React from 'react';
import { useSelector } from 'react-redux';
import { gfs_dispatch, gfs_PGM_REDUCER } from '../../../Method/Store';

const SideBarMainListDetailComponent = (props) => {


  const pgmClick = (e) => {
    const select = e.currentTarget.dataset;

    //#region 프로그램 리듀서 생성
    gfs_PGM_REDUCER(select.pgm);
    
    //#endregion

    //메뉴클릭시 사이드바메뉴 닫기.
    gfs_dispatch('SIDEBARMENU_REDUCER', 'MENUOPEN');

    gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
      ({
        windowZindex: 0,
        activeWindow: {programId: select.pgm,
                       programNam: select.nam
                      }
      })
    );

  };

  const selectWindow = useSelector((e) => {
    if(e.WINDOWFRAME_REDUCER === undefined) {
      return null;
    }else{
      return e.WINDOWFRAME_REDUCER.activeWindow
    }
  }, (p, n) => {
    return (p === null ? 0 : p.programId) === (n === null ? 0 : n.programId)
  });

  return (
    
    <li className={(selectWindow !== null) && selectWindow.programId === props.MENU_ID ? 'on' : ''}
    
        data-pgm={props.MENU_ID} 
        data-nam={props.MENU_NAM}
        onClick={(e) => pgmClick(e)}>
      <span>{props.MENU_NAM}</span>
    </li>
  );
};

export default SideBarMainListDetailComponent;