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

  const movieDown = async() => {
    gfc_showMask();

    let name = '';

    if(value.toString() !== ''){
      const reault = await callOracle(
        'Common/Common',
        'ZM_IMS_VIDEO_SELECT',
        [{
          scaleNumb: value.toString(),
          seq      : props.seq
        }]
      );

      if(reault.data.rows.length > 0){
        name = reault.data.rows[0][5];
      }else{
        name = '';
      }
    }

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
        Name     : name
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

  const [hls, setHls] = useState(null);
  let name = '';

  const Init = async() => {
    if(value.toString() !== ''){
      const reault = await callOracle(
        'Common/Common',
        'ZM_IMS_VIDEO_SELECT',
        [{
          scaleNumb: value.toString(),
          seq      : props.seq
        }]
      );

      if(reault.data.rows.length > 0){
        name = reault.data.rows[0][5];
        setHls(await hlsMake(-1));
      }else{
        name = '';
        setHls(null);
      }
    }
  }

  useEffect(() => { 
    Init();
  }, [props.seq, value])

  const onActiveWindow = () => {
    if(movieRef.current === undefined) return; 
    if(value.toString() === '') return;
    if(hls === null) return;
    
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

  const hlsDel = async(time) => {
    const hlsPlayer = await hlsMake(time);

    setHls(hlsPlayer);
  }

  const hlsMake = async(time) => {
    return (
      <>
        <ReactHlsPlayer
          src={`http://ims.yksteel.co.kr:90/WebServer/Replay/${value.toString().substring(0, 8)}/${value.toString()}/${encodeURIComponent(name)}/${value.toString()}.m3u8`}
          autoPlay={true}
          controls={true}
          width='100%'
          height='100%'
          muted='muted'
          // onLoadedData={e => e.target.play()}
          onError={e => {
            hlsDel(e.target.currentTime * 1 + 2);
          }}
          hlsConfig={{
            startPosition: time,
            debug: false,
            lowLatencyMode: true
          }}
        />
  
        <div className='file_download' onClick={() => this.movieDown(name)}></div>
      </>
    )
  }
  
  useEffect(() => {
    gfs_subscribe(onActiveWindow);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    {(value.toString() !== '' && hls !== null) &&
      <>
        <div 
          style={{width:'100%', height:'100%'}} 
          className='player-wrapper'>
            {hls}
        </div>

        <div className='file_download' onClick={() => movieDown()}></div>
      </>
    }
    </>
  );
}

export default RecImageDtl;