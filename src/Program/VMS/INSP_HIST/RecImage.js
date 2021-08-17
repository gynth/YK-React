import React from 'react';
import { useSelector } from 'react-redux';
import { gfs_dispatch } from '../../../Method/Store';
import ReactImageDtl from './RecImageDtl';

function RecImage(props) {  

  // const isOpen = useSelector((e) => {
  //   return e.INSP_PROC_MAIN[props.cam];
  // }, (p, n) => {
  //   return p === n;
  // });

  // const isFocus = useSelector((e) => {
  //   return e.INSP_PROC_MAIN[props.focus];
  // }, (p, n) => {
  //   return p === n;
  // });
 
  const img = <a href='#!'>
                <div id={props.rec} className='cctv'>
                  <div className='viewer'>
                    <div style={{width:'100%', height:'100%'}}>
                      <ReactImageDtl device={props.device} 
                                     Name={props.Name}
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