import React from 'react';
import { useSelector } from 'react-redux';

import { gfg_getGrid, gfg_getRow } from '../../../Method/Grid';
import { gfs_getStoreValue, gfs_dispatch } from '../../../Method/Store';
import { gfc_showMask, gfc_hideMask, gfc_screenshot_srv_YK, gfc_chit_yn_YK, gfc_sleep, gfc_screenshot_del_yk } from '../../../Method/Comm';
import { gfo_getCombo, gfo_getInput } from '../../../Method/Component';
import { getSp_Oracle_YK } from '../../../db/Oracle/Oracle';

import { YK_WEB_REQ } from '../../../WebReq/WebReq';

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

      if(column.chk.toString() === 'true'){
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

      gfc_hideMask();
      return;
    }
    const return_reason_desc = gfo_getInput(props.pgm, 'return_reason_desc'); //취소사유

    gfc_showMask();

    let param = [];
    for(let i = 0; i < grid.getRowCount(); i++){
      const column = gfg_getRow(grid, i);
      if(column.chk === null) continue;

      if(column.chk.toString() === 'true'){
        param.push({
          sp   : `BEGIN 
                    emm_inspect_apporve_cancel(
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
          }
        })
      }
    }

    let result = await getSp_Oracle_YK(
      param
    ); 

    console.log(param);

    //#endregion

    gfc_hideMask();
  }
  //#endregion

  //#region 계량표저장
  // const onScaleChit = async() => {
  //   const img = document.getElementById(`content2_${props.pgm}`);
  //   const scaleNumb = gfs_getStoreValue('INSP_CFRM_MAIN', 'CHIT_INFO');

  //   if(scaleNumb.scaleNumb === ''){
  //     alert('선택된 배차정보가 없습니다.');
  //     return;
  //   }

  //   gfc_showMask();

  //   const memo = gfs_getStoreValue('INSP_CFRM_MAIN', 'CHIT_MEMO').trim();
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
  //     gfs_dispatch('INSP_CFRM_MAIN', 'CHIT_INFO', {
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
      <button type='button' id={`btn1_${props.pgm}`} onClick={e => onProcess()} className='on'><span>검수확정</span></button>
      <button type='button' id={`btn2_${props.pgm}`} onClick={e => onProcess()}><span>검수확정</span></button>
    </div>
  );
}

export default CompleteBtn;