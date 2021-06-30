import React from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import { gfs_dispatch } from '../../../Method/Store';

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
    }};

  const img = <button style={{height:'100%', width:'100%', color:'white', border:'none'}}
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
                   <img style={{height:'100%', width:'100%'}} src={require(`../../../Image/${props.image}`).default} alt='yk_image'
                        onDoubleClick={e => {
                          let obj = {};
                          obj[props.focus] = false; 
                          gfs_dispatch('INSP_PROC_MAIN', props.focus, obj);
                          
                          setModalIsOpen(true);
                        }}
                   /> 
              </button>;

  return (
    <>
      <div style={{float:'left', width: '49%', height:'100%', border: isFocus === true ? '2px solid blue' : undefined}}>
        { isOpen === false && img}
      </div>

      <Modal style={style}
             isOpen={isOpen} 
             onRequestClose={() => setModalIsOpen(false)} 
             ariaHideApp={false}>
        { isOpen === true && img}
      </Modal>
    </>
  );
}

export default RecImage;