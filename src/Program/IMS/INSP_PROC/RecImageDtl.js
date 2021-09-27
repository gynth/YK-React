import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MILESTONE, RTSP } from '../../../WebReq/WebReq';
import Modal from 'react-modal';
import { Rnd } from 'react-rnd';
import { gfs_dispatch, gfs_getStoreValue, gfs_injectAsyncReducer } from '../../../Method/Store';
import { gfc_showMask, gfc_sleep, gfc_hideMask, gfc_screenshot_srv_from_milestone } from '../../../Method/Comm';

const jsmpeg = require('jsmpeg');

function RecImageDtl(props) {
  const imageRef = useRef();
  const dragRef = useRef();

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

  const start = async() => {
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

  let client = null;
  let canvas = null;
  const setRtsp = () => {
    client = new WebSocket(`ws://ims.yksteel.co.kr:90/ws/${props.cameraPort}`);
    canvas = imageRef.current;
    new jsmpeg(client, {
      canvas 
    });
  }

  useEffect(() => {
    start();

    if(props.seq > 2){
      const dragReducer = (nowState, action) => {
        if(action.reducer !== 'INSP_PROC_MAIN_DRAG') {
          return {
            CLICK: nowState === undefined ? false :nowState.CLICK
          }
        }

        if(action.type === 'ONMOUSEDOWN'){

          return Object.assign({}, nowState, {
            CLICK : action.CLICK
          })
        }
      }

      gfs_injectAsyncReducer('INSP_PROC_MAIN_DRAG', dragReducer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { 

    RTSP({reqAddr: 'RTSPStart',
          device   : props.device, 
          // streamUrl: `rtsp://admin:admin@10.10.10.136:554/live/${props.device}`,
          streamUrl: props.rtspAddr,
          port: props.cameraPort,
          width: 1920,
          height: 1080,
          fps: 24
        }).then(e => {
          if(e.data === 'OK'){
            setRtsp();
          }
        })

    return() => {
      client.close();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, props.rtspAddr])

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
                {(props.seq < 3 || isOpen === true)?
                  <>
                    <canvas 
                      data-seq={props.seq}
                      ref={imageRef} 
                      style={{
                        width:'100%', 
                        height:'100%'
                      }}
                      onDoubleClick={e => {
                        setModalIsOpen(true);
                      }}
                    />
                    <div className='picture_save' onClick={e => {
                      const scaleNumb = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_SCALE');
                      if(scaleNumb === '' || scaleNumb === undefined || scaleNumb === null){
                        alert('선택된 계근번호가 없습니다.');
                        return;
                      }

                      gfc_showMask();

                      gfc_screenshot_srv_from_milestone(props.device, scaleNumb).then(
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
                      <button 
                        type='' 
                        className='left' 
                        onClick={e => {
                          e.stopPropagation();
                          onClick(e, 'left')}}>왼쪽
                      </button>
                      <button 
                        type='' 
                        className='top' 
                        onClick={e => {
                          e.stopPropagation();
                          onClick(e, 'up')}}>위쪽
                      </button>
                      <button 
                        type='' 
                        className='down' 
                        onClick={e => {
                          e.stopPropagation();
                          onClick(e, 'down')}}>아래
                      </button>
                      <button 
                        type='' 
                        className='right' 
                        onClick={e => {
                          e.stopPropagation();
                          onClick(e, 'right')}}>오른쪽
                      </button>
                    </div>
                    <div className={isOpen === true ? 'controller on' : 'controller'}>
                      <button type='' className='plus' onClick={e => {
                        e.stopPropagation();
                        onClick(e, 'zoomin')}}>확대</button>
                      <button type='' className='minus' onClick={e => {
                        e.stopPropagation();
                        onClick(e, 'zoomout')}}>축소</button>
                    </div>
                  </>

                  :
                  
                  <div
                  >
                    <Rnd
                      ref={dragRef}
                      default={{
                        x: 0,
                        y: 0,
                        width: '100%',
                        height: '100%'
                      }}
                      style={{
                        // zIndex: 100,
                        overflow:'hidden'
                      }}
                      onDragStop={(e, data) => {
                        dragRef.current.updatePosition({x:0, y:0});
                      }}
                    >
                      <canvas 
                        ref={imageRef} 
                        style={{
                          width:'100%', 
                          height:'100%',
                          overflow:'hidden'
                        }}
                        onDoubleClick={e => {
                          setModalIsOpen(true);
                        }}
                        data-seq={props.seq}
                        onMouseOver={e => e.stopPropagation()}
                        onMouseDown={async e => {
                          // e.stopPropagation();
                          await gfc_sleep(50);
                          gfs_dispatch('INSP_PROC_MAIN_DRAG', 'ONMOUSEDOWN', {CLICK: false});
                        }}
                        onMouseUp={async e => {
                          // e.stopPropagation();
                          await gfc_sleep(50);
                          gfs_dispatch('INSP_PROC_MAIN_DRAG', 'ONMOUSEDOWN', {CLICK: true});
                        }}
                      />
                    </Rnd>
                  </div>
                }
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