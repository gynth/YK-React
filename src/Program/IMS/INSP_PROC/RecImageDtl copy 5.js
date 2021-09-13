import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MILESTONE, RTSP } from '../../../WebReq/WebReq';
import Modal from 'react-modal';
import { gfs_dispatch } from '../../../Method/Store';
import { gfc_showMask, gfc_sleep, gfc_hideMask, gfc_screenshot_srv_from_milestone } from '../../../Method/Comm';
import axios from 'axios';

const jsmpeg = require('jsmpeg');

function RecImageDtl(props) {
  const imageRef = useRef();

  const isOpen = useSelector((e) => {
    return e.INSP_PROC_MAIN[props.cam];
  }, (p, n) => {
    return p === n;
  });

  const [port, setPort] = useState(0);
  
  const setModalIsOpen = (open) => {
    
    let obj = {};
    obj[props.cam] = open;

    gfs_dispatch('INSP_PROC_MAIN', props.cam, obj);
  }

  const start = async() => {
      MILESTONE({reqAddr: 'CONNECT',
                 device : props.device})
  }

  const getPort = async() => {
    const host = `http://10.10.10.136:3000/getEmptyPort`;
    const option = {
      url   : host,
      method: 'POST',
      // headers: {
      //   'Access-Control-Allow-Origin': '*'
      // },
      data: {
        device : props.device,
        MAX_CONNECTION: props.maxCon,
        START_PORT: props.startPort
      }
    };
  
    await gfc_sleep(500);

    const result = await axios(option);
    setPort(result.data.port);
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

  var client = null;
  var canvas = null;
  const setRtsp = () => {

    client = new WebSocket(`ws://10.10.10.136:${port}`);
    canvas = imageRef.current;
    new jsmpeg(client, {
      canvas 
    });
  }

  useEffect(() => {
    start();
  }, [])

  useEffect(() => { 
    if(port === 0)
      getPort();

    if(port === 'Connection Full'){
      alert(`${props.cameraNam} 카메라의 최대접속 유저가 초과되었습니다.`);
      return;
    }

    if(port === 0){
      return;
    }

    RTSP({reqAddr: 'RTSPStart',
          device   : props.device,
          streamUrl: `rtsp://admin:admin@10.10.10.136:554/live/${props.device}`,
          port: port,
          width: 1920,
          height: 1080,
          fps: 24
        }).then(e => {
          if(e.data === 'OK'){
            setRtsp();
          }
        })

    return() => {
      setPort(0);
      client.close();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, port])

  // const debounceOnClick = throttle((e, ptz) => {
  //   TOKEN({}).then(e => {

  //     MILESTONE({reqAddr: 'PTZ',
  //     device: props.device,
  //     ptz})
  //   })

  // }, 1000);

  const debounceOnClick = (e, ptz) => {
    MILESTONE({reqAddr: 'PTZ',
    device: props.device,
    ptz})

  };

  const onClick = (e, ptz) => {
    e.stopPropagation();
    debounceOnClick(e, ptz);
  }

  const img = <>
                <canvas 
                  ref={imageRef} 
                  style={{width:'100%', height:'100%'}}
                  onDoubleClick={e => {
                    setModalIsOpen(true);
                  }}
                  
                />
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
                <div className="direction">
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
                </div>
                <div className={isOpen === true ? 'controller on' : 'controller'}>
                    <button type='' className='plus' onClick={e => {
                    e.stopPropagation();
                    onClick(e, 'zoomin')}}>확대</button>
                    <button type='' className='minus' onClick={e => {
                    e.stopPropagation();
                    onClick(e, 'zoomout')}}>축소</button>
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