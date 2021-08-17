import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gfc_setNumberFormat } from '../../../../Method/Comm';
import ChitMemo from './ChitMemo';

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
      {
        value.chit === 'N' && props.reducer === 'INSP_PROC_MAIN' ?
        <div className='data_list' id={`content2_${props.pgm}`}>
          <div className='doc'>
            <h5>계 량 증 명 서</h5>
            <ul>
              <li>
                <span className='t'>일&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;시</span>
                <span className='v'>{value.date}</span>
              </li>
              <li>
                <span className='t'>계량번호</span>
                <span className='v'>{value.scaleNumb}</span>
              </li>
              <li>
                <span className='t'>차량번호</span>
                <span className='v'>{value.carNumb}</span>
              </li>
              <li>
                <span className='t'>업&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;체</span>
                <span className='v'>{value.vender}</span>
              </li>
              <li>
                <span className='t'>제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;품</span>
                <span className='v'>{value.itemFlag}</span>
              </li>
              <li>
                <span className='t'>입차중량</span>
                <span className='v'>{gfc_setNumberFormat(value.Wgt, '0,0', '0R')}</span>
              </li>
              <li>
                <span className='t'>지&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;역</span>
                <span className='v'>{value.loc}</span>
              </li>
              <li>
                <span className='t'>검&nbsp;&nbsp;수&nbsp;&nbsp;자</span>
                <span className='v'>{value.user}</span>
              </li>
            </ul>
          </div>
          <div className='memo'>
            <h5>MEMO</h5>
            <ChitMemo pgm={props.pgm} id={props.id} reducer={props.reducer}/>
          </div>
        </div>
      :
      
      <div className='data_list' id={`content2_${props.pgm}`}>
        {value.chit !== 'N' && <img src={'data:image/jpeg;base64,' + value.chit} style={{width:'100%', height:690}} alt='chit' />}
      </div>
      }
    </>
  );
}

export default Chit;