import React from 'react';
import { useSelector } from 'react-redux';

import { gfs_getStoreValue, gfs_dispatch } from '../../../Method/Store';
import { gfc_showMask, gfc_hideMask, gfc_screenshot_srv_YK, gfc_chit_yn_YK, gfc_sleep } from '../../../Method/Comm';
import { gfo_getCombo } from '../../../Method/Component';

import { YK_WEB_REQ } from '../../../WebReq/WebReq';

const CompleteBtn = (props) => {
  const value = useSelector((e) => {
    return e.INSP_PROC_MAIN.CHIT_INFO;
  }, (p, n) => {
    return p.scaleNumb === n.scaleNumb;
  });

  //#region 검수등록
  const onProcess = async() => {
    const scaleNumb = gfs_getStoreValue('INSP_PROC_MAIN', 'DETAIL_SCALE');

    if(scaleNumb === ''){
      alert('선택된 배차정보가 없습니다.');
      return;
    }

    gfc_showMask();

    //#region 필수입력확인 및 변수세팅
    const detail_grade1 = gfo_getCombo(props.pgm, 'detail_grade1'); //고철등급
    if(detail_grade1.getValue() === null){
      alert('필수입력값이 없습니다. > 고철등급');
      const chitBtn = document.getElementById(`tab1_${props.pgm}`);
      chitBtn.click(0);

      gfc_hideMask();
      return;
    }
    const detail_grade2 = gfo_getCombo(props.pgm, 'detail_grade2'); //상세고철등급
    if(detail_grade2.getValue() === null){
      alert('필수입력값이 없습니다. > 등급세부코드');
      const chitBtn = document.getElementById(`tab1_${props.pgm}`);
      chitBtn.click(0);

      gfc_hideMask();
      return;
    }
    const detail_subt = gfo_getCombo(props.pgm, 'detail_subt'); //감량중량
    const detail_subt_leg = gfo_getCombo(props.pgm, 'detail_subt_leg'); //감량사유
    const detail_depr = gfo_getCombo(props.pgm, 'detail_depr'); //감가내역
    const detail_depr2 = gfo_getCombo(props.pgm, 'detail_depr2'); //감가비율
    if(detail_depr.getValue() !== null){
      if(detail_depr2.getValue() === null){
        alert('필수입력값이 없습니다. > 감가비율');
        const chitBtn = document.getElementById(`tab1_${props.pgm}`);
        chitBtn.click(0);
  
        gfc_hideMask();
        return;
      }
    }

    // const detail_out = gfo_getCombo(props.pgm, 'detail_out'); //하차구역
    // if(detail_out.getValue() === null){
    //   alert('필수입력값이 없습니다. > 하차구역');
    //   gfc_hideMask();
    //   return;
    // }
    const detail_car = gfo_getCombo(props.pgm, 'detail_car'); //차종구분
    if(detail_car.getValue() === null){
      alert('필수입력값이 없습니다. > 차종구분');
      const chitBtn = document.getElementById(`tab1_${props.pgm}`);
      chitBtn.click(0);

      gfc_hideMask();
      return;
    }
    const detail_rtn = gfo_getCombo(props.pgm, 'detail_rtn'); //반품구분
    const detail_rtn2 = gfo_getCombo(props.pgm, 'detail_rtn2'); //반품구분사유
    if(detail_rtn !== null){
      if(detail_rtn2.getValue() === null){
        alert('필수입력값이 없습니다. > 반품구분사유');
        const chitBtn = document.getElementById(`tab1_${props.pgm}`);
        chitBtn.click(0);
  
        gfc_hideMask();
        return;
      }
    }

    const detail_warning = gfo_getCombo(props.pgm, 'detail_warning'); //경고
    
    //#endregion
    
    //#region 계량표저장
    const chitYn = await gfc_chit_yn_YK(scaleNumb);
    const memo = gfs_getStoreValue('INSP_PROC_MAIN', 'CHIT_MEMO').trim();
    if(chitYn.data === 'N'){
      document.getElementById(`tab2_${props.pgm}`).click(2);

      await gfc_sleep(200);

      if(memo.length === 0){
        if(window.confirm('계량표의 내용이 없습니다. 저장하시겠습니까?') === false){
          gfc_hideMask();
          return;
        }
      }

      const img = document.getElementById(`content2_${props.pgm}`);
      const result = await gfc_screenshot_srv_YK(img, scaleNumb);
      
      if(result.data === 'Y'){
        const chitYn = await gfc_chit_yn_YK(scaleNumb);
        gfs_dispatch('INSP_PROC_MAIN', 'CHIT_INFO', {
          chit     : chitYn.data
        });
      }else{
        alert('계량표 저장에 실패 했습니다.');
        gfc_hideMask();
        return;
      }
    }else{
      if(memo.length > 0){
        alert('저장된 계량표가있습니다. 다시 조회 후 확인바랍니다.');
        gfc_hideMask();
        return;
      }
    }

    const msg = `dScaleNumb=${scaleNumb}&` + //검수번호(계근번호)
                // `dWorker=${gfs_getStoreValue('USER_REDUCER', 'USER_ID')}&` + //검수자(ERP ID)
                `dWorker=1989&` + //검수자(ERP ID)
                `dWorkerName=${gfs_getStoreValue('USER_REDUCER', 'USER_NAM')}&` + //검수자 이름
                `dOutageReasonCode=${detail_subt_leg.getValue() === null ? '' : detail_subt_leg.getValue()}&` + //감량사유
                `dOutageWeightCode=${detail_subt.getValue() === null ? '' : detail_subt.getValue()}&` + //감량중량
                `dScrapGradeCode=${detail_grade1.getValue()}&` + //등급코드
                `dScrapGradeItemCode=${detail_grade2.getValue()}&` + //등급아이템
                `dTallyHistoryCode=${detail_depr.getValue() === null ? '' : detail_depr.getValue()}&` + //감가내역
                
                `dTallyRatio=${detail_depr2.getValue()}&` + //감가비율???
                
                // `dScrapAreaCode=${detail_out.getValue()}&` + //하차구역(섹터), 옥내는E001고정
                `dScrapAreaCode=E001&` + //하차구역(섹터), 옥내는E001고정
                `dReturnDivisionCode=${detail_rtn.getValue() === null ? '' : detail_rtn.getValue()}&` + //반품구분
                `dReturnHistoryCode=${detail_rtn2.getValue() === null ? '' : detail_rtn2.getValue()}&` + //반품구분사유
                
                `dOutageReasonEtcEdit=&` + //기타의견???

                `dCarTypeCode=${detail_car.getValue()}&` +
                `dWarning=${detail_warning.getValue() === null ? '' : detail_warning.getValue()}&` +
                `dRain=0`;

    const Data = await YK_WEB_REQ(`tally_process_erp_procedure.jsp?${msg}`);
    console.log(Data);

    //#endregion

    gfc_hideMask();
  }
  //#endregion

  //#region 계량표저장
  // const onScaleChit = async() => {
  //   const img = document.getElementById(`content2_${props.pgm}`);
  //   const scaleNumb = gfs_getStoreValue('INSP_PROC_MAIN', 'CHIT_INFO');

  //   if(scaleNumb.scaleNumb === ''){
  //     alert('선택된 배차정보가 없습니다.');
  //     return;
  //   }

  //   gfc_showMask();

  //   const memo = gfs_getStoreValue('INSP_PROC_MAIN', 'CHIT_MEMO').trim();
  //   if(memo.length === 0){
  //     if(window.confirm('계량표의 내용이 없습니다. 저장하시겠습니까?') === false){
  //       gfc_hideMask();
  //       return;
  //     }
  //   }

  //   //다른쪽에서 저장된 계량표가 있는지 한번더 확인한다.
  //   const chitYn = await gfc_chit_yn_YK(scaleNumb.scaleNumb);
  //   if(chitYn.data !== 'N'){
  //     alert('이미처리된 계량표 입니다. 재조회 후 확인바랍니다.');
  //     gfc_hideMask();
  //     return;
  //   }

  //   const result = await gfc_screenshot_srv_YK(img, scaleNumb.scaleNumb);
    
  //   if(result.data === 'Y'){
  //     const chitYn = await gfc_chit_yn_YK(scaleNumb.scaleNumb);
  //     gfs_dispatch('INSP_PROC_MAIN', 'CHIT_INFO', {
  //       chit     : chitYn.data
  //     });
  //   }else{
  //     alert('계량표 저장에 실패 했습니다.')
  //   }
    
  //   gfc_hideMask();
  // }
  //#endregion

  return (
    <div className='complete_btn'>
      <button type='button' id={`btn1_${props.pgm}`} onClick={e => onProcess()} className='on'><span>등록완료</span></button>
      {/* <button type='button' id={`btn2_${props.pgm}`} onClick={e => onProcess()}><span>등록완료</span></button> */}
      <button style={{display: value.chit !== 'N' && 'none' }} type='button' id={`btn2_${props.pgm}`} onClick={e => onProcess()}><span>등록완료</span></button>
      <button style={{display:'none'}} id={`btn3_${props.pgm}`}></button>
      <button style={{display:'none'}} id={`btn4_${props.pgm}`}></button>
    </div>
  );
}

export default CompleteBtn;