import React, { useEffect, useState } from 'react';
// import { getDynamicSql_Mysql } from '../../../db/Mysql/Mysql.js';
import { useSelector } from 'react-redux';

import SideBarMainListDetail from './SideBarMainListDetail';

const SideBarMainList = (props) => {
  const SideBarMenuState = useSelector((e) => e.SIDEBARMENU_REDUCER.State, (p, n) => {
    return p.MENU_ID === n.MENU_ID;
  });

  const MENU_ID = SideBarMenuState.MENU_ID;

  const [list, setList] = useState([]);

  useEffect(() => {
    // if(MENU_ID !== ''){

    //   getDynamicSql_Mysql(
    //     'Common/Common.js',
    //     'ch_menu2',
    //     [{
    //       pr_menu: MENU_ID
    //     }]
    //   ).then(
    //     e => {setList(e.data.data)}
    //   )
    // }
    setList([]);

    if(MENU_ID === 'INSP'){
      setList(
        [{
          MENU_ID,
          MENU_NAM: '검수'
        }]
      )
    }
    // else if(MENU_ID === 'DISP'){
    //   setList(
    //     [{
    //       MENU_ID,
    //       MENU_NAM: '배차'
    //     }]
    //   )
    // }else if(MENU_ID === 'ENTR'){
    //   setList(
    //     [{
    //       MENU_ID,
    //       MENU_NAM: '입차'
    //     }]
    //   )
    // }
  }, [MENU_ID])

  return (
    <>
        {
          list.map((e) => 
            <React.Fragment key={e.MENU_ID}>
              <h3><span><span>{e.MENU_NAM}</span></span></h3>
              <SideBarMainListDetail MENU_ID={e.MENU_ID} MENU_NAM={e.MENU_NAM}/>
            </React.Fragment>       
          )
        }
    </>
  );
};

export default SideBarMainList;