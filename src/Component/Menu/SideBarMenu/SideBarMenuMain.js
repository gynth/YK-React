import React, { useEffect, useState } from 'react';
import '../Menu.css';
import { useSelector } from 'react-redux';
import { gfs_dispatch, gfs_injectAsyncReducer } from '../../../Method/Store';
import { gfc_set_oracle_column } from '../../../Method/Comm';
import { getDynamicSql_Oracle } from '../../../db/Oracle/Oracle';
import Li from './SideBarMainView';
import Title from './SideBarMenuTitle';
import SideBarMainList from './SideBarMainList';
import SideBarUserName from './SideBarUserName';

//#region 리듀서 생성
const sidebarmenuReducer = (nowState, action) => {

  if(action.reducer !== 'SIDEBARMENU_REDUCER') {
    return {
      State: nowState === undefined ? {open: true, index: '', MENU_ID:'', nam: ''} : nowState.State
    };
  }

  if(action.type === 'INIT'){
    return Object.assign({}, nowState, {
      State : {'open'   : action.open,
               'index'  : action.index,
               'MENU_ID': action.MENU_ID,
               'nam'    : action.nam
              }
    })
  }else if(action.type === 'MENUOPEN'){
    const menuOpen = action.open === undefined ? (nowState.State.open ? false : true) : action.open;

    return Object.assign({}, nowState, {
      State : {'open'   : menuOpen,
               'index'  : nowState.State.index,
               'MENU_ID': nowState.State.MENU_ID,
               'nam'    : nowState.State.nam
              }
    })
  }else if(action.type === 'MENUCLICK'){
    return Object.assign({}, nowState, {
      State : {'open'   : nowState.State.open,
               'index'  : action.index,
               'MENU_ID': action.MENU_ID,
               'nam'    : action.nam
              }
    })
  }
};
//#endregion
gfs_injectAsyncReducer('SIDEBARMENU_REDUCER', sidebarmenuReducer);

//#region 이벤트

const onClick = (e) => {
  gfs_dispatch('SIDEBARMENU_REDUCER', 'MENUOPEN');
  e.target.blur();
};

//#endregion

const SideBarMenu = (props) => {
  const [mainMenu, setMainMenu] = useState([]);
  const [commMenu, setCommMenu] = useState([]);

  const SideBarMenuState = useSelector((e) => e.SIDEBARMENU_REDUCER.State, (p, n) => {
    return p.open === n.open;
  });

  const user_nam = useSelector((e) => {
    if(e['USER_REDUCER'] === undefined){
      return '';
    }else{
      return e['USER_REDUCER'].USER_NAM;
    }
  }, (p, n) => {
    return p.USER_NAM === n.USER_NAM;
  });

  const menuOpen = SideBarMenuState.open;

  const MENU_1 = async() => {
    let result = await getDynamicSql_Oracle(
      'Common/Common',
      'MENU_1',
      [{}]
    ); 

    let menu = [];
    let commMenu = [];
    let data = gfc_set_oracle_column(result);

    for(let i = 0; i < data.length; i++){
      if(data[i].COMM_DTL_CD === 'COMM'){
        commMenu.push(
          <Li key={data[i].COMM_DTL_CD} MENU_ID={data[i].COMM_DTL_CD} index={data[i].SORT_SEQ} nam={data[i].COMM_DTL_NAM} />
        )
      }else{
        menu.push(
          <Li key={data[i].COMM_DTL_CD} MENU_ID={data[i].COMM_DTL_CD} index={data[i].SORT_SEQ - 1} nam={data[i].COMM_DTL_NAM} />
        )
      }
    }

    setMainMenu(menu);
    setCommMenu(commMenu);
  }

  useEffect(() => {
    MENU_1();
  }, [])

  return (
    <div className={menuOpen? 'sidebarmenu open' : 'sidebarmenu'} id='moveOpen'>
      <div className='left_menu'>
        <div className='fixed_menu'>
          <h1><img src={require('../../../Image/yk_08@2x.png').default} alt='로고'/></h1>
          <button htmlFor='menuIcon' type='button' className='hmenu' onClick={(e) => onClick(e)}/>
          <ul>
            { mainMenu }
            {/* <Li MENU_ID='INSP' index='1' nam='검수'></Li>
            <Li MENU_ID='DISP' index='2' nam='출차'></Li>
            <Li MENU_ID='ENTR' index='3' nam='입차'></Li>
            <Li MENU_ID='CFRM' index='4' nam='확정'></Li> */}
          </ul>
          <div className='footer_menu'>
            <SideBarUserName />
            <ul>
              {/* <Li MENU_ID='COMM' index='5' nam='설정'></Li> */}
              { commMenu }
            </ul>
            {/* <div className='setting'><span onClick={e => {

              gfs_PGM_REDUCER('CAMR_SETTING');
              gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
              ({
                windowZindex: 0,
                activeWindow: {programId: 'CAMR_SETTING',
                                programNam: '카메라정보'
                              }
              }));
            }}>옵션</span></div> */}
          </div>
        </div>
        <div className='move_menu'>
          <Title />

          <div className='search_box'>
            <input type='text' placeholder='메뉴명을 입력하세요' />
          </div>

          <div className='sub_menu'>
            <SideBarMainList />
          </div>
        </div>
      </div>
  </div>
  );
};

export default SideBarMenu;