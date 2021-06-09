import { gfs_getValue } from '../Method/Store';

export const gfo_getInput = (parent, inputId) => {
  const type = typeof(parent);
  let storeValue;

  if(type === 'string'){
    storeValue = gfs_getValue(parent, 'Input');
  }else{
    storeValue = parent['Input'];
  }

  if(storeValue !== undefined && storeValue.length > 0) {
    const findValue = storeValue.find(e => e.id === inputId);

    if(findValue !== undefined)
      return findValue.Input;
  }
}

export const gfo_getCombo = (parent, comboId) => {
  const type = typeof(parent);
  let storeValue;

  if(type === 'string'){
    storeValue = gfs_getValue(parent, 'Combo');
  }else{
    storeValue = parent['Combo'];
  }

  if(storeValue !== undefined && storeValue.length > 0) {
    const findValue = storeValue.find(e => e.id === comboId);

    if(findValue !== undefined)
      return findValue.Combo;
  }
} 

export const gfo_getDateTime = (parent, dateTimeId) => {
  const type = typeof(parent);
  let storeValue;

  if(type === 'string'){
    storeValue = gfs_getValue(parent, 'DateTime');
  }else{
    storeValue = parent['DateTime'];
  }

  if(storeValue !== undefined && storeValue.length > 0) {
    const findValue = storeValue.find(e => e.id === dateTimeId);

    if(findValue !== undefined)
      return findValue.DateTime;
  }
} 

export const gfo_getNumber = (parent, numberId) => {
  const type = typeof(parent);
  let storeValue;

  if(type === 'string'){
    storeValue = gfs_getValue(parent, 'Number');
  }else{
    storeValue = parent['Number'];
  }

  if(storeValue !== undefined && storeValue.length > 0) {
    const findValue = storeValue.find(e => e.id === numberId);

    if(findValue !== undefined)
      return findValue.Number;
  }
} 