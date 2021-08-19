import React from 'react';
import { useSelector } from 'react-redux';

function DispImg(props) {
  const DISP_PIC = useSelector((e) => {
    return e.INSP_PROC_MAIN.DISP_PIC;
  }, (p, n) => {
    return p.scaleNumb === n.scaleNumb;
  });

  return (
    <div>
      <div 
        style={{textAlign:'center', marginBottom:'3px'}}>공차앞
      </div> 
      <div 
        style={{marginBottom:'3px'}}>시간: {DISP_PIC.empty_front_date}
      </div>
      <div 
        style={{marginBottom:'3px'}}>위치: {DISP_PIC.empty_front_gps_addr}
      </div>
      <img
        src={'data:image/jpeg;base64,' + DISP_PIC.empty_front}
        style={{width:'100%', height:450, marginBottom:'15px'}} 
        alt='DISP1' />

      <div 
        style={{textAlign:'center', marginBottom:'3px'}}>공차뒤
      </div> 
      <div 
        style={{marginBottom:'3px'}}>시간: {DISP_PIC.empty_rear_date}
      </div>
      <div 
        style={{marginBottom:'3px'}}>위치: {DISP_PIC.empty_rear_gps_addr}
      </div>
      <img
        src={'data:image/jpeg;base64,' + DISP_PIC.empty_rear}
        style={{width:'100%', height:450, marginBottom:'15px'}} 
        alt='DISP2' />

      <div 
        style={{textAlign:'center', marginBottom:'3px'}}>상차앞
      </div> 
      <div 
        style={{marginBottom:'3px'}}>시간: {DISP_PIC.cargo_front_date}
      </div>
      <div 
        style={{marginBottom:'3px'}}>위치: {DISP_PIC.cargo_front_gps_addr}
      </div>
      <img
        src={'data:image/jpeg;base64,' + DISP_PIC.cargo_front}
        style={{width:'100%', height:450, marginBottom:'15px'}} 
        alt='DISP3' />

      <div 
        style={{textAlign:'center', marginBottom:'3px'}}>상차뒤
      </div> 
      <div 
        style={{marginBottom:'3px'}}>시간: {DISP_PIC.cargo_rear_date}
      </div>
      <div 
        style={{marginBottom:'3px'}}>위치: {DISP_PIC.cargo_rear_gps_addr}
      </div>
      <img
        src={'data:image/jpeg;base64,' + DISP_PIC.cargo_rear}
        style={{width:'100%', height:450, marginBottom:'15px'}} 
        alt='DISP4' />
    </div>
  );
}

export default DispImg;