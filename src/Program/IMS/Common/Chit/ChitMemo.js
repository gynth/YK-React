import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import TextArea from '../../../../Component/Control/TextArea';
import { gfs_dispatch } from '../../../../Method/Store';
import { gfo_getTextarea } from '../../../../Method/Component';

function ChitMemo(props) {
  const [focus, setFocus] = useState(false);
  const textAreaRef = useRef();
  const canvasRef = useRef();
  
  const value = useSelector((e) => {
    return e[props.reducer].DETAIL_SCALE;
  }, (p, n) => {
    return p === n;
  });

  useEffect(e => {
    // if(props.reducer !== 'INSP_PROC_MAIN') return;

    // if(value.chit === 'N'){
      gfo_getTextarea(props.pgm, 'chit_memo').setValue('');
      let ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.beginPath();
    // }
  }, [props.pgm, value])

  const changeMemo = (e) => {
    gfs_dispatch(props.reducer, 'CHIT_MEMO', {CHIT_MEMO: e.target.value});
    drawTextBox(e.target.value, 4, 10, 305, 1.3)
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
      e.target.style.color = 'black';
      setTimeout(function(){
        e.target.style.color = 'red';
      },200);
    }    

    e.target.value = lines.slice(0, maxRows).join("\n");
    drawTextBox(e.target.value, 4, 10, 295, 1.2)
  }
  
  function drawTextBox(text, x, y, fieldWidth, spacing) {
    let ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "red";  //<======= here
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.beginPath();
    ctx.font = '17px sans serif';
    var line = "";
    var currentY = y;
    ctx.textBaseline = "top";
    for(var i=0; i<text.length; i++) {
      var tempLine = line + text[i];
      var tempWidth = ctx.measureText(tempLine).width;
   
      if (tempWidth < fieldWidth && text[i] !== '\n') {
        line = tempLine;
      }
      else {
        ctx.fillText(line, x, currentY);
        if(text[i] !== '\n') line = text[i];
        else line = "";
        currentY += 17 * spacing;
      }
    }
    ctx.fillText(line, x, currentY);
    // ctx.rect(x, y, fieldWidth, currentY-y+fontSize*spacing);
    ctx.stroke();
  }

  return (
    <>
        <TextArea 
          ref={textAreaRef}
          pgm={props.pgm} 
          id={props.id} 
          style={{display: focus === true ? 'block' : 'none', color:'red', fontSize:'18px'}}
          rows={5} 
          cols={30}
          wrap='soft' 
          defaultValue='' 
          onChange={e => changeMemo(e)} 
          // onKeyUp={e => limitLine(e)}
          onBlur={e => {
            setFocus(false)
          }}
        >
        </TextArea> 
        <canvas 
          ref={canvasRef}
          style={{width:'100%', height: '156px', display: focus === true ? 'none' : 'block'}}
          onClick={e => setFocus(true)}>
        </canvas> 
    </>


  );
}

export default ChitMemo;