import numeral from 'numeral';
import { gfs_dispatch } from '../Method/Store';

export const gfc_getMultiLang = (code, text) => {
  // alert(code + '[' + text + ']');
  console.log(code + '[' + text + ']');
}

export const gfc_initPgm = (programId, programNam, init) => {

  // 버전처리 로직 추가

  gfs_dispatch('WINDOWFRAME_REDUCER', 'INITFUNCTION', 
    ({
      activeWindow: {programId,
                     programNam,
                     Retrieve : init.Retrieve,
                     Insert   : init.Insert,
                     Delete   : init.Delete,
                     Save     : init.Save,
                     Init     : init.Init,
                     DtlInsert: init.DtlInsert,
                     DtlDelete: init.DtlDelete
                    }
    })
  );
}

export const gfc_getAtt = (code) => { 
  return code;
}

/**
 * 
 * 사용할 함수는 async로 만들어야함
 * async function() {}
 * 
 * await gfc_sleep(1000)
 */
export const gfc_sleep = (ms) => {
  return new Promise(resolve=>setTimeout(resolve, ms));
}

export const gfc_setNumberFormat = (value, format, round) => {
  if(value !== null){
    value = numeral(value)._value;
    
    if(round !== '' && round !== null){
      const rndCode = round.substr(-1);
      const length = round.substr(0, 1);
      const digit = Math.pow(10, round.substr(0, 1));

      value = gfc_unNumberFormat(value);
      value = Number((value * digit).toFixed(6));

      if(rndCode === 'R'){
        value = Math.round(value) / digit;
      }else if(rndCode === 'D'){
        value = Math.floor(value) / digit;
      }else if(rndCode === 'U'){
        value = Math.ceil(value) / digit;
      }

      if(format !== '' && format !== null){
        let setFormat = format;
        if(length > 0){
          if(!Number.isInteger(value)){
            const decimal = value.toString().split('.')[1]

            setFormat = setFormat + '.';
  
            for(let i = 0; i < length; i++){
              setFormat = setFormat + '0';
              if(decimal.length === i + 1) break;
            }
          }
        }

        value = numeral(value).format(setFormat);
      }

      return value;
    }
  }else{
    return value;
  }
}

export const gfc_unNumberFormat = (value) => {
  // console.log(numeral('1,000'));
  // console.log(numeral('1 000'));
  // console.log(numeral('1,000.001'));
  // console.log(numeral('1 000.001'));
  // console.log(numeral('1e000.001'));

  // console.log(value.toString().split(',').join('') * 1);
  // console.log(numeral(value));

  // return value.toString().split(',').join('') * 1;
  return numeral(value)._value;
}

export const gfc_lpad = (str, padLen, padStr) => { 
  if (padStr.length > padLen) {
      console.log("LENGTH ERROR");
      return str;
  }
  str += ""; // 문자로
  padStr += ""; // 문자로
  while (str.length < padLen)
      str = padStr + str;
  str = str.length >= padLen ? str.substring(0, padLen) : str;
  return str;
}

export const gfc_rpad = (str, padLen, padStr) => {
  if (padStr.length > padLen) {
    console.log("LENGTH ERROR");
      return str + "";
  }
  str += ""; // 문자로
  padStr += ""; // 문자로
  while (str.length < padLen)
      str += padStr;
  str = str.length >= padLen ? str.substring(0, padLen) : str;
  return str;
}

export const gfc_showMask = () => {
  gfs_dispatch('MASK_REDUCER', 'MASK', 
    ({
      MASK: true
    })
  );
}

export const gfc_hideMask = () => {
  gfs_dispatch('MASK_REDUCER', 'MASK', 
    ({
      MASK: false
    })
  );
}