import React from 'react';
import { useSelector } from 'react-redux';
import TabListItem from './TabListItem';
import { gfc_sleep } from '../../../Method/Comm';
import { gfs_getStoreValue } from '../../../Method/Store';

async function onClick(flag){
  // 1. Retrieve
  // 2. Insert
  // 3. Delete
  // 4. Save
  // 5. Init
  // 6. Print
  // 7. DtlInsert
  // 8. DelDelete
  if(gfs_getStoreValue('WINDOWFRAME_REDUCER') === undefined) return;

  // const pgm = store.getState().WINDOWFRAME_REDUCER.activeWindow['programId'];
  // const window = store.getState().WINDOWFRAME_REDUCER.windowState.filter(e => e.programId === pgm)
  const pgm = gfs_getStoreValue('WINDOWFRAME_REDUCER').activeWindow['programId'];
  const window = gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState').filter(e => e.programId === pgm)

  if(window.length === 0){
    return;
  }

  if(flag !== 1 && flag !== 5 && flag !== 3){
    gfs_getStoreValue(pgm, 'Grid').map(e => e.Grid.blur())
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
    if(window[0].DelDelete !== undefined){
      window[0].DelDelete();
    }
  }
}

const TabList = (props) => {

  const selectWindow = useSelector((e) => {
    if(e.WINDOWFRAME_REDUCER === undefined) {
      return null
    }else{
      return e.WINDOWFRAME_REDUCER.windowState
    }
  }, (p, n) => {
    return (p === null ? 0 : p.length) === (n === null ? 0 : n.length)
  });

  return (
    <div className='content'>
      <div className='header'>
        <div className='tabs'>
          <ul className='list'>
            {selectWindow !== null &&
              selectWindow.sort((a, b) => {
                if (a.makeDttm.valueOf() > b.makeDttm.valueOf()) {
                  return 1;
                }
                if (a.makeDttm.valueOf() < b.makeDttm.valueOf()) {
                  return -1;
                }
                // a must be equal to b
                return 0;
              }).map((e) => 
                <TabListItem key={e.programId}
                             programId={e.programId}
                             programNam={e.programNam}/>
              )
            }
          </ul>
        </div>
        <div className='common_btns'>
          <button type='button' className='save' onClick={() => onClick(2)} ><span>추가</span></button>
          <button type='button' className='save' onClick={() => onClick(4)} ><span>저장</span></button>
          <button type='button' className='del'  onClick={() => onClick(3)} ><span>삭제</span></button>
          <button type='button' className='search' onClick={() => onClick(1)} ><span>조회</span></button>
        </div>
      </div>
    </div>
  );
};

export default TabList; 