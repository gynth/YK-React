import React from 'react';
import { useSelector } from 'react-redux';
import { gfc_setNumberFormat } from '../../../Method/Comm';

function Mainspan(props) {
  const value = useSelector((e) => {
    if(props.flag === 1){
      return e.INSP_PROC_MAIN.MAIN_WAIT;
    }else if(props.flag === 2){
      return e.INSP_PROC_MAIN.MAIN_TOTAL;
    }else{
      return e.INSP_PROC_MAIN.MAIN_WEIGHT;
    }
  }, (p, n) => {
    return p === n;
  });

  return (
    <span style={{color:'white', fontSize:'30', margin:'0 0 8px 15px'}}>
      {
        props.flag === 1 ? `잔류 : ${value}` :
        props.flag === 2 ? `전체 : ${value}` :
        props.flag === 3 ? `입고 : ${gfc_setNumberFormat(value, '0,0', '0R')}` : ''
      }
    </span>
  );
}

export default Mainspan;