import React from 'react';
import { useSelector } from 'react-redux';
import { gfc_addClass, gfc_removeClass, gfc_hasClass } from '../../../Method/Comm';
import { gfs_getStoreValue } from '../../../Method/Store';

const TabList = (props) => {
  const value = useSelector((e) => {
    return e[props.reducer].CHIT_INFO;
  }, (p, n) => {
    return p.chit === n.chit;
  });


  const tabButton = (tabIndex,type) => {

    let tabList = [`tab1_${type}`,`tab2_${type}`]
    let contentList = [`content1_${type}`,`content2_${type}`]
    let btnList = [`btn1_${type}`,`btn2_${type}`]
    let tabMaxIndex = 2;
    for(let i = 0; i < tabMaxIndex; i++){
      if(i === tabIndex){
        if(gfc_hasClass(document.getElementById(tabList[i]),'on') === false){
          gfc_addClass(document.getElementById(tabList[i]),'on');
          gfc_addClass(document.getElementById(contentList[i]),'on');

          const btnElement = document.getElementById(btnList[i]);
          if(btnElement !== null) gfc_addClass(btnElement,'on');

          const car_info = document.getElementById(`car_info_${props.pgm}`);

          if(i === 0){
            car_info.style.paddingBottom = '90px';
          }else if(i === 1){
            if(gfs_getStoreValue('DISP_PROC_MAIN', 'CHIT_INFO').chit !== 'N'){
              car_info.style.paddingBottom = '10px';
            }else{
              car_info.style.paddingBottom = '90px';
            }
          }else{
            car_info.style.paddingBottom = '10px';
          }
        }
      }
      else{
        gfc_removeClass(document.getElementById(tabList[i]),'on');
        gfc_removeClass(document.getElementById(contentList[i]),'on');
        
        const btnElement = document.getElementById(btnList[i]);
          if(btnElement !== null) gfc_removeClass(btnElement,'on');
      }
    }
  }

  return (
    <div id={props.pgm}>
      <div className='tab_list type2'>
        <button type='button' id={`tab1_${props.pgm}`} className='tab on' onClick={() => tabButton(0, props.pgm)}>검수입력</button>
        <button type='button' id={`tab2_${props.pgm}`} className='tab' onClick={() => tabButton(1, props.pgm)}>
          {value.chit !== 'N' && <span className='doc'>메모있음</span> } 
          계량표
        </button>
      </div>
    </div>
  );
}

export default TabList;