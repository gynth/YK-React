import React, { Component } from 'react';
import { TOKEN, RTSP, MILESTONE } from './WebReq/WebReq';
import { getDynamicSql_Oracle } from './db/Oracle/Oracle';
import { gfc_showMask, gfc_hideMask, gfc_screenshot_srv_from_milestone } from './Method/Comm';
import { getSessionCookie } from './Cookies';

const jsmpeg = require('jsmpeg');

class RtspFullScreen extends Component {
  cameraList = 0;
  scaleNumb = '';

  milestoneInfo = async() => {

    // 선택된 공정의 카메라를 찾아서 스트리밍 받는다
    // 지금은 하드코딩 되어있지만 나중엔 로컬스토리지와 콤보박스를 써서 선택된 공정의 아이피를 가지고 카메라를 가져온다.
    // 1. 선택된 공정의 카메라 정보를 가지고온다.
    // const milestone = TOKEN({reqAddr: 'LOGIN', MilestoneIP: gfs_getStoreValue('CAMERA_REDUCER', 'MilestoneIP')});
    const milestone = await TOKEN({});
    this.token  = milestone.data.TOKEN;
    this.device = milestone.data.DEVICE;
    
    if(this.token === ''){
      alert('마일스톤 서버에 접속할 수 없습니다.'); 
    }else if(this.device === ''){
      alert('마일스톤 서버에 접속할 수 없습니다.');
    }else{
      const areaTp = this.getParameter('areaTp');
      this.scaleNumb = this.getParameter('scaleNumb');

      const select = await getDynamicSql_Oracle('Common/Common', 'ZM_IMS_CAMERA_SELECT_EACH', [{AREA_TP:areaTp}]);
      if(select.data === undefined){
        alert('설정된 카메라가 없습니다.');
        return;
      }

      if(select.data.rows.length === 0){
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
      this.infoArr = [];

      for(let i = 0; i < ipArr.length; i++){
        const camera = this.device.find(e1 => e1.Name.indexOf(ipArr[i]) >= 0);
        if(camera){
          this.infoArr.push({
            camera, 
            ipArr: ipArr[i], 
            cameraPort: cameraPort[i], 
            cameraNam: cameraNam[i], 
            rtspAddr: rtspAddr[i]
          }); 
        }
      }
    }
  }

  getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(this.props.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  constructor(props) {
    super(props);
    this.imageRef = React.createRef();
  }

  componentDidMount() {
    this.Init();
  }

  Init = async() => {
    await this.milestoneInfo();
    this.setCameraRtsp(0);
  }

  debounceOnClick = (e, ptz) => {
    MILESTONE({reqAddr: 'PTZ',
    device: this.infoArr[this.cameraList].camera.Guid,
    ptz})
  };

  onClick = (e, ptz) => {
    e.stopPropagation();
    this.debounceOnClick(e, ptz);
  }

  setCameraRtsp(){

    if(this.infoArr.length <= this.cameraList) return;
    
    RTSP({reqAddr: 'RTSPStart',
          device   : this.infoArr[this.cameraList].camera.Guid, 
          streamUrl: this.infoArr[this.cameraList].rtspAddr,
          port     : this.infoArr[this.cameraList].cameraPort,
          width: 1920,
          height: 1080,
          fps: 24
        }).then(e => {
          if(e.data === 'OK'){
            if(this.client !== null && this.client !== undefined){
              this.client.close();
              this.canvas = null;
            }

            this.client = new WebSocket(`ws://ims.yksteel.co.kr:90/ws/${this.infoArr[this.cameraList].cameraPort}`);
            this.canvas = this.imageRef.current;
            new jsmpeg(this.client, {
              canvas: this.canvas
              // pauseWhenHidden: false 
            });
          }
        })

    // if(this.client !== null && this.client !== undefined){
    //   this.client.close();
    //   this.client = null;
    //   this.canvas = null;
    // }

    // const setRtsp = () => {
    //   this.client = new WebSocket(`ws://ims.yksteel.co.kr:90/ws/${props.cameraPort}`);
    //   this.canvas = this.imageRef.current;
    //   new jsmpeg(this.client, {
    //     canvas: this.canvas
    //   });
    // }
  }

  render() {
    return (
    <div>
      <button onClick={e => {
        this.cameraList = 0;
        this.setCameraRtsp();
      }}>1</button>
      <button onClick={e => {
        this.cameraList = 1;
        this.setCameraRtsp();
      }}>2</button>
      <button onClick={e => {
        this.cameraList = 2;
        this.setCameraRtsp();
      }}>3</button>
      <button onClick={e => {
        this.cameraList = 3;
        this.setCameraRtsp();
      }}>4</button>

      <div className='cctv select' style={{height:'100%'}}>
        <div
        className='viewer'>
          <canvas 
            ref={this.imageRef} 
            style={{
              width:'100%', 
              height:'100%'
            }}
          />
          <div className='picture_save' onClick={e => {

            
            const scaleNumb = getSessionCookie('DETAIL_SCALE');
            if(scaleNumb === '' || scaleNumb === undefined || scaleNumb === null){
              alert('선택된 계근번호가 없습니다.');
              return;
            }

            gfc_showMask();

            gfc_screenshot_srv_from_milestone(this.infoArr[this.cameraList].camera.Guid, scaleNumb).then(
              e => {
                gfc_hideMask();
                if(e.data.Result !== 'OK'){
                  alert('파일저장에 실패 했습니다.');
                }
              }
            )
          }}>
          </div>
          <div className='direction'>
            <button 
              type='' 
              className='left' 
              onClick={e => {
                e.stopPropagation();
                this.onClick(e, 'left')}}>왼쪽
            </button>
            <button 
              type='' 
              className='top' 
              onClick={e => {
                e.stopPropagation();
                this.onClick(e, 'up')}}>위쪽
            </button>
            <button 
              type='' 
              className='down' 
              onClick={e => {
                e.stopPropagation();
                this.onClick(e, 'down')}}>아래
            </button>
            <button 
              type='' 
              className='right' 
              onClick={e => {
                e.stopPropagation();
                this.onClick(e, 'right')}}>오른쪽
            </button>
          </div>
          <div className='controller'>
            <button type='' className='plus' onClick={e => {
              e.stopPropagation();
              this.onClick(e, 'zoomin')}}>확대</button>
            <button type='' className='minus' onClick={e => {
              e.stopPropagation();
              this.onClick(e, 'zoomout')}}>축소</button>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default RtspFullScreen;