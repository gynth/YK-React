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
    MASK     : false,
    time     : [-1, -1, -1, -1]
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

  hlsDel = async(no, name, time) => {
    this.hlsList.splice(no * 1, 1, await this.hlsMake(
      no, name, time
    ));

    this.setState({
      hlsPlayer: this.hlsList
    })
  }

  hlsMake = async(no, name, time) => {
    return (
      <>
        <div key={no.toString()}
          style={{width:'100%', height:'100%'}} 
          className='player-wrapper'>
  
            <div style={{width: '100%'}}>
              카메라: ${name}
              <button onClick={() => this.movieDown(name)}>다운로드</button>
            </div>
            <ReactHlsPlayer
              src={`http://ims.yksteel.co.kr:90/WebServer/Replay/${this.scaleNumb.toString().substring(0, 8)}/${this.scaleNumb.toString()}/${encodeURIComponent(name)}/${this.scaleNumb.toString()}.m3u8`}
              autoPlay={true}
              controls={true}
              width='100%'
              height='95%'
              muted='muted'
              // onLoadedData={e => e.target.play()}
              onError={e => {
                this.hlsDel(no, name, e.target.currentTime * 1 + 2);
              }}
              hlsConfig={{
                startPosition: time,
                debug: false,
                lowLatencyMode: true
              }}
            />
        </div>
      </>
    )
  }

  Init = async() => {
    this.hlsList = [];

    this.scaleNumb = gfc_getParameter(this.props, 'scaleNumb');

    const result1 = await getDynamicSql_Oracle(
      'Common/Common',
      'ZM_IMS_VIDEO_SELECT',
      [{
        scaleNumb: this.scaleNumb,
        seq      : 1
      }]
    )
    if(result1.data.rows.length > 0){
      this.hls1 = await this.hlsMake('0', result1.data.rows[0][5], -1);
      this.hlsList.push(this.hls1);
    }

    const result2 = await getDynamicSql_Oracle(
      'Common/Common',
      'ZM_IMS_VIDEO_SELECT',
      [{
        scaleNumb: this.scaleNumb,
        seq      : 2
      }]
    )
    if(result2.data.rows.length > 0){
      this.hls2 = await this.hlsMake('1', result2.data.rows[0][5], -1);
      this.hlsList.push(this.hls2);
    }

    const result3 = await getDynamicSql_Oracle(
      'Common/Common',
      'ZM_IMS_VIDEO_SELECT',
      [{
        scaleNumb: this.scaleNumb,
        seq      : 3
      }]
    )
    if(result3.data.rows.length > 0){
      this.hls3 = await this.hlsMake('2', result3.data.rows[0][5], -1);
      this.hlsList.push(this.hls3);
    }

    const result4 = await getDynamicSql_Oracle(
      'Common/Common',
      'ZM_IMS_VIDEO_SELECT',
      [{
        scaleNumb: this.scaleNumb,
        seq      : 4
      }]
    )
    if(result4.data.rows.length > 0){
      this.hls4 = await this.hlsMake('3', result4.data.rows[0][5], -1);
      this.hlsList.push(this.hls4);
    }

    this.setState({
      hlsPlayer: this.hlsList
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