import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { gfs_getStoreValue, gfs_dispatch } from '../../../Method/Store';
import { gfc_showMask, gfc_hideMask, gfc_screenshot_srv_YK, gfc_ftp_file_yn_YK, gfc_sleep } from '../../../Method/Comm';
import { gfo_getCombo, gfo_getCheckbox } from '../../../Method/Component';

import { YK_WEB_REQ, YK_WEB_REQ_RAIN } from '../../../WebReq/WebReq';
import { getDynamicSql_Oracle, getSp_Oracle_YK } from '../../../db/Oracle/Oracle';
import { getDynamicSql_Mysql } from '../../../db/Mysql/Mysql';

const CompleteBtn = (props) => {
  const value = useSelector((e) => {
    return e.INSP_PROC_MAIN.CHIT_INFO;
  }, (p, n) => {
    return p.scaleNumb === n.scaleNumb;
  });


  const getRain = async() => {
    const result = await YK_WEB_REQ_RAIN();
    let value = 0;

    if(result){
      gfs_dispatch('INSP_PROC_MAIN', 'RAIN_INFO', {RAIN_INFO: result.data});
      value = result.data;
    }
    
    return value;
  }

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
    if(detail_grade1.getValue() === null || detail_grade1.getValue() === '' || detail_grade1.getValue() === undefined){
      alert('필수입력값이 없습니다. > 고철등급');
      const chitBtn = document.getElementById(`tab1_${props.pgm}`);
      chitBtn.click(0);

      gfc_hideMask();
      return;
    }
    const detail_grade2 = gfo_getCombo(props.pgm, 'detail_grade2'); //상세고철등급
    if(detail_grade2.getValue() === null || detail_grade2.getValue() === '' || detail_grade2.getValue() === undefined){
      alert('필수입력값이 없습니다. > 등급세부코드');
      const chitBtn = document.getElementById(`tab1_${props.pgm}`);
      chitBtn.click(0);

      gfc_hideMask();
      return;
    }
    const detail_subt = gfo_getCombo(props.pgm, 'detail_subt'); //감량중량
    const detail_subt_leg = gfo_getCombo(props.pgm, 'detail_subt_leg'); //감량사유
    if(detail_subt.getValue() !== null &&  detail_subt.getValue() !== '' && detail_subt.getValue() !== '0' && detail_subt.getValue() !== undefined){
      if(detail_subt_leg.getValue() === null || detail_subt_leg.getValue() === '' || detail_subt_leg.getValue() === undefined){
        alert('필수입력값이 없습니다. > 감량사유');
        const chitBtn = document.getElementById(`tab1_${props.pgm}`);
        chitBtn.click(0);
  
        gfc_hideMask();
        return;
      }
    }

    const detail_depr = gfo_getCombo(props.pgm, 'detail_depr'); //감가내역
    const detail_depr2 = gfo_getCombo(props.pgm, 'detail_depr2'); //감가비율
    if(detail_depr.getValue() !== null &&  detail_depr.getValue() !== ''&&  detail_depr.getValue() !== undefined){
      if(detail_depr2.getValue() === null || detail_depr2.getValue() === '' || detail_depr2.getValue() === undefined){
        alert('필수입력값이 없습니다. > 감가비율');
        const chitBtn = document.getElementById(`tab1_${props.pgm}`);
        chitBtn.click(0);
  
        gfc_hideMask();
        return;
      }
    }

    const detail_car = gfo_getCombo(props.pgm, 'detail_car'); //차종구분
    if(detail_car.getValue() === null || detail_car.getValue() === '' || detail_car.getValue() === undefined){
      alert('필수입력값이 없습니다. > 차종구분');
      const chitBtn = document.getElementById(`tab1_${props.pgm}`);
      chitBtn.click(0);

      gfc_hideMask();
      return;
    }
    
    const detail_rtn = gfo_getCombo(props.pgm, 'detail_rtn'); //반품구분
    const detail_rtn2 = gfo_getCombo(props.pgm, 'detail_rtn2'); //반품구분사유
    if(detail_rtn.getValue() !== null && detail_rtn.getValue() !== '' && detail_rtn.getValue() !== undefined){
      if(detail_rtn2.getValue() === null || detail_rtn2.getValue() === '' || detail_rtn2.getValue() === undefined){
        alert('필수입력값이 없습니다. > 반품구분사유');
        const chitBtn = document.getElementById(`tab1_${props.pgm}`);
        chitBtn.click(0);
  
        gfc_hideMask();
        return;
      }
    }

    const detail_warning = gfo_getCheckbox(props.pgm, 'detail_warning'); //경고
    
    //#endregion
    
    //#region 계량표저장
    const chitYn = await gfc_ftp_file_yn_YK(scaleNumb);
    const memo = gfs_getStoreValue('INSP_PROC_MAIN', 'CHIT_MEMO').trim();
    if(chitYn.data === false){

      if(memo.length === 0){
        // if(window.confirm('계량표의 내용이 없습니다. 저장하시겠습니까?') === false){
        //   gfc_hideMask();
        //   return;
        // }
        document.getElementById(`tab2_${props.pgm}`).click(2);
        await gfc_sleep(100);
        alert('계량표의 내용이 없습니다.');
        gfc_hideMask();
        return;
      }

      document.getElementById(`tab2_${props.pgm}`).click(2);
      await gfc_sleep(100);

      const img = document.getElementById(`content2_${props.pgm}`);
      const result = await gfc_screenshot_srv_YK(img, scaleNumb);
      
      if(result.data.substring(0, 8) === 'Uploaded'){
        // const chitYn = await gfc_chit_yn_YK(scaleNumb);
        gfs_dispatch('INSP_PROC_MAIN', 'CHIT_INFO', {
          scaleNumb,
          chit     : 'Y'
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

    const rain = await getRain();
    let param = [];
    param.push({
      sp   : `begin 
                apps.EMM_INSPECT_MOBILE(
                  :p_delivery_id,
                  :p_sector_code,
                  :p_reduce_code,
                  :p_reduce_wgt,
                  :p_return_gubun,
                  :p_return_code,
                  :p_file_yn,
                  :p_iron_grade,
                  :p_iron_grade_item,
                  :p_discount_code,
                  :p_erp_id,
                  :p_erp_worker,
                  :p_discount_rate,
                  :p_cartype,
                  :p_warning,
                  :p_rain,
                  :p_out
                );
              end;
              `,
      data : {
        p_delivery_id     : scaleNumb,
        p_sector_code     : 'E001',
        p_reduce_code     : (detail_subt_leg.getValue() === null || detail_subt_leg.getValue() === undefined) ? '' : detail_subt_leg.getValue(),
        p_reduce_wgt      : (detail_subt.getValue() === null || detail_subt.getValue() === undefined) ? '' : detail_subt.getValue(),
        p_return_gubun    : (detail_rtn.getValue() === null || detail_rtn.getValue() === undefined) ? '' : detail_rtn.getValue(),
        p_return_code     : (detail_rtn2.getValue() === null || detail_rtn2.getValue() === undefined) ? '' : detail_rtn2.getValue(),
        p_file_yn         : '',
        p_iron_grade      : detail_grade1.getValue(),
        p_iron_grade_item : detail_grade2.getValue(),
        p_discount_code   : (detail_depr.getValue() === null || detail_depr.getValue() === undefined)? '' : detail_depr.getValue(),
        p_erp_id          : gfs_getStoreValue('USER_REDUCER', 'ERP_ID'),
        p_erp_worker      : gfs_getStoreValue('USER_REDUCER', 'USER_NAM'),
        p_discount_rate   : (detail_depr2.getValue() === null || detail_depr2.getValue() === undefined) ? '' : detail_depr2.getValue(),
        p_cartype         : detail_car.getValue(),
        p_warning         : detail_warning.getValue() === true ? 'Y' : 'N',
        p_rain            : rain,
      },
      errSeq: 0
    })

    let result = await getSp_Oracle_YK(
      param
    ); 

    if(result.data.result !== 'OK'){
      alert('검수등록중 오류가 발생했습니다. > ' + result.data.result);
      gfc_hideMask();
    }else{

      getDynamicSql_Mysql(scaleNumb, (detail_subt.getValue() === null || detail_subt.getValue() === undefined || detail_subt.getValue() === '') ? 0 : detail_subt.getValue()).then(e => {
        console.log(e)
        
        const pgm = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState').filter(e => e.programId === 'INSP_PROC');
        pgm[0].Retrieve();
    
        gfc_hideMask();
      });
    }

    //#endregion
  }

  useEffect(() => {
    getRain();

    //1분에 한번씩 강수량 체크한다.
    const interval = setInterval(() => {
      getRain();
    }, 60000 * 1);

    return() => {
      clearInterval(interval);
    }

  }, [])
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
      <button style={{display: value.chit !== false && 'none' }} type='button' id={`btn2_${props.pgm}`} onClick={e => onProcess()}><span>등록완료</span></button>
      <button style={{display:'none'}} id={`btn3_${props.pgm}`}></button>
      <button style={{display:'none'}} id={`btn4_${props.pgm}`}></button>
    </div>
  );
}

export default CompleteBtn;