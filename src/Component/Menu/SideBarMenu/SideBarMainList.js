import React, { useEffect, useState } from 'react';
// import { getDynamicSql_Mysql } from '../../../db/Mysql/Mysql.js';
import { useSelector } from 'react-redux';

import SideBarMainListDetail from './SideBarMainListDetail';

const SideBarMainList = (props) => {
  const SideBarMenuState = useSelector((e) => e.SIDEBARMENU_REDUCER.State, (p, n) => {
    return p.MENU_ID === n.MENU_ID;
  });

  const MENU = SideBarMenuState;

  const [list, setList] = useState([]);


  useEffect(() => {
    if(MENU.MENU_ID !== ''){
      let menu = [];
      menu.push(
        <React.Fragment key={MENU.MENU_ID}>
          <h3><span><span>{MENU.MENU_NAM}</span></span></h3>
          <SideBarMainListDetail MENU_ID={MENU.MENU_ID} MENU_NAM={MENU.MENU_NAM}/>
        </React.Fragment>
      )
  
      setList(menu)
    }
  }, [MENU])

  return (
    <>
        {list
        }
    </>
  );
};

export default SideBarMainList;