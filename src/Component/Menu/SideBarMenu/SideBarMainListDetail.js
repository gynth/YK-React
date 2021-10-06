import React, { useEffect, useState } from 'react';
// import { getDynamicSql_Mysql } from '../../../db/Mysql/Mysql.js';
import { gfc_set_oracle_column } from '../../../Method/Comm';
import { getDynamicSql_Oracle } from '../../../db/Oracle/Oracle';

import Component from './SideBarMainListDetailComponent';
import { gfs_getStoreValue } from '../../../Method/Store';

const SideBarMainListDetail = (props) => {
  const [mainMenu, setMainMenu] = useState([]);

  const MENU_ID = props.MENU_ID;
  
  const MENU_2 = async() => {
    let result = await getDynamicSql_Oracle(
      'Common/Common',
      'MENU_2',
      [{menu_grp: MENU_ID}]
    ); 

    let menu = [];
    let data = gfc_set_oracle_column(result);
    let auth = gfs_getStoreValue('USER_REDUCER', 'AUTH');

    for(let i = 0; i < data.length; i++){
      const eachAuth = auth.find(e => e.MENU_ID === data[i].MENU_ID)
      if(eachAuth.PGMAUT_YN === 'Y'){
        menu.push(
          <Component key={data[i].MENU_ID} 
                      MENU_ID={data[i].MENU_ID} 
                      MENU_NAM={data[i].MENU_NAM}>
          </Component>
        )
      }
    }

    setMainMenu(menu);
  }

  useEffect(() => {
    // if(MENU_ID !== ''){
    //   getDynamicSql_Mysql(
    //     'Common/Common.js',
    //     'ch_menu3',
    //     [{
    //       pr_menu: MENU_ID
    //     }]
    //   ).then(
    //     e => {setList(e.data.data)}
    //   )
    // }
    MENU_2();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MENU_ID])

  return (
    <ul>
      { mainMenu }
      {/* {
        list.map((e) => <Component key={e.MENU_ID} 
                                   MENU_ID={e.MENU_ID} 
                                   MENU_NAM={e.MENU_NAM}></Component>)
      } */}
    </ul>
  );
};

export default SideBarMainListDetail;