//#region import
import React, { Component } from 'react';
import Input from '../../../Component/Control/Input';
import Checkbox from '../../../Component/Control/Checkbox';

import { gfc_initPgm, gfc_sleep, gfc_showMask, gfc_yk_call_sp, gfc_hideMask, gfc_chit_yn_YK, gfc_ftp_file_yn_YK } from '../../../Method/Comm';
import { gfs_getStoreValue, gfs_injectAsyncReducer, gfs_dispatch, gfs_subscribe, gfs_PGM_REDUCER } from '../../../Method/Store';
import { gfo_getCombo, gfo_getInput, gfo_getCheckbox } from '../../../Method/Component';
import { gfg_appendRow, gfg_getGrid, gfg_setSelectRow } from '../../../Method/Grid';
import { getDynamicSql_Oracle, getSp_Oracle } from '../../../db/Oracle/Oracle';

import Grid from '../../../Component/Grid/Grid';
import Layout from '../../../Component/Layout/Layout';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Image as columnImage } from '../../../Component/Grid/Column/Image';
import { TextArea as columnTextArea } from '../../../Component/Grid/Column/TextArea';
import { DateTime as columnDateTime } from '../../../Component/Grid/Column/DateTime';

import Combobox from '../../../Component/Control/Combobox';

import Mainspan from '../Common/Mainspan';
import Detailspan from '../Common/Detailspan';
import Botspan from '../Common/Botspan';
import Chit from '../Common/Chit/Chit';
import CompleteBtn from './CompleteBtn';
import TabList from '../Common/TabList';
import DispInfo from './DispInfo';
import DispImg from './DispImg';
import RecImage from './RecImage';
import RainInfo from './RainInfo';

import GifPlayer from 'react-gif-player';

import { ReRec, RecodingList } from '../../../WebReq/WebReq';
import { TOKEN, MILESTONE } from '../../../WebReq/WebReq';
import { throttle } from 'lodash';
import { setSessionCookie } from '../../../Cookies';
import { getDynamicSql_Mysql } from '../../../db/Mysql/Mysql';
//#endregion

class INSP_PROC extends Component {

  state = {
    wait_list: [],
    device: []
  }

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
      const areaTp = gfs_getStoreValue('USER_REDUCER', 'AREA_TP');
      const select = await this.callOracle('Common/Common', 'ZM_IMS_CAMERA_SELECT_EACH', [{AREA_TP:areaTp}]);
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

      if(this.infoArr.length > 0){
        // this.setState(this.state.device = this.infoArr);
        gfs_dispatch('INSP_PROC_MAIN', 'DEVICE', {DEVICE: this.infoArr});
      }
    }
  }

  //#region onActivePage 스토어 subscribe로 실행됨.
  onActivePage = () => {
    const activeWindow = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'activeWindow');
    if(activeWindow.programId === 'INSP_PROC'){
      window.onkeydown = e => this.onKeyDown(e);
      window.onmousewheel = e => this.onMouseWheel(e);
    }
  }

  onCameraChange = () => {
    const cameraDevice = gfs_getStoreValue('INSP_PROC_MAIN', 'DEVICE');
    if(cameraDevice !== undefined){
      if(cameraDevice === 0) return;

      if(JSON.stringify(cameraDevice) !== JSON.stringify(this.state.device)){
        this.setState({
          device: cameraDevice
        });
      }
    } 
  }
  //#endregion

  //#region PTZ
  debounceKeyDown = throttle((e, device) => {
    let ptz = '';
    if(e.keyCode === 37) ptz = 'left';
    else if(e.keyCode === 38) ptz = 'up';
    else if(e.keyCode === 39) ptz = 'right';
    else if(e.keyCode === 40) ptz = 'down';

    if(ptz !== ''){
      MILESTONE({reqAddr: 'PTZ',
      device: device.Guid,
      ptz})
    }
  }, 1000);

  // debounceMouseWheel = throttle((e, device) => {
  //   let ptz = '';
  //   if(e.deltaX === -0){
  //     if (e.wheelDelta > 0){
  //       ptz = 'zoomin';
  //     }else{
  //       ptz = 'zoomout';
  //     }
  //   }

  //   if(ptz !== ''){
  //     MILESTONE({reqAddr: 'PTZ',
  //     device: device.Guid,
  //     ptz})
  //   }
  // }, 1000);


  // debounceKeyDown = (e, device) => {
  //   let ptz = '';
  //   if(e.keyCode === 37) ptz = 'left';
  //   else if(e.keyCode === 38) ptz = 'up';
  //   else if(e.keyCode === 39) ptz = 'right';
  //   else if(e.keyCode === 40) ptz = 'down';

  //   if(ptz !== ''){
  //     MILESTONE({reqAddr: 'PTZ',
  //     device: device.Guid,
  //     ptz})
  //   }
  // };

  debounceMouseWheel = (e, device) => {
    let ptz = '';
    if(e.deltaX === -0){
      if (e.wheelDelta > 0){
        ptz = 'zoomin';
      }else{
        ptz = 'zoomout';
      }
    }

    if(ptz !== ''){
      MILESTONE({reqAddr: 'PTZ',
      device: device.Guid,
      ptz})
    }
  };

  onKeyDown = (e) => {
    e.stopPropagation();

    const STD_CAM_FOCUS = gfs_getStoreValue('INSP_PROC_MAIN', 'STD_CAM_FOCUS');
    const DUM_CAM_FOCUS = gfs_getStoreValue('INSP_PROC_MAIN', 'DUM_CAM_FOCUS');
    
    if(STD_CAM_FOCUS || DUM_CAM_FOCUS){
      this.debounceKeyDown(e, STD_CAM_FOCUS ? this.infoArr[0].camera : this.infoArr[1].camera);
    }
  }

  onMouseWheel = (e) => {
    e.stopPropagation();

    const STD_CAM_FOCUS = gfs_getStoreValue('INSP_PROC_MAIN', 'STD_CAM_FOCUS');
    const DUM_CAM_FOCUS = gfs_getStoreValue('INSP_PROC_MAIN', 'DUM_CAM_FOCUS');

    if(STD_CAM_FOCUS || DUM_CAM_FOCUS){
      this.debounceMouseWheel(e, STD_CAM_FOCUS ? this.infoArr[0].camera : this.infoArr[1].camera);
    }
  }
  //#endregion

  //#region 녹화제어
  startRec = async () => {
    
    const scaleNumb = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_SCALE');
    const camera_no = gfs_getStoreValue('USER_REDUCER', 'CAMERA_NO');
    if(scaleNumb === ''){
      alert('선택된 계근번호가 없습니다.');
      return;
    }
    if(camera_no === '' || camera_no === null){
      alert('설정된 차량인식 카메라가 없습니다.');
      return;
    }

    //기존저장된 파일있는지 확인.
    let param = [];
    param.push({
      sp   : `begin 
                SP_ZM_IMS_REC(
                  :p_RowStatus,
                  :p_scaleNumb,
                  :p_seq,
                  :p_cameraNo,
                  :p_cameraDevice,
                  :p_cameraName,
                  :p_UserId,
                  
                  :p_select,
                  :p_SUCCESS,
                  :p_MSG_CODE,
                  :p_MSG_TEXT,
                  :p_COL_NAM
                );
              end;
              `,
      data : {
        p_RowStatus    : 'R2',
        p_scaleNumb    : scaleNumb,
        p_seq          : 0,
        p_cameraNo     : '',
        p_cameraDevice : '',
        p_cameraName   : '',
        p_UserId       : ''
      },
      errSeq: 0
    })
    
    const result = await getSp_Oracle(param);
    if(result.data.SUCCESS === 'N'){
      if(result.data.MSG_CODE === '1'){
        if(window.confirm(result.data.MSG_TEXT) === true){
          const recYn = await ReRec(scaleNumb);
          //0. 파일명은 변경된 상태
          if(recYn.data.Response === 'OK'){
            //1. DB에 녹화시작으로 저장
            let param = [];
            param.push({
              sp   : `begin 
                        SP_ZM_IMS_REC(
                          :p_RowStatus,
                          :p_scaleNumb,
                          :p_seq,
                          :p_cameraNo,
                          :p_cameraDevice,
                          :p_cameraName,
                          :p_UserId,
                          
                          :p_select,
                          :p_SUCCESS,
                          :p_MSG_CODE,
                          :p_MSG_TEXT,
                          :p_COL_NAM
                        );
                      end;
                      `,
              data : {
                p_RowStatus    : 'I2',
                p_scaleNumb    : scaleNumb,
                p_seq          : 0,
                p_cameraNo     : camera_no,
                p_cameraDevice : '',
                p_cameraName   : '',
                p_UserId       : ''
              },
              errSeq: 0
            })
            
            const result = await getSp_Oracle(param);

            if(result.data.SUCCESS === 'N'){
              alert('수동녹화 시작에 실패했습니다.');
            }
          }
        }else{
          return;
        }
      }else{
        if(window.confirm(result.data.MSG_TEXT) === true){
          //1. DB에 녹화시작으로 저장
          let param = [];
          param.push({
            sp   : `begin 
                      SP_ZM_IMS_REC(
                        :p_RowStatus,
                        :p_scaleNumb,
                        :p_seq,
                        :p_cameraNo,
                        :p_cameraDevice,
                        :p_cameraName,
                        :p_UserId,
                        
                        :p_select,
                        :p_SUCCESS,
                        :p_MSG_CODE,
                        :p_MSG_TEXT,
                        :p_COL_NAM
                      );
                    end;
                    `,
            data : {
              p_RowStatus    : 'I3',
              p_scaleNumb    : scaleNumb,
              p_seq          : 0,
              p_cameraNo     : camera_no,
              p_cameraDevice : '',
              p_cameraName   : '',
              p_UserId       : ''
            },
            errSeq: 0
          })
          
          const result = await getSp_Oracle(param);

          if(result.data.SUCCESS === 'N'){
            alert('수동녹화 시작에 실패했습니다.');
          }
        }else{
          return;
        }
      }
    }else{
        //1. DB에 녹화시작으로 저장
        let param = [];
        param.push({
          sp   : `begin 
                    SP_ZM_IMS_REC(
                      :p_RowStatus,
                      :p_scaleNumb,
                      :p_seq,
                      :p_cameraNo,
                      :p_cameraDevice,
                      :p_cameraName,
                      :p_UserId,
                      
                      :p_select,
                      :p_SUCCESS,
                      :p_MSG_CODE,
                      :p_MSG_TEXT,
                      :p_COL_NAM
                    );
                  end;
                  `,
          data : {
            p_RowStatus    : 'I2',
            p_scaleNumb    : scaleNumb,
            p_seq          : 0,
            p_cameraNo     : camera_no,
            p_cameraDevice : '',
            p_cameraName   : '',
            p_UserId       : ''
          },
          errSeq: 0
        })
        
        const result = await getSp_Oracle(param);

        if(result.data.SUCCESS === 'N'){
          alert('수동녹화 시작에 실패했습니다.');
        }
    }
  }

  stopRec = async () => {
    const scaleNumb = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_SCALE');
    const camera_no = gfs_getStoreValue('USER_REDUCER', 'CAMERA_NO');
    if(scaleNumb === ''){
      alert('선택된 계근번호가 없습니다.');
      return;
    }
    if(camera_no === '' || camera_no === null){
      alert('설정된 차량인식 카메라가 없습니다.');
      return;
    }

    //기존저장된 파일있는지 확인.
    let param = [];
    param.push({
      sp   : `begin 
                SP_ZM_IMS_REC(
                  :p_RowStatus,
                  :p_scaleNumb,
                  :p_seq,
                  :p_cameraNo,
                  :p_cameraDevice,
                  :p_cameraName,
                  :p_UserId,
                  
                  :p_select,
                  :p_SUCCESS,
                  :p_MSG_CODE,
                  :p_MSG_TEXT,
                  :p_COL_NAM
                );
              end;
              `,
      data : {
        p_RowStatus    : 'R4',
        p_scaleNumb    : scaleNumb,
        p_seq          : 0,
        p_cameraNo     : '',
        p_cameraDevice : '',
        p_cameraName   : '',
        p_UserId       : ''
      },
      errSeq: 0
    })
    
    const result = await getSp_Oracle(param);
    if(result.data.SUCCESS === 'N'){
      alert('녹화중인 계량번호가 아닙니다.');
      return;
    }else{

      let param = [];
      param.push({
        sp   : `begin 
                  SP_ZM_IMS_REC(
                    :p_RowStatus,
                    :p_scaleNumb,
                    :p_seq,
                    :p_cameraNo,
                    :p_cameraDevice,
                    :p_cameraName,
                    :p_UserId,
                    
                    :p_select,
                    :p_SUCCESS,
                    :p_MSG_CODE,
                    :p_MSG_TEXT,
                    :p_COL_NAM
                  );
                end;
                `,
        data : {
          p_RowStatus    : 'D3',
          p_scaleNumb    : scaleNumb,
          p_seq          : 0,
          p_cameraNo     : '',
          p_cameraDevice : '',
          p_cameraName   : '',
          p_UserId       : ''
        },
        errSeq: 0
      })
      
      const result = await getSp_Oracle(param);

      if(result.data.SUCCESS === 'N'){
        alert('수동녹화 중지에 실패했습니다.');
      }
    }
  }
  //#endregion



  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this);

    //#region 리듀서
    const INSP_PROC_MAIN = (nowState, action) => {

      if(action.reducer !== 'INSP_PROC_MAIN') {
        return {
          ON_ACTIVE    : nowState === undefined ? {
            active : true,
            time   : new Date() 
          } : nowState.ON_ACTIVE,

          DEVICE       : nowState === undefined ? 0 : nowState.DEVICE,

          RAIN_INFO    : nowState === undefined ? 0 : nowState.RAIN_INFO,

          MAIN_WAIT    : nowState === undefined ? 0 : nowState.MAIN_WAIT,
          MAIN_TOTAL   : nowState === undefined ? 0 : nowState.MAIN_TOTAL,
          MAIN_WEIGHT  : nowState === undefined ? 0 : nowState.MAIN_WEIGHT,
          BOT_TOTAL    : nowState === undefined ? 0 : nowState.BOT_TOTAL,
          PROC_WAIT    : nowState === undefined ? 0 : nowState.PROC_WAIT,
          DEPT_WAIT    : nowState === undefined ? 0 : nowState.DEPT_WAIT,
          ENTR_WAIT    : nowState === undefined ? 0 : nowState.ENTR_WAIT,
          DRIV_WAIT    : nowState === undefined ? 0 : nowState.DRIV_WAIT,
          
          DETAIL_SCALE : nowState === undefined ? '' : nowState.DETAIL_SCALE,
          DETAIL_CARNO : nowState === undefined ? '' : nowState.DETAIL_CARNO,
          DETAIL_WEIGHT: nowState === undefined ? '' : nowState.DETAIL_WEIGHT,
          DETAIL_DATE  : nowState === undefined ? '' : nowState.DETAIL_DATE,

          STD_CAM_IMG  : nowState === undefined ? null : nowState.STD_CAM_IMG,
          DUM_CAM_IMG  : nowState === undefined ? null : nowState.DUM_CAM_IMG,
          ETC1_CAM_IMG : nowState === undefined ? false : nowState.ETC1_CAM_IMG,
          ETC2_CAM_IMG : nowState === undefined ? false : nowState.ETC2_CAM_IMG,

          STD_CAM_OPEN : nowState === undefined ? false : nowState.STD_CAM_OPEN,
          DUM_CAM_OPEN : nowState === undefined ? false : nowState.DUM_CAM_OPEN,
          ETC1_CAM_OPEN : nowState === undefined ? false : nowState.ETC1_CAM_OPEN,
          ETC2_CAM_OPEN : nowState === undefined ? false : nowState.ETC2_CAM_OPEN,

          STD_CAM_FOCUS: nowState === undefined ? false : nowState.STD_CAM_FOCUS,
          DUM_CAM_FOCUS: nowState === undefined ? false : nowState.DUM_CAM_FOCUS,
          ETC1_CAM_FOCUS : nowState === undefined ? false : nowState.ETC1_CAM_FOCUS,
          ETC2_CAM_FOCUS : nowState === undefined ? false : nowState.ETC2_CAM_FOCUS,

          STD_CAM_REC  : nowState === undefined ? {
            rec     : false,
            time    : '00:00'
          } : nowState.STD_CAM_REC,

          DUM_CAM_REC  : nowState === undefined ? {
            rec     : false,
            time    : '00:00'
          } : nowState.DUM_CAM_REC,

          CHIT_MEMO    : nowState === undefined ? '' : nowState.CHIT_MEMO,
          
          CHIT_INFO    : nowState === undefined ? {
            date     : '',
            scaleNumb: '',
            carNumb  : '',
            vender   : '',
            itemFlag : '',
            Wgt      : '',
            loc      : '',
            user     : '',
            chit     : 'N'
          } : nowState.CHIT_INFO,
          
          DISP_INFO    : nowState === undefined ? {
            scaleNumb       : '',
            scrp_ord_no     : '',
            scrp_grd_nm     : '',
            real_vender_name: '',
            load_area_nm    : '',
            load_area_addr  : ''
          } : nowState.DISP_INFO,

          DISP_PIC    : nowState === undefined ? {
            scaleNumb           : '',
            scrp_ord_no         : '',
            empty_front_date    : '',
            empty_front         : '',
            empty_front_gps_addr: '',
            empty_rear_date     : '',
            empty_rear          : '',
            empty_rear_gps_addr : '',
            cargo_front_date    : '',
            cargo_front         : '',
            cargo_front_gps_addr: '',
            cargo_rear_date     : '',
            cargo_rear          : '',
            cargo_rear_gps_addr : ''
          } : nowState.DISP_PIC
        };
      }

      if(action.type === 'DEVICE'){

        return Object.assign({}, nowState, {
          DEVICE : action.DEVICE
        })
      }else if(action.type === 'RAIN_INFO'){

        return Object.assign({}, nowState, {
          RAIN_INFO : action.RAIN_INFO
        })
      }else if(action.type === 'MAIN_WAIT'){

        return Object.assign({}, nowState, {
          MAIN_WAIT : action.MAIN_WAIT
        })
      }else if(action.type === 'DRIV_WAIT'){

        return Object.assign({}, nowState, {
          DRIV_WAIT : action.DRIV_WAIT
        })
      }else if(action.type === 'MAIN_TOTAL'){
        
        return Object.assign({}, nowState, {
          MAIN_TOTAL : action.MAIN_TOTAL
        })
      }else if(action.type === 'MAIN_WEIGHT'){

        return Object.assign({}, nowState, {
          MAIN_WEIGHT : action.MAIN_WEIGHT
        })
      }else if(action.type === 'BOT_TOTAL'){

        return Object.assign({}, nowState, {
          BOT_TOTAL : action.BOT_TOTAL
        })
      }else if(action.type === 'PROC_WAIT'){

        return Object.assign({}, nowState, {
          PROC_WAIT : action.PROC_WAIT
        })
      }else if(action.type === 'DEPT_WAIT'){

        return Object.assign({}, nowState, {
          DEPT_WAIT : action.DEPT_WAIT
        })
      }else if(action.type === 'ENTR_WAIT'){

        return Object.assign({}, nowState, {
          ENTR_WAIT : action.ENTR_WAIT
        })
      }else if(action.type === 'DETAIL_SCALE'){

        return Object.assign({}, nowState, {
          DETAIL_SCALE : action.DETAIL_SCALE
        })
      }else if(action.type === 'DETAIL_CARNO'){

        return Object.assign({}, nowState, {
          DETAIL_CARNO : action.DETAIL_CARNO
        })
      }else if(action.type === 'DETAIL_WEIGHT'){

        return Object.assign({}, nowState, {
          DETAIL_WEIGHT : action.DETAIL_WEIGHT
        })
      }else if(action.type === 'DETAIL_DATE'){

        return Object.assign({}, nowState, {
          DETAIL_DATE : action.DETAIL_DATE
        })
      }else if(action.type === 'STD_CAM_IMG'){

        return Object.assign({}, nowState, {
          STD_CAM_IMG : action.STD_CAM_IMG
        })
      }else if(action.type === 'DUM_CAM_IMG'){

        return Object.assign({}, nowState, {
          DUM_CAM_IMG : action.DUM_CAM_IMG
        })
      }else if(action.type === 'ETC1_CAM_IMG'){

        return Object.assign({}, nowState, {
          ETC1_CAM_IMG : action.ETC1_CAM_IMG
        })
      }else if(action.type === 'ETC2_CAM_IMG'){

        return Object.assign({}, nowState, {
          ETC2_CAM_IMG : action.ETC2_CAM_IMG
        })
      }else if(action.type === 'STD_CAM_OPEN'){

        return Object.assign({}, nowState, {
          STD_CAM_OPEN : action.STD_CAM_OPEN
        })
      }else if(action.type === 'DUM_CAM_OPEN'){

        return Object.assign({}, nowState, {
          DUM_CAM_OPEN : action.DUM_CAM_OPEN
        })
      }else if(action.type === 'ETC1_CAM_OPEN'){

        return Object.assign({}, nowState, {
          ETC1_CAM_OPEN : action.ETC1_CAM_OPEN
        })
      }else if(action.type === 'ETC2_CAM_OPEN'){

        return Object.assign({}, nowState, {
          ETC2_CAM_OPEN : action.ETC2_CAM_OPEN
        })
      }else if(action.type === 'STD_CAM_FOCUS'){

        return Object.assign({}, nowState, {
          STD_CAM_FOCUS : action.STD_CAM_FOCUS
        })
      }else if(action.type === 'DUM_CAM_FOCUS'){

        return Object.assign({}, nowState, {
          DUM_CAM_FOCUS : action.DUM_CAM_FOCUS
        })
      }else if(action.type === 'ETC1_CAM_FOCUS'){

        return Object.assign({}, nowState, {
          ETC1_CAM_FOCUS : action.ETC1_CAM_FOCUS
        })
      }else if(action.type === 'ETC2_CAM_FOCUS'){

        return Object.assign({}, nowState, {
          ETC2_CAM_FOCUS : action.ETC2_CAM_FOCUS
        })
      }else if(action.type === 'STD_CAM_REC'){

        return Object.assign({}, nowState, {
          STD_CAM_REC : {
            rec  : action.rec,
            //  car  : action.car,
            time : nowState.STD_CAM_REC.time
          }
        })
      }else if(action.type === 'DUM_CAM_REC'){

        return Object.assign({}, nowState, {
          DUM_CAM_REC : {
            rec  : action.rec,
            //  car  : action.car,
            time : nowState.DUM_CAM_REC.time
          }
        })
      }else if(action.type === 'STD_CAM_REC_TIME'){

        return Object.assign({}, nowState, {
          STD_CAM_REC : {
            rec     : nowState.STD_CAM_REC.rec,
            //  car     : action.car,
            time    : action.time
          }
        })
      }else if(action.type === 'DUM_CAM_REC_TIME'){

        return Object.assign({}, nowState, {
          DUM_CAM_REC : {
            rec     : nowState.DUM_CAM_REC.rec,
            //  car     : action.car,
            time    : action.time
          }
        })
      }
      // else if(action.type === 'CHIT_INFO_ITEM_FLAG'){

      //   return Object.assign({}, nowState, {
      //     CHIT_INFO : {
      //       date     :  nowState.CHIT_INFO.date,
      //       scaleNumb:  nowState.CHIT_INFO.scaleNumb,
      //       carNumb  :  nowState.CHIT_INFO.carNumb,
      //       vender   :  nowState.CHIT_INFO.vender,
      //       itemFlag :  action.itemFlag,
      //       Wgt      :  nowState.CHIT_INFO.Wgt,
      //       loc      :  nowState.CHIT_INFO.loc,
      //       user     :  nowState.CHIT_INFO.user,
      //       chit     :  nowState.CHIT_INFO.chit
      //     }
      //   })
      // }
      else if(action.type === 'CHIT_INFO'){

        return Object.assign({}, nowState, {
          CHIT_INFO : {
            date     : action.date,
            scaleNumb: action.scaleNumb,
            carNumb  : action.carNumb,
            vender   : action.vender,
            itemFlag : action.itemFlag,
            Wgt      : action.Wgt,
            loc      : action.loc,
            user     : action.user,
            chit     : action.chit
          }
        })
      }else if(action.type === 'CHIT_MEMO'){
        return Object.assign({}, nowState, {
          CHIT_MEMO : action.CHIT_MEMO
        })
      }else if(action.type === 'DISP_INFO'){

        return Object.assign({}, nowState, {
          DISP_INFO : {
            scaleNumb       : action.scaleNumb,
            scrp_ord_no     : action.scrp_ord_no,
            scrp_grd_nm     : action.scrp_grd_nm,
            real_vender_name: action.real_vender_name,
            load_area_nm    : action.load_area_nm,
            load_area_addr  : action.load_area_addr  
          }
        })
      }else if(action.type === 'DISP_PIC'){

        return Object.assign({}, nowState, {
          DISP_PIC : {
            scaleNumb           : action.scaleNumb,
            scrp_ord_no         : action.scrp_ord_no,
            empty_front_date    : action.empty_front_date,
            empty_front         : action.empty_front,
            empty_front_gps_addr: action.empty_front_gps_addr,
            empty_rear_date     : action.empty_rear_date,
            empty_rear          : action.empty_rear,
            empty_rear_gps_addr : action.empty_rear_gps_addr,
            cargo_front_date    : action.cargo_front_date,
            cargo_front         : action.cargo_front,
            cargo_front_gps_addr: action.cargo_front_gps_addr,
            cargo_rear_date     : action.cargo_rear_date,
            cargo_rear          : action.cargo_rear,
            cargo_rear_gps_addr : action.cargo_rear_gps_addr 
          }
        })
      }
    }

    gfs_injectAsyncReducer('INSP_PROC_MAIN', INSP_PROC_MAIN);
    gfs_subscribe(this.onActivePage);
    gfs_subscribe(this.onCameraChange);
    //#endregion
  }

  callOracle = async(file, fn, param) => {
    let result = await getDynamicSql_Oracle(
      file,
      fn,
      param
    ); 

    return result;
  }

  Init = async() => {
    await this.milestoneInfo();
  }

  //#region 개별조회
  mainHeader = async() => {
  
    // const select = await gfc_yk_call_sp('sp_zm_mstr_header');
    const select = await gfc_yk_call_sp('sp_zm_mstr_header_test');
    const R_CARSU = select.data.ROWS[0].R_CARSU === null ? 0 : select.data.ROWS[0].R_CARSU;
    const E_CARSU = select.data.ROWS[0].E_CARSU === null ? 0 : select.data.ROWS[0].E_CARSU;
    const E_KG = select.data.ROWS[0].E_KG === null ? 0 : select.data.ROWS[0].E_KG;

    if(select.data.SUCCESS === 'Y'){
      if(R_CARSU !== gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_WAIT'))
        gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WAIT', {MAIN_WAIT: R_CARSU});

      if(E_CARSU !== gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_TOTAL'))
        gfs_dispatch('INSP_PROC_MAIN', 'MAIN_TOTAL', {MAIN_TOTAL: E_CARSU});

      if(E_KG !== gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_WEIGHT'))
        gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WEIGHT', {MAIN_WEIGHT: E_KG});
    }else{
      if(gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_WAIT') !== 0)
        gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WAIT', {MAIN_WAIT: 0});
      if(gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_TOTAL') !== 0)
        gfs_dispatch('INSP_PROC_MAIN', 'MAIN_TOTAL', {MAIN_TOTAL: 0});
      if(gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_WEIGHT') !== 0)
        gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WEIGHT', {MAIN_WEIGHT: 0});
    }
  }

  mainHeader2 = async() => {
    //출차대기
    // const select = await gfc_yk_call_sp('sp_zm_mstr_pass');
    const select = await gfc_yk_call_sp('sp_zm_mstr_pass_test');

    if(select.data.SUCCESS === 'Y'){
      if(select.data.ROWS.length !== gfs_getStoreValue('INSP_PROC_MAIN', 'DEPT_WAIT'))
        gfs_dispatch('INSP_PROC_MAIN', 'DEPT_WAIT', {DEPT_WAIT: select.data.ROWS.length});
    }else{
      if(gfs_getStoreValue('INSP_PROC_MAIN', 'DEPT_WAIT') !== 0)
        gfs_dispatch('INSP_PROC_MAIN', 'DEPT_WAIT', {DEPT_WAIT: 0});
    }

    //입차대기
    // const select2 = await gfc_yk_call_sp('SP_ZM_MSTR_DRIVE');
    const select2 = await gfc_yk_call_sp('SP_ZM_MSTR_DRIVE_TEST');

    if(select2.data.SUCCESS === 'Y'){
      if(select2.data.ROWS.length !== gfs_getStoreValue('INSP_PROC_MAIN', 'ENTR_WAIT'))
        gfs_dispatch('INSP_PROC_MAIN', 'ENTR_WAIT', {ENTR_WAIT: select2.data.ROWS.length});
    }else{
      if(gfs_getStoreValue('INSP_PROC_MAIN', 'ENTR_WAIT') !== 0)
        gfs_dispatch('INSP_PROC_MAIN', 'ENTR_WAIT', {ENTR_WAIT: 0});
    }

    // //운송대기
    // const select3 = await gfc_yk_call_sp('SP_ZM_MSTR_DRIVE_WAIT');
    const select3 = await gfc_yk_call_sp('SP_ZM_MSTR_DRIVE_WAIT_TEST');

    if(select3.data.SUCCESS === 'Y'){
      if(select3.data.ROWS.length !== gfs_getStoreValue('INSP_PROC_MAIN', 'DRIV_WAIT'))
        gfs_dispatch('INSP_PROC_MAIN', 'DRIV_WAIT', {DRIV_WAIT: select3.data.ROWS.length});
    }else{
      if(gfs_getStoreValue('INSP_PROC_MAIN', 'DRIV_WAIT') !== 0)
        gfs_dispatch('INSP_PROC_MAIN', 'DRIV_WAIT', {DRIV_WAIT: 0});
    }
  }

  mainGrid = async() => {
    const grid = gfg_getGrid(this.props.pgm, 'main10');

    // const select = await gfc_yk_call_sp('SP_ZM_MSTR_WAIT');
    const select = await gfc_yk_call_sp('SP_ZM_MSTR_WAIT_TEST');
    if(select.data.SUCCESS === 'Y'){
      const main = select.data.ROWS;
        
      if(main.length !== gfs_getStoreValue('INSP_PROC_MAIN', 'PROC_WAIT'))
        gfs_dispatch('INSP_PROC_MAIN', 'PROC_WAIT', {PROC_WAIT: main.length});

      const search_tp = gfo_getCombo(this.props.pgm, 'search_tp').getValue();
      const search_txt = gfo_getInput(this.props.pgm, 'search_txt').getValue();
  
      const dataMod = [];
      main.forEach(e => {
        dataMod.push({
          scaleNumb: e['DELIVERY_ID'].toString(),
          carNumb: e['VEHICLE_NO'],
          itemGrade: e['ITEM_GRADE'],
          date: e['CREATION_DATE'],
          vendor: e['VENDOR_NAME']
        })
      })

      let data = dataMod.filter(e => {
        if(search_tp !== null && search_tp !== ''){
          //계근번호
          if(search_tp === '1'){
            if(e.scaleNumb.indexOf(search_txt) >= 0){
              return true;
            }else{
              return false;
            }
          }
          //차량번호
          else if(search_tp === '2'){
            if(e.carNumb.indexOf(search_txt) >= 0){
              return true;
            }else{
              return false;
            }
          }
          //사전등급
          else if(search_tp === '3'){
            if(e.itemGrade.indexOf(search_txt) >= 0){
              return true;
            }else{
              return false;
            }
          }
          //업체
          else if(search_tp === '4'){
            if(e.vendor.indexOf(search_txt) >= 0){
              return true;
            }else{
              return false;
            }
          }
          
        }else{
          return true;
        }
      })

      if(data.length > 0){
        
        //기존 그리드에서 scaleNumb기준으로 데이터가 없으면 추가한다.
        for(let i = 0; i < data.length; i++){
          const scaleNumb = data[i].scaleNumb;

          const oldData = grid.getData().find(e => e.scaleNumb === scaleNumb);
          if(!oldData){
            gfg_appendRow(grid, grid.getRowCount(), {
              scaleNumb,
              carNumb: data[i].carNumb,
              itemGrade: data[i].itemGrade,
              date: data[i].date,
              vendor: data[i].vendor,
              rec: '0'
            }, 'scaleNumb', false);
            grid.resetOriginData();
          }
        }

        //새로운 정보 기준으로 데이터가 지워졌으면 삭제한다.
        for(let i = 0; i < grid.getData().length; i++){
          const scaleNumb =  grid.getData()[i].scaleNumb;

          const newData = data.find(e => e.scaleNumb === scaleNumb)
          if(!newData){
            grid.removeRow(i);

            //지워진 데이터가 기존에 선택된 데이터 이면 초기화 한다.
            const selectScaleNumb = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_SCALE');
            if(scaleNumb === selectScaleNumb){
              gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: ''});
              gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: ''});
              gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: '0'});
              gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: ''});
            }
          }
        }

        RecodingList().then(recScaleNumb => {
          for(let i = 0; i < recScaleNumb.data.Response.length; i++){

            const data = grid.getData().find(e => e.scaleNumb === recScaleNumb.data.Response[i])
            if(data){
              //녹화 on만 설정
              grid.setValue(data.rowKey, 'rec', '1');
            }
          }

          const recGrid = grid.getData().filter(e => e.rec === '1');
          for(let i = 0; i < recGrid.length; i++){
            const data = recScaleNumb.data.Response.find(e => e === recGrid[i].scaleNumb);
            if(!data){
              //녹화 off만 설정
              grid.setValue(recGrid[i].rowKey, 'rec', '0');
            }
          }
        })
  
        if(data.length !== gfs_getStoreValue('INSP_PROC_MAIN', 'BOT_TOTAL'))
          gfs_dispatch('INSP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: data.length});
      }
    }else{
      grid.clear();
      if(gfs_getStoreValue('INSP_PROC_MAIN', 'BOT_TOTAL') !== 0)
        gfs_dispatch('INSP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
    }

    await this.mainHeader();
    await this.mainHeader2();
  }
  //#endregion

  componentDidMount(){
    this.Init();
    // this.Retrieve();

    // this.mainHeaderInterval = setInterval(e => {
    //   this.mainHeader();
    // }, 2000)

    // this.mainHeaderInterval2 = setInterval(e => {
    //   this.mainHeader2();
    // }, 5000)

    this.mainGridInterval = setInterval(e => {
      this.mainGrid();
    }, 2000)
  }

  componentWillUnmount(){
    // clearInterval(this.mainHeaderInterval);
    // clearInterval(this.mainHeaderInterval2);
    clearInterval(this.mainGridInterval);
  }

  Retrieve = async () => {
    gfc_showMask();

    gfo_getInput(this.props.pgm, 'detail_pre_grade').setValue(''); //사전등급
    gfo_getCombo(this.props.pgm, 'detail_grade1').setValue('');   //고철등급
    gfo_getCombo(this.props.pgm, 'detail_grade2').setValue('');   //상세고철등급
    gfo_getCombo(this.props.pgm, 'detail_subt').setValue('');     //감량중량
    gfo_getCombo(this.props.pgm, 'detail_subt_leg').setValue(''); //감량사유
    gfo_getCombo(this.props.pgm, 'detail_depr').setValue('');     //감가내역
    gfo_getCombo(this.props.pgm, 'detail_depr2').setValue('');    //감가비율
    gfo_getCombo(this.props.pgm, 'detail_car').setValue('');      //차종구분
    gfo_getCombo(this.props.pgm, 'detail_rtn').setValue('');      //반품구분
    gfo_getCombo(this.props.pgm, 'detail_rtn2').setValue('');     //반품구분사유
    gfo_getCheckbox(this.props.pgm, 'detail_warning').setValue('');  //경고

    gfo_getInput(this.props.pgm, 'disp_scrp_ord_no').setValue('');      //배차번호
    gfo_getInput(this.props.pgm, 'disp_scrp_grd_nm').setValue('');      //배차등급
    gfo_getInput(this.props.pgm, 'disp_real_vender_name').setValue(''); //실공급자
    gfo_getInput(this.props.pgm, 'disp_load_area_nm').setValue('');     //실상차지
    gfo_getInput(this.props.pgm, 'disp_load_area_addr').setValue('');   //주소

    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: ''});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: ''});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: ''});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: ''});
    gfs_dispatch('INSP_PROC_MAIN', 'CHIT_INFO', {
      chit     : false
    });

    gfs_dispatch('INSP_PROC_MAIN', 'DISP_INFO', {
      scaleNumb       : '',
      scrp_ord_no     : '',
      scrp_grd_nm     : '',
      real_vender_name: '',
      load_area_nm    : '',
      load_area_addr  : ''
    });

    gfs_dispatch('INSP_PROC_MAIN', 'DISP_PIC', {
      scaleNumb           : '',
      scrp_ord_no         : '',
  
      empty_front_date    : '',
      empty_front         : '',
      empty_front_gps_addr: '',
      empty_rear_date     : '',
      empty_rear          : '',
      empty_rear_gps_addr : '',
      cargo_front_date    : '',
      cargo_front         : '',
      cargo_front_gps_addr: '',
      cargo_rear_date     : '',
      cargo_rear          : '',
      cargo_rear_gps_addr : ''
    });

    this.mainGrid();
    // this.mainHeader();
    // this.mainHeader2();

    gfc_hideMask();
  }

  dblclick = async(e) => {
    gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
      ({
        windowZindex: 0,
        activeWindow: {programId:  'INSP_HIST',
                       programNam: '검수이력'
                      }
      })
    );
  }

  onSelectChange = async (e) => {
    if(e === null) return;

    gfc_showMask();

    document.getElementById('tab1_INSP_PROC').click(0);
    await gfc_sleep(100);

    gfo_getInput(this.props.pgm, 'detail_pre_grade').setValue(e.itemGrade); //사전등급
    gfo_getCombo(this.props.pgm, 'detail_grade1').setValue('');   //고철등급
    gfo_getCombo(this.props.pgm, 'detail_grade2').setValue('');   //상세고철등급
    gfo_getCombo(this.props.pgm, 'detail_subt').setValue('');     //감량중량
    gfo_getCombo(this.props.pgm, 'detail_subt_leg').setValue(''); //감량사유
    gfo_getCombo(this.props.pgm, 'detail_depr').setValue('');     //감가내역
    gfo_getCombo(this.props.pgm, 'detail_depr2').setValue('');    //감가비율
    gfo_getCombo(this.props.pgm, 'detail_car').setValue(e.cartype);      //차종구분
    gfo_getCombo(this.props.pgm, 'detail_rtn').setValue('');      //반품구분
    gfo_getCombo(this.props.pgm, 'detail_rtn2').setValue('');     //반품구분사유
    gfo_getCheckbox(this.props.pgm, 'detail_warning').setValue('');  //경고

    gfo_getInput(this.props.pgm, 'disp_scrp_ord_no').setValue('');      //배차번호
    gfo_getInput(this.props.pgm, 'disp_scrp_grd_nm').setValue('');      //배차등급
    gfo_getInput(this.props.pgm, 'disp_real_vender_name').setValue(''); //실공급자
    gfo_getInput(this.props.pgm, 'disp_load_area_nm').setValue('');     //실상차지
    gfo_getInput(this.props.pgm, 'disp_load_area_addr').setValue('');   //주소

    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: e.scaleNumb});
    setSessionCookie('DETAIL_SCALE', e.scaleNumb);
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: e.carNumb});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: e.totalWgt});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: e.date});
    gfs_dispatch('INSP_PROC_MAIN', 'CHIT_INFO', {
      chit     : false
    });

    //계량증명서 정보여부
    
    const chitInfoYn = await gfc_yk_call_sp('SP_ZM_CHIT', {
      P_SCALENUMB: e.scaleNumb
    });

    if(chitInfoYn.data.SUCCESS === 'N'){
      alert('계량증명서 정보가 없습니다.');
      gfc_hideMask();
      return;
    }

    //계량증명서
    const chitYn = await gfc_ftp_file_yn_YK(e.scaleNumb);
    gfs_dispatch('INSP_PROC_MAIN', 'CHIT_INFO', {
      date     : chitInfoYn.data.ROWS[0].CREATION_DATE,
      scaleNumb: chitInfoYn.data.ROWS[0].DELIVERY_ID.toString(),
      carNumb  : chitInfoYn.data.ROWS[0].VEHICLE_NO,
      vender   : chitInfoYn.data.ROWS[0].VENDOR_NAME,
      itemFlag : e.itemGrade,
      Wgt      : chitInfoYn.data.ROWS[0].TOTAL_WEIGHT,
      loc      : chitInfoYn.data.ROWS[0].AREA,
      user     : gfs_getStoreValue('USER_REDUCER', 'USER_NAM'),
      chit     : chitYn.data
    });

    //배차정보 김경현
    const dispInfo = await gfc_yk_call_sp('SP_ZM_PROCESS_F3', {
      P_SCALENUMB: e.scaleNumb
    });

    if(dispInfo.data.SUCCESS === 'Y'){
      gfs_dispatch('INSP_PROC_MAIN', 'DISP_INFO', {
        scaleNumb       : chitInfoYn.data.ROWS[0].DELIVERY_ID.toString(),
        scrp_ord_no     : dispInfo.data.ROWS[0].SCRP_ORD_NO,
        scrp_grd_nm     : dispInfo.data.ROWS[0].SCRP_GRD_NM,
        real_vender_name: dispInfo.data.ROWS[0].REAL_VENDER_NAME,
        load_area_nm    : dispInfo.data.ROWS[0].LOAD_AREA_NM,
        load_area_addr  : dispInfo.data.ROWS[0].LOAD_AREA_ADDR
      });

      const scrp_ord_no = dispInfo.data.ROWS[0].SCRP_ORD_NO;
      const yyyy = scrp_ord_no.substr(2, 4);
      const mm = scrp_ord_no.substr(6, 2);
      const dd = scrp_ord_no.substr(8, 2);

      gfs_dispatch('INSP_PROC_MAIN', 'DISP_PIC', {
        scaleNumb           : chitInfoYn.data.ROWS[0].DELIVERY_ID.toString(),
        scrp_ord_no         : dispInfo.data.ROWS[0].SCRP_ORD_NO,
    
        empty_front_date    : dispInfo.data.ROWS[0].EMPTY_FRONT_DATE,
        empty_front         : `http://scrap.yksteel.co.kr:8088/stms/resources/upload/${yyyy}/${mm}/${dd}/${dispInfo.data.ROWS[0].EMPTY_FRONT}`,
        empty_front_gps_addr: dispInfo.data.ROWS[0].EMPTY_FRONT_GPS_ADDR,
        
        empty_rear_date     : dispInfo.data.ROWS[0].EMPTY_REAR_DATE,
        empty_rear          : `http://scrap.yksteel.co.kr:8088/stms/resources/upload/${yyyy}/${mm}/${dd}/${dispInfo.data.ROWS[0].EMPTY_REAR}`,
        empty_rear_gps_addr : dispInfo.data.ROWS[0].EMPTY_REAR_GPS_ADDR,
        
        cargo_front_date    : dispInfo.data.ROWS[0].CARGO_FRONT_DATE,
        cargo_front         : `http://scrap.yksteel.co.kr:8088/stms/resources/upload/${yyyy}/${mm}/${dd}/${dispInfo.data.ROWS[0].CARGO_FRONT}`,
        cargo_front_gps_addr: dispInfo.data.ROWS[0].CARGO_FRONT_GPS_ADDR,
        
        cargo_rear_date     : dispInfo.data.ROWS[0].CARGO_REAR_DATE,
        cargo_rear          : `http://scrap.yksteel.co.kr:8088/stms/resources/upload/${yyyy}/${mm}/${dd}/${dispInfo.data.ROWS[0].CARGO_REAR}`,
        cargo_rear_gps_addr : dispInfo.data.ROWS[0].CARGO_REAR_GPS_ADDR
      });
    }
    
    gfc_hideMask();
  }

  render() {

    return (
      <div className='win_body' style={{borderRadius:'0px', borderWidth:'0px 1px 0px 1px'}}>
        <div className='car_manager'>

          
          <div className='car_list'>
            <div className='search_line'>
              <div className='wp'>
                <div style={{position:'absolute', left:0, top:0, width:'124px', height:'42px', fontSize:'16px'}}>
                  <Combobox pgm     = {this.props.pgm}
                            id      = 'search_tp'
                            value   = 'code'
                            display = 'name'
                            width   = {124}
                            height  = {42}
                            emptyRow
                            data    = {[{
                              code: '1',
                              name: '계근번호'
                            },{
                              code: '2',
                              name: '차량번호'
                            },{
                              code: '3',
                              name: '사전등급'
                            },{
                              code: '4',
                              name: '업체'
                            }]}
                  />
                </div>
                <Input pgm         = {this.props.pgm}
                       id          = 'search_txt'
                       height      = '42'
                       placeHolder = '검색어를 입력하세요'
                       paddingLeft = '14'
                       width       = '100%'
                       type        = 'textarea'
                       onKeyDown   = {(e) => {
                        if(e.keyCode === 13){
                          this.Retrieve()
                        }
                       }}
                      //  padding-bottom:2px; padding-left:14px; border:none; font-size:22px;
                        />
                <button>검색</button>
              </div>
            </div>
            <div className='grid'>
              <div className='wp'>
                <div style={{width:'100%', height:'100%', overflow:'auto'}}>
                  <Grid pgm={this.props.pgm}
                        id ='main10'
                        selectionChange={(e) => this.onSelectChange(e)}
                        // dblclick={(e) => this.dblclick(e)}
                        rowHeight={46}
                        rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                        columns={[
                          columnInput({
                            name: 'scaleNumb',
                            header: '계근번호',
                            width : 110,
                            readOnly: true,
                            color : '#0063A9',
                            align : 'center'
                          }),
                          columnInput({
                            name: 'carNumb',
                            header: '차량번호',
                            width : 90,
                            readOnly: true,
                            align : 'center'
                          }),   
                          columnInput({
                            name: 'itemGrade',
                            header: '사전등급',
                            width : 135,
                            readOnly: true,
                            align : 'center'
                          }),   
                          columnDateTime({
                            name  : 'date',
                            header: '입차시간',
                            width : 120,
                            height: 38,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT'),
                            time  : 'HH:mm:ss'
                          }),
                          columnTextArea({
                            name: 'vendor',
                            header: 'Vendor',
                            width : 160,
                            height: 38,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnImage({
                            name: 'rec',
                            header: '녹화중',
                            width: 85,
                            imgItem:[
                              {'code':'0', 'value': ''},
                              {'code':'1', 'value': <GifPlayer height='30' width='70' gif={require('../../../Image/yk_rec01.gif').default} autoplay/>}
                            ]
                          })
                        ]}
                  />
                </div>
              </div>
              <div className='grid_info'>
                <span className='title'>잔여차량</span><Botspan reducer='INSP_PROC_MAIN' />
              </div>
            </div>
            <div className='total_info'>
              <ul>
                <li><span className='title'>잔류 차량</span><Mainspan reducer='INSP_PROC_MAIN' flag={1} /></li>
                <li onClick={e => {
                  const auth = gfs_getStoreValue('USER_REDUCER', 'AUTH');
                  if(auth.length === undefined || auth.length === 0) return;

                  const openAuth = auth.find(e => e.MENU_ID === 'DAILY_PROC');
                  if(openAuth !== null){
                    if(openAuth.PGMAUT_YN === 'Y'){

                      //#region 프로그램 리듀서 생성
                      gfs_PGM_REDUCER('DAILY_PROC');
                      //#endregion

                      gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
                        ({
                          windowZindex: 0,
                          activeWindow: {programId: 'DAILY_PROC',
                                        programNam: '검수일계표'
                                        }
                        })
                      );
                    }
                  }
                }}><span className='title'>전체 검수 차량</span><Mainspan reducer='INSP_PROC_MAIN' flag={2} /></li>
                <li onClick={e => {
                  const auth = gfs_getStoreValue('USER_REDUCER', 'AUTH');
                  if(auth.length === undefined || auth.length === 0) return;

                  const openAuth = auth.find(e => e.MENU_ID === 'DAILY_PROC');
                  if(openAuth !== null){
                    if(openAuth.PGMAUT_YN === 'Y'){

                      //#region 프로그램 리듀서 생성
                      gfs_PGM_REDUCER('DAILY_PROC');
                      //#endregion

                      gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
                        ({
                          windowZindex: 0,
                          activeWindow: {programId: 'DAILY_PROC',
                                        programNam: '검수일계표'
                                        }
                        })
                      );
                    }
                  }
                }}><span className='title'>입고량(KG)</span><Mainspan reducer='INSP_PROC_MAIN' flag={3} /></li>
              </ul>
              <ul className='four'>
                <li><span className='title'>검수대기</span><Mainspan reducer='INSP_PROC_MAIN' flag={4} /></li>
                <li onClick={e => {
                  const auth = gfs_getStoreValue('USER_REDUCER', 'AUTH');
                  if(auth.length === undefined || auth.length === 0) return;

                  const openAuth = auth.find(e => e.MENU_ID === 'DISP_PROC');
                  if(openAuth !== null){
                    if(openAuth.PGMAUT_YN === 'Y'){

                      //#region 프로그램 리듀서 생성
                      gfs_PGM_REDUCER('DISP_PROC');
                      //#endregion

                      gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
                        ({
                          windowZindex: 0,
                          activeWindow: {programId: 'DISP_PROC',
                                        programNam: '출차대기'
                                        }
                        })
                      );
                    }
                  }
                }}><span className='title'>출차대기</span><Mainspan reducer='INSP_PROC_MAIN' flag={5} /></li>
                <li onClick={e => {
                  const auth = gfs_getStoreValue('USER_REDUCER', 'AUTH');
                  if(auth.length === undefined || auth.length === 0) return;

                  const openAuth = auth.find(e => e.MENU_ID === 'ENTR_PROC');
                  if(openAuth !== null){
                    if(openAuth.PGMAUT_YN === 'Y'){
                  
                      //#region 프로그램 리듀서 생성
                      gfs_PGM_REDUCER('ENTR_PROC');
                      //#endregion

                      gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
                        ({
                          windowZindex: 0,
                          activeWindow: {programId: 'ENTR_PROC',
                                        programNam: '입차대기'
                                        }
                        })
                      );
                    }
                  }
                }}><span className='title'>입차대기</span><Mainspan reducer='INSP_PROC_MAIN' flag={6} /></li>
                <li onClick={e => {
                  const auth = gfs_getStoreValue('USER_REDUCER', 'AUTH');
                  if(auth.length === undefined || auth.length === 0) return;

                  const openAuth = auth.find(e => e.MENU_ID === 'ENTR_PROC');
                  if(openAuth !== null){
                    if(openAuth.PGMAUT_YN === 'Y'){
                  
                      //#region 프로그램 리듀서 생성
                      gfs_PGM_REDUCER('ENTR_WAIT');
                      //#endregion

                      gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
                        ({
                          windowZindex: 0,
                          activeWindow: {programId: 'ENTR_WAIT',
                                        programNam: '운송대기'
                                        }
                        })
                      );
                    }
                  }
                }}><span className='title'>운송대기</span><Mainspan reducer='INSP_PROC_MAIN' flag={7} /></li>
              </ul>
            </div>
          </div>
          <div className='car_info' id='car_info'>
            <div className='title'><span>계근번호</span><Detailspan reducer='INSP_PROC_MAIN' flag={1} /></div>

            <TabList pgm={this.props.pgm} id={this.props.id} reducer='INSP_PROC_MAIN'/>

            <div className='tab_content' id='tabMain'>
              <div className='input_list on' id={`content1_${this.props.pgm}`}>
                <ul>
                  <li>
                    <h5>사전등급</h5>
                      <Input pgm     = {this.props.pgm}
                             id      = 'detail_pre_grade'
                             width   = '100%'
                             disabled
                      />
                  </li>
                  <li>
                    <h5>등급책정</h5>
                    <div style={{marginBottom:'5px'}}>
                      <Combobox pgm     = {this.props.pgm}
                                id      = 'detail_grade1'
                                value   = 'itemCode'
                                display = 'item'
                                placeholder = '고철등급 검색'
                                height  = {42}
                                oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                                  p_division    : 'P005'
                                })}
                                onChange = {async (e) => {
                                  const combo = gfo_getCombo(this.props.pgm, 'detail_grade2');
                                  combo.setValue(null);
                                  combo.setDisabled(true);

                                  if(e !== undefined && e.value !== ''){
                                    await combo.onReset({oracleSpData:  gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                                      p_division    : e.value
                                    })});
                                    combo.setDisabled(false);
                                  }else{
                                    combo.setDisabled(true);
                                  }
                                }}
                      />
                    </div>
                    <Combobox pgm     = {this.props.pgm}
                              id      = 'detail_grade2'
                              value   = 'itemCode'
                              display = 'item'
                              isDisabled
                    />
                  </li>
                  <li>
                    <h5>감량중량</h5>
                    <div style={{marginBottom:'5px'}}>
                      <Combobox pgm     = {this.props.pgm}
                            id      = 'detail_subt'
                            value   = 'itemCode'
                            display = 'item'
                            placeholder = '감량중량 검색(KG)'
                            oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                              p_division    : 'P535'
                            })}
                            onChange = {async (e) => {
                              const combo = gfo_getCombo(this.props.pgm, 'detail_subt_leg');
                              combo.setValue(null);
                              combo.setDisabled(true);

                              if(e === undefined) return;

                              if(e.value !== '0'){
                                await combo.onReset({oracleSpData:  gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                                  p_division    : e.value
                                })});
                                combo.setDisabled(false);
                              }
                            }}
                      />
                    </div>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_subt_leg'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '감량사유 검색'
                          oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                            p_division    : 'P620'
                          })}
                          isDisabled
                    /> 
                  </li>
                  <li>
                    <h5>감가내역</h5>
                    <div style={{marginBottom:'5px'}}>
                      <Combobox pgm     = {this.props.pgm}
                            id      = 'detail_depr'
                            value   = 'itemCode'
                            display = 'item'
                            placeholder = '감가내역 검색'
                            oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                              p_division    : 'P130'
                            })}
                            emptyRow
                            onChange = {async (e) => {
                              const combo = gfo_getCombo(this.props.pgm, 'detail_depr2');
                              combo.setValue(null);

                              if(e === undefined) return;

                              if(e !== undefined && e.value !== ''){
                                combo.setDisabled(false);
                              }else{
                                combo.setDisabled(true);
                              }
                            }}
                      />
                    </div>
                    <Combobox pgm = {this.props.pgm}
                          id      = 'detail_depr2'
                          value   = 'CODE'
                          display = 'NAME'
                          placeholder = '감가비율'
                          isDisabled
                          data    = {[{
                            'CODE': '10',
                            'NAME': '10%'
                          },{
                            'CODE': '20',
                            'NAME': '20%'
                          },{
                            'CODE': '30',
                            'NAME': '30%'
                          },{
                            'CODE': '40',
                            'NAME': '40%'
                          },{
                            'CODE': '50',
                            'NAME': '50%'
                          },{
                            'CODE': '60',
                            'NAME': '60%'
                          },{
                            'CODE': '70',
                            'NAME': '70%'
                          },{
                            'CODE': '80',
                            'NAME': '80%'
                          },{
                            'CODE': '90',
                            'NAME': '90%'
                          },{
                            'CODE': '100',
                            'NAME': '100%'
                          }]}
                          // emptyRow
                    />
                  </li>
                  {/* <li>
                    <h5>하차구역</h5>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_out'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '하차구역 검색(SECTOR)'
                          data    = ''
                          onFocus = {ComboCreate => {
                            YK_WEB_REQ('tally_process_pop.jsp?division=P530', {})
                              .then(res => {
                                ComboCreate({data   : res.data.dataSend,
                                            value  : 'itemCode',
                                            display: 'item'});
                              })
                          }}
                  />
                  </li> */}
                  <li>
                    <h5>차종구분</h5>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_car'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '차종선택'
                          oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                            p_division    : 'P700'
                          })}
                  />
                  </li>
                  <li>
                    <h5>반품구분</h5>
                    <div style={{marginBottom:'5px'}}>
                      <Combobox pgm     = {this.props.pgm}
                            id      = 'detail_rtn'
                            value   = 'itemCode'
                            display = 'item'
                            placeholder = '일부,전량 선택'
                            oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                              p_division    : 'P110'
                            })}
                            emptyRow
                            onChange = {e => {
                              const combo = gfo_getCombo(this.props.pgm, 'detail_rtn2');
                              combo.setValue(null);

                              if(e === undefined) return;

                              if(e.value === ''){
                                combo.setDisabled(true);
                              }else{
                                combo.setDisabled(false);
                              }
                              // combo.onReset({etcData:  YK_WEB_REQ(`tally_process_pop.jsp?division=${e.value}`, {})});
                            }}
                    />
                  </div>
                  <Combobox pgm     = {this.props.pgm}
                            id      = 'detail_rtn2'
                            value   = 'itemCode'
                            display = 'item'
                            oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                              p_division    : 'P120'
                            })}
                            isDisabled
                    />
                  </li>
                  <li>
                    <h5>경고</h5>
                    <Checkbox pgm   = {this.props.pgm}
                              id    = 'detail_warning'
                              width = '30px'
                              height= '30px'

                    />
                  </li>
                </ul>
              </div>
              
              <Chit pgm={this.props.pgm} id={'chit_memo'} reducer='INSP_PROC_MAIN'/>
              
              <div className='input_list' id={`content3_${this.props.pgm}`}>
                <DispInfo pgm={this.props.pgm} />
              </div>

              <div className='input_list' id={`content4_${this.props.pgm}`}>
                <DispImg pgm={this.props.pgm} />
              </div>
            </div>
            
            <CompleteBtn pgm={this.props.pgm}/>
          </div>

          
          <div className='cctv_viewer'>
            <h4>실시간 CCTV</h4>
            <div className='manual_record'>
              <h5>수동녹화</h5>
              <button 
                type='button' 
                className='record'
                onClick={e => this.startRec()}
              >녹화</button>
              <button 
                type='button' 
                className='stop on'
                onClick={e => this.stopRec()}
              >정지</button>
            </div>
            <RainInfo />
            <div className='cctv_list' 
            >
              {this.state.device[0] !== undefined && 
                <RecImage 
                  seq={1}
                  device={this.state.device[0].camera.Guid} 
                  Name={this.state.device[0].camera.Name}
                  rtspAddr={this.state.device[0].rtspAddr}
                  cameraPort={this.state.device[0].cameraPort}
                  cameraNam={this.state.device[0].cameraNam}
                  cam='STD_CAM_OPEN' 
                  focus='STD_CAM_FOCUS' 
                  rec='STD_CAM_REC' 
                  image='STD_CAM_IMG'/> 
              }
              {this.state.device[1] !== undefined && 
                <RecImage
                  seq={2} 
                  device={this.state.device[1].camera.Guid} 
                  Name={this.state.device[1].camera.Name}
                  rtspAddr={this.state.device[1].rtspAddr}
                  cameraPort={this.state.device[1].cameraPort}
                  cameraNam={this.state.device[1].cameraNam}
                  cam='DUM_CAM_OPEN' 
                  focus='DUM_CAM_FOCUS' 
                  rec='DUM_CAM_REC' 
                  image='DUM_CAM_IMG'/> 
              }
            </div>
            <div className='cctv_other_list'>
              <ul>
                <li>
                  {this.state.device[2] !== undefined && 
                    <RecImage
                      seq={3} 
                      device={this.state.device[2].camera.Guid} 
                      Name={this.state.device[2].camera.Name}
                      rtspAddr={this.state.device[2].rtspAddr}
                      cameraPort={this.state.device[2].cameraPort}
                      cameraNam={this.state.device[2].cameraNam}
                      cam='ETC1_CAM_OPEN' 
                      focus='ETC1_CAM_FOCUS' 
                      rec='ETC1_CAM_REC' 
                      image='ETC1_CAM_IMG'/> 
                  }
                </li>
                <li>
                  {this.state.device[3] !== undefined && 
                    <RecImage
                      seq={4} 
                      device={this.state.device[3].camera.Guid} 
                      Name={this.state.device[3].camera.Name}
                      rtspAddr={this.state.device[3].rtspAddr}
                      cameraPort={this.state.device[3].cameraPort}
                      cameraNam={this.state.device[3].cameraNam}
                      cam='ETC2_CAM_OPEN' 
                      focus='ETC2_CAM_FOCUS' 
                      rec='ETC2_CAM_REC' 
                      image='ETC2_CAM_IMG'/> 
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default INSP_PROC;