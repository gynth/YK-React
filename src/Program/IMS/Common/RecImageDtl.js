import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { gfs_subscribe, gfs_getStoreValue } from '../../../Method/Store';
import { gfc_showMask, gfc_hideMask } from '../../../Method/Comm';
import axios from 'axios';
import { getDynamicSql_Oracle } from '../../../db/Oracle/Oracle';
import ReactHlsPlayer from 'react-hls-player';

function RecImageDtl(props) {
  
  const movieRef = useRef();

  const value = useSelector((e) => {
    return e[props.reducer].GRID_SCALE;
  }, (p, n) => {
    return p === n;
  });

  const callOracle = async(file, fn, param) => {
    let result = await getDynamicSql_Oracle(
      file,
      fn,
      param
    ); 

    return result;
  }

  const movieDown = () => {
    gfc_showMask();
    // const host = `http://10.10.10.136:3003/MovieDown`;
    const host = 'http://ims.yksteel.co.kr:90/WebServer/MovieDown';
    const option = {
      url   : host,
      method: 'POST',
      // headers: {
      //   'Access-Control-Allow-Origin': '*'
      // },
      data: {
        scaleNumb: value.toString(),
        Name     : props.Name
      },
      responseType: 'blob'
    };
  
    axios(option)
      .then(res => {
        gfc_hideMask();
        const url = window.URL
              .createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${value.toString()}.mp4`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(err => {
        gfc_hideMask();
        console.log(err);
      })
  }

  const [playUrl, setPlayUrl] = useState('');
  const [cameraName, setCameraName] = useState('');

  useEffect(() => { 
    if(value.toString() !== ''){
      callOracle(
        'Common/Common',
        'ZM_IMS_VIDEO_SELECT',
        [{
          scaleNumb: value.toString(),
          seq      : props.seq
        }]
      ).then(e => {
        if(e.data.rows.length > 0){
          setCameraName(e.data.rows[0][5]);
          // setPlayUrl(`http://10.10.10.136:3003/${value.toString()}/${encodeURIComponent(cameraName)}/${value.toString()}.m3u8`);
          setPlayUrl(`http://ims.yksteel.co.kr:90/WebServer/Replay/${value.toString().substring(0, 8)}/${value.toString()}/${encodeURIComponent(cameraName)}/${value.toString()}.m3u8`);
        }else{
          setPlayUrl('');
        }
      }).catch(e => {
        console.log('DISP_PROC>' + e);
      })
    }
  }, [cameraName, props.seq, value])

  const onActiveWindow = () => {
    if(movieRef.current === undefined) return; 
    if(value.toString() === '') return;
    if(playUrl === '') return;
    
    const isActive = gfs_getStoreValue('MASK_REDUCER', 'ON_ACTIVE');

    const isPlay = movieRef.current.paused;

    if(isActive.active){
      if(isPlay === false){
        movieRef.current.play();
      }
    }else{
      if(isPlay){
        movieRef.current.pause();
      }
    }
  }
  
  useEffect(() => {
    gfs_subscribe(onActiveWindow);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    {(value.toString() !== '' && playUrl.toString() !== '') &&
      <>
        <div 
          style={{width:'100%', height:'100%'}} 
          className='player-wrapper'>
            <ReactHlsPlayer
              playerRef={movieRef}
              src={playUrl}
              autoPlay={false}
              controls={true}
              width='100%'
              height='100%'
              muted='muted'
              onLoadedData={e => e.target.play()}
              hlsConfig={{
                autoStartLoad: true,
                startPosition: -1,
                debug: false,
                lowLatencyMode: true
              }}
            />
        </div>

        <div className='file_download' onClick={() => movieDown()}></div>
      </>
    }
    </>
  );
}

export default RecImageDtl;