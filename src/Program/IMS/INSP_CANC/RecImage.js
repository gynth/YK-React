import React from 'react';
import ReactImageDtl from './RecImageDtl';

function RecImage(props) {  
  return (
    <div id={props.rec} className='cctv'>
      <div className='viewer'>
        <div style={{width:'100%', height:'100%'}}>
          <ReactImageDtl 
            seq   = {props.seq}
            cam   = {props.cam}
            focus = {props.focus}
            rec   = {props.rec} 
            car   = {props.car}/>
        </div>
      </div>
    </div>
  );
}

export default RecImage;