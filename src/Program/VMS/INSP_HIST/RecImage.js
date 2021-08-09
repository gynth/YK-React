import React from 'react';
import { useSelector } from 'react-redux';
import { gfs_dispatch } from '../../../Method/Store';
import ReactImageDtl from './RecImageDtl';

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
 
  const img = <a href='#!'
                  onFocus={() => {
                    if(!isOpen){ 
                      let obj = {}; 
                      obj[props.focus] = true;
    
                      gfs_dispatch('INSP_PROC_MAIN', props.focus, obj);
                    } 
                  }}
                  onBlur={() => {
                    if(!isOpen){
                      let obj = {}; 
                      obj[props.focus] = false; 
                      gfs_dispatch('INSP_PROC_MAIN', props.focus, obj);
                    }
                  }}>
                <div id={props.rec} style={{height: isOpen === true && '100%'}} className={isFocus === true ? 'cctv select' : 'cctv'}>
                  <div className={isFocus === true ? 'viewer on' : 'viewer'}>
                    <div style={{width:'100%', height:'100%'}}>
                      <ReactImageDtl device={props.device} 
                                     rtspUrl={props.rtspUrl}
                                     rtspPort={props.rtspPort}
                                     cam={props.cam}
                                     focus={props.focus}
                                     rec={props.rec} 
                                     car={props.car}/>
                    </div>
                  </div>
                </div>
              </a>

  return (
    <>
      {img}
    </>
  );
}

export default RecImage;