import React from 'react';
import { useSelector } from 'react-redux';
import { gfc_addClass, gfc_removeClass, gfc_hasClass } from '../../../Method/Comm';
import { gfo_getCombo } from '../../../Method/Component';
import { gfs_dispatch } from '../../../Method/Store';

const TabList = (props) => {
  const value = useSelector((e) => {
    return e[props.reducer].CHIT_INFO;
  }, (p, n) => {
    return p.scaleNumb === n.scaleNumb;
  });


  const tabButton = (tabIndex) => {
    let tabList = [`${props.pgm}_tab1`,`${props.pgm}_tab2`]
    let contentList = [`${props.pgm}_content1`,`${props.pgm}_content2`]
    let btnList = [`${props.pgm}_btn1`,`${props.pgm}_btn2`]
    let tabMaxIndex = 2;
    for(let i = 0; i < tabMaxIndex; i++){
      if(i === tabIndex){
        if(gfc_hasClass(document.getElementById(tabList[i]),'on') === false){
          gfc_addClass(document.getElementById(tabList[i]),'on');
          gfc_addClass(document.getElementById(contentList[i]),'on');
          gfc_addClass(document.getElementById(btnList[i]),'on');
        }
      }
      else{
        gfc_removeClass(document.getElementById(tabList[i]),'on');
        gfc_removeClass(document.getElementById(contentList[i]),'on');
        gfc_removeClass(document.getElementById(btnList[i]),'on');

        if(props.pgm === 'INSP_PROC'){
          const detail_grade1 = gfo_getCombo(props.pgm, 'detail_grade1').getLabel(); //고철등급
          gfs_dispatch(props.reducer, 'CHIT_INFO_ITEM_FLAG', {
            itemFlag : detail_grade1
          });
        }
      }
    }
  }

  return (
    <div className='tab_list'>
      <button type='button' id={`${props.pgm}_tab1`} className='tab on' onClick={() => tabButton(0)}>검수입력</button>
      <button type='button' id={`${props.pgm}_tab2`} className='tab' onClick={() => tabButton(1)}>
        {value.chit.length !== undefined && <span className='doc'>메모있음</span> } 
        {/* 계량증명서 */}
        검수입력
      </button>
    </div>
  );
}

export default TabList;