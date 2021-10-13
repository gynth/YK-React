import React from 'react';
import { useSelector } from 'react-redux';
import { gfc_setNumberFormat } from '../../../Method/Comm';

function Botspan(props) {
  const value = useSelector((e) => e['DAILY_PROC_MAIN'], (p, n) => {
    return p === n;
  });

  return (
    // <div style={{fontSize:'25', float:'right', height:'40', margin:'5px 10px 8px 0'}}>{value}</div>
    <span className='value'>{gfc_setNumberFormat(value[props.column], '0,0', '0R')}</span>
  );
}

export default Botspan;