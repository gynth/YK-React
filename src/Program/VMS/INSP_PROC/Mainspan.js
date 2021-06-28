import React from 'react';
import { useSelector } from 'react-redux';
import { gfc_setNumberFormat } from '../../../Method/Comm';

// MAIN_WAIT   : nowState === undefined ? 0 : nowState.MAIN_WAIT,
// MAIN_TOTAL  : nowState === undefined ? 0 : nowState.MAIN_TOTAL,
// MAIN_WEIGHT : nowState === undefined ? 0 : nowState.MAIN_WEIGHT,
// BOT_TOTAL   : nowState === undefined ? 0 : nowState.BOT_TOTAL,

// DETAIL_SCALE: nowState === undefined ? '' : nowState.DETAIL_SCALE,
// DETAIL_CARNO: nowState === undefined ? '' : nowState.DETAIL_CARNO,
// DETAIL_WEIGHT: nowState === undefined ? '' : nowState.DETAIL_WEIGHT,
// DETAIL_DATE: nowState === undefined ? '' : nowState.DETAIL_DATE

function Mainspan(props) {
  const value = useSelector((e) => {
    if(props.flag === 1){
      return e.INSP_PROC_MAIN.MAIN_WAIT;
    }else if(props.flag === 2){
      return e.INSP_PROC_MAIN.MAIN_TOTAL;
    }else if(props.flag === 3){
      return e.INSP_PROC_MAIN.MAIN_WEIGHT;
    }else if(props.flag === 4){
      return e.INSP_PROC_MAIN.BOT_TOTAL;
    }else if(props.flag === 5){
      return e.INSP_PROC_MAIN.DETAIL_SCALE;
    }else if(props.flag === 6){
      return e.INSP_PROC_MAIN.DETAIL_CARNO;
    }else if(props.flag === 7){
      return e.INSP_PROC_MAIN.DETAIL_WEIGHT;
    }else if(props.flag === 8){
      return e.INSP_PROC_MAIN.DETAIL_DATE;
    }
  }, (p, n) => {
    return p === n;
  });

  return (
    <span style={{color:'white', fontSize:props.fontSize, margin:props.margin}}>
      {
        props.flag === 1 ? `잔류 : ${value}` :
        props.flag === 2 ? `전체 : ${value}` :
        props.flag === 3 ? `입고 : ${gfc_setNumberFormat(value, '0,0', '0R')}` :
        props.flag === 7 ? gfc_setNumberFormat(value, '0,0', '0R') :
        props.flag >=  4 ? value : ''
      }
    </span>
  );
}

Mainspan.defaultProps = {
  fontSize: '30',
  margin: '0 0 8px 15px'
}

export default Mainspan;