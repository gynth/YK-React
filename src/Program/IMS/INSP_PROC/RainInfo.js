import React from 'react';
import { useSelector } from 'react-redux';

function RainInfo(props) {
  const rainInfo = useSelector((e) => {
    return e.INSP_PROC_MAIN.RAIN_INFO;
  }, (p, n) => {
    return p === n;
  });

  return (
    <>
      {rainInfo > 0 &&
        <div className='rain_info'>
          <span className='title'>강수량</span><span className='value'>{`${rainInfo} mm`}</span>
        </div>
      }
    </>
  );
}

export default RainInfo;