import React from 'react';

import { gfg_getGrid, gfg_getRow } from '../../../Method/Grid';
import { gfs_getStoreValue } from '../../../Method/Store';
import { gfc_showMask, gfc_hideMask } from '../../../Method/Comm';
import { gfo_getCombo, gfo_getInput, gfo_getCheckbox } from '../../../Method/Component';
import { getSp_Oracle_YK } from '../../../db/Oracle/Oracle';
import { getDynamicSql_Mysql } from '../../../db/Mysql/Mysql';

const CompleteBtnModify = (props) => {

  //#region 검수등록
  const onProcess = async() => {
    const scaleNumb = gfs_getStoreValue('INSP_CFRM_MAIN', 'DETAIL_SCALE');

    if(scaleNumb === ''){
      alert('선택된 배차정보가 없습니다.');
      return;
    }

    const grid = gfg_getGrid(props.pgm, 'main10');
    let chkCnt = 0;
    for(let i = 0; i < grid.getRowCount(); i++){
      const column = gfg_getRow(grid, i);
      if(column.chk === null) continue;
      if(column.chk === undefined) continue;

      if(column.chk.toString() === 'Y'){
        chkCnt += 1;
        break;
      }
    }

    if(chkCnt === 0){
      alert('선택된건이 없습니다.');
      return;
    }


    //#region 필수입력확인 및 변수세팅
    const detail_grade1 = gfo_getCombo(props.pgm, 'detail_grade1'); //고철등급
    if(detail_grade1.getValue() === null || detail_grade1.getValue() === '' || detail_grade1.getValue() === undefined){
      alert('필수입력값이 없습니다. > 고철등급');
      const chitBtn = document.getElementById(`tab1_${props.pgm}`);
      chitBtn.click(0);

      return;
    }
    const detail_grade2 = gfo_getCombo(props.pgm, 'detail_grade2'); //상세고철등급
    if(detail_grade2.getValue() === null || detail_grade2.getValue() === '' || detail_grade2.getValue() === undefined){
      alert('필수입력값이 없습니다. > 등급세부코드');
      const chitBtn = document.getElementById(`tab1_${props.pgm}`);
      chitBtn.click(0);

      return;
    }
    const detail_subt = gfo_getCombo(props.pgm, 'detail_subt'); //감량중량
    const detail_subt_leg = gfo_getCombo(props.pgm, 'detail_subt_leg'); //감량사유
    if(detail_subt.getValue() !== null &&  detail_subt.getValue() !== '' && detail_subt.getValue() !== '0' && detail_subt.getValue() !== undefined){
      if(detail_subt_leg.getValue() === null || detail_subt_leg.getValue() === '' || detail_subt_leg.getValue() === undefined){
        alert('필수입력값이 없습니다. > 감량사유');
        const chitBtn = document.getElementById(`tab1_${props.pgm}`);
        chitBtn.click(0);
  
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
  
        return;
      }
    }

    const detail_out = gfo_getCombo(props.pgm, 'detail_out'); //하차구역
    if(detail_out.getValue() ===  null || detail_out.getValue() === '' || detail_out.getValue() === undefined){
      alert('필수입력값이 없습니다. > 하차구역');
      const chitBtn = document.getElementById(`tab1_${props.pgm}`);
      chitBtn.click(0);

      return;
    }
    const detail_car = gfo_getCombo(props.pgm, 'detail_car'); //차종구분
    if(detail_car.getValue() === null || detail_car.getValue() === '' || detail_car.getValue() === undefined){
      alert('필수입력값이 없습니다. > 차종구분');
      const chitBtn = document.getElementById(`tab1_${props.pgm}`);
      chitBtn.click(0);

      return;
    }
    const detail_rtn = gfo_getCombo(props.pgm, 'detail_rtn'); //반품구분
    const detail_rtn2 = gfo_getCombo(props.pgm, 'detail_rtn2'); //반품구분사유
    if(detail_rtn.getValue() !== null && detail_rtn.getValue() !== '' && detail_rtn.getValue() !== undefined){
      if(detail_rtn2.getValue() === null || detail_rtn2.getValue() === '' || detail_rtn2.getValue() === undefined){
        alert('필수입력값이 없습니다. > 반품구분사유');
        const chitBtn = document.getElementById(`tab1_${props.pgm}`);
        chitBtn.click(0);
  
        return;
      }
    }

    const detail_warning = gfo_getCheckbox(props.pgm, 'detail_warning'); //경고
    const detail_rain = gfo_getInput(props.pgm, 'detail_rain');

    gfc_showMask();

    let param = [];
    for(let i = 0; i < grid.getRowCount(); i++){
      const column = gfg_getRow(grid, i);
      if(column.chk === null) continue;
      if(column.chk === undefined) continue;

      if(column.chk.toString() === 'Y'){
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
            p_delivery_id     : column.scaleNumb,
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
            p_rain            : (detail_rain.getValue() === null || detail_rain.getValue() === undefined) ? 0 : detail_rain.getValue(),
          },
          errSeq: i
        })
      }
    }

    try{
      let result = await getSp_Oracle_YK(
        param
      );     
      
      if(result.data.result !== 'OK'){
        alert('검수수정중 오류가 발생했습니다. > ' + result.data.result);
        gfc_hideMask();
      }else{
        getDynamicSql_Mysql(scaleNumb, (detail_subt.getValue() === null || detail_subt.getValue() === undefined || detail_subt.getValue() === '') ? 0 : detail_subt.getValue()).then(e => {
          console.log(e)

          alert('저장되었습니다.');
          
          const pgm = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState').filter(e => e.programId === 'INSP_PROC');
          pgm[0].Retrieve();
      
          gfc_hideMask();
        });
      }
    }catch(e){

    }finally{
      gfc_hideMask();
    }
  }
  //#endregion

  return (
    <div className="complete_btn edit">
      <button onClick={() => onProcess()} type="button" style={{display:'block'}}><span>검수수정</span></button>
    </div>
  );
}

export default CompleteBtnModify;