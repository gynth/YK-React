import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gfc_setNumberFormat } from '../../../Method/Comm';
import { gfs_dispatch } from '../../../Method/Store';
import { gfo_getTextarea } from '../../../Method/Component';
import TextArea from '../../../Component/Control/TextArea';

function Chit(props) {
  const value = useSelector((e) => {
    return e[props.reducer].CHIT_INFO;
  }, (p, n) => {
    if(props.reducer !== 'INSP_PROC_MAIN')
      return p.itemFlag === n.itemFlag;
    else
      return p === n;
  });

  const changeMemo = (e) => {
    gfs_dispatch(props.reducer, 'CHIT_MEMO', {CHIT_MEMO: e.target.value});
  }

  const limitLine = (e) => {
    // let numberOfLines = (e.target.value.match("\n/g") || []).length + 1;
    let numberOfLines = e.target.value.substr(0, e.target.value.length).split("\n").length;
    let maxRows = e.target.rows;
    // if(e.which === 13 && numberOfLines === maxRows){
    if(numberOfLines >= maxRows){

    }
  }

  useEffect(e => {
    if(props.reducer !== 'INSP_PROC_MAIN') return;

    if(value.chit === 'N'){
      gfo_getTextarea(props.pgm, 'chit_memo').setValue('');
    }
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
            <TextArea pgm={props.pgm} id={props.id} rows={10} wrap='soft' defaultValue='' onChange={e => changeMemo(e)} onKeyDown={e => limitLine(e)}></TextArea>
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