import React, { Component } from 'react';
import ReactHlsPlayer from 'react-hls-player';
import axios from 'axios';
import { gfc_getParameter } from './Method/Comm';
import { getDynamicSql_Oracle } from './db/Oracle/Oracle';
import GifPlayer from 'react-gif-player';
import LoadingOverlay from 'react-loading-overlay';

class HLSViewer extends Component {
  state = {
    hlsPlayer: [],
    MASK     : false
  }

  showMask = () => {
    this.setState({
      MASK: true
    })
  }

  hideMask = () => {
    this.setState({
      MASK: false
    })
  }

  movieDown = (name) => {
    const scaleNumb = gfc_getParameter(this.props, 'scaleNumb');

    this.showMask();
    // const host = `http://10.10.10.136:3003/MovieDown`;
    const host = 'http://ims.yksteel.co.kr:90/WebServer/MovieDown';
    const option = {
      url   : host,
      method: 'POST',
      // headers: {
      //   'Access-Control-Allow-Origin': '*'
      // },
      data: {
        scaleNumb: scaleNumb,
        Name     : name
      },
      responseType: 'blob'
    };
  
    axios(option)
      .then(res => {
        this.hideMask();
        const url = window.URL
              .createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${scaleNumb}.mp4`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(err => {
        this.hideMask();
        console.log(err);
      })
  }

  Init = async() => {
    let hlsList = [];

    const scaleNumb = gfc_getParameter(this.props, 'scaleNumb');

    const result1 = await getDynamicSql_Oracle(
      'Common/Common',
      'ZM_IMS_VIDEO_SELECT',
      [{
        scaleNumb: scaleNumb,
        seq      : 1
      }]
    )

    if(result1.data.rows.length > 0){
      hlsList.push(
        <>
          <div 
            style={{width:'100%', height:'100%'}} 
            className='player-wrapper'>
              <input style={{width: '100%'}} defaultValue={`카메라: ${result1.data.rows[0][5]}`} disabled/>
              <ReactHlsPlayer
                src={`http://ims.yksteel.co.kr:90/WebServer/Replay/${scaleNumb.toString().substring(0, 8)}/${scaleNumb.toString()}/${encodeURIComponent(result1.data.rows[0][5])}/${scaleNumb.toString()}.m3u8`}
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

          <div className='file_download' onClick={() => this.movieDown(result1.data.rows[0][5])}></div>
        </>
      )
    }

    this.setState({
      hlsPlayer: hlsList
    })
  }

  componentDidMount() {
    this.Init();
  }

  render() {
    return (    
      <LoadingOverlay
        active={this.state.MASK}
        spinner={<GifPlayer height='100' width='100' gif={require('./Image/waitImage.gif').default} autoplay={this.state.MASK ? true : false}/>}
        styles={{
          overlay: (base) => ({
            ...base,
            background: 'transparent'
          })
        }}
      >
        <div style={{width:'100%', height:'100%', overflow:'auto'}}>
          { this.state.hlsPlayer }
        </div>
      </LoadingOverlay>
    );
  }
}

export default HLSViewer;