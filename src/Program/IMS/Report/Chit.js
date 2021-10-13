import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

function Chit(props) {
  const value = useSelector((e) => {
    return e[props.reducer].CHIT_INFO;
  }, (p, n) => {
    return p === n;
  });

  useEffect(e => {
    // if(props.reducer !== 'INSP_PROC_MAIN') return;

    // if(value.chit === 'N'){
    //   gfo_getTextarea(props.pgm, 'chit_memo').setValue('');
    // }
  })

  // date     : action.date,
  // scaleNumb: action.scaleNumb,
  // carNumb  : action.carNumb,
  // vender   : action.vender,
  // itemFlag : action.itemFlag,
  // Wgt      : action.Wgt,
  // loc      : action.loc,
  // user     : action.user,
  // chit     : action.chit

  return (
    <>
      <div className='data_list' style={{paddingLeft:0, paddingRight: 0}} id={`content2_${props.pgm}`}>
        {value.scaleNumb.length > 0 &&
          <img 
            src={`http://tally.yksteel.co.kr/Images/scaleChit/${value.scaleNumb.substring(0, 8)}/${value.scaleNumb}.jpg?date=${new Date()}`} 
            style={{width:'100%', height:600}} alt='chit' 
            />
        }
        <input style={{width:'95%', paddingLeft:'15px', height:30, border:'none', fontSize:'18px'}} readOnly defaultValue='검수일자'/>
        <span style={{width:'100%', paddingLeft:'15px', height:30, fontSize:'18px'}} >{value.date}</span>
      </div>
    </>
  );
}

export default Chit;