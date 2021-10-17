import React from 'react';

import { gfg_getGrid, gfg_getRow, gfg_setSelectRow } from '../../../Method/Grid';
import { gfs_getStoreValue } from '../../../Method/Store';
import { gfc_showMask, gfc_hideMask } from '../../../Method/Comm';
import { gfo_getCombo, gfo_getInput, gfo_getCheckbox } from '../../../Method/Component';
import { getDynamicSql_Oracle, getSp_Oracle_YK } from '../../../db/Oracle/Oracle';
import { YK_WEB_REQ } from '../../../WebReq/WebReq';
import { getDynamicSql_Mysql } from '../../../db/Mysql/Mysql';

const CompleteBtnModify = (props) => {

  //#region 검수등록
  const onProcess = async() => {
    const scaleNumb = gfs_getStoreValue('INSP_CFRM_MAIN', 'DETAIL_SCALE');

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
    if(detail_depr.getValue() !== null && detail_depr.getValue() !== '' && detail_depr.getValue() !== undefined){
      if(detail_depr2.getValue() === null || detail_depr2.getValue() === '' || detail_depr2.getValue() === undefined){
        alert('필수입력값이 없습니다. > 감가비율');
        const chitBtn = document.getElementById(`tab1_${props.pgm}`);
        chitBtn.click(0);
  
        gfc_hideMask();
        return;
      }
    }

    const detail_out = gfo_getCombo(props.pgm, 'detail_out'); //하차구역
    if(detail_out.getValue() ===  null || detail_out.getValue() === '' || detail_out.getValue() === undefined){
      alert('필수입력값이 없습니다. > 하차구역');
      gfc_hideMask();
      return;
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
    
    // const msg = `dScaleNumb=${scaleNumb}&` + //검수번호(계근번호)
    // `dWorker=${gfs_getStoreValue('USER_REDUCER', 'USER_ID')}&` + //검수자(ERP ID)
    // `dWorkerName=${gfs_getStoreValue('USER_REDUCER', 'USER_NAM')}&` + //검수자 이름
    // `dOutageReasonCode=${detail_subt_leg.getValue() === null ? '' : detail_subt_leg.getValue()}&` + //감량사유
    // `dOutageWeightCode=${detail_subt.getValue() === null ? '' : detail_subt.getValue()}&` + //감량중량
    // `dScrapGradeCode=${detail_grade1.getValue()}&` + //등급코드
    // `dScrapGradeItemCode=${detail_grade2.getValue()}&` + //등급아이템
    // `dTallyHistoryCode=${detail_depr.getValue() === null ? '' : detail_depr.getValue()}&` + //감가내역
    
    // `dTallyRatio=${detail_depr2.getValue()}&` + //감가비율???
    
    // // `dScrapAreaCode=${detail_out.getValue()}&` + //하차구역(섹터), 옥내는E001고정
    // `dScrapAreaCode=E001&` + //하차구역(섹터), 옥내는E001고정
    // `dReturnDivisionCode=${detail_rtn.getValue() === null ? '' : detail_rtn.getValue()}&` + //반품구분
    // `dReturnHistoryCode=${detail_rtn2.getValue() === null ? '' : detail_rtn2.getValue()}&` + //반품구분사유
    
    // `dOutageReasonEtcEdit=&` + //기타의견???

    // `dCarTypeCode=${detail_car.getValue()}&` +
    // `dWarning=${detail_warning.getValue() === true ? 'Y' : 'N'}&` +
    // `dRain=0`;
    // const Data = await YK_WEB_REQ(`tally_process_erp_procedure.jsp?${msg}`);

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
        p_sector_code     : detail_out.getValue(),
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
        p_rain            : '0',
      },
      errSeq: 0
    })

    let result = await getSp_Oracle_YK(
      param
    );     
    
    if(result.data.result !== 'OK'){
      alert('검수수정중 오류가 발생했습니다. > ' + result.data.result);
      gfc_hideMask();
    }else{
      getDynamicSql_Mysql(scaleNumb, (detail_subt.getValue() === null || detail_subt.getValue() === undefined || detail_subt.getValue() === '') ? 0 : detail_subt.getValue()).then(e => {
        console.log(e)
        
        const pgm = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState').filter(e => e.programId === 'INSP_PROC');
        pgm[0].Retrieve();
    
        gfc_hideMask();
      });
      // if(detail_subt.getValue() === null || detail_subt.getValue() === undefined || detail_subt.getValue() === ''){
        
      //   const pgm = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState').filter(e => e.programId === 'INSP_PROC');
      //   pgm[0].Retrieve();
      //   alert('저장되었습니다.');
      //   gfc_hideMask();
      // }else{   
      //   getDynamicSql_Mysql(scaleNumb, (detail_subt.getValue() === null || detail_subt.getValue() === undefined || detail_subt.getValue() === '') ? 0 : detail_subt.getValue()).then(e => {
      //     console.log(e)
          
      //     const pgm = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState').filter(e => e.programId === 'INSP_PROC');
      //     pgm[0].Retrieve();
      
      //     gfc_hideMask();
      //   });
        // getDynamicSql_Mysql(scaleNumb, detail_subt.getValue() === null ? '' : detail_subt.getValue()).then(e => {
        //   console.log(e)

        //   const pgm = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState').filter(e => e.programId === 'INSP_PROC');
        //   pgm[0].Retrieve();
        //   alert('저장되었습니다.');
      
        //   gfc_hideMask();
        // });
      }
    // getDynamicSql_Oracle(
    //   'Common/Common',
    //   'EMM_INSPECT_MOBILEY',
    //   [{strScaleNumb          : scaleNumb,
    //     strErpId              : gfs_getStoreValue('USER_REDUCER', 'ERP_ID'),
    //     strWorker             : gfs_getStoreValue('USER_REDUCER', 'USER_NAM'),
    //     strOutageReasonCode   : detail_subt_leg.getValue() === null ? '' : detail_subt_leg.getValue(),
    //     strOutageWeightCode   : detail_subt.getValue() === null ? '' : detail_subt.getValue(),
    //     strScrapGradeCode     : detail_grade1.getValue(),
    //     strScrapGradeItemCode : detail_grade2.getValue(),
    //     strTallyHistoryCode   : detail_depr.getValue() === null ? '' : detail_depr.getValue(),
    //     strTallyRatio         : detail_depr2.getValue() === null ? '' : detail_depr2.getValue(),
    //     strScrapAreaCode      : detail_out.getValue(),
    //     strReturnDivisionCode : detail_rtn.getValue() === null ? '' : detail_rtn.getValue(),
    //     strReturnHistoryCode  : detail_rtn2.getValue() === null ? '' : detail_rtn2.getValue(),
    //     strOutageReasonEtcEdit: '',
    //     strCarType            : detail_car.getValue(),
    //     strWarning            : detail_warning.getValue() === true ? 'Y' : 'N',
    //     strRain               : '0'
    //   }]
    // ).then(e => {
    //   console.log(e);
      
    //   getDynamicSql_Mysql(scaleNumb, detail_subt.getValue() === null ? '' : detail_subt.getValue()).then(e => {
    //     console.log(e)

    //     const pgm = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState').filter(e => e.programId === 'INSP_CFRM');
    //     pgm[0].Retrieve();
        
    //     gfc_hideMask();
    //   });

    // })
  }
  //#endregion

  return (
    <div className="complete_btn edit">
      <button onClick={() => onProcess()} type="button" style={{display:'block'}}><span>검수수정</span></button>
    </div>
  );
}

export default CompleteBtnModify;