import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import SideBarMenuMain from './Component/Menu/SideBarMenu/SideBarMenuMain';
import TabList from './Component/Menu/tabMenu/TabList';
import WindowFrame from './Program/WindowFrame';

import './Home.css';
import { getSessionCookie } from "./Cookies";
import { gfs_injectAsyncReducer, gfs_WINDOWFRAME_REDUCER, gfs_dispatch, gfs_PGM_REDUCER } from './Method/Store';
import { gfc_sleep } from './Method/Comm';

import GifPlayer from 'react-gif-player';
import LoadingOverlay from 'react-loading-overlay';

let isSession = false;

const defaultData = async() => {
  const userReducer = (nowState, action) => {
    if(action.reducer !== 'USER_REDUCER') {
      return {
        COP_CD    : nowState === undefined ? ''           : nowState.COP_CD,
        USER_ID   : nowState === undefined ? '1989'       : nowState.USER_ID,
        USER_NAM  : nowState === undefined ? '김경현'      : nowState.USER_NAM,
        LANGUAGE  : nowState === undefined ? 'KOR'        : nowState.LANGUAGE,
        YMD_FORMAT: nowState === undefined ? 'yyyy-MM-DD' : nowState.YMD_FORMAT,
        // YMD_FORMAT: nowState === undefined ? 'MM-DD-yyyy' : nowState.YMD_FORMAT,
        YM_FORMAT : nowState === undefined ? 'yyyy-MM'    : nowState.YM_FORMAT,
        NUM_FORMAT: nowState === undefined ? '0,0'        : nowState.NUM_FORMAT,
        NUM_ROUND : nowState === undefined ? '2R'         : nowState.NUM_ROUND
      };
    }

    if(action.type === 'USERID_FOCUS'){
      return Object.assign({}, nowState, {
        userIdFocus  : action.userIdFocus
      });
    }else if(action.type === 'PWD_FOCUS'){
      return Object.assign({}, nowState, {
        pwdFocus  : action.pwdFocus
      });
    }else if(action.type === 'USERID_CHANGE'){
      return Object.assign({}, nowState, {
        userIdText   : action.userIdText
      });
    }else if(action.type === 'PWD_CHANGE'){
      return Object.assign({}, nowState, {
        pwdText   : action.pwdText
      });
    }
  };

  gfs_injectAsyncReducer('USER_REDUCER', userReducer);
}

const onActiveWindow = (e) => {
  if(document.visibilityState === 'visible'){
    gfs_dispatch('MASK_REDUCER', 'ON_ACTIVE', {
      active : true,
      time   : new Date()
    });
  }else{
    gfs_dispatch('MASK_REDUCER', 'ON_ACTIVE', {
      active : false,
      time   : new Date()
    });
  }
}

const defaultOpen = async() => {

    // //검수대기 Open
    // gfs_PGM_REDUCER('INSP_PROC');
    // gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
    // ({
    //   windowZindex: 0,
    //   activeWindow: {programId: 'INSP_PROC',
    //                   programNam: '검수진행'
    //                 }
    // }));

    // await gfc_sleep(20);

    // //검수이력 Open
    // gfs_PGM_REDUCER('INSP_HIST');
    // gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
    // ({
    //   windowZindex: 1,
    //   activeWindow: {programId: 'INSP_HIST',
    //                   programNam: '검수이력'
    //                 }
    // }));

    // await gfc_sleep(20);

    // //출차대기 Open
    // gfs_PGM_REDUCER('DISP_PROC');
    // gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
    // ({
    //   windowZindex: 2,
    //   activeWindow: {programId: 'DISP_PROC',
    //                   programNam: '출차대기'
    //                 }
    // }));

    // await gfc_sleep(20);

    // //입차대기 Open
    // gfs_PGM_REDUCER('ENTR_PROC');
    // gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
    // ({
    //   windowZindex: 3,
    //   activeWindow: {programId: 'ENTR_PROC',
    //                   programNam: '입차대기'
    //                 }
    // }));

    // await gfc_sleep(20);

    // gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
    // ({
    //   windowZindex: 0,
    //   activeWindow: {programId: 'INSP_PROC',
    //                   programNam: '검수진행'
    //                 }
    // }));
}

const Home = (props) => {  
  useEffect(e => {
    const MASK_REDUCER = (nowState, action) => {
      if(action.reducer !== 'MASK_REDUCER') {
        return {
          MASK     : nowState === undefined ? false : nowState.MASK,
          ON_ACTIVE: nowState === undefined ? {
            active : true,
            time   : new Date() 
          } : nowState.ON_ACTIVE,
        };
      }
      
      if(action.type === 'ON_ACTIVE'){

        return Object.assign({}, nowState, {
          ON_ACTIVE : {
            active: action.active,
            time  : action.time
          }
        })
      }else if(action.type === 'MASK'){

        return Object.assign({}, nowState, {
          MASK : action.MASK
        })
      }
    }

    gfs_injectAsyncReducer('MASK_REDUCER', MASK_REDUCER);
    document.onvisibilitychange = e => onActiveWindow(e);

    //#region 윈도우 리듀서 생성
    gfs_WINDOWFRAME_REDUCER();
    //#endregion

    defaultData();

    //화면Open
    defaultOpen();
  }, [])

  const session = getSessionCookie("session");
  const leftWindow = useSelector((e) => e.SIDEBARMENU_REDUCER.State, (p, n) => {
    return p.open === n.open;
  });

  const MASK = useSelector((e) => {
    if(e.MASK_REDUCER !== undefined){
      return e.MASK_REDUCER.MASK;
    }else{
      return false;
    }
  }, (p, n) => {
    return p === n;
  });

  const windowState = useSelector((e) => {
    if(e.WINDOWFRAME_REDUCER === undefined) {
      return null;
    }else{
      return e.WINDOWFRAME_REDUCER.windowState
    }
  }, (p, n) => {
    return (p === null ? 0 : p.length) === (n === null ? 0 : n.length)
  });

  // const SideBarMenuState = useSelector((e) => e.SIDEBARMENU_REDUCER.State, (p, n) => {
  //   return JSON.stringify(p) === JSON.stringify(n);
  // });

  // const width = SideBarMenuState[0].width;

  let width = 343; 
  if(leftWindow.open) width = 90;
  // if (session === "SUCCESS")
  // {
    isSession = true;
  // }
  return (
    
    <LoadingOverlay
      active={MASK}
      spinner={<GifPlayer height='100' width='100' gif={require('../src/Image/waitImage.gif').default} autoplay={MASK ? true : false}/>}
      styles={{
        overlay: (base) => ({
          ...base,
          background: 'transparent'
        })
      }}
    >
      <React.Fragment>      
        {isSession ?
        <>

          <div style={{display:'inline-block', height:'100%'}} >
            <SideBarMenuMain />
          </div>
          
          <div style={{display:'inline-block', paddingRight:'17px', transition:'all 0.2s ease-in-out', position:'absolute', left:width, right:0, height:'100%'}}>
            <div style={{display:'flex', flexDirection:'column', height:'100vh'}}>
              <div style={{height:80}}>
                <TabList />
              </div>
              <div style={{flex:1, display:'flex'}}> 
                <div style={{float:'left', width:'100%', position:'relative', zIndex:0, overflow:'hidden'}}>
                  {windowState != null &&
                    windowState.map(e => 
                      <WindowFrame key={e.programId} programId={e.programId} programNam={e.programNam}/>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </>
        :
          <div>LOGIN PLZZZ</div>
        }
        
      </React.Fragment>
    </LoadingOverlay>
  );
};

export default Home;