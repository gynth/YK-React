import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import SideBarMenuMain from './Component/Menu/SideBarMenu/SideBarMenuMain';
import TabList from './Component/Menu/tabMenu/TabList';
import WindowFrame from './Program/WindowFrame';
import { getDynamicSql_Oracle } from './db/Oracle/Oracle';
import './Home.css';
import { getSessionCookie, setSessionCookie } from './Cookies';
import { gfs_injectAsyncReducer, gfs_WINDOWFRAME_REDUCER, gfs_dispatch, gfs_PGM_REDUCER, gfs_getStoreValue } from './Method/Store';
import { gfc_sleep, gfc_set_oracle_column } from './Method/Comm';

import GifPlayer from 'react-gif-player';
import LoadingOverlay from 'react-loading-overlay';

let isSession = false;

const defaultData = async(user_id, areaTp) => {

  const userReducer = (nowState, action) => {
    if(action.reducer !== 'USER_REDUCER') {
      return {
        COP_CD    : nowState === undefined ? '' : nowState.COP_CD,
        USER_ID   : nowState === undefined ? '' : nowState.USER_ID,
        USER_NAM  : nowState === undefined ? '' : nowState.USER_NAM,
        DEPT_NAM  : nowState === undefined ? '' : nowState.DEPT_NAM,
        YMD_FORMAT: nowState === undefined ? '' : nowState.YMD_FORMAT,
        YM_FORMAT : nowState === undefined ? '' : nowState.YM_FORMAT,
        NUM_FORMAT: nowState === undefined ? '' : nowState.NUM_FORMAT,
        NUM_ROUND : nowState === undefined ? '' : nowState.NUM_ROUND,
        ERP_ID    : nowState === undefined ? '' : nowState.ERP_ID,
        AREA_TP   : nowState === undefined ? '' : nowState.AREA_TP,
        AUTH      : nowState === undefined ? {} : nowState.AUTH,
        CAMERA_NO : nowState === undefined ? '' : nowState.CAMERA_NO
      };
    }

    if(action.type === 'USER'){
      return Object.assign({}, nowState, {
        COP_CD     : action.COP_CD,
        USER_ID    : action.USER_ID,
        USER_NAM   : action.USER_NAM,
        DEPT_NAM   : action.DEPT_NAM,
        YMD_FORMAT : action.YMD_FORMAT,
        YM_FORMAT  : action.YM_FORMAT,
        NUM_FORMAT : action.NUM_FORMAT,
        NUM_ROUND  : action.NUM_ROUND,
        ERP_ID     : action.ERP_ID,
        AREA_TP    : action.AREA_TP,
        AUTH       : nowState.AUTH,
        CAMERA_NO  : action.CAMERA_NO
      });
    }else if(action.type === 'AUTH'){
      return Object.assign({}, nowState, {
        COP_CD     : nowState.COP_CD,
        USER_ID    : nowState.USER_ID,
        USER_NAM   : nowState.USER_NAM,
        DEPT_NAM   : nowState.DEPT_NAM,
        YMD_FORMAT : nowState.YMD_FORMAT,
        YM_FORMAT  : nowState.YM_FORMAT,
        NUM_FORMAT : nowState.NUM_FORMAT,
        NUM_ROUND  : nowState.NUM_ROUND,
        ERP_ID     : nowState.ERP_ID,
        AREA_TP    : nowState.AREA_TP,
        AUTH       : action.AUTH,
        CAMERA_NO  : nowState.CAMERA_NO
      });
    }
  };

  gfs_injectAsyncReducer('USER_REDUCER', userReducer);

  let result = await getDynamicSql_Oracle(
    'Common/Common',
    'LOGIN_SESSION',
    [{user_id}]
  ); 

  let data = gfc_set_oracle_column(result);

  gfs_dispatch('USER_REDUCER', 'USER', {
    COP_CD    : '10',
    USER_ID   : data[0].USER_ID,
    USER_NAM  : data[0].USER_NAM,
    DEPT_NAM  : data[0].DEPT_NAM,
    YMD_FORMAT: 'yyyy-MM-DD',
    YM_FORMAT : 'yyyy-MM',
    NUM_FORMAT: '0,0',
    NUM_ROUND : '2R',
    ERP_ID    : data[0].ERP_ID,
    AREA_TP   : (areaTp === '' || areaTp === null || areaTp === 'null') ? data[0].AREA_TP : areaTp,
    AUTH      : {},
    CAMERA_NO : data[0].CAMERA_NO
  });

  let result2 = await getDynamicSql_Oracle(
    'Common/Common',
    'AUTH_TOTAL',
    [{COP_CD: '10',
      user_id
    }]
  ); 

  let data2 = gfc_set_oracle_column(result2);
  gfs_dispatch('USER_REDUCER', 'AUTH', {
    AUTH      : data2
  });

  defaultOpen();//김경현
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
  
    const auth = gfs_getStoreValue('USER_REDUCER', 'AUTH');
    if(auth.length === undefined || auth.length === 0) return;

    const inspProc = auth.find(e => e.MENU_ID === 'INSP_PROC');
    if(inspProc !== null){
      if(inspProc.PGMAUT_YN === 'Y'){
        //검수대기 Open
        gfs_PGM_REDUCER('INSP_PROC');
        gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
        ({
          windowZindex: 0,
          activeWindow: {programId: 'INSP_PROC',
                          programNam: '검수진행'
                        }
        }));
      }
    }

    await gfc_sleep(500);

    const inspHist = auth.find(e => e.MENU_ID === 'INSP_HIST');
    if(inspHist !== null){
      if(inspHist.PGMAUT_YN === 'Y'){
        //검수이력 Open
        gfs_PGM_REDUCER('INSP_HIST');
        gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
        ({
          windowZindex: 1,
          activeWindow: {programId: 'INSP_HIST',
                          programNam: '검수이력'
                        }
        }));
      }
    }

    await gfc_sleep(500);

    const dispProc = auth.find(e => e.MENU_ID === 'DISP_PROC');
    if(dispProc !== null){
      if(dispProc.PGMAUT_YN === 'Y'){
        //출차대기 Open
        gfs_PGM_REDUCER('DISP_PROC');
        gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
        ({
          windowZindex: 2,
          activeWindow: {programId: 'DISP_PROC',
                          programNam: '출차대기'
                        }
        }));
      }
    }

    await gfc_sleep(500);

    const entrProc = auth.find(e => e.MENU_ID === 'ENTR_PROC');
    if(entrProc !== null){
      if(entrProc.PGMAUT_YN === 'Y'){
        //입차대기 Open
        gfs_PGM_REDUCER('ENTR_PROC');
        gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
        ({
          windowZindex: 3,
          activeWindow: {programId: 'ENTR_PROC',
                          programNam: '입차대기'
                        }
        }));
      }
    }

    await gfc_sleep(500);

    if(inspProc !== null){
      if(inspProc.PGMAUT_YN === 'Y'){

        gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
        ({
          windowZindex: 0,
          activeWindow: {programId: 'INSP_PROC',
                          programNam: '검수진행'
                        }
        }));
      }
    }
}

const Home = (props) => {
  const user_id = getSessionCookie('login');
  const areaTp = getSessionCookie('areaTp');

  // const session = getSessionCookie('session');
  // if (session === 'SUCCESS')
  // {
    // isSession = true;
  // }
  
  useEffect(e => {

    if(user_id === ''){
      alert('로그인부터 해주세요.');
      window.location.replace('http://ims.yksteel.co.kr:90');
      // window.location.replace('http://localhost:4000');
      return;
    }

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

    defaultData(user_id, areaTp);


    // return() => {
    //   setSessionCookie('login', '');
    //   console.log('Tmy')
    // }
  }, [])

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
        
    </LoadingOverlay>
  );
};

export default Home;