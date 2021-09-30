import React from 'react';
import { useSelector } from 'react-redux';
import { gfs_dispatch, gfs_getStoreValue } from '../../../Method/Store';
import ReactImageDtl from './RecImageDtl';
import { getDynamicSql_Oracle } from '../../../db/Oracle/Oracle';
import { gfc_hideMask, gfc_showMask } from '../../../Method/Comm';
import { TOKEN } from '../../../WebReq/WebReq';

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

  const isActive = useSelector((e) => {
    return e.MASK_REDUCER['ON_ACTIVE'];
  }, (p, n) => {
    return p.active === n.active;
  });

  const callOracle = async(file, fn, param) => {
    let result = await getDynamicSql_Oracle(
      file,
      fn,
      param
    ); 

    return result;
  }

  let interval;

  return (
    <a href='#!' 
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
      }}
    >
    <div 
      id={props.rec} 
      style={{height: isOpen === true ? '100%' : props.seq > 2 && '100%',
              paddingBottom: props.seq > 2 && '0px'
      }} 
      className={isFocus === true ? 'cctv select' : 'cctv'}
    >
      
      {/* <div className={isFocus === true ? 'viewer on' : 'viewer'}> */}
      <div 
        className='viewer'
        // onMouseOver={async e => {
        //   e.stopPropagation();

        //   if(e.target.dataset.seq !== undefined){
        //     if(e.relatedTarget === null) return;

        //     if(e.relatedTarget.dataset['seq'] !== undefined){
        //       console.log(e.target.dataset);
        //       console.log(e.relatedTarget.dataset);
        //     }
        //   }
        // }}
        onMouseOut={e => {
          clearInterval(interval);
        }}

        onMouseOver={e => {
          e.stopPropagation();

          interval = setInterval(async() => {
            const mouseDown = gfs_getStoreValue('INSP_PROC_MAIN_DRAG', 'CLICK');

            if(mouseDown === true){
              if(e.target.dataset.seq !== undefined){
                if(e.relatedTarget === null) return;
    
                if(e.relatedTarget.dataset['seq'] !== undefined){
                  if(e.relatedTarget.dataset.seq > 2){
                    gfc_showMask();
                  
                    let token;
                    let device;

                    const milestone = await TOKEN({});
                    token  = milestone.data.TOKEN;
                    device = milestone.data.DEVICE;
                    if(token === ''){
                      gfc_hideMask();
                      alert('마일스톤 서버에 접속할 수 없습니다.'); 
                    }else if(device === ''){
                      gfc_hideMask();
                      alert('마일스톤 서버에 접속할 수 없습니다.');
                    }else{

                      let DEVICE = gfs_getStoreValue('INSP_PROC_MAIN', 'DEVICE');
                      const target = e.target.dataset.seq - 1;
                      const source = e.relatedTarget.dataset.seq - 1;
                      
                      //1. 큰 화면의 SEQ업데이트
                      const targetResult = await callOracle(
                        'Common/Common',
                        'ZM_IMS_CAMERA_UPDATE2',
                        [{
                          SEQ   : source,
                          CAMERA_IP: DEVICE[target].ipArr
                        }]
                      );

                      if(targetResult.data.rowsAffected === 0){
                        gfc_hideMask();

                        alert('카메라 정보가 변경되었습니다. 새로고침후 확인해주세요.');
                        return;
                      }

                      //2. 작은 화면의 SEQ업데이트
                      const sourceResult = await callOracle(
                        'Common/Common',
                        'ZM_IMS_CAMERA_UPDATE2',
                        [{
                          SEQ   : target,
                          CAMERA_IP: DEVICE[source].ipArr
                        }]
                      )

                      if(sourceResult.data.rowsAffected === 0){
                        gfc_hideMask();
                        
                        alert('카메라 정보가 변경되었습니다. 새로고침후 확인해주세요.');
                        return;
                      }

                      const select = await callOracle('Common/Common', 'ZM_IMS_CAMERA_SELECT_EACH', [{AREA_TP:'E001'}]);
                      if(select.data === undefined){
                        gfc_hideMask();

                        alert('설정된 카메라가 없습니다.');
                        return;
                      }
                
                      if(select.data.rows.length === 0){
                        gfc_hideMask();

                        alert('설정된 카메라가 없습니다.');
                        return;
                      }

                      let data = [];
                      for(let i = 0; i < select.data.rows.length; i++){
                  
                        let col = {};
                        for(let j = 0; j < select.data.rows[i].length; j++){
                          col[select.data.metaData[j].name] = select.data.rows[i][j];
                        }
                        data.push(col);
                      }
                
                      let infoArr = [];
                      let ipArr = [];
                      let cameraPort = [];
                      let cameraNam = [];
                      let rtspAddr = [];
                
                      for(let i = 0; i < data.length; i++){
                        ipArr.push(data[i].CAMERA_IP);
                        cameraPort.push(data[i].CAMERA_PORT);
                        cameraNam.push(data[i].CAMERA_NAM);
                        rtspAddr.push(data[i].RTSP_ADDR);
                      }
                
                      // let ipArr = ['10.10.136.112', '10.10.136.128'];
                      // let rtspUrl = ['rtsp://admin:admin13579@10.10.136.112:554/profile2/media.smp', 'rtsp://admin:pass@10.10.136.128:554/video1'];
                      // let rtspPort = [3100, 3101];
                
                      for(let i = 0; i < ipArr.length; i++){
                        const camera = device.find(e1 => e1.Name.indexOf(ipArr[i]) >= 0);
                        if(camera){
                          infoArr.push({
                            camera, 
                            ipArr: ipArr[i], 
                            cameraPort: cameraPort[i], 
                            cameraNam: cameraNam[i],
                            rtspAddr: rtspAddr[i]
                          }); 
                        }
                      }
                
                      if(infoArr.length > 0){
                        gfs_dispatch('INSP_PROC_MAIN', 'DEVICE', {DEVICE: infoArr});
                        gfs_dispatch('INSP_PROC_MAIN_DRAG', 'ONMOUSEDOWN', {CLICK: false});
                      }
                    }

                    clearInterval(interval);
                    gfc_hideMask();
                  }
                }
              }
            }
          }, 100);
        }
          // console.log(console.log('des'), e.relatedTarget.dataset);
      }
    >
        <div style={{width:'100%', height:'100%'}}>
          {isActive.active === true &&
            <ReactImageDtl 
              seq={props.seq}
              device={props.device} 
              Name={props.Name}
              cameraPort={props.cameraPort}
              rtspAddr={props.rtspAddr}
              cameraNam={props.cameraNam}
              cam={props.cam}
              focus={props.focus}
              rec={props.rec} 
              car={props.car}/>
          }
        </div>
      </div>
    </div>
    </a>
  );
}

export default RecImage;