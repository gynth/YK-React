import React from 'react';
import '../Menu.css';
import { useSelector } from 'react-redux';
import {injectAsyncReducer} from '../../../Store/Store';
import { gfs_dispatch } from '../../../Method/Store';

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
injectAsyncReducer('SIDEBARMENU_REDUCER', sidebarmenuReducer);

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
          <h1><img src={require('../../../Image/logo@2x.png').default} alt='로고'/></h1>
          <button htmlFor='menuIcon' type='button' className='hmenu' onClick={(e) => onClick(e)}/>
          <ul>
            {/* 김경현 하드코딩중 추후에 바꿔야함 WHO??? */}
            {/* 지금 안하는 이유는 아이콘 이미지가 하드코딩임 */}
            <Li MENU_ID='ED' index='0' nam='연습'></Li>
            <Li MENU_ID='ZM' index='1' nam='공통'></Li>
            <Li              index='2'           ></Li>
            <Li              index='3'           ></Li>
            <Li              index='4'           ></Li>
          </ul>
          <div className='footer_menu'>
            <span className='user'>유저</span>
            <div className='setting'><span>옵션</span></div>
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
    {/* <div className='content'>
      <div className='header'>
        <div className='tabs'>
          <ul className='list'>
            <li className='on'>메뉴이름<button type='button' className='close'>닫기</button></li>
            <li>메뉴이름<button type='button' className='close'>닫기</button></li>
            <li>메뉴이름<button type='button' className='close'>닫기</button></li>
          </ul>
        </div>
        <div className='common_btns'>
          <button type='button' className='save'><span>저장</span></button>
          <button type='button' className='del'><span>삭제</span></button>
          <button type='button' className='search'><span>조회</span></button>
        </div>
      </div>
      <div className='body'>
        <div className='win_box'>
          <div className='win_header'>
            <h4>고객등록</h4>
            <div className='win_controller'>
              <button type='button' className='min'>최소화</button>
              <button type='button' className='max'>최대화</button>
              <button type='button' className='close'>닫기</button>
            </div>
          </div>
          <div className='win_body'>
            
          </div>
        </div>
      </div>
    </div> */}
  </div>
  );
};

export default SideBarMenu;