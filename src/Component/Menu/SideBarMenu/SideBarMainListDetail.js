import React, { useEffect, useState } from 'react';
// import { getDynamicSql_Mysql } from '../../../db/Mysql/Mysql.js';

import Component from './SideBarMainListDetailComponent';

const SideBarMainListDetail = (props) => {

  const MENU_ID = props.MENU_ID;
  const [list, setList] = useState([]);
  
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
    if(MENU_ID === 'INSP'){
      setList(
        [{
          MENU_ID : 'INSP_PROC',
          MENU_NAM: '검수진행'
        },{
          MENU_ID : 'INSP_HIST',
          MENU_NAM: '검수이력'
        },{
          MENU_ID : 'SHIP_PROC',
          MENU_NAM: '해상운송건'
        }]
      )
    }
    else if(MENU_ID === 'DISP'){
      setList(
        [{
          MENU_ID : 'DISP_PROC',
          MENU_NAM: '출차대기'
        }]
      )
    }
    else if(MENU_ID === 'ENTR'){
      setList(
        [{
          MENU_ID : 'ENTR_PROC',
          MENU_NAM: '입차대기'
        }]
      )
    }
    else if(MENU_ID === 'CFRM'){
      setList(
        [{
          MENU_ID : 'INSP_CFRM',
          MENU_NAM: '검수확정'
        },{
          MENU_ID : 'INSP_CANC',
          MENU_NAM: '검수취소'
        }]
      )
    }
    else if(MENU_ID === 'COMM'){
      setList(
        [{
          MENU_ID : 'COMM',
          MENU_NAM: '공통코드'
        },{
          MENU_ID : 'MENU',
          MENU_NAM: '프로그램메뉴'
        },{
          MENU_ID : 'AUTH',
          MENU_NAM: '권한관리'
        },{
          MENU_ID : 'CAMR_SETTING',
          MENU_NAM: '카메라세팅'
        },{
          MENU_ID : 'USER',
          MENU_NAM: '사용자관리'
        }]
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