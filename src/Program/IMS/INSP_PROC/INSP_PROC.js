//#region import
import React, { Component } from 'react';
import axios from 'axios';
import Input from '../../../Component/Control/Input';
import Checkbox from '../../../Component/Control/Checkbox';

import { gfc_initPgm, gfc_sleep, gfc_showMask, gfc_hideMask, gfc_chit_yn_YK, gfc_now } from '../../../Method/Comm';
import { gfs_getStoreValue, gfs_injectAsyncReducer, gfs_dispatch, gfs_subscribe, gfs_PGM_REDUCER } from '../../../Method/Store';
import { gfo_getCombo, gfo_getInput, gfo_getTextarea, gfo_getCheckbox } from '../../../Method/Component';
import { gfg_getGrid, gfg_setSelectRow } from '../../../Method/Grid';
import { getDynamicSql_Oracle } from '../../../db/Oracle/Oracle';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Image as columnImage } from '../../../Component/Grid/Column/Image';
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';
import { TextArea as columnTextArea } from '../../../Component/Grid/Column/TextArea';

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

import GifPlayer from 'react-gif-player';

import { YK_WEB_REQ, YK_WEB_REQ_DIRECT, YK_WEB_REQ_DISP } from '../../../WebReq/WebReq';
import { TOKEN, MILESTONE } from '../../../WebReq/WebReq';
import { throttle } from 'lodash';
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
      const select = await this.callOracle('Common/Common', 'ZM_IMS_CAMERA_SELECT_EACH', [{AREA_TP:'E001'}]);
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
      let rtspUrl = [];
      let rtspPort = [];

      for(let i = 0; i < data.length; i++){
        ipArr.push(data[i].CAMERA_IP);
        rtspUrl.push(data[i].RTSP_URL);
        rtspPort.push(data[i].RTSP_PORT);
      }

      // let ipArr = ['10.10.136.112', '10.10.136.128'];
      // let rtspUrl = ['rtsp://admin:admin13579@10.10.136.112:554/profile2/media.smp', 'rtsp://admin:pass@10.10.136.128:554/video1'];
      // let rtspPort = [3100, 3101];
      this.infoArr = [];

      for(let i = 0; i < ipArr.length; i++){
        const camera = this.device.find(e1 => e1.Name.indexOf(ipArr[i]) >= 0);
        if(camera){
          this.infoArr.push({camera, ipArr: ipArr[i], rtspUrl: rtspUrl[i], rtspPort: rtspPort[i]}); 
        }
      }

      if(this.infoArr.length > 0){
        this.setState(this.state.device = this.infoArr);
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

  debounceMouseWheel = throttle((e, device) => {
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
  }, 1000);

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
  startRec = async (Guid, Name, scaleNo, seq) => {
    const select = await this.callOracle('Common/Common', 'ZM_IMS_REC_SELECT', [{
      scaleNumb:scaleNo,
      seq
    }]);
    if(select.data.rows.length === 0){

      const insert = await this.callOracle('Common/Common', 'ZM_IMS_REC_INSERT', [{
        scaleNumb: scaleNo,
        seq,
        Guid,
        Name
      }]);

      if(insert.data.rowsAffected === 0){
        alert('녹화시작에 실패 했습니다.');
      }
    }else{
      console.log('이미 녹화중 입니다.');
    }
  }

  stopRec = async (Guid, Name, camera_ip, scaleNo, seq) => {
    const now = await gfc_now();
    const select = await this.callOracle('Common/Common', 'ZM_IMS_REC_SELECT', [{
      scaleNumb:scaleNo,
      seq
    }]);

    if(select.data.rows.length > 0){
      const insert = await this.callOracle('Common/Common', 'ZM_IMS_VIDEO_INSERT', [{
        scaleNumb: scaleNo,
        seq,
        rec_fr_dttm: select.data.rows[0][2],
        camera_ip,
        Guid,
        Name
      }]);

      if(insert.data.rowsAffected === 0){
        alert('녹화저장에 실패 했습니다. insert');
      }

      const update = await this.callOracle('Common/Common', 'ZM_IMS_REC_UPDATE', [{
        scaleNumb: scaleNo,
        seq,
        rec_to_dttm: now
      }]);

      if(update.data.rowsAffected === 0){
        alert('녹화저장에 실패 했습니다. update');
      }
    }
  }
  //#endregion

  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const INSP_PROC_MAIN = (nowState, action) => {

      if(action.reducer !== 'INSP_PROC_MAIN') {
        return {
          ON_ACTIVE    : nowState === undefined ? {
            active : true,
            time   : new Date() 
          } : nowState.ON_ACTIVE,

          MAIN_WAIT    : nowState === undefined ? 0 : nowState.MAIN_WAIT,
          MAIN_TOTAL   : nowState === undefined ? 0 : nowState.MAIN_TOTAL,
          MAIN_WEIGHT  : nowState === undefined ? 0 : nowState.MAIN_WEIGHT,
          BOT_TOTAL    : nowState === undefined ? 0 : nowState.BOT_TOTAL,
          PROC_WAIT    : nowState === undefined ? 0 : nowState.PROC_WAIT,
          DEPT_WAIT    : nowState === undefined ? 0 : nowState.DEPT_WAIT,
          ENTR_WAIT    : nowState === undefined ? 0 : nowState.ENTR_WAIT,
 
          DETAIL_SCALE : nowState === undefined ? '' : nowState.DETAIL_SCALE,
          DETAIL_CARNO : nowState === undefined ? '' : nowState.DETAIL_CARNO,
          DETAIL_WEIGHT: nowState === undefined ? '' : nowState.DETAIL_WEIGHT,
          DETAIL_DATE  : nowState === undefined ? '' : nowState.DETAIL_DATE,

          STD_CAM_IMG  : nowState === undefined ? null : nowState.STD_CAM_IMG,
          DUM_CAM_IMG  : nowState === undefined ? null : nowState.DUM_CAM_IMG,

          STD_CAM_OPEN : nowState === undefined ? false : nowState.STD_CAM_OPEN,
          DUM_CAM_OPEN : nowState === undefined ? false : nowState.DUM_CAM_OPEN,

          STD_CAM_FOCUS: nowState === undefined ? false : nowState.STD_CAM_FOCUS,
          DUM_CAM_FOCUS: nowState === undefined ? false : nowState.DUM_CAM_FOCUS,

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

      if(action.type === 'MAIN_WAIT'){

        return Object.assign({}, nowState, {
          MAIN_WAIT : action.MAIN_WAIT
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
      }else if(action.type === 'STD_CAM_OPEN'){

        return Object.assign({}, nowState, {
          STD_CAM_OPEN : action.STD_CAM_OPEN
        })
      }else if(action.type === 'DUM_CAM_OPEN'){

        return Object.assign({}, nowState, {
          DUM_CAM_OPEN : action.DUM_CAM_OPEN
        })
      }else if(action.type === 'STD_CAM_FOCUS'){

        return Object.assign({}, nowState, {
          STD_CAM_FOCUS : action.STD_CAM_FOCUS
        })
      }else if(action.type === 'DUM_CAM_FOCUS'){

        return Object.assign({}, nowState, {
          DUM_CAM_FOCUS : action.DUM_CAM_FOCUS
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
    this.milestoneInfo();
  }

  componentDidMount(){
    this.Init();
  }

  Retrieve = async () => {
    gfc_showMask();

    const headData = await YK_WEB_REQ('tally_mstr_header.jsp');
    const header = headData.data.dataSend;
    if(header){
      gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WAIT', {MAIN_WAIT: header[0].rCar});
      gfs_dispatch('INSP_PROC_MAIN', 'MAIN_TOTAL', {MAIN_TOTAL: header[0].eCar});
      gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WEIGHT', {MAIN_WEIGHT: header[0].eKg});
    }else{
      gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WAIT', {MAIN_WAIT: 0});
      gfs_dispatch('INSP_PROC_MAIN', 'MAIN_TOTAL', {MAIN_TOTAL: 0});
      gfs_dispatch('INSP_PROC_MAIN', 'MAIN_WEIGHT', {MAIN_WEIGHT: 0});
    }

    const mainData = await YK_WEB_REQ('tally_mstr_wait.jsp');
    const main = mainData.data.dataSend;
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    if(main){
      grid.resetData(main);
      gfg_setSelectRow(grid);

      gfs_dispatch('INSP_PROC_MAIN', 'PROC_WAIT', {PROC_WAIT: main.length});
      gfs_dispatch('INSP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: main.length});
    }else{
      gfs_dispatch('INSP_PROC_MAIN', 'PROC_WAIT', {PROC_WAIT: 0});
      gfs_dispatch('INSP_PROC_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
    }

    //출차대기
    const headData2 = await YK_WEB_REQ('tally_mstr_pass.jsp');
    const header2 = headData2.data.dataSend;
    if(header2){
      gfs_dispatch('INSP_PROC_MAIN', 'DEPT_WAIT', {DEPT_WAIT: header2.length});
    }else{
      gfs_dispatch('INSP_PROC_MAIN', 'DEPT_WAIT', {DEPT_WAIT: 0});
    }

    //입차대기
    const headData3 = await YK_WEB_REQ('tally_mstr_drive.jsp');
    const header3 = headData3.data.dataSend;
    if(header3){
      gfs_dispatch('INSP_PROC_MAIN', 'ENTR_WAIT', {ENTR_WAIT: header3.length});
    }else{
      gfs_dispatch('INSP_PROC_MAIN', 'ENTR_WAIT', {ENTR_WAIT: 0});
    }

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
    gfo_getCombo(this.props.pgm, 'detail_car').setValue('');      //차종구분
    gfo_getCombo(this.props.pgm, 'detail_rtn').setValue('');      //반품구분
    gfo_getCombo(this.props.pgm, 'detail_rtn2').setValue('');     //반품구분사유
    gfo_getCheckbox(this.props.pgm, 'detail_warning').setValue('');  //경고

    gfo_getInput(this.props.pgm, 'disp_scrp_ord_no').setValue('');      //배차번호
    gfo_getInput(this.props.pgm, 'disp_scrp_grd_nm').setValue('');      //배차등급
    gfo_getInput(this.props.pgm, 'disp_real_vender_name').setValue(''); //실공급자
    gfo_getInput(this.props.pgm, 'disp_load_area_nm').setValue('');     //실상차지
    gfo_getInput(this.props.pgm, 'disp_load_area_addr').setValue('');   //주소

    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: e.scaleNumb});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: e.carNumb});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: e.totalWgt});
    gfs_dispatch('INSP_PROC_MAIN', 'DETAIL_DATE', {DETAIL_DATE: e.date});

    //계량증명서 정보여부
    const chitInfoYn = await YK_WEB_REQ(`tally_chit.jsp?scaleNumb=${e.scaleNumb}`);
    if(!chitInfoYn.data.dataSend){
      alert('계량증명서 정보가 없습니다.');
      return;
    }

    //계량증명서 여부 확인.
    const chitYn = await gfc_chit_yn_YK(e.scaleNumb);
    if(chitYn.data === 'N'){
      gfs_dispatch('INSP_PROC_MAIN', 'CHIT_INFO', {
        date     : chitInfoYn.data.dataSend[0].date,
        scaleNumb: chitInfoYn.data.dataSend[0].scaleNumb,
        carNumb  : chitInfoYn.data.dataSend[0].carNumb,
        vender   : chitInfoYn.data.dataSend[0].vendor,
        itemFlag : e.itemGrade,
        Wgt      : chitInfoYn.data.dataSend[0].totalWgt,
        loc      : chitInfoYn.data.dataSend[0].area,
        user     : gfs_getStoreValue('USER_REDUCER', 'USER_NAM'),
        chit     : 'N'
      });
    }else{
      gfs_dispatch('INSP_PROC_MAIN', 'CHIT_INFO', {
        chit     : chitYn.data
      });
    }

    //배차정보
    // const chitInfoYn = await YK_WEB_REQ(`tally_process_f3.jsp?scaleNumb=${e.scaleNumb}`); 나중에 이형식으로 바꿔야함
    const dispInfo = await YK_WEB_REQ_DIRECT('http://tally.yksteel.co.kr/tally_process_f3.jsp?scaleNumb=202108300001');
    if(dispInfo.data.dataSend){
      gfs_dispatch('INSP_PROC_MAIN', 'DISP_INFO', {
        scaleNumb       : chitInfoYn.data.dataSend[0].scaleNumb,
        scrp_ord_no     : dispInfo.data.dataSend[0].SCRP_ORD_NO,
        scrp_grd_nm     : dispInfo.data.dataSend[0].SCRP_GRD_NM,
        real_vender_name: dispInfo.data.dataSend[0].REAL_VENDER_NAME,
        load_area_nm    : dispInfo.data.dataSend[0].LOAD_AREA_NM,
        load_area_addr  : dispInfo.data.dataSend[0].LOAD_AREA_ADDR
      });

      const scrp_ord_no = dispInfo.data.dataSend[0].SCRP_ORD_NO;
      const yyyy = scrp_ord_no.substr(2, 4);
      const mm = scrp_ord_no.substr(6, 2);
      const dd = scrp_ord_no.substr(8, 2);

      gfs_dispatch('INSP_PROC_MAIN', 'DISP_PIC', {
        scaleNumb           : chitInfoYn.data.dataSend[0].scaleNumb,
        scrp_ord_no         : dispInfo.data.dataSend[0].SCRP_ORD_NO,
    
        empty_front_date    : dispInfo.data.PIC[0].EMPTY_FRONT_DATE,
        empty_front         : `http://scrap.yksteel.co.kr:8088/stms/resources/upload/${yyyy}/${mm}/${dd}/${dispInfo.data.PIC[0].EMPTY_FRONT}`,
        empty_front_gps_addr: dispInfo.data.PIC[0].EMPTY_FRONT_GPS_ADDR,
        empty_rear_date     : dispInfo.data.PIC[0].EMPTY_REAR_DATE,
        empty_rear          : `http://scrap.yksteel.co.kr:8088/stms/resources/upload/${yyyy}/${mm}/${dd}/${dispInfo.data.PIC[0].EMPTY_REAR}`,
        empty_rear_gps_addr : dispInfo.data.PIC[0].EMPTY_REAR_GPS_ADDR,
        cargo_front_date    : dispInfo.data.PIC[0].CARGO_FRONT_DATE,
        cargo_front         : `http://scrap.yksteel.co.kr:8088/stms/resources/upload/${yyyy}/${mm}/${dd}/${dispInfo.data.PIC[0].CARGO_FRONT}`,
        cargo_front_gps_addr: dispInfo.data.PIC[0].CARGO_FRONT_GPS_ADDR,
        cargo_rear_date     : dispInfo.data.PIC[0].CARGO_REAR_DATE,
        cargo_rear          : `http://scrap.yksteel.co.kr:8088/stms/resources/upload/${yyyy}/${mm}/${dd}/${dispInfo.data.PIC[0].CARGO_REAR}`,
        cargo_rear_gps_addr : dispInfo.data.PIC[0].CARGO_REAR_GPS_ADDR
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
                              name: '등급'
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
                            width : 120,
                            readOnly: true,
                            color : '#0063A9',
                            align : 'center'
                          }),
                          columnInput({
                            name: 'carNumb',
                            header: '차량번호',
                            width : 110,
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
                          // columnCombobox({
                          //   name: 'itemFlag', 
                          //   header: '구분',
                          //   readOnly: true,
                          //   width   : 75,
                          //   data: [{
                          //     'code': 'M1KDO0001',
                          //     'name': '고철'
                          //   },{
                          //     'code': 'M1KDO0002',
                          //     'name': '분철'
                          //   }],
                          //   editor: {
                          //     value   : 'code',
                          //     display : 'name'
                          //   }
                          // }),
                          columnTextArea({
                            name  : 'date',
                            header: '입차시간',
                            width : 80,
                            height: 38,
                            // paddingTop: ''
                            readOnly: true,
                            valign:'middle',
                            format: gfs_getStoreValue('USER_REDUCER', 'YMD_FORMAT'),
                            time  : 'HH:mm'
                          }),
                          columnTextArea({
                            name: 'vendor',
                            header: 'Vendor',
                            width : 180,
                            height: 38,
                            readOnly: true,
                            align : 'left'
                          }),
                          columnImage({
                            name: 'rec',
                            header: '녹화중',
                            width: 70,
                            imgItem:[
                              {'code':'0', 'value': ''},
                              {'code':'1', 'value': <GifPlayer height='30' width='65' gif={require('../../../Image/yk_rec01.gif').default} autoplay/>}
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
                <li><span className='title'>전체 검수 차량</span><Mainspan reducer='INSP_PROC_MAIN' flag={2} /></li>
                <li><span className='title'>입고량(KG)</span><Mainspan reducer='INSP_PROC_MAIN' flag={3} /></li>
              </ul>
              <ul>
                <li><span className='title'>검수대기</span><Mainspan reducer='INSP_PROC_MAIN' flag={4} /></li>
                <li><span className='title'>출차대기</span><Mainspan reducer='INSP_PROC_MAIN' flag={5} /></li>
                <li><span className='title'>입차대기</span><Mainspan reducer='INSP_PROC_MAIN' flag={6} /></li>
              </ul>
            </div>
          </div>
          <div className='car_info' id='car_info'>
            <div className='title'><span>계근번호</span><Detailspan reducer='INSP_PROC_MAIN' flag={1} /></div>
            <div className='detail'>
              <ul>
                <li><span className='t'>차량번호</span><Detailspan reducer='INSP_PROC_MAIN' flag={2} /></li>
                <li><span className='t'>총중량(KG)</span><Detailspan reducer='INSP_PROC_MAIN' flag={3} /></li>
                <li><span className='t'>입차시간</span><Detailspan reducer='INSP_PROC_MAIN' flag={4} /></li>
                
                
                
                <li>
                  <button onClick={e => {
                        MILESTONE({
                          reqAddr : 'Replay',
                          device  : this.infoArr[0].camera.Guid,
                          scaleNo: 'test11',
                          cameraName: this.infoArr[0].camera.Name})
                  }}>Replay

                  </button>
                    <button onClick={() => 
                      {
                        const scaleNumb = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_SCALE');
                        this.startRec(this.state.device[0].camera.Guid, 
                                      this.state.device[0].camera.Name, 
                                      scaleNumb, 
                                      1);
                      }}>on1
                    </button>
                    <button onClick={() => 
                      {
                        const scaleNumb = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_SCALE');
                        this.stopRec(this.state.device[0].camera.Guid, 
                                     this.state.device[0].camera.Name, 
                                     this.state.device[0].ipArr,
                                     scaleNumb, 
                                     1);
                      }}>off1
                    </button>
                    <button onClick={() => gfs_dispatch('INSP_PROC_MAIN', 'DUM_CAM_REC', {rec: true, car: '1234'})}>on2</button>
                    <button onClick={() => gfs_dispatch('INSP_PROC_MAIN', 'DUM_CAM_REC', {rec: false, car: '1234'})}>off2</button>
                    <button onClick={() =>{
                    }}>oracle</button>
                </li>




              </ul> 
            </div>

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
                                etcData = {YK_WEB_REQ('tally_process_pop.jsp?division=P005', {})}
                                onChange = {e => {
                                  const combo = gfo_getCombo(this.props.pgm, 'detail_grade2');
                                  combo.setValue('');
                                  // combo.setFilter('aaa');
                                }}
                                // onFocus = {ComboCreate => {
                                //   YK_WEB_REQ('tally_process_pop.jsp?division=P005', {})
                                //     .then(res => {
                                //       ComboCreate({data   : res.data.dataSend,
                                //                   value  : 'itemCode',
                                //                   display: 'item'});
                                //     })
                                // }}
                      />
                    </div>
                    <Combobox pgm     = {this.props.pgm}
                              id      = 'detail_grade2'
                              value   = 'itemCode'
                              display = 'item'
                              data    = ''
                              onFocus = {ComboCreate => {
                                const value = gfo_getCombo(this.props.pgm, 'detail_grade1').getValue();
                                if(value === null) return;

                                YK_WEB_REQ(`tally_process_pop.jsp?division=${value}`, {})
                                  .then(res => {
                                    ComboCreate({data   : res.data.dataSend,
                                                value  : 'itemCode',
                                                display: 'item'});
                                  })
                              }}
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
                            etcData = {YK_WEB_REQ('tally_process_pop.jsp?division=P535', {})}
                            // onFocus = {ComboCreate => {
                            //   YK_WEB_REQ('tally_process_pop.jsp?division=P535', {})
                            //     .then(res => {
                            //       ComboCreate({data   : res.data.dataSend,
                            //                   value  : 'itemCode',
                            //                   display: 'item',
                            //                   emptyRow: true});
                            //     })
                            // }}
                      />
                    </div>
                    <Combobox pgm     = {this.props.pgm}
                          id      = 'detail_subt_leg'
                          value   = 'itemCode'
                          display = 'item'
                          placeholder = '감량사유 검색'
                          etcData = {YK_WEB_REQ('tally_process_pop.jsp?division=P620', {})}
                          // onFocus = {ComboCreate => {
                          //   YK_WEB_REQ('tally_process_pop.jsp?division=P620', {})
                          //     .then(res => {
                          //       ComboCreate({data   : res.data.dataSend,
                          //                   value  : 'itemCode',
                          //                   display: 'item',
                          //                   emptyRow: true});
                          //     })
                          // }}
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
                            etcData = {YK_WEB_REQ('tally_process_pop.jsp?division=P130', {})}
                            // onFocus = {ComboCreate => {
                            //   YK_WEB_REQ('tally_process_pop.jsp?division=P130', {})
                            //     .then(res => {
                            //       ComboCreate({data   : res.data.dataSend,
                            //                   value  : 'itemCode',
                            //                   display: 'item',
                            //                   emptyRow: true});
                            //     })
                            // }}
                      />
                    </div>
                    <Combobox pgm = {this.props.pgm}
                          id      = 'detail_depr2'
                          value   = 'code'
                          display = 'name'
                          placeholder = '감가비율'
                          data    = {[{
                            'code': '10',
                            'name': '10%'
                          },{
                            'code': '20',
                            'name': '20%'
                          },{
                            'code': '30',
                            'name': '30%'
                          },{
                            'code': '40',
                            'name': '40%'
                          },{
                            'code': '50',
                            'name': '50%'
                          },{
                            'code': '60',
                            'name': '60%'
                          },{
                            'code': '70',
                            'name': '70%'
                          },{
                            'code': '80',
                            'name': '80%'
                          },{
                            'code': '90',
                            'name': '90%'
                          },{
                            'code': '100',
                            'name': '100%'
                          }]}
                          emptyRow
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
                          etcData = {YK_WEB_REQ('tally_process_pop.jsp?division=P700', {})}
                          // onFocus = {ComboCreate => {
                          //   YK_WEB_REQ('tally_process_pop.jsp?division=P700', {})
                          //     .then(res => {
                          //       ComboCreate({data   : res.data.dataSend,
                          //                   value  : 'itemCode',
                          //                   display: 'item'});
                          //     })
                          // }}
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
                            etcData = {YK_WEB_REQ('tally_process_pop.jsp?division=P110', {})}
                            // onFocus = {ComboCreate => {
                            //   YK_WEB_REQ('tally_process_pop.jsp?division=P110', {})
                            //     .then(res => {
                            //       ComboCreate({data   : res.data.dataSend,
                            //                   value  : 'itemCode',
                            //                   display: 'item',
                            //                   emptyRow: true});
                            //     })
                            // }}
                    />
                  </div>
                  <Combobox pgm     = {this.props.pgm}
                            id      = 'detail_rtn2'
                            value   = 'itemCode'
                            display = 'item'
                            data    = ''
                            onFocus = {ComboCreate => {
                              const value = gfo_getCombo(this.props.pgm, 'detail_rtn').getValue();
                              if(value === null) return;

                              YK_WEB_REQ(`tally_process_pop.jsp?division=P120`, {})
                                .then(res => {
                                  ComboCreate({data   : res.data.dataSend,
                                              value  : 'itemCode',
                                              display: 'item'});
                                })
                            }}
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
              {/* <div className='rain_info'>
		            <span className='title'>강수량</span><span className='value'>100mm</span>
	            </div> */}
              <div className='cctv_list'>
                {this.state.device[0] !== undefined && 
                  <RecImage 
                    seq={1}
                    device={this.state.device[0].camera.Guid} 
                    Name={this.state.device[0].camera.Name}
                    rtspUrl={this.state.device[0].rtspUrl}
                    rtspPort={this.state.device[0].rtspPort}
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
                    rtspUrl={this.state.device[1].rtspUrl}
                    rtspPort={this.state.device[1].rtspPort}
                    cam='DUM_CAM_OPEN' 
                    focus='DUM_CAM_FOCUS' 
                    rec='DUM_CAM_REC' 
                    image='DUM_CAM_IMG'/> 
                }
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default INSP_PROC;