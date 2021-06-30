import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import SideBarMenuMain from './Component/Menu/SideBarMenu/SideBarMenuMain';
import TabList from './Component/Menu/tabMenu/TabList';
import WindowFrame from './Program/WindowFrame';

import './Home.css';
import {getSessionCookie} from "./Cookies";
import { gfs_injectAsyncReducer } from './Method/Store';

import GifPlayer from 'react-gif-player';
import LoadingOverlay from 'react-loading-overlay';

let isSession = false;

const Home = (props) => {  
  useEffect(e => {
    const MASK_REDUCER = (nowState, action) => {
      if(action.reducer !== 'MASK_REDUCER') {
        return {
          MASK : nowState === undefined ? false : nowState.MASK
        };
      }
      
      if(action.type === 'MASK'){

        return Object.assign({}, nowState, {
          MASK : action.MASK
        })
      }
    }

    gfs_injectAsyncReducer('MASK_REDUCER', MASK_REDUCER);
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
      spinner={<GifPlayer height='100' width='100' gif={require('../src/Image/waitImage.gif').default} autoplay/>}
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