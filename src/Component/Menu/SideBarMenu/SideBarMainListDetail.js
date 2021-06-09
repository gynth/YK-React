import React, { useEffect, useState } from 'react';
import { getDynamicSql_Mysql } from '../../../db/Mysql/Mysql.js';

import Component from './SideBarMainListDetailComponent';

const SideBarMainListDetail = (props) => {

  const MENU_ID = props.MENU_ID;
  const [list, setList] = useState([]);
  
  useEffect(() => {
    if(MENU_ID !== ''){
      getDynamicSql_Mysql(
        'Common/Common.js',
        'ch_menu3',
        [{
          pr_menu: MENU_ID
        }]
      ).then(
        e => {setList(e.data.data)}
      )
    }
  }, [MENU_ID])

  return (
    <ul>
      {
        list.map((e) => <Component key={e.MENU_ID} 
                                   MENU_ID={e.MENU_ID} 
                                   MENU_NAM={e.MENU_NAM}></Component>)
      }
    </ul>
  );
};

export default SideBarMainListDetail;