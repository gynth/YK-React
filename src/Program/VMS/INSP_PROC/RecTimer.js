import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gfc_lpad } from '../../../Method/Comm';
import { gfs_dispatch } from '../../../Method/Store';
import GifPlayer from 'react-gif-player';

// let interval;

function RecTimer(props) {

  const isRec = useSelector((e) => {
    return e.INSP_PROC_MAIN[props.rec];
  }, (p, n) => {
    return p.rec === n.rec;
  });

  const time = useSelector((e) => {
    return e.INSP_PROC_MAIN[props.rec];
  }, (p, n) => {
    return p.time === n.time;
  });

  if(isRec.rec){
    if(isRec.interval === undefined){
      isRec.timer.start();

      isRec.interval = setInterval((e) => {
        gfs_dispatch('INSP_PROC_MAIN', `${props.rec}_TIME`, {
          car     : props.car,
          time    : `${gfc_lpad(isRec.timer.time().m, 2, '0')}:${gfc_lpad(isRec.timer.time().s, 2, '0')}`,
          interval: isRec.interval
        })
      }, 1000);
    }
  }else{
    clearInterval(isRec.interval);
    isRec.timer.stop();
    gfs_dispatch('INSP_PROC_MAIN', `${props.rec}_TIME`, {
      car     : '',
      time    : '00:00',
      interval: undefined
    })
  }

  return (
    <React.Fragment>   
      {isRec.rec &&
        <>
          <div style={{float:'left', width:'40', height:'30', marginTop:'5'}}>
            <GifPlayer height='30' width='30' gif={require('../../../Image/yk_rec02.gif').default} autoplay/>
          </div>
          <div style={{float:'left', width:'70', height:'30', marginTop:'5'}}>
            <h2>{time.time}</h2>
          </div>
        </>
      }
    </React.Fragment>
  );
}

export default RecTimer;