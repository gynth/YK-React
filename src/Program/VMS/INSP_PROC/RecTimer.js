import React from 'react';
import { useSelector } from 'react-redux';
import { gfc_getMultiLang, gfc_lpad, gfc_screenshot, gfc_screenshot_srv } from '../../../Method/Comm';
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
            <h2 style={{color:'white'}}>{time.time}</h2>
          </div>
        </>
      }
      {/* <button onClick={() => {
                const img = document.getElementById(props.rec);
                gfc_screenshot(img, 'capture.jpg');
                
              }}>client</button>
      <button onClick={async () => {
                const img = document.getElementById(props.rec);
                // const result = await gfc_screenshot_srv(img, 'capture-test.png', 'C:\\Image');
                const result = await gfc_screenshot_srv(img);

                if(result.data !== null) gfc_getMultiLang('영상캡처에 실패했습니다.');
                
              }}>server</button> */}
    </React.Fragment>
  );
}

export default RecTimer;