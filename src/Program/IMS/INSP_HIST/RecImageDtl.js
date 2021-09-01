import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import { gfs_dispatch, gfs_subscribe, gfs_getStoreValue } from '../../../Method/Store';
import { gfc_showMask, gfc_hideMask } from '../../../Method/Comm';
import axios from 'axios';
import ReactHlsPlayer from 'react-hls-player';

function RecImageDtl(props) {
  
  const movieRef = useRef();
  // const prgRef = useRef();
  // const timeRef = useRef();
  // const btnRef = useRef();

  // let isSeek = false;

  const isOpen = useSelector((e) => {
    return e.INSP_HIST_MAIN[props.cam];
  }, (p, n) => {
    return p === n;
  });

  const value = useSelector((e) => {
    return e.INSP_HIST_MAIN.GRID_SCALE;
  }, (p, n) => {
    return p === n;
  });

  // const isActive = useSelector((e) => {
  //   return e.INSP_HIST_MAIN['ON_ACTIVE'];
  // }, (p, n) => {
  //   return p.active === n.active;
  // });

  // const activeWindow = useSelector((e) => {
  //   return e.WINDOWFRAME_REDUCER.activeWindow;
  // }, (p, n) => {
  //   return p.programId === n.programId;
  // });

  const movieDown = () => {
    gfc_showMask();
    const host = `http://10.10.10.136:3003/`;
    const option = {
      url   : host,
      method: 'POST',
      // headers: {
      //   'Access-Control-Allow-Origin': '*'
      // },
      data: {
        scaleNumb: value,
        Name     : props.Name
      },
      responseType: 'blob'
    };
  
    axios(option)
      .then(res => {
        gfc_hideMask();
        const url = window.URL
              .createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${value}.mp4`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(err => {
        gfc_hideMask();
        console.log(err);
      })
  }
  
  // const playToggle = (_play) => {
  //   var menu = document.getElementById(_play);
  //   if(gfc_hasClass(menu,'play')){
  //     gfc_removeClass(menu,'play')
  //     movieRef.current.player.player.play();
  //   }else{
  //     gfc_addClass(menu,'play');
  //     movieRef.current.player.player.pause();
  //   }
  // }

  // if(activeWindow.programId === 'INSP_HIST'){
  //   window.onkeydown = e => onKeyDown(e);
  // //   if(window.onkeydown === null){
  // //     window.onkeydown = e => onKeyDown(e);
  // //   }
  // // }else{
  // //   if(window.onkeydown !== null){
  // //     window.onkeydown = null;
  // //   }
  // }

  // const onKeyDown = (e) => {
  //   e.stopPropagation();

  //   const STD_CAM_FOCUS = gfs_getStoreValue('INSP_HIST_MAIN', 'STD_CAM_FOCUS');
  //   const DUM_CAM_FOCUS = gfs_getStoreValue('INSP_HIST_MAIN', 'DUM_CAM_FOCUS');
    
  //   if(STD_CAM_FOCUS || DUM_CAM_FOCUS){
  //     debounceKeyDown(e, STD_CAM_FOCUS ? 'STD_CAM_FOCUS' : 'DUM_CAM_FOCUS');
  //   }
  // }
  
  // const debounceKeyDown = throttle((e, owner) => {
  //   let move = '';
  //   if(e.keyCode === 37) move = 'left';
  //   else if(e.keyCode === 39) move = 'right';

  //   if(move !== ''){
  //     if(owner === props.focus){
  //       let curTime;
  //       if(move === 'left'){
  //         curTime = movieRef.current.getCurrentTime() - 5;
  //       }else{
  //         curTime = movieRef.current.getCurrentTime() + 5;
  //       }

  //       const loadedSeconds = movieRef.current.player.prevLoaded;

  //       const totalMin = gfc_lpad(parseInt((loadedSeconds%3600)/60), 2, '0');
  //       const totalSec = gfc_lpad(parseInt(loadedSeconds%60), 2, '0');

  //       const curMin = gfc_lpad(parseInt((curTime%3600)/60), 2, '0');
  //       const curSec = gfc_lpad(parseInt(curTime%60), 2, '0');

  //       timeRef.current.textContent = `${curMin}:${curSec} / ${totalMin}:${totalSec}`;

  //       movieRef.current.seekTo(curTime);
  //     }
  //   }
  // }, 300);

  const setModalIsOpen = (open) => {
    
    let obj = {};
    obj[props.cam] = open;

    gfs_dispatch('INSP_HIST_MAIN', props.cam, obj);
  }
  const style={
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    content: {
      position: 'absolute',
      top: '40px',
      left: '40px',
      right: '40px',
      bottom: '40px',
      height:'auto',
      // border: '1px solid #ccc',
      // background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      // padding: '20px'
    }
  };

  const [playUrl, setPlayUrl] = useState('');

  useEffect(() => { 
    if(value !== ''){
      setPlayUrl(`http://10.10.10.136:3003/${value}/${encodeURIComponent(props.Name)}/${value}.m3u8`);
    }
  }, [props.device, props.Name, value])

  const onActiveWindow = () => {
    const isActive = gfs_getStoreValue('MASK_REDUCER', 'ON_ACTIVE');
    const isPlay = movieRef.current.paused;

    if(isActive.active){
      if(isPlay === false){
        movieRef.current.play();
      }
    }else{
      if(isPlay){
        movieRef.current.pause();
      }
    }
  }
  useEffect(() => {
    gfs_subscribe(onActiveWindow);
  }, [])
 
  const img = <>
                <div 
                  style={{width:'100%', height:'100%'}} 
                  className='player-wrapper'>
                    <ReactHlsPlayer
                      playerRef={movieRef}
                      src={playUrl}
                      autoPlay={false}
                      controls={true}
                      width="100%"
                      height="100%"
                      muted="muted"
                      onLoadedData={e => e.target.play()}
                      hlsConfig={{
                        autoStartLoad: true,
                        startPosition: -1,
                        debug: false
                      }}
                    />



                  {/* <ReactPlayer 
                    ref={movieRef} 
                    className='react-player'
                    width='100%' 
                    height='100%' 
                    onKeyPress={e => console.log(e)}
                    
                    // controls
                    playing 
                    muted 
                    
                    url={playUrl} 

                    
                    onError={e => {
                      if(e.target.error.code === 3){
                        console.log(e.target);
                        const curTime = movieRef.current.getCurrentTime() + 1;
                        movieRef.current.seekTo(curTime);
                        e.target.play();
                      }else{
                        btnRef.current.style = 'display:none;';
                        gfc_hideMask();
                      }
                    }}

                    onDuration={e => {
                      btnRef.current.style = 'display:block;';
                      prgRef.current.max = e;
                    }}

                    onPlay={e => {
                      gfc_hideMask();
                    }}

                    onProgress={e => {
                      if(isSeek) return;

                      const totalMin = gfc_lpad(parseInt((e.loadedSeconds%3600)/60), 2, '0');
                      const totalSec = gfc_lpad(parseInt(e.loadedSeconds%60), 2, '0');

                      const curMin = gfc_lpad(parseInt((e.playedSeconds%3600)/60), 2, '0');
                      const curSec = gfc_lpad(parseInt(e.playedSeconds%60), 2, '0');

                      prgRef.current.value = e.playedSeconds;
                      timeRef.current.textContent = `${curMin}:${curSec} / ${totalMin}:${totalSec}`;
                    }}
                  />  */}
                </div>

                {/* <div className='viewer_range'>
                  <div className='wp'>
                    <button type='button' id='play1' onClick={() => playToggle('play1')}></button>
                    <span className='time' ref={timeRef}>00:00 / 00:00 </span>
                    <button 
                      ref={btnRef}
                      type='button' 
                      className='download' 
                      onClick={() => movieDown()}></button>
                  </div>
                  <input 
                    onMouseDown={e => isSeek = true}
                    onMouseUp={e => {
                      movieRef.current.seekTo(e.target.value);
                      isSeek = false;
                    }}
                    ref={prgRef} 
                    type='range' 
                    min={0} 
                    defaultValue={0} 
                    className='cctv_gauge'/> 
                </div> */}

                <div className='file_download' onClick={() => movieDown()}></div>
                {/* <div className='picture_save' onClick={e => {
                  
                   gfc_showMask();
                   gfc_screenshot_srv_from_milestone(props.device, 'TESTScaleNo').then(
                     e => {
                       gfc_hideMask();
                       if(e.data.Result !== 'OK'){
                         alert('파일저장에 실패 했습니다.');
                       } 
                     }
                   )
                }}>
                </div> */}
              </>;

  return (
    <>
      {isOpen === false ? img : 
        <Modal style={style}
              className='cctv'
              isOpen={isOpen} 
              onRequestClose={() => setModalIsOpen(false)} 
              ariaHideApp={false}>
              {img}
        </Modal>
      }
    </>
  );
}

export default RecImageDtl;