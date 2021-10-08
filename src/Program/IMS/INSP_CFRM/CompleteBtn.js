import React from 'react';

import { gfg_getGrid, gfg_getRow, gfg_setSelectRow } from '../../../Method/Grid';
import { gfs_getStoreValue } from '../../../Method/Store';
import { gfc_showMask, gfc_hideMask } from '../../../Method/Comm';
import { getSp_Oracle_YK } from '../../../db/Oracle/Oracle';

const CompleteBtn = (props) => {

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

      if(column.chk.toString() === 'Y'){
        chkCnt += 1;
        break;
      }
    }

    if(chkCnt === 0){
      alert('선택된건이 없습니다.');
      return;
    }

    gfc_showMask();

    let param = [];
    for(let i = 0; i < grid.getRowCount(); i++){
      const column = gfg_getRow(grid, i);
      if(column.chk === null) continue;

      if(column.chk.toString() === 'Y'){
        param.push({
          sp   : `begin 
                    apps.emm_inspect_apporve(
                      :p_delivery_id,
                      :p_approve_name,
                      :p_erp_id,
                      :p_out
                    );
                  end;
                  `,
          data : {
            p_delivery_id : column.scaleNumb,
            p_approve_name: gfs_getStoreValue('USER_REDUCER', 'USER_NAM'),
            p_erp_id      : gfs_getStoreValue('USER_REDUCER', 'ERP_ID')
          },
          errSeq: i
        })
      }
    }

    let result = await getSp_Oracle_YK(
      param
    ); 


    if(result.data.result !== 'OK'){
      alert('검수확정중 오류가 발생했습니다. > ' + result.data.result);

      const ROW_KEY = result.data.seq;
      gfg_setSelectRow(grid, '', ROW_KEY);
    }else{
      alert('검수확정 되었습니다.');
      const pgm = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState').filter(e => e.programId === 'INSP_CFRM');
      pgm[0].Retrieve();
    }

    //#endregion

    gfc_hideMask();
  }
  //#endregion

  return (            
    <div className="complete_btn">
      <button onClick={() => onProcess()} type="button" style={{display:'block'}}><span>검수확정</span></button>
    </div>
  );
}

export default CompleteBtn;