import React from 'react';
import { useSelector } from 'react-redux';
import { gfc_addClass, gfc_removeClass, gfc_hasClass } from '../../../Method/Comm';

const TabList = (props) => {
  const value = useSelector((e) => {
    return e.INSP_PROC_MAIN.CHIT_INFO;
  }, (p, n) => {
    return p.scaleNumb === n.scaleNumb;
  });


  const tabButton = (tabIndex) => {
    let tabList = ['tab1','tab2']
    let contentList = ['content1','content2']
    let btnList = ['btn1','btn2']
    let tabMaxIndex = 2;
    for(let i = 0; i < tabMaxIndex; i++){
      if(i === tabIndex){
        if(gfc_hasClass(document.getElementById(tabList[i]),'on') === false){
          gfc_addClass(document.getElementById(tabList[i]),'on');
          gfc_addClass(document.getElementById(contentList[i]),'on');
          gfc_addClass(document.getElementById(btnList[i]),'on');
        }
      }else{
        gfc_removeClass(document.getElementById(tabList[i]),'on');
        gfc_removeClass(document.getElementById(contentList[i]),'on');
        gfc_removeClass(document.getElementById(btnList[i]),'on');
      }
    }
  }

  return (
    <div className='tab_list'>
      <button type='button' id='tab1' className='tab on' onClick={() => tabButton(0)}>검수입력</button>
      <button type='button' id='tab2' className='tab' onClick={() => tabButton(1)}>
        {value.chit.length !== undefined && <span className='doc'>메모있음</span> } 
        계량증명서
      </button>
    </div>
  );
}

export default TabList;