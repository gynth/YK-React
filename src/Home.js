import React from 'react';
import { useSelector } from 'react-redux';

import SideBarMenuMain from './Component/Menu/SideBarMenu/SideBarMenuMain';
import TabList from './Component/Menu/tabMenu/TabList';
import WindowFrame from './Program/WindowFrame';

import './Home.css';
import {getSessionCookie} from "./Cookies";
// import {ExampleApp} from './Component/Popup/TestPopup'

let isSession = false;

const Home = (props) => {  
  const session = getSessionCookie("session");
  const leftWindow = useSelector((e) => e.SIDEBARMENU_REDUCER.State, (p, n) => {
    return p.open === n.open;
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
  );
};

export default Home;