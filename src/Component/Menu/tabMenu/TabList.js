import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import TabListItem from './TabListItem';
import { gfc_sleep, gfc_set_oracle_column } from '../../../Method/Comm';
import { gfs_getStoreValue } from '../../../Method/Store';
import { getDynamicSql_Oracle } from '../../../db/Oracle/Oracle';

async function onClick(flag, e){
  if(e.target.parentNode.disabled) return;

  // 1. Retrieve
  // 2. Insert
  // 3. Delete
  // 4. Save
  // 5. Init
  // 6. Print
  // 7. DtlInsert
  // 8. DtlDelete
  if(gfs_getStoreValue('WINDOWFRAME_REDUCER') === undefined) return;

  // const pgm = store.getState().WINDOWFRAME_REDUCER.activeWindow['programId'];
  // const window = store.getState().WINDOWFRAME_REDUCER.windowState.filter(e => e.programId === pgm)
  const pgm = gfs_getStoreValue('WINDOWFRAME_REDUCER').activeWindow['programId'];
  const window = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState').filter(e => e.programId === pgm)

  if(window.length === 0){
    return;
  }
  
  if(flag !== 1 && flag !== 5 && flag !== 3 && flag !== 7){
    gfs_getStoreValue(pgm, 'Grid').map(e => 
      e.Grid.finishEditing()
    );

    await gfc_sleep(50);
  }

  if(flag === 1){
    if(window[0].Retrieve !== undefined){
      window[0].Retrieve();
    }
  }else if(flag === 2){
    if(window[0].Insert !== undefined){
      window[0].Insert();
    }
  }else if(flag === 3){
    if(window[0].Delete !== undefined){
      window[0].Delete();
    }
  }else if(flag === 4){
    if(window[0].Save !== undefined){
      window[0].Save();
    }
  }else if(flag === 5){
    if(window[0].Init !== undefined){
      window[0].Init();
    }
  }else if(flag === 6){
    if(window[0].Print !== undefined){
      window[0].Print();
    }
  }else if(flag === 7){
    if(window[0].DtlInsert !== undefined){
      window[0].DtlInsert();
    }
  }else{
    if(window[0].DtlDelete !== undefined){
      window[0].DtlDelete();
    }
  }
}

const TabList = (props) => {
  const insRef = useRef();
  const dtlInsRef = useRef();
  const dtlDelRef = useRef();
  const savRef = useRef();
  const delRef = useRef();
  const retRef = useRef();

  const windowState = useSelector((e) => {
    if(e.WINDOWFRAME_REDUCER === undefined) {
      return null
    }else{
      return e.WINDOWFRAME_REDUCER.windowState
    }
  }, (p, n) => {
    return (p === null ? 0 : p.length) === (n === null ? 0 : n.length)
  });

  const activeWindow = useSelector((e) => {
    if(e.WINDOWFRAME_REDUCER === undefined) {
      return null
    }else{
      return e.WINDOWFRAME_REDUCER.activeWindow
    }
  }, (p, n) => {
    return ((p === null || p === undefined) ? 0 : p.programId) === ((n === null || n === undefined) ? 0 : n.programId)
  });

  const authSelect = async(programId) => {
    if(programId === undefined){
      insRef.current.disabled = false;
      dtlInsRef.current.disabled = false;
      delRef.current.disabled = false;
      dtlDelRef.current.disabled = false;
      savRef.current.disabled = false;
      retRef.current.disabled = false;

      return;
    }

    let result = await getDynamicSql_Oracle(
      'Common/Common',
      'MENU_AUTH',
      [{programId}]
    ); 

    let data = gfc_set_oracle_column(result);
    let auth = gfs_getStoreValue('USER_REDUCER', 'AUTH');

    if(auth.length !== undefined){
      if(data[0].INSAUT_YN === 'Y'){
        const eachAuth = auth.find(e => e.MENU_ID === programId);
        if(eachAuth !== null){
          if(eachAuth.INSAUT_YN === 'Y'){
            insRef.current.disabled = false;
            dtlInsRef.current.disabled = false;
          }else{
            insRef.current.disabled = true;
            dtlInsRef.current.disabled = true;
          }
        }
      }else{
        insRef.current.disabled = true;
        dtlInsRef.current.disabled = true;
      }

      if(data[0].DELAUT_YN === 'Y'){
        const eachAuth = auth.find(e => e.MENU_ID === programId);
        if(eachAuth !== null){
          if(eachAuth.DELAUT_YN === 'Y'){
            delRef.current.disabled = false;
            dtlDelRef.current.disabled = false;
          }else{
            delRef.current.disabled = true;
            dtlDelRef.current.disabled = true;
          }
        }
      }else{
        delRef.current.disabled = true;
        dtlDelRef.current.disabled = true;
      }

      if(data[0].SAVAUT_YN === 'Y'){
        const eachAuth = auth.find(e => e.MENU_ID === programId);
        if(eachAuth !== null){
          if(eachAuth.SAVAUT_YN === 'Y'){
            savRef.current.disabled = false;
          }else{
            savRef.current.disabled = true;
          }
        }
      }else{
        savRef.current.disabled = true;
      }

      if(data[0].RETAUT_YN === 'Y'){
        const eachAuth = auth.find(e => e.MENU_ID === programId);
        if(eachAuth !== null){
          if(eachAuth.RETAUT_YN === 'Y'){
            retRef.current.disabled = false;
          }else{
            retRef.current.disabled = true;
          }
        }
      }else{
        retRef.current.disabled = true;
      }
    }
  }

  if(activeWindow !== null){
    authSelect(activeWindow.programId);
  }

  return (
    <div className='content'>
      <div className='header'>
        <div className='tabs'>
          <ul className='list'>
            {windowState !== null &&
              windowState.sort((a, b) => {
                if (a.makeDttm.valueOf() >= b.makeDttm.valueOf()) {
                  return 1;
                }else{
                  return -1;
                }
              }).map((e) => 
                <TabListItem key={e.programId}
                             programId={e.programId}
                             programNam={e.programNam}/>
              )
            }
          </ul>
        </div>
        <div className='common_btns'>
          <button ref={insRef}    type='button' className='save'  onClick={(e) => onClick(2, e)} ><span>추가</span></button>
          <button ref={dtlInsRef} type='button' className='save'  onClick={(e) => onClick(7, e)} ><span>상세추가</span></button>
          <button ref={dtlDelRef} type='button' className='save'  onClick={(e) => onClick(8, e)} ><span>상세삭제</span></button>
          <button ref={savRef}    type='button' className='save' onClick={(e) => onClick(4, e)} ><span>저장</span></button>
          <button ref={delRef}    type='button' className='del'   onClick={(e) => onClick(3, e)} ><span>삭제</span></button>
          <button ref={retRef}    type='button' className='search' onClick={(e) => onClick(1, e)} ><span>조회</span></button>
        </div>
      </div>
    </div>
  );
};

export default TabList; 