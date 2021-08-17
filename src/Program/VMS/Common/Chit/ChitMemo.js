import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import TextArea from '../../../../Component/Control/TextArea';
import { gfs_dispatch } from '../.././../../Method/Store';
import { gfo_getTextarea } from '../../../../Method/Component';

function ChitMemo(props) {
  const value = useSelector((e) => {
    return e[props.reducer].DETAIL_SCALE;
  }, (p, n) => {
    return p === n;
  });

  useEffect(e => {
    // if(props.reducer !== 'INSP_PROC_MAIN') return;

    // if(value.chit === 'N'){
      gfo_getTextarea(props.pgm, 'chit_memo').setValue('');
    // }
  }, [props.pgm, value])

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

  return ( 
    <TextArea pgm={props.pgm} id={props.id} rows={10} wrap='soft' defaultValue='' onChange={e => changeMemo(e)} onKeyDown={e => limitLine(e)}></TextArea>      
  );
}

export default ChitMemo;