import React from 'react';
import { useSelector } from 'react-redux';
import { gfc_setNumberFormat } from '../../../Method/Comm';

function Mainspan(props) {
  const value = useSelector((e) => {
    if(props.flag === 1){
      return e.INSP_PROC_MAIN.MAIN_WAIT;
    }else if(props.flag === 2){
      return e.INSP_PROC_MAIN.MAIN_TOTAL;
    }else if(props.flag === 3){
      return e.INSP_PROC_MAIN.MAIN_WEIGHT;
    }else if(props.flag === 4){
      return e.INSP_PROC_MAIN.PROC_WAIT;
    }else if(props.flag === 5){
      return e.INSP_PROC_MAIN.DEPT_WAIT;
    }else if(props.flag === 6){
      return e.INSP_PROC_MAIN.ENTR_WAIT;
    }
  }, (p, n) => {
    return p === n;
  });

  return (
    <span className='value'>
      {gfc_setNumberFormat(value, '0,0', '0R')
        // props.flag === 1 ? `잔류 : ${value}` :
        // props.flag === 2 ? `전체 : ${value}` :
        // props.flag === 3 ? `입고 : ${gfc_setNumberFormat(value, '0,0', '0R')}` :
        // props.flag === 7 ? gfc_setNumberFormat(value, '0,0', '0R') :
        // props.flag >=  4 ? value : ''
      }
    </span>
  );
}

export default Mainspan;