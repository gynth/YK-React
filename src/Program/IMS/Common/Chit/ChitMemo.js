import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import TextArea from '../../../../Component/Control/TextArea';
import { gfs_dispatch } from '../../../../Method/Store';
import { gfo_getTextarea } from '../../../../Method/Component';

function ChitMemo(props) {
  const textAreaRef = useRef();

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
    const maxRows = textAreaRef.current.props.rows;
    const spaces = textAreaRef.current.props.cols;
    let lines = e.target.value.split('\n');
    for (var i = 0; i < lines.length; i++) 
    {
      if (lines[i].length <= spaces) continue;
      var j = 0;

      var space = spaces;

      while (j++ <= spaces) 
      {
        if (lines[i].charAt(j) === " ") space = j;  
      }
      
      lines[i + 1] = lines[i].substring(space + 1) + (lines[i + 1] || "");
      lines[i] = lines[i].substring(0, space);
   }

   if(lines.length > maxRows){
     e.target.style.color = 'red';
     setTimeout(function(){
       e.target.style.color = '';
     },500);
   }    

   e.target.value = lines.slice(0, maxRows).join("\n");
}

  return ( 
    <TextArea 
      ref={textAreaRef}
      pgm={props.pgm} 
      id={props.id} 
      rows={7} 
      cols={36}
      wrap='soft' 
      defaultValue='' 
      onChange={e => changeMemo(e)} 
      onKeyUp={e => limitLine(e)}
    >
    </TextArea>      
  );
}

export default ChitMemo;