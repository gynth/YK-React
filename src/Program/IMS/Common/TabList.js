import React from 'react';
import { useSelector } from 'react-redux';
import { gfc_addClass, gfc_removeClass, gfc_hasClass } from '../../../Method/Comm';
import { gfs_getStoreValue } from '../../../Method/Store';

const TabList = (props) => {
  const value = useSelector((e) => {
    return e[props.reducer].CHIT_INFO;
  }, (p, n) => {
    return p.scaleNumb === n.scaleNumb;
  });


  const tabButton = (tabIndex,type) => {

    let tabList = [`tab1_${type}`,`tab2_${type}`,`tab3_${type}`,`tab4_${type}`]
    let contentList = [`content1_${type}`,`content2_${type}`,`content3_${type}`,`content4_${type}`]
    let btnList = [`btn1_${type}`,`btn2_${type}`,`btn3_${type}`,`btn4_${type}`]
    let tabMaxIndex = 4;
    for(let i = 0; i < tabMaxIndex; i++){
      if(i === tabIndex){
        if(gfc_hasClass(document.getElementById(tabList[i]),'on') === false){
          gfc_addClass(document.getElementById(tabList[i]),'on');
          gfc_addClass(document.getElementById(contentList[i]),'on');

          const btnElement = document.getElementById(btnList[i]);
          if(btnElement !== null) gfc_addClass(btnElement,'on');

          const car_info = document.getElementById('car_info');
          if(i === 0){
            car_info.style.paddingBottom = '90px';
          }else if(i === 1){
            if(gfs_getStoreValue('INSP_PROC_MAIN', 'CHIT_INFO').chit !== 'N'){
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

        // if(props.pgm === 'INSP_PROC'){
        //   const detail_grade1 = gfo_getCombo(props.pgm, 'detail_grade1').getLabel(); //고철등급
        //   gfs_dispatch(props.reducer, 'CHIT_INFO_ITEM_FLAG', {
        //     itemFlag : detail_grade1
        //   });
        // }
      }
    }
  }

  return (
    <div id={props.pgm}>
      <div className='tab_list'>
        <button type='button' id={`tab1_${props.pgm}`} className='tab on' onClick={() => tabButton(0, props.pgm)}>검수입력</button>
        <button type='button' id={`tab2_${props.pgm}`} className='tab' onClick={() => tabButton(1, props.pgm)}>
          {value.chit !== false && <span className='doc'>메모있음</span> } 
          계량표
        </button>
        <button type='button' id={`tab3_${props.pgm}`} className='tab' onClick={() => tabButton(2, props.pgm)}>배차정보</button>
        <button type='button' id={`tab4_${props.pgm}`} className='tab' onClick={() => tabButton(3, props.pgm)}>출발보고</button>
      </div>
    </div>
  );
}

export default TabList;