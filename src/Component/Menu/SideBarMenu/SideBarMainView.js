import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gfs_dispatch } from '../../../Method/Store';

const SideBarMainList = (props) => {
  const SideBarMenuState = useSelector((e) => e.SIDEBARMENU_REDUCER.State, (p, n) => {
    return p.index === n.index;
  });

  const menuIndex = SideBarMenuState.index;

  //#region 이벤트
  const onMenuClick = (e) => {

    gfs_dispatch('SIDEBARMENU_REDUCER', 'MENUCLICK', 
      ({
        index  : props.index,
        MENU_ID: props.MENU_ID,
        nam    : props.nam
      })
    );
  
    gfs_dispatch('SIDEBARMENU_REDUCER', 'MENUOPEN', 
      ({
        open   : false //css에서 명칭이좀 그래서 false이지 실제로는 true임
      })
    );
  }

  useEffect(() => {
    if(props.index === '0'){
      gfs_dispatch('SIDEBARMENU_REDUCER', 'INIT', 
        ({
          open   : true, //css에서 명칭이좀 그래서 false이지 실제로는 true임,
          index  : '0',
          MENU_ID: props.MENU_ID,
          nam    : props.nam
        })
      );
    }
  }, [props.index, props.MENU_ID, props.nam])
  //#endregion
  
  return (
    <li className={menuIndex === props.index ? `m${props.index} on` : `m${props.index}`} onClick={(e) => onMenuClick(e)}>
      <span></span>
    </li>
  );
};

export default SideBarMainList;