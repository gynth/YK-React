import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { TOKEN, MILESTONE, MILESTONE_LIVE } from '../../../WebReq/WebReq';
import Modal from 'react-modal';
import { gfs_dispatch } from '../../../Method/Store';
import RecTimer from './RecTimer';
import { throttle } from 'lodash';
import { gfc_showMask, gfc_hideMask, gfc_screenshot_srv_from_milestone } from '../../../Method/Comm';

function RecImageDtl(props) {
  const imageRef = useRef();

  const isOpen = useSelector((e) => {
    return e.INSP_PROC_MAIN[props.cam];
  }, (p, n) => {
    return p === n;
  });

  const setModalIsOpen = (open) => {
    let obj = {};
    obj[props.cam] = open;

    gfs_dispatch('INSP_PROC_MAIN', props.cam, obj);
  }

  const start = async(ip) => {

      MILESTONE({reqAddr: 'CONNECT',
                 device : props.device})
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
    var jsmpeg = require('jsmpeg');
    var client = new WebSocket('ws://211.231.136.182:3100');
    var canvas = document.querySelector('canvas');
    new jsmpeg(client, {
      canvas 
    });


    // start(props.ip);
    // onStreaming();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onStreaming = () => {
    setInterval((e) => {
      MILESTONE_LIVE({
        device: props.device
      }).then(e => {
        // console.log('1');
        // const JPEG = e.data.liveImg.data;
        // const JPEG = 'data:image/JPEG;base64,' + _arrayBufferToBase64(e.data.liveImg.data);
        try{
          const JPEG = e.data;
          // setImage(JPEG);
          // imageRef.current.src = JPEG;
  
          if(JPEG !== undefined && JPEG !== ''){
            if(imageRef.current !== undefined){
              // setImage(JPEG);
              imageRef.current.src = JPEG;
              // let obj = {};
              // obj[props.image] = JPEG;
    
              // gfs_dispatch('INSP_PROC_MAIN', props.image, obj);
            }
          }
        }catch (e){
          
        }
      })
    }, 80);
  }

  const debounceOnClick = throttle((e, ptz) => {
    TOKEN({}).then(e => {

      MILESTONE({reqAddr: 'PTZ',
      device: props.device,
      ptz})
    })

  }, 1000);

  const onClick = (e, ptz) => {
    e.stopPropagation();
    debounceOnClick(e, ptz);
  }

  const img = <>
                <div style={{position:'absolute'}}>
                  <RecTimer device={props.device} rec={props.rec} car={props.car} />
                </div>
                {/* rtsp://admin:admin13579@10.10.136.112:554/video1+audio1  */}

                <canvas id='canvas' style={{width:'100%', height:'100%'}}/>

                {/* <img style={{height:'100%', width:'100%'}} alt='yk_image' 
                    ref={imageRef}
                    onDoubleClick={e => {
                      setModalIsOpen(true);
                    }}>
                </img> */}
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
                  {/* <a href='#!' className='server'></a> */}
                </div>
                <div className={isOpen === true ? 'controller on' : 'controller'}>
                  <button type='' className='left' onClick={e => {
                    e.stopPropagation();
                    onClick(e, 'left')}}>왼쪽</button>
                  <button type='' className='top' onClick={e => {
                    e.stopPropagation();
                    onClick(e, 'up')}}>위쪽</button>
                  <button type='' className='down' onClick={e => {
                    e.stopPropagation();
                    onClick(e, 'down')}}>아래</button>
                  <button type='' className='right' onClick={e => {
                    e.stopPropagation();
                    onClick(e, 'right')}}>오른쪽</button>
                  <span className='sep'>
                    <button type='' className='plus' onClick={e => {
                    e.stopPropagation();
                    onClick(e, 'zoomin')}}>확대</button>
                    <button type='' className='minus' onClick={e => {
                    e.stopPropagation();
                    onClick(e, 'zoomout')}}>축소</button>
                  </span>
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