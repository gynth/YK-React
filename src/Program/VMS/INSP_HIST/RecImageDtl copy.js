import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { TOKEN, MILESTONE, MILESTONE_LIVE } from '../../../WebReq/WebReq';
import Modal from 'react-modal';
import { gfs_dispatch, gfs_getStoreValue } from '../../../Method/Store';
import { throttle } from 'lodash';
import { gfc_showMask, gfc_hideMask, gfc_screenshot_srv_from_milestone } from '../../../Method/Comm';
import ReactPlayer from 'react-player'

function RecImageDtl(props) {
  const movieRef = useRef();
  const prgRef = useRef();

  const handleDuration = (duration) => {
    prgRef.current.max = duration;
  }
  const handleSeekMouseDown = e => {
    prgRef.current.dataset.seeking = 'true';
  }
  const handleSeekMouseUp = e => {
    const value = prgRef.current.value;
    // movieRef.current.pau
    movieRef.current.seekTo(5);
    prgRef.current.dataset.seeking = 'false';

    console.log(movieRef.current);
  }
  const handleSeekChange = e => {
    // this.setState({ played: parseFloat(e.target.value) })
  }
  const  handleProgress = state => {
    // // We only want to update time slider if we are not currently seeking
    // if (!state.seeking) {
    //   setState(e)
    // }
    console.log(state);
    
    if(prgRef.current.dataset.seeking === 'false')
      prgRef.current.value = state.playedSeconds;
  }

  const isOpen = useSelector((e) => {
    return e.INSP_HIST_MAIN[props.cam];
  }, (p, n) => {
    return p === n;
  });

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
    return() => {

    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const img = <>
                <div style={{width:'100%', height:'100%'}}>
                  {/* <video controls autoPlay width='100%' height='100%'>
                    <source src='http://10.10.10.136:3003/1.mp4' type='video/mp4' />
                  </video> */}
                  <ReactPlayer ref={movieRef} 
                    width='100%' 
                    height='100%' 
                    url='http://10.10.10.136:3003/1.mp4'
                    
                    controls
                    playing 
                    muted
                    
                    onDuration={e => handleDuration(e)}
                    onProgress={e => handleProgress(e)}
                  />
                  <input ref={prgRef} data-seeking={false} style={{width:'100%'}} defaultValue={0}
                    type='range' min={0} step='any'
                    // value={played}
                    onMouseDown={e => handleSeekMouseDown(e)}
                    onChange={e => handleSeekChange(e)}
                    onMouseUp={e => handleSeekMouseUp(e)}
                  />
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