import React from 'react';

import { gfg_getGrid, gfg_getRow, gfg_setSelectRow } from '../../../Method/Grid';
import { gfs_getStoreValue } from '../../../Method/Store';
import { gfc_showMask, gfc_hideMask } from '../../../Method/Comm';
import { gfo_getCombo, gfo_getInput } from '../../../Method/Component';
import { getSp_Oracle_YK } from '../../../db/Oracle/Oracle';

const CompleteBtnModify = (props) => {

  //#region 검수등록
  const onProcess = async() => {
    const scaleNumb = gfs_getStoreValue('INSP_CANC_MAIN', 'DETAIL_SCALE');

    if(scaleNumb === ''){
      alert('선택된 배차정보가 없습니다.');
      return;
    }

    const grid = gfg_getGrid(props.pgm, 'main10');
    let chkCnt = 0;
    for(let i = 0; i < grid.getRowCount(); i++){
      const column = gfg_getRow(grid, i);
      if(column.chk === null) continue;

      if(column.chk.toString() === 'Y'){
        chkCnt += 1;
        break;
      }
    }

    if(chkCnt === 0){
      alert('선택된건이 없습니다.');
      return;
    }

    const return_reason = gfo_getCombo(props.pgm, 'return_reason'); //취소사유
    if(return_reason.getValue() === null){
      alert('필수입력값이 없습니다. > 취소사유');
      return;
    }
    const return_reason_desc = gfo_getInput(props.pgm, 'return_reason_desc'); //취소사유

    if(window.confirm('확정취소 하시겠습니까?') === false){
      return;
    }

    gfc_showMask();

    let param = [];
    for(let i = 0; i < grid.getRowCount(); i++){
      const column = gfg_getRow(grid, i);
      if(column.chk === null) continue;

      if(column.chk.toString() === 'Y'){
        param.push({
          sp   : `BEGIN 
                    apps.emm_inspect_apporve_cancel(
                      :p_delivery_id,
                      :p_approve_name,
                      :p_reason_code,
                      :p_reason_desc,
                      :p_erp_id,
                      :p_out
                    );
                  END;
                  `,
          data : {
            p_delivery_id : column.scaleNumb,
            p_approve_name: 'bjkim2',
            p_reason_code : return_reason.getValue(),
            p_reason_desc : return_reason_desc.getValue(),
            p_erp_id      : 1989
          },
          errSeq : {
            delivery_id : column.scaleNumb,
            seq         : i
          }
        })
      }
    }

    let result = await getSp_Oracle_YK(
      param
    ); 

    if(result.data.result !== 'OK'){
      alert('확정취소중 오류가 발생했습니다. > ' + result.data.result);

      const ROW_KEY = result.data.seq;
      gfg_setSelectRow(grid, '', ROW_KEY);
    }else{
      alert('확정취소 되었습니다.');
      const pgm = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState').filter(e => e.programId === 'INSP_CANC');
      pgm[0].Retrieve();
    }

    //#endregion

    gfc_hideMask();
  }
  //#endregion

  return (
    <div className="complete_btn edit">
      <button onClick={() => onProcess()} type="button" style={{display:'block'}}><span>검수수정</span></button>
    </div>
  );
}

export default CompleteBtnModify;