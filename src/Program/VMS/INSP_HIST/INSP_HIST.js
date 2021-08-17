//#region import
import React, { Component } from 'react';

import Input from '../../../Component/Control/Input';

import { gfc_initPgm, gfc_showMask, gfc_hideMask, gfc_chit_yn_YK, gfc_sleep } from '../../../Method/Comm';
import { gfs_getStoreValue, gfs_injectAsyncReducer, gfs_dispatch, gfs_subscribe } from '../../../Method/Store';
import { gfo_getCombo, gfo_getInput, gfo_getTextarea } from '../../../Method/Component';
import { gfg_getGrid, gfg_setSelectRow } from '../../../Method/Grid';

import Grid from '../../../Component/Grid/Grid';
import { Input as columnInput } from '../../../Component/Grid/Column/Input';
import { Image as columnImage } from '../../../Component/Grid/Column/Image';
import { Combobox as columnCombobox }  from '../../../Component/Grid/Column/Combobox';
import { TextArea as columnTextArea } from '../../../Component/Grid/Column/TextArea';

import Combobox from '../../../Component/Control/Combobox';

// import Mainspan from './Mainspan';
import Detailspan from '../Common/Detailspan';
import Botspan from '../Common/Botspan';
import Chit from '../Common/Chit/Chit';
import CompleteBtn from './CompleteBtn';
import TabList from '../Common/TabList';
import RecImage from './RecImage';

import { YK_WEB_REQ } from '../../../WebReq/WebReq';
import { TOKEN, MILESTONE } from '../../../WebReq/WebReq';
//#endregion

class INSP_HIST extends Component {

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
      let ipArr = ['10.10.136.112', '10.10.136.128'];
      let rtspUrl = ['rtsp://admin:admin13579@10.10.136.112:554/profile2/media.smp', 'rtsp://admin:pass@10.10.136.128:554/video1'];
      let rtspPort = [3100, 3101];
      let infoArr = [];

      ipArr.forEach(e => {
        const camera = this.device.find(e1 => e1.Name.indexOf(e) >= 0);
        if(camera){
          infoArr.push({camera, rtspUrl, rtspPort}); 
        }
      })

      if(infoArr.length > 0){
        this.setState(this.state.device = infoArr);
      }
    }
  }

  onTabChg = async() => {

    await gfc_sleep(200);

    const activeWindow = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'activeWindow');
    if(activeWindow.programId !== 'INSP_HIST'){
      return;
    }

    const carNumb = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_CARNO');
    if(carNumb !== undefined && carNumb !== ''){

      const befCarNumb = gfo_getInput(this.props.pgm, 'search_txt').getValue();

      if(befCarNumb !== carNumb){
        gfo_getInput(this.props.pgm, 'search_txt').setValue(carNumb);
        await gfc_sleep(100);
        
        this.Retrieve();

        //차량번호, 총중량, 입차시간 세팅
        const scaleNumb = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_SCALE');
        const totalWgt = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_WEIGHT');
        const date = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_DATE');

        gfs_dispatch('INSP_HIST_MAIN', 'DETAIL_SCALE', {DETAIL_SCALE: scaleNumb});
        gfs_dispatch('INSP_HIST_MAIN', 'DETAIL_CARNO', {DETAIL_CARNO: carNumb});
        gfs_dispatch('INSP_HIST_MAIN', 'DETAIL_WEIGHT', {DETAIL_WEIGHT: totalWgt});
        gfs_dispatch('INSP_HIST_MAIN', 'DETAIL_DATE', {DETAIL_DATE: date});
      }
    }
  }

  //#region onActiveWindow 스토어 subscribe로 실행됨.
  onActiveWindow = () => {
    const activeWindow = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'activeWindow');
    if(activeWindow.programId === 'INSP_HIST'){
      this.onTabChg();
    }
  }
  //#endregion

  //#endregion

  constructor(props){
    super(props)
    
    gfc_initPgm(props.pgm, props.nam, this)

    //#region 리듀서
    const INSP_HIST_MAIN = (nowState, action) => {

      if(action.reducer !== 'INSP_HIST_MAIN') {
        return {
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

          GRID_SCALE   : nowState === undefined ? '' : nowState.GRID_SCALE,

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
                                                    chit     : 'N',
                                                  } : nowState.CHIT_INFO
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
      }else if(action.type === 'GRID_SCALE'){

        return Object.assign({}, nowState, {
          GRID_SCALE : action.GRID_SCALE
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
      }else if(action.type === 'CHIT_INFO_ITEM_FLAG'){

        return Object.assign({}, nowState, {
          CHIT_INFO : {
            date     :  nowState.CHIT_INFO.date,
            scaleNumb:  nowState.CHIT_INFO.scaleNumb,
            carNumb  :  nowState.CHIT_INFO.carNumb,
            vender   :  nowState.CHIT_INFO.vender,
            itemFlag :  action.itemFlag,
            Wgt      :  nowState.CHIT_INFO.Wgt,
            loc      :  nowState.CHIT_INFO.loc,
            user     :  nowState.CHIT_INFO.user,
            chit     :  nowState.CHIT_INFO.chit
          }
        })
      }else if(action.type === 'CHIT_INFO'){

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
      }
    }

    gfs_injectAsyncReducer('INSP_HIST_MAIN', INSP_HIST_MAIN);
    gfs_subscribe(this.onActiveWindow);
    //#endregion
  }

  componentDidMount(){
    this.milestoneInfo();
    gfo_getCombo(this.props.pgm, 'search_tp').setValue('2');
  }

  Retrieve = async () => {
    const carNumb = gfo_getInput(this.props.pgm, 'search_txt').getValue();
    if(carNumb === undefined || carNumb === ''){
      alert('선택된 차량번호가 없습니다.');
      return;
    }

    gfc_showMask();

    const mainData = await YK_WEB_REQ(`tally_process_f2.jsp?carnumb=${carNumb}&ld=20210417&nd=20210617`);
    const main = mainData.data.dataSend;
    const grid = gfg_getGrid(this.props.pgm, 'main10');
    if(main){

      const dataMod = [];
      main.forEach(e => {
        dataMod.push({
          totalWgt : e['감량'],
          grade    : e['검수등급'],
          scaleNumb: e['계근번호'],
          date     : e['계근일자'],
          rtn      : e['반품구분'],
          vendor   : e['업체명'],
          carNumb  : e['차량번호'],
          loc      : e['상차주소'],
          // warning  : e['경고'] === 'N' ? '' : '경고'
          warning  : '경고'
        })
      })

      grid.resetData(dataMod);
      gfs_dispatch('INSP_HIST_MAIN', 'BOT_TOTAL', {BOT_TOTAL: main.length});
      
      await gfc_sleep(100);

      gfg_setSelectRow(grid);
    }else{
      gfs_dispatch('INSP_HIST_MAIN', 'BOT_TOTAL', {BOT_TOTAL: 0});
    }

    gfc_hideMask();
  }


  onSelectChange = async (e) => {
    if(e === null) return;

    gfs_dispatch('INSP_HIST_MAIN', 'GRID_SCALE', {GRID_SCALE: e.scaleNumb});

    //계량표 여부 확인.
    const chitYn = await gfc_chit_yn_YK(e.scaleNumb);
    gfs_dispatch('INSP_HIST_MAIN', 'CHIT_INFO', {
      chit     : chitYn.data
    });
  }

  render() {

    return (
      <div className='win_body' style={{borderRadius:'0px', borderWidth:'0px 1px 0px 1px'}}>
        <div className='car_manager' >
          <div style={{paddingBottom:'0'}} className='car_list'>
            <div className='search_line'>
              <div className='wp' >
                <div style={{position:'absolute', left:0, top:0, width:'124px', height:'42px', fontSize:'16px'}}>
                  <Combobox pgm     = {this.props.pgm}
                            id      = 'search_tp'
                            value   = 'code'
                            display = 'name'
                            width   = {124}
                            height  = {42}
                            emptyRow
                            isDisabled
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
                       readOnly
                      //  padding-bottom:2px; padding-left:14px; border:none; font-size:22px;
                />
              </div>
            </div>
            <div className='grid'>
              <div className='wp'>
                <div style={{width:'100%', height:'100%', overflow:'auto'}}>
                  <Grid pgm={this.props.pgm}
                        id ='main10'
                        selectionChange={(e) => this.onSelectChange(e)}
                        rowHeight={41}
                        rowHeaders= {[{ type: 'rowNum', width: 40 }]}
                        columns={[
                          columnInput({
                            name: 'scaleNumb',
                            header: '계근번호',
                            width : 100,
                            readOnly: true,
                            color : '#0063A9',
                            align : 'center',
                            fontSize: '12'
                          }),
                          columnInput({
                            name: 'carNumb',
                            header: '차량번호',
                            width : 90,
                            readOnly: true,
                            align : 'center',
                            fontSize: '12'
                          }),   
                          columnInput({
                            name: 'grade',
                            header: '검수등급',
                            width : 90,
                            readOnly: true,
                            align : 'left',
                            fontSize: '12'
                          }),
                          columnInput({
                            name: 'date',
                            header: '계근일자',
                            width : 80,
                            readOnly: true,
                            align : 'center',
                            fontSize: '12'
                          }),   
                          columnTextArea({
                            name: 'vendor',
                            header: '업체명',
                            width : 95,
                            height: 38,
                            readOnly: true,
                            align : 'left',
                            fontSize: '12'
                          }),
                          columnTextArea({
                            name: 'loc',
                            header: '상차주소',
                            width : 120,
                            height: 38,
                            readOnly: true,
                            align : 'left',
                            fontSize: '12'
                          }),
                          columnInput({
                            name: 'totalWgt',
                            header: '감량',
                            width : 35,
                            readOnly: true,
                            align : 'right',
                            fontSize: '12'
                          }),
                          columnInput({
                            name: 'warning',
                            header: '경고',
                            width : 40,
                            readOnly: true,
                            align : 'center',
                            fontSize: '12'
                          })
                        ]}
                  />
                </div>
              </div>
              <div className='grid_info'>
                <span className='title'>전체차량</span><Botspan reducer='INSP_HIST_MAIN' />
              </div>
            </div>
            {/* <div className='total_info'>
              <ul>
                <li><span className='title'>잔류 차량</span><Mainspan flag={1} /></li>
                <li><span className='title'>전체 검수 차량</span><Mainspan flag={2} /></li>
                <li><span className='title'>입고량(KG)</span><Mainspan flag={3} /></li>
              </ul>
              <ul>
                <li><span className='title'>검수대기</span><Mainspan flag={4} /></li>
                <li><span className='title'>출차대기</span><Mainspan flag={5} /></li>
                <li><span className='title'>입차대기</span><Mainspan flag={6} /></li>
              </ul>
            </div> */}
          </div>
          <div style={{paddingBottom:'10px', paddingTop:'200px'}} className='car_info'>
            <div className='title'><span>계근번호</span><Detailspan flag={1}  reducer='INSP_HIST_MAIN'/></div>
            <div style={{height:'130px'}} className='detail'>
              <ul>
                <li><span className='t'>차량번호</span><Detailspan flag={2}  reducer='INSP_HIST_MAIN'/></li>
                <li><span className='t'>총중량(KG)</span><Detailspan flag={3} reducer='INSP_HIST_MAIN' /></li>
                <li><span className='t'>입차시간</span><Detailspan flag={4}  reducer='INSP_HIST_MAIN'/></li> 
              </ul>
            </div>

            <Chit pgm={this.props.pgm} id={'chit_memo'}  reducer='INSP_HIST_MAIN'/>
          </div>
            <div className='cctv_viewer'>
              <h4>녹화영상</h4>
              {/* <div className='rain_info'>
		            <span className='title'>강수량</span><span className='value'>100mm</span>
	            </div> */}
              <div className='cctv_list'>
                {this.state.device[0] !== undefined && 
                  <RecImage device={this.state.device[0].camera.Guid} 
                            Name={this.state.device[0].camera.Name}
                            rtspUrl={this.state.device[0].rtspUrl[0]}
                            rtspPort={this.state.device[0].rtspPort[0]}
                            cam='STD_CAM_OPEN' 
                            focus='STD_CAM_FOCUS' 
                            rec='STD_CAM_REC' 
                            image='STD_CAM_IMG'/> 
                }
                {this.state.device[1] !== undefined && 
                  <RecImage device={this.state.device[1].camera.Guid} 
                            Name={this.state.device[1].camera.Name}
                            rtspUrl={this.state.device[1].rtspUrl[1]}
                            rtspPort={this.state.device[1].rtspPort[1]}
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

export default INSP_HIST;