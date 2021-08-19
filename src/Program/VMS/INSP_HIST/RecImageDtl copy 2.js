import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { TOKEN, MILESTONE, MILESTONE_LIVE } from '../../../WebReq/WebReq';
import Modal from 'react-modal';
import { gfs_dispatch, gfs_getStoreValue } from '../../../Method/Store';
import { gfc_addClass, gfc_removeClass, gfc_hasClass } from '../../../Method/Comm';
import { gfc_showMask, gfc_hideMask, gfc_screenshot_srv_from_milestone } from '../../../Method/Comm';

function RecImageDtl(props) {
  
  const movieRef = useRef();
  const prgRef = useRef();

  const handleDuration = (duration) => {
    prgRef.current.max = duration;
  }
  const handleSeekMouseDown = e => {
    // prgRef.current.dataset.seeking = 'true';
  }
  const handleSeekMouseUp = e => {
    // const value = prgRef.current.value;
    
    // movieRef.current.seekTo(5);
    // prgRef.current.dataset.seeking = 'false';

    const aa = movieRef.current.currentTime;
    movieRef.current.currentTime += 0.5;
    console.log(movieRef.current.currentTime);
  }
  const handleSeekChange = e => {
    // this.setState({ played: parseFloat(e.target.value) })
    // movieRef.current.currentTime += 0.5;
  }
  const  handleProgress = state => {
    // // We only want to update time slider if we are not currently seeking
    // if (!state.seeking) {
    //   setState(e)
    // }
    // console.log(state);
    
    // if(prgRef.current.dataset.seeking === 'false')
    //   prgRef.current.value = state.playedSeconds;
  }

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
  
  const playToggle = (_play) => {
    var menu = document.getElementById(_play);
    if(gfc_hasClass(menu,'play')){
      gfc_removeClass(menu,'play')
    }else{
      gfc_addClass(menu,'play')
    }
  }

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

  useEffect(() => { 
    if(value !== ''){
      gfc_showMask();

      // movieRef.current.get(0).stop();
      // movieRef.current.get(0).stop();
      movieRef.current.src = '';

      MILESTONE({
        reqAddr : 'Replay',
        device  : props.device,
        scaleNo : value,
        cameraName: props.Name}).then(e => {
          if(e.data === '0'){
            var req = new XMLHttpRequest();
            req.open('GET', `http://211.231.136.182:3003/${value}.mkv?scaleNumb=${value}&cameraName=${props.Name}`, true);
            req.responseType = 'blob';
        
            req.onload = function() {
              // Onload is triggered even on 404
              // so we need to check the status code
              if (this.status === 200) {
                  var videoBlob = this.response;
                  var vid = URL.createObjectURL(videoBlob); // IE10+
                  // Video is now downloaded
                  // and we can set it as source on the video element
                  movieRef.current.src = vid;
              }
            }
            req.onerror = function() {
              gfc_hideMask();
            }
        
            req.send();
          }else{
            gfc_hideMask();
          }
        })
    }
  }, [props.device, props.Name, value])

  const img = <>
                <div style={{width:'100%', height:'100%'}}>
                  <video 
                    ref={movieRef} 
                    width='100%' 
                    height='100%' 
                    autoPlay 

                    onPlaying={e => {
                      gfc_hideMask();
                    }}
                    
                    onSeekingCapture={e => console.log(e)}

                    style={{objectFit:'fill'}}>
                    <source type='video/mp4' />
                  </video> 
                </div>
                <div className='viewer_range'>
                  <div className='wp'>
                    <button type='button' id='play1' className='play' onClick={() => playToggle('play1')}></button>
                    <span className='time'>0:00 / 3:00 </span>
                    <button type='button' className='download'></button>
                  </div>
                  <input  type='range' defaultValue={0} className='cctv_gauge'/> 
                </div>
                <div className='picture_save' onClick={e => {
                  
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
                </div>
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