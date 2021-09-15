import { gfs_getStoreValue } from '../Method/Store';

export const gfg_getGrid = (pgm, gridId) => {
  const storeValue = gfs_getStoreValue(pgm, 'Grid');
  
  if(storeValue !== undefined && storeValue.length > 0) {
    const findValue = storeValue.find(e => e.id === gridId);

    if(findValue !== undefined)
      return findValue.Grid;
  }
}

export const gfg_appendRow = (grid, row, value, focus) => {
  if(grid === undefined || grid === null) return;
  if(row < 0) return;

  grid.appendRow(value, {at: row, focus: true})

  if(focus === undefined || focus === null || focus === '')
    grid.focusAt(row, 0, true)
  else
    grid.focus(row, focus, true);
}

export const gfg_getModyfiedRow = (grid) => {
  let rtn = [];

  const modRows = grid.getModifiedRows();
  for(let idx in modRows.updatedRows){
    rtn.push(modRows.updatedRows[idx])
    rtn[rtn.length - 1].rowStatus = 'U'
  }

  for(let idx in modRows.createdRows){
    rtn.push(modRows.createdRows[idx])
    rtn[rtn.length - 1].rowStatus = 'I'
  }

  for(let idx in modRows.deletedRows){
    rtn.push(modRows.deletedRows[idx])
    rtn[rtn.length - 1].rowStatus = 'D'
  }
  
  return rtn;
}

export const gfg_getPhantomRow = (grid, row) => {
  let rtn = false
  const crtRows = grid.getModifiedRows().createdRows;
  if(crtRows.length > 0){
    if(crtRows.find(e => e.rowKey === row) !== undefined) rtn = true;
  }

  return rtn;
}

export const gfg_getRow = (grid, row) => {
  const rowKey = row === undefined ? grid.getFocusedCell().rowKey : row;
  let rtn = grid.getRow(rowKey);

  if(rtn !== null){
    rtn.phantom = gfg_getPhantomRow(grid, rowKey)
  }

  return rtn;
}

export const gfg_getColumn = (grid) => {
  return grid.getFocusedCell().columnName;
}

export const gfg_setValue = (grid, column, value, row) => {
  const rowKey = row === undefined ? grid.getFocusedCell().rowKey : row;
  grid.setValue(rowKey, column, value)
} 

export const gfg_setSelectRow = (grid, columnName, row = 0, setScroll = true) => {
  if(columnName !== undefined){
    grid.focus(row, columnName, setScroll);
  }
  else{
    grid.focusAt(row, 0, setScroll);
  }
}

export const gfg_setEventOnOff = (grid, on_off, eventName, handler) => {
  if(on_off === '' || on_off === null || on_off === undefined) return;
  if(eventName === '' || eventName === null || eventName === undefined) return;

  if(on_off === 'on'){
    grid.on(eventName, handler);
  }else if(on_off === 'off'){
    grid.off(eventName, handler);
  }
}

export const gfg_getRowCount = (grid) => {
  return grid.getRowCount();
}