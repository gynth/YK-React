import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { TOKEN, MILESTONE, MILESTONE_LIVE } from '../../../WebReq/WebReq';
import Modal from 'react-modal';
import { gfs_dispatch } from '../../../Method/Store';
import RecTimer from './RecTimer';
import { throttle } from 'lodash';

function RecImageDtl(props) {
  const imageRef = useRef();
  let token = '';
  let device = '';

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

    const milestone = await TOKEN({});
    token  = milestone.data.TOKEN;
    device = milestone.data.DEVICE.find(e => e.Name.indexOf(ip) >= 0);
    
    if(device === undefined){
      console.log('IP가 잘못되었거나 마일스톤 설정이 잘못되었습니다. ' + ip);
  
      return;
    }else{
      device = device['Guid'];
    }

    if(token !== ''){
      MILESTONE({reqAddr: 'CONNECT',
                 token,
                 device,
                 ip})

      console.log(token, device);
    }
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
    start(props.ip);
    onStreaming();
  // eslint-disable-next-line react-hooks/exhaustive-deps
    // imageRef.current.subscribeToStateChange(this.handleStateChange.bind(this));
  }, [])

  const onStreaming = () => {
    setInterval((e) => {
      MILESTONE_LIVE({
        device
      }).then(e => {
        // console.log('1');
        // const JPEG = e.data.liveImg.data;
        // const JPEG = 'data:image/JPEG;base64,' + _arrayBufferToBase64(e.data.liveImg.data);
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
      })
    }, 50);
  }

  const debounceOnClick = throttle((e, ptz) => {
    TOKEN({}).then(e => {
      const device = e.data.DEVICE.find(e => e.Name.indexOf(props.ip) >= 0);

      MILESTONE({reqAddr: 'PTZ',
      device: device.Guid,
      ptz})
    })

  }, 1000);

  const onClick = (e, ptz) => {
    e.stopPropagation();
    debounceOnClick(e, ptz);
  }

  // const onMouseWheel = (e) => {
  //   e.stopPropagation();

  //   const STD_CAM_FOCUS = gfs_getStoreValue('INSP_PROC_MAIN', 'STD_CAM_FOCUS');
  //   const DUM_CAM_FOCUS = gfs_getStoreValue('INSP_PROC_MAIN', 'DUM_CAM_FOCUS');
    
  //   if(STD_CAM_FOCUS || DUM_CAM_FOCUS){
  //     this.debounceMouseWheel(e, STD_CAM_FOCUS ? this.device[0] : this.device[1]);
  //   }
  // }

  const img = <>
                <div style={{position:'absolute'}}>
                  <RecTimer rec={props.rec} car={props.car} />
                </div>
                <img style={{height:'100%', width:'100%'}} alt='yk_image' 
                    ref={imageRef}
                    onDoubleClick={e => {
                      // let obj = {};
                      // obj[props.focus] = false; 
                      // gfs_dispatch('INSP_PROC_MAIN', props.focus, obj);

                      setModalIsOpen(true);
                    }}>
                </img>
                <div className='picture_save'>
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