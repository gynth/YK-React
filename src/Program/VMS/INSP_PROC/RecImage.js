import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gfs_dispatch } from '../../../Method/Store';
import { TOKEN, MILESTONE } from '../../../WebReq/WebReq';
import ReactImageDtl from './RecImageDtl';

function RecImage(props) {  
  let token  = '';
  let device = '';
  const ip     = props.ip;

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

  const startLive = async() => {

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

  useEffect(() => { 
    startLive();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
 
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
                      <ReactImageDtl ip={props.ip} 
                                     cam={props.cam}
                                     focus={props.focus}
                                     rec={props.rec} 
                                     car={props.car} />
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