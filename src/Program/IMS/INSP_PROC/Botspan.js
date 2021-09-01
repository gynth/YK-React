import React from 'react';
import { useSelector } from 'react-redux';

function Botspan(props) {
  const value = useSelector((e) => e.INSP_PROC_MAIN.BOT_TOTAL, (p, n) => {
    return p === n;
  });

  return (
    // <div style={{fontSize:'25', float:'right', height:'40', margin:'5px 10px 8px 0'}}>{value}</div>
    <span className='value'>{value}</span>
  );
}

export default Botspan;