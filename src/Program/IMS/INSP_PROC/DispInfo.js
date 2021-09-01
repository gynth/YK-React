import React from 'react';
import { useSelector } from 'react-redux';
import Input from '../../../Component/Control/Input';

function DispInfo(props) {
  const DISP_INFO = useSelector((e) => {
    return e.INSP_PROC_MAIN.DISP_INFO;
  }, (p, n) => {
    return p.scaleNumb === n.scaleNumb;
  });

  return (
    <ul>
      <li>
        <h5>배차번호</h5>
          <Input pgm     = {props.pgm}
                 id      = 'disp_scrp_ord_no'
                 width   = '100%'
                 value   = {DISP_INFO.scrp_ord_no}
                 disabled
          />
      </li>
      <li>
        <h5>배차등급</h5>
          <Input pgm     = {props.pgm}
                 id      = 'disp_scrp_grd_nm'
                 width   = '100%'
                 value   = {DISP_INFO.scrp_grd_nm}
                 disabled
          />
      </li>
      <li>
        <h5>실공급자</h5>
          <Input pgm     = {props.pgm}
                 id      = 'disp_real_vender_name'
                 width   = '100%'
                 value   = {DISP_INFO.real_vender_name}
                 disabled
          />
      </li>
      <li>
        <h5>실상차지</h5>
          <Input pgm     = {props.pgm}
                 id      = 'disp_load_area_nm'
                 width   = '100%'
                 value   = {DISP_INFO.load_area_nm}
                 disabled
          />
      </li>
      <li>
        <h5>주소</h5>
          <Input pgm     = {props.pgm}
                 id      = 'disp_load_area_addr'
                 width   = '100%'
                 value   = {DISP_INFO.load_area_addr}
                 disabled
          />
      </li>
    </ul>
  );
}

export default DispInfo;