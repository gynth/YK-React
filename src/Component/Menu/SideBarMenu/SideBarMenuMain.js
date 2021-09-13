import React from 'react';
import '../Menu.css';
import { useSelector } from 'react-redux';
import { gfs_dispatch, gfs_injectAsyncReducer } from '../../../Method/Store';

import Li from './SideBarMainView';
import Title from './SideBarMenuTitle';
import SideBarMainList from './SideBarMainList';

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
  const SideBarMenuState = useSelector((e) => e.SIDEBARMENU_REDUCER.State, (p, n) => {
    return p.open === n.open;
  });

  const menuOpen = SideBarMenuState.open;

  return (
    <div className={menuOpen? 'sidebarmenu open' : 'sidebarmenu'} id='moveOpen'>
      <div className='left_menu'>
        <div className='fixed_menu'>
          <h1><img src={require('../../../Image/yk_08@2x.png').default} alt='로고'/></h1>
          <button htmlFor='menuIcon' type='button' className='hmenu' onClick={(e) => onClick(e)}/>
          <ul>
            <Li MENU_ID='INSP' index='0' nam='검수'></Li>
            <Li MENU_ID='DISP' index='1' nam='출차'></Li>
            <Li MENU_ID='ENTR' index='2' nam='입차'></Li>
            <Li MENU_ID='CFRM' index='3' nam='확정'></Li>
          </ul>
          <div className='footer_menu'>
            <ul>
              <Li MENU_ID='COMM' index='5' nam='설정'></Li>
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