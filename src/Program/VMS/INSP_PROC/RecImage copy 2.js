import React from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import { gfs_dispatch } from '../../../Method/Store';
import RecTimer from './RecTimer';
import '../../../Program/WindowFrame.css';

function RecImage(props) {  
  const isOpen = useSelector((e) => {
    return e.INSP_PROC_MAIN[props.cam];
  }, (p, n) => {
    return p === n;
  });

  const isFocus = useSelector((e) => {
    return e.INSP_PROC_MAIN[props.focus];
  }, (p, n) => {
    return p === n;
  });

  const setModalIsOpen = (open) => {
    let obj = {};
    obj[props.cam] = open;

    gfs_dispatch('INSP_PROC_MAIN', props.cam, obj);
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
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      padding: '20px'
    }
  };

  // const img = <a href='#null' style={{pointerEvents:'none'}} 
  const img = <a href='#!' 
                              onFocus={e => {
                                if(!isOpen){
                                  let obj = {};
                                  obj[props.focus] = true;
                
                                  gfs_dispatch('INSP_PROC_MAIN', props.focus, obj);
                                }
                              }}
                              onBlur={e => {
                                if(!isOpen){
                                  let obj = {};
                                  obj[props.focus] = false; 
                                  gfs_dispatch('INSP_PROC_MAIN', props.focus, obj);
                                }
                              }}>
                <div className={isFocus === true ? 'cctv select' : 'cctv'}>
                  <div className={isFocus === true ? 'viewer on' : 'viewer'}>

                    <img style={{height:'100%', width:'100%'}} src={require(`../../../Image/${props.image}`).default} alt='yk_image'
                             onDoubleClick={e => {
                               let obj = {};
                               obj[props.focus] = false; 
                               gfs_dispatch('INSP_PROC_MAIN', props.focus, obj);
                              
                              setModalIsOpen(true);
                            }}
                      /> 
                      <div className={isFocus === true ? 'controller on' : 'controller'}>
                        <button type='' className='left'>왼쪽</button>
                        <button type='' className='top'>위쪽</button>
                        <button type='' className='down'>아래</button>
                        <button type='' className='right'>오른쪽</button>
                        <span className='sep'>
                          <button type='' className='plus'>확대</button>
                          <button type='' className='minus'>축소</button>
                        </span>
                      </div>
                  </div>
                </div>
              </a>

  return (
    <>
      { isOpen === false && img}

      <Modal 
             style={style}
             className='cctv_viewer'
             isOpen={isOpen} 
             onRequestClose={() => setModalIsOpen(false)} 
             ariaHideApp={false}>
        { isOpen === true && img}
      </Modal>
    </>
  );
}

export default RecImage;