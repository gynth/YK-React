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
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';
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

let retData = [];
class INSP_PROC extends Component {

  state = {
    wait_list: [],
    device: []
  }

  milestoneInfo = async() => {

    // ????????? ????????? ???????????? ????????? ???????????? ?????????
    // ????????? ???????????? ??????????????? ????????? ????????????????????? ??????????????? ?????? ????????? ????????? ???????????? ????????? ???????????? ????????????.
    // 1. ????????? ????????? ????????? ????????? ???????????????.
    // const milestone = TOKEN({reqAddr: 'LOGIN', MilestoneIP: gfs_getStoreValue('CAMERA_REDUCER', 'MilestoneIP')});
    const milestone = await TOKEN({});
    this.token  = milestone.data.TOKEN;
    this.device = milestone.data.DEVICE;
    if(this.token === ''){
      alert('???????????? ????????? ????????? ??? ????????????.'); 
    }else if(this.device === ''){
      alert('???????????? ????????? ????????? ??? ????????????.');
    }else{
      const areaTp = gfs_getStoreValue('USER_REDUCER', 'AREA_TP');
      const select = await this.callOracle('Common/Common', 'ZM_IMS_CAMERA_SELECT_EACH', [{AREA_TP:areaTp}]);
      if(select.data === undefined){
        alert('????????? ???????????? ????????????.');
        return;
      }

      if(select.data.rows.length === 0){
        alert('????????? ???????????? ????????????.');
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

  //#region onActivePage ????????? subscribe??? ?????????.
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

  //#region ????????????
  startRec = async () => {
    
    const scaleNumb = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_SCALE');
    const camera_no = gfs_getStoreValue('USER_REDUCER', 'CAMERA_NO');
    if(scaleNumb === ''){
      alert('????????? ??????????????? ????????????.');
      return;
    }
    if(camera_no === '' || camera_no === null){
      alert('????????? ???????????? ???????????? ????????????.');
      return;
    }

    //??????????????? ??????????????? ??????.
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
          //0. ???????????? ????????? ??????
          if(recYn.data.Response === 'OK'){
            //1. DB??? ?????????????????? ??????
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
              alert('???????????? ????????? ??????????????????.');
            }
          }
        }else{
          return;
        }
      }else{
        if(window.confirm(result.data.MSG_TEXT) === true){
          //1. DB??? ?????????????????? ??????
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
            alert('???????????? ????????? ??????????????????.');
          }
        }else{
          return;
        }
      }
    }else{
        //1. DB??? ?????????????????? ??????
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
          alert('???????????? ????????? ??????????????????.');
        }
    }
  }

  stopRec = async () => {
    const scaleNumb = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_SCALE');
    const camera_no = gfs_getStoreValue('USER_REDUCER', 'CAMERA_NO');
    if(scaleNumb === ''){
      alert('????????? ??????????????? ????????????.');
      return;
    }
    if(camera_no === '' || camera_no === null){
      alert('????????? ???????????? ???????????? ????????????.');
      return;
    }

    //??????????????? ??????????????? ??????.
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
      alert('???????????? ??????????????? ????????????.');
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
        alert('???????????? ????????? ??????????????????.');
      }
    }
  }
  //#endregion



  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this);

    //#region ?????????
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
          CAR_TOTAL    : nowState === undefined ? 0 : nowState.CAR_TOTAL,
          
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
      }else if(action.type === 'CAR_TOTAL'){

        return Object.assign({}, nowState, {
          CAR_TOTAL : action.CAR_TOTAL
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

  //#region ????????????
  mainHeader = async() => {
  
    // const select = await gfc_yk_call_sp('sp_zm_mstr_header');
    const select = await gfc_yk_call_sp('sp_zm_mstr_header');

    if(select.data.SUCCESS === 'Y'){
      const R_CARSU = select.data.ROWS[0].R_CARSU === null ? 0 : select.data.ROWS[0].R_CARSU;
      const E_CARSU = select.data.ROWS[0].E_CARSU === null ? 0 : select.data.ROWS[0].E_CARSU;
      const E_KG = select.data.ROWS[0].E_KG === null ? 0 : select.data.ROWS[0].E_KG;
      const CAR_TOTAL = select.data.ROWS[0].CAR_TOTAL === null ? 0 : select.data.ROWS[0].CAR_TOTAL;

      if(R_CARSU !== gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_WAIT'))
        gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WAIT', {MAIN_WAIT: R_CARSU});

      if(E_CARSU !== gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_TOTAL'))
        gfs_dispatch('INSP_PROC_MAIN', 'MAIN_TOTAL', {MAIN_TOTAL: E_CARSU});

      if(E_KG !== gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_WEIGHT'))
        gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WEIGHT', {MAIN_WEIGHT: E_KG});

      if(CAR_TOTAL !== gfs_getStoreValue('INSP_PROC_MAIN', 'CAR_TOTAL'))
        gfs_dispatch('INSP_PROC_MAIN', 'CAR_TOTAL', {CAR_TOTAL: CAR_TOTAL});
    }else{
      if(gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_WAIT') !== 0)
        gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WAIT', {MAIN_WAIT: 0});
      if(gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_TOTAL') !== 0)
        gfs_dispatch('INSP_PROC_MAIN', 'MAIN_TOTAL', {MAIN_TOTAL: 0});
      if(gfs_getStoreValue('INSP_PROC_MAIN', 'MAIN_WEIGHT') !== 0)
        gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WEIGHT', {MAIN_WEIGHT: 0});
        if(gfs_getStoreValue('INSP_PROC_MAIN', 'CAR_TOTAL') !== 0)
          gfs_dispatch('INSP_PROC_MAIN', 'CAR_TOTAL', {CAR_TOTAL: 0});
    }
  }

  mainHeader2 = async() => {
    //????????????
    // const select = await gfc_yk_call_sp('sp_zm_mstr_pass');
    const select = await gfc_yk_call_sp('sp_zm_mstr_pass');

    if(select.data.SUCCESS === 'Y'){
      if(select.data.ROWS.length !== gfs_getStoreValue('INSP_PROC_MAIN', 'DEPT_WAIT'))
        gfs_dispatch('INSP_PROC_MAIN', 'DEPT_WAIT', {DEPT_WAIT: select.data.ROWS.length});
    }else{
      if(gfs_getStoreValue('INSP_PROC_MAIN', 'DEPT_WAIT') !== 0)
        gfs_dispatch('INSP_PROC_MAIN', 'DEPT_WAIT', {DEPT_WAIT: 0});
    }

    //????????????
    // const select2 = await gfc_yk_call_sp('SP_ZM_MSTR_DRIVE');
    const select2 = await gfc_yk_call_sp('SP_ZM_MSTR_DRIVE');

    if(select2.data.SUCCESS === 'Y'){
      if(select2.data.ROWS.length !== gfs_getStoreValue('INSP_PROC_MAIN', 'ENTR_WAIT'))
        gfs_dispatch('INSP_PROC_MAIN', 'ENTR_WAIT', {ENTR_WAIT: select2.data.ROWS.length});
    }else{
      if(gfs_getStoreValue('INSP_PROC_MAIN', 'ENTR_WAIT') !== 0)
        gfs_dispatch('INSP_PROC_MAIN', 'ENTR_WAIT', {ENTR_WAIT: 0});
    }

    // //????????????
    // const select3 = await gfc_yk_call_sp('SP_ZM_MSTR_DRIVE_WAIT');
    const select3 = await gfc_yk_call_sp('SP_ZM_MSTR_DRIVE_WAIT');

    if(select3.data.SUCCESS === 'Y'){
      if(select3.data.ROWS.length !== gfs_getStoreValue('INSP_PROC_MAIN', 'DRIV_WAIT'))
        gfs_dispatch('INSP_PROC_MAIN', 'DRIV_WAIT', {DRIV_WAIT: select3.data.ROWS.length});
    }else{
      if(gfs_getStoreValue('INSP_PROC_MAIN', 'DRIV_WAIT') !== 0)
        gfs_dispatch('INSP_PROC_MAIN', 'DRIV_WAIT', {DRIV_WAIT: 0});
    }
  }

  mainGrid = async() => {
    try{
      const grid = gfg_getGrid(this.props.pgm, 'main10');
      const search_tp = gfo_getCombo(this.props.pgm, 'search_tp').getValue();
      const search_txt = gfo_getInput(this.props.pgm, 'search_txt').getValue();

      // await grid.restore();
  
      // //?????????
      // gfg_appendRow(grid, grid.getRowCount(), {
      //   scaleNumb: '202110140010',
      //   carNumb: 'data[i].carNumb',
      //   itemGrade: 'data[i].itemGrade',
      //   date: 'data[i].date',
      //   vendor: 'data[i].vendor',
      //   rec: '0'
      // }, 'scaleNumb', false);
      //   if(grid.getData().length !== gfs_getStoreValue('INSP_PROC_MAIN', 'PROC_WAIT'))
      //     gfs_dispatch('INSP_PROC_MAIN', 'PROC_WAIT', {PROC_WAIT: grid.getData().length});
  
      if(search_tp !== null && search_tp !== '' && search_txt !== ''){
        let main = retData.filter(e => {
          //????????????
          if(search_tp === '1'){
            if(e.scaleNumb.indexOf(search_txt) >= 0){
              return true;
            }else{
              return false;
            }
          }
          //????????????
          else if(search_tp === '2'){
            if(e.carNumb.indexOf(search_txt) >= 0){
              return true;
            }else{
              return false;
            }
          }
          //????????????
          else if(search_tp === '3'){
            if(e.itemGrade.indexOf(search_txt) >= 0){
              return true;
            }else{
              return false;
            }
          }
          //??????
          else if(search_tp === '4'){
            if(e.vendor.indexOf(search_txt) >= 0){
              return true;
            }else{
              return false;
            }
          }
        })
        grid.resetData(main);
        grid.resetOriginData()
        grid.restore();
      }else{
        const select = await gfc_yk_call_sp('SP_ZM_MSTR_WAIT');
        if(select.data.SUCCESS === 'Y'){
          let main = select.data.ROWS;
      
          const dataMod = [];
          main.forEach(e => {
            dataMod.push({
              scaleNumb: e['DELIVERY_ID'].toString(),
              carNumb: e['VEHICLE_NO'],
              itemGrade: e['ITEM_GRADE'],
              date: e['CREATION_DATE'],
              vendor: e['VENDOR_NAME'],
              warning: e['WARNING'],
              carType: e['CAR_TYPE'],
              scrpOrdNo: e['SCRP_ORD_NO']
            })
          })

          if(dataMod.length !== gfs_getStoreValue('INSP_PROC_MAIN', 'PROC_WAIT'))
            gfs_dispatch('INSP_PROC_MAIN', 'PROC_WAIT', {PROC_WAIT: dataMod.length});
    
          if(dataMod.length > 0){
            
            //?????? ??????????????? scaleNumb???????????? ???????????? ????????? ????????????.
            for(let i = 0; i < dataMod.length; i++){
              const scaleNumb = dataMod[i].scaleNumb;
    
              const oldData = grid.getData().find(e => e.scaleNumb === scaleNumb);
              if(!oldData){
                gfg_appendRow(grid, grid.getRowCount(), {
                  scaleNumb,
                  carNumb: dataMod[i].carNumb,
                  itemGrade: dataMod[i].itemGrade,
                  date: dataMod[i].date,
                  vendor: dataMod[i].vendor,
                  carType: dataMod[i].carType,
                  scrpOrdNo: dataMod[i].scrpOrdNo,
                  warning: dataMod[i].warning,
                  rec: '0'
                }, 'scaleNumb', false);
              }
            }
    
            //????????? ?????? ???????????? ???????????? ??????????????? ????????????.
            for(let i = 0; i < grid.getData().length; i++){
              const scaleNumb =  grid.getData()[i].scaleNumb;
    
              const newData = dataMod.find(e => e.scaleNumb === scaleNumb)
              if(!newData){
                grid.removeRow(i);
    
                //????????? ???????????? ????????? ????????? ????????? ?????? ????????? ??????.
                const selectScaleNumb = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_SCALE');
                if(scaleNumb === selectScaleNumb){
                  gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: ''});
                  gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: ''});
                  gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: '0'});
                  gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: ''});
                }
              }
            }
            
            grid.resetOriginData();
            grid.restore();
      
            if(dataMod.length !== gfs_getStoreValue('INSP_PROC_MAIN', 'BOT_TOTAL'))
              gfs_dispatch('INSP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: dataMod.length});
            
            retData = grid.getData();
            // await grid.resetOriginData();
            // await grid.refreshLayout();
          }
        }else{
          grid.clear();
          if(gfs_getStoreValue('INSP_PROC_MAIN', 'BOT_TOTAL') !== 0)
            gfs_dispatch('INSP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
        }
      }
  
      await this.mainHeader();
      await this.mainHeader2();
    }catch(e){

    }
  }
  //#endregion

  rec = async() => {

    try{
      RecodingList().then(recScaleNumb => {
        const grid = gfg_getGrid(this.props.pgm, 'main10');
  
        for(let i = 0; i < recScaleNumb.data.Response.length; i++){
  
          const data = grid.getData().find(e => e.scaleNumb === recScaleNumb.data.Response[i])
          if(data){
            //?????? on??? ??????
            grid.setValue(data.rowKey, 'rec', '1');
          }
        }
  
        const recGrid = grid.getData().filter(e => e.rec === '1');
        for(let i = 0; i < recGrid.length; i++){
          const data = recScaleNumb.data.Response.find(e => e === recGrid[i].scaleNumb);
          if(!data){
            //?????? off??? ??????
            grid.setValue(recGrid[i].rowKey, 'rec', '0');
          }
        }
      })
    }catch(e){
      console.log(e)
    }
  }

  componentDidUpdate(){

    this.mainGridInterval = setInterval(e => {
      this.mainGrid();
    }, 5000)

    this.recInterval = setInterval(e => {
      this.rec();
    }, 1000)

    this.Retrieve();
  }

  componentDidMount(){
    this.Init();
  }

  componentWillUnmount(){
    // clearInterval(this.mainHeaderInterval);
    // clearInterval(this.mainHeaderInterval2);
    clearInterval(this.mainGridInterval);
    clearInterval(this.recInterval);
  }

  Retrieve = async () => {
    gfc_showMask();

    gfo_getInput(this.props.pgm, 'detail_pre_grade').setValue(''); //????????????
    gfo_getCombo(this.props.pgm, 'detail_grade1').setValue('');   //????????????
    gfo_getCombo(this.props.pgm, 'detail_grade2').setValue('');   //??????????????????
    gfo_getCombo(this.props.pgm, 'detail_subt').setValue('');     //????????????
    gfo_getCombo(this.props.pgm, 'detail_subt_leg').setValue(''); //????????????
    gfo_getCombo(this.props.pgm, 'detail_depr').setValue('');     //????????????
    gfo_getCombo(this.props.pgm, 'detail_depr2').setValue('');    //????????????
    gfo_getCombo(this.props.pgm, 'detail_car').setValue('');      //????????????
    gfo_getCombo(this.props.pgm, 'detail_rtn').setValue('');      //????????????
    gfo_getCombo(this.props.pgm, 'detail_rtn2').setValue('');     //??????????????????
    gfo_getCheckbox(this.props.pgm, 'detail_warning').setValue('');  //??????

    gfo_getInput(this.props.pgm, 'disp_scrp_ord_no').setValue('');      //????????????
    gfo_getInput(this.props.pgm, 'disp_scrp_grd_nm').setValue('');      //????????????
    gfo_getInput(this.props.pgm, 'disp_real_vender_name').setValue(''); //????????????
    gfo_getInput(this.props.pgm, 'disp_load_area_nm').setValue('');     //????????????
    gfo_getInput(this.props.pgm, 'disp_load_area_addr').setValue('');   //??????

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
                       programNam: '????????????'
                      }
      })
    );
  }

  onSelectChange = async (e) => {
    if(e === null) return;

    // gfc_showMask();

    document.getElementById('tab1_INSP_PROC').click(0);
    await gfc_sleep(100);

    gfo_getInput(this.props.pgm, 'detail_pre_grade').setValue(e.itemGrade); //????????????
    gfo_getCombo(this.props.pgm, 'detail_grade1').setValue('');   //????????????
    gfo_getCombo(this.props.pgm, 'detail_grade2').setValue('');   //??????????????????
    gfo_getCombo(this.props.pgm, 'detail_subt').setValue('');     //????????????
    gfo_getCombo(this.props.pgm, 'detail_subt_leg').setValue(''); //????????????
    gfo_getCombo(this.props.pgm, 'detail_depr').setValue('');     //????????????
    gfo_getCombo(this.props.pgm, 'detail_depr2').setValue('');    //????????????
    gfo_getCombo(this.props.pgm, 'detail_car').setValue(e.carType);      //????????????
    gfo_getCombo(this.props.pgm, 'detail_rtn').setValue('');      //????????????
    gfo_getCombo(this.props.pgm, 'detail_rtn2').setValue('');     //??????????????????
    gfo_getCheckbox(this.props.pgm, 'detail_warning').setValue('');  //??????

    gfo_getInput(this.props.pgm, 'disp_scrp_ord_no').setValue('');      //????????????
    gfo_getInput(this.props.pgm, 'disp_scrp_grd_nm').setValue('');      //????????????
    gfo_getInput(this.props.pgm, 'disp_real_vender_name').setValue(''); //????????????
    gfo_getInput(this.props.pgm, 'disp_load_area_nm').setValue('');     //????????????
    gfo_getInput(this.props.pgm, 'disp_load_area_addr').setValue('');   //??????

    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: e.scaleNumb});
    setSessionCookie('DETAIL_SCALE', e.scaleNumb);
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: e.carNumb});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: e.totalWgt});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: e.date});
    gfs_dispatch('INSP_PROC_MAIN', 'CHIT_INFO', {
      chit     : false
    });

    //??????????????? ????????????
    const chitInfoYn = await gfc_yk_call_sp('SP_ZM_CHIT', {
      P_SCALENUMB: e.scaleNumb
    });

    if(chitInfoYn.data.SUCCESS === 'N'){
      alert('??????????????? ????????? ????????????.');
      gfc_hideMask();
      return;
    }

    //???????????????
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
      // chit     : false
    });

    //????????????
    const dispInfo = await gfc_yk_call_sp('SP_ZM_PROCESS_F3', {
      P_SCALENUMB: e.scrpOrdNo
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
    
    // gfc_hideMask();
  }

  render() {
    return (
      <div className='win_body' style={{borderRadius:'0px', borderWidth:'0px 1px 0px 1px'}}>
        <div className='car_manager'>

          <Layout split       ='vertical'
                  minSize     ={[370]}
                  defaultSize ={1225}
          >
            <div style={{width:'100%'}}>
              <div className='car_list' style={{width:'calc(100% - 365px)',overflow:'hidden'}}>
                <div className='search_line'>
                  <div className='wp'>
                    <div style={{position:'absolute', left:0, top:0, width:'124px', height:'42px', fontSize:'16px'}}>
                      <Combobox pgm     = {this.props.pgm}
                                id      = 'search_tp'
                                value   = 'CODE'
                                display = 'NAME'
                                width   = {124}
                                height  = {42}
                                emptyRow
                                data    = {[{
                                  CODE: '1',
                                  NAME: '????????????'
                                },{
                                  CODE: '2',
                                  NAME: '????????????'
                                },{
                                  CODE: '3',
                                  NAME: '????????????'
                                },{
                                  CODE: '4',
                                  NAME: '??????'
                                }]}
                      />
                    </div>
                    <Input pgm         = {this.props.pgm}
                          id          = 'search_txt'
                          height      = '42'
                          placeHolder = '???????????? ???????????????'
                          paddingLeft = '14'
                          width       = '100%'
                          type        = 'textarea'
                          // onKeyDown   = {(e) => {
                          //   if(e.keyCode === 13){
                          //     this.Retrieve()
                          //   }
                          // }}
                          onChange    = {(e) => {
                            if(e.target.value.length > 0)
                              this.Retrieve()
                          }}
                          //  padding-bottom:2px; padding-left:14px; border:none; font-size:22px;
                            />
                    <button>??????</button>
                  </div>
                </div>
                <div className='grid'>
                  <div className='wp'>
                    <div style={{width:'100%', height:'100%', overflow:'auto'}}>
                      <Grid pgm={this.props.pgm}
                            id ='main10'
                            selectionChange={(e) => this.onSelectChange(e)}
                            dblclick={(e) => this.dblclick(e)}
                            rowHeight={46}
                            rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                            columns={[
                              columnInput({
                                name: 'scaleNumb',
                                header: '????????????',
                                width : 110,
                                readOnly: true,
                                color : '#0063A9',
                                align : 'center'
                              }),
                              columnInput({
                                name: 'carNumb',
                                header: '????????????',
                                width : 90,
                                readOnly: true,
                                align : 'center'
                              }),   
                              columnInput({
                                name: 'itemGrade',
                                header: '????????????',
                                width : 135,
                                readOnly: true,
                                align : 'center'
                              }),   
                              columnDateTime({
                                name  : 'date',
                                header: '????????????',
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
                                header: '?????????',
                                width: 85,
                                imgItem:[
                                  {'code':'0', 'value': ''},
                                  {'code':'1', 'value': <GifPlayer height='30' width='70' gif={require('../../../Image/yk_rec01.gif').default} autoplay/>}
                                ]
                              }),
                              columnInput({
                                name: 'warning',
                                header: '??????',
                                width : 40,
                                readOnly: true,
                                align : 'center',
                                fontSize: '12',
                                onBackGround: (value, control) => {
                                  if(value === 'Y'){
                                    control.style.backgroundColor = 'yellow';
                                  }
                                  // if(rows.phantom){
                                  //   control.isDisabled = false;
                                  // }else{
                                  //   control.isDisabled = true;
                                  // }
                                }
                              })
                            ]}
                      />
                    </div>
                  </div>
                  <div className='grid_info'>
                    <span className='title'>????????????</span><Botspan reducer='INSP_PROC_MAIN' />
                  </div>
                </div>
                <div className='total_info'>
                  <ul className='four'>
                    <li><span className='title'>???????????? ??????</span><Mainspan reducer='INSP_PROC_MAIN' flag={8} /></li>
                    <li><span className='title'>?????? ??????</span><Mainspan reducer='INSP_PROC_MAIN' flag={1} /></li>
                    <li onClick={e => {
                      const auth = gfs_getStoreValue('USER_REDUCER', 'AUTH');
                      if(auth.length === undefined || auth.length === 0) return;

                      const openAuth = auth.find(e => e.MENU_ID === 'DAILY_PROC');
                      if(openAuth !== null){
                        if(openAuth.PGMAUT_YN === 'Y'){

                          //#region ???????????? ????????? ??????
                          gfs_PGM_REDUCER('DAILY_PROC');
                          //#endregion

                          gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
                            ({
                              windowZindex: 0,
                              activeWindow: {programId: 'DAILY_PROC',
                                            programNam: '???????????????'
                                            }
                            })
                          );
                        }
                      }
                    }}><span className='title'>?????? ?????? ??????</span><Mainspan reducer='INSP_PROC_MAIN' flag={2} /></li>
                    <li onClick={e => {
                      const auth = gfs_getStoreValue('USER_REDUCER', 'AUTH');
                      if(auth.length === undefined || auth.length === 0) return;

                      const openAuth = auth.find(e => e.MENU_ID === 'DAILY_PROC');
                      if(openAuth !== null){
                        if(openAuth.PGMAUT_YN === 'Y'){

                          //#region ???????????? ????????? ??????
                          gfs_PGM_REDUCER('DAILY_PROC');
                          //#endregion

                          gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
                            ({
                              windowZindex: 0,
                              activeWindow: {programId: 'DAILY_PROC',
                                            programNam: '???????????????'
                                            }
                            })
                          );
                        }
                      }
                    }}><span className='title'>?????????(KG)</span><Mainspan reducer='INSP_PROC_MAIN' flag={3} /></li>
                  </ul>
                  <ul className='four'>
                    <li><span className='title'>????????????</span><Mainspan reducer='INSP_PROC_MAIN' flag={4} /></li>
                    <li onClick={e => {
                      const auth = gfs_getStoreValue('USER_REDUCER', 'AUTH');
                      if(auth.length === undefined || auth.length === 0) return;

                      const openAuth = auth.find(e => e.MENU_ID === 'DISP_PROC');
                      if(openAuth !== null){
                        if(openAuth.PGMAUT_YN === 'Y'){

                          //#region ???????????? ????????? ??????
                          gfs_PGM_REDUCER('DISP_PROC');
                          //#endregion

                          gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
                            ({
                              windowZindex: 0,
                              activeWindow: {programId: 'DISP_PROC',
                                            programNam: '????????????'
                                            }
                            })
                          );
                        }
                      }
                    }}><span className='title'>????????????</span><Mainspan reducer='INSP_PROC_MAIN' flag={5} /></li>
                    <li onClick={e => {
                      const auth = gfs_getStoreValue('USER_REDUCER', 'AUTH');
                      if(auth.length === undefined || auth.length === 0) return;

                      const openAuth = auth.find(e => e.MENU_ID === 'ENTR_PROC');
                      if(openAuth !== null){
                        if(openAuth.PGMAUT_YN === 'Y'){
                      
                          //#region ???????????? ????????? ??????
                          gfs_PGM_REDUCER('ENTR_PROC');
                          //#endregion

                          gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
                            ({
                              windowZindex: 0,
                              activeWindow: {programId: 'ENTR_PROC',
                                            programNam: '????????????'
                                            }
                            })
                          );
                        }
                      }
                    }}><span className='title'>????????????</span><Mainspan reducer='INSP_PROC_MAIN' flag={6} /></li>
                    <li onClick={e => {
                      const auth = gfs_getStoreValue('USER_REDUCER', 'AUTH');
                      if(auth.length === undefined || auth.length === 0) return;

                      const openAuth = auth.find(e => e.MENU_ID === 'ENTR_PROC');
                      if(openAuth !== null){
                        if(openAuth.PGMAUT_YN === 'Y'){
                      
                          //#region ???????????? ????????? ??????
                          gfs_PGM_REDUCER('ENTR_WAIT');
                          //#endregion

                          gfs_dispatch('WINDOWFRAME_REDUCER', 'SELECTWINDOW', 
                            ({
                              windowZindex: 0,
                              activeWindow: {programId: 'ENTR_WAIT',
                                            programNam: '????????????'
                                            }
                            })
                          );
                        }
                      }
                    }}><span className='title'>????????????</span><Mainspan reducer='INSP_PROC_MAIN' flag={7} /></li>
                  </ul>
                </div>
              </div>
            <div className='car_info' id='car_info'>
              <div className='title'><span>????????????</span><Detailspan reducer='INSP_PROC_MAIN' flag={1} /></div>

              <TabList pgm={this.props.pgm} id={this.props.id} reducer='INSP_PROC_MAIN'/>

              <div className='tab_content' id='tabMain'>
                <div className='input_list on' id={`content1_${this.props.pgm}`}>
                  <ul>
                    <li>
                      <h5>????????????</h5>
                        <Input pgm     = {this.props.pgm}
                              id      = 'detail_pre_grade'
                              width   = '100%'
                              disabled
                        />
                    </li>
                    <li>
                      <h5>????????????</h5>
                      <div style={{marginBottom:'5px'}}>
                        <Combobox pgm     = {this.props.pgm}
                                  id      = 'detail_grade1'
                                  value   = 'itemCode'
                                  display = 'item'
                                  placeholder = '???????????? ??????'
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
                      <h5>????????????</h5>
                      <div style={{marginBottom:'5px'}}>
                        <Combobox pgm     = {this.props.pgm}
                              id      = 'detail_subt'
                              value   = 'itemCode'
                              display = 'item'
                              placeholder = '???????????? ??????(KG)'
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
                            placeholder = '???????????? ??????'
                            oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                              p_division    : 'P620'
                            })}
                            isDisabled
                      /> 
                    </li>
                    <li>
                      <h5>????????????</h5>
                      <div style={{marginBottom:'5px'}}>
                        <Combobox pgm     = {this.props.pgm}
                              id      = 'detail_depr'
                              value   = 'itemCode'
                              display = 'item'
                              placeholder = '???????????? ??????'
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
                            placeholder = '????????????'
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
                      <h5>????????????</h5>
                      <Combobox pgm     = {this.props.pgm}
                            id      = 'detail_out'
                            value   = 'itemCode'
                            display = 'item'
                            placeholder = '???????????? ??????(SECTOR)'
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
                      <h5>????????????</h5>
                      <Combobox pgm     = {this.props.pgm}
                            id      = 'detail_car'
                            value   = 'itemCode'
                            display = 'item'
                            placeholder = '????????????'
                            oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                              p_division    : 'P700'
                            })}
                    />
                    </li>
                    <li>
                      <h5>????????????</h5>
                      <div style={{marginBottom:'5px'}}>
                        <Combobox pgm     = {this.props.pgm}
                              id      = 'detail_rtn'
                              value   = 'itemCode'
                              display = 'item'
                              placeholder = '??????,?????? ??????'
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
                      <h5>??????</h5>
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
            </div>

          
          <div className='cctv_viewer' style={{width:'100%'}}>
            <h4>????????? CCTV</h4>
            <div className='manual_record'>
              <h5>????????????</h5>
              <button 
                type='button' 
                className='record'
                onClick={e => this.startRec()}
              >??????</button>
              <button 
                type='button' 
                className='stop on'
                onClick={e => this.stopRec()}
              >??????</button>
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
          </Layout>
        </div>
      </div>
    );
  }
}

export default INSP_PROC;