import numeral from 'numeral';
import moment from 'moment';
import { gfs_dispatch } from '../Method/Store';
import html2canvas from 'html2canvas';
// import html2canvas from 'html2canvas-render-offscreen'
import axios from 'axios';
import { getDynamicSql_Oracle, getSp_Oracle } from '../db/Oracle/Oracle';

export const gfc_now = async () => {
  const result = await getDynamicSql_Oracle('Common/Common', 'SYSDATE', null);
  return moment(result.data.rows[0][0]).format('yyyy-MM-DD HH:mm:ss');
}

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

export const gfc_oracleRetrieve = (result) => {
  let data = [];
  for(let i = 0; i < result.data.data.rows.length; i++){

    let col = {};
    for(let j = 0; j < result.data.data.rows[i].length; j++){
      col[result.data.data.metaData[j].name] = result.data.data.rows[i][j];
    }
    data.push(col);
  }

  return data;
}

export const gfc_yk_call_sp = async(sp, parameter) => {
  let param = '';
  if(parameter === undefined){
    parameter = {};
  }else{
    for(let i = 0; i < Object.keys(parameter).length; i++){
      param += `:${Object.keys(parameter)[i]},`;
    }
  }
  
  let SP = [];
  SP.push({
    sp   : `begin 
              ${sp}(
                ${param}
                :p_select,
                :p_SUCCESS,
                :p_MSG_CODE,
                :p_MSG_TEXT,
                :p_COL_NAM
              );
            end;
            `,
    data : parameter,
    // data: {},
    errSeq: 0
  })

  // const select = await getSp_Oracle(param);
  const select = await getSp_Oracle(SP);
  return select;
}

export const gfc_getAtt = (code) => { 
  //추후 다국어 지원시 사용 xml or db 등등
  let msg = '';
  if(code === 'MSG01') msg = '조회된 건이 없습니다.';
  else if(code === 'MSG02') msg = '해당건이 없습니다. 재조회 후 처리해주세요.';
  else if(code === 'MSG03') msg = '중복값이 존재합니다.';
  else if(code === 'MSG04') msg = '필수입력값이 없습니다.';
  else if(code === 'MSG05') msg = '저장되었습니다.';
  else if(code === 'MSG06') msg = '삭제되었습니다.';
  else if(code === 'MSG07') msg = '데이터베이스처리중 에러가 발생했습니다.';
  else msg = code;

  return msg;
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

export const gfc_getParameter = (props, name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(props.location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export const gfc_lpad = (str, padLen, padStr) => { 
  if (padStr.length > padLen) {
      console.log('LENGTH ERROR');
      return str;
  }
  str += ''; // 문자로
  padStr += ''; // 문자로
  while (str.length < padLen)
      str = padStr + str;
  str = str.length >= padLen ? str.substring(0, padLen) : str;
  return str;
}

export const gfc_rpad = (str, padLen, padStr) => {
  if (padStr.length > padLen) {
    console.log('LENGTH ERROR');
      return str + '';
  }
  str += ''; // 문자로
  padStr += ''; // 문자로
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

export const gfc_addClass = (element, className) => {
	element.className += ' ' + className;
	
}

export const gfc_removeClass = (element, className) => {
	var check = new RegExp('(\\s|^)' + className + '(\\s|$)');
	element.className = element.className.replace(check, ' ').trim();
}

export const gfc_hasClass = (element, className) => {
	if(element.className.indexOf(className) > -1){
		return true;
	}else{
		return false;
	}
}

export const gfc_screenshot = (element, filename) => {
  html2canvas(element, {
    scale: 3
  }).then(canvas => {
    const img = canvas.toDataURL('image/png');

    var link = document.createElement('a');
    if (typeof link.download === 'string') {
      link.href = img;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else { 
      window.open(img);
    }
  });
}

export const gfc_screenshot_srv_from_milestone = (device, scaleNo) => {

  const host = `http://211.231.136.182:3001/ScreenShot/Milestone`;
  // const host = 'http://ims.yksteel.co.kr:90/WebServer/ScreenShot/Milestone';
  const option = {
    url   : host,
    method: 'POST',
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    data: {
      device,
      scaleNo
    } 
  };

  return axios(option)
    .then(res => {
      // console.log(res);
      return res;
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}

export const gfc_screenshot_srv = (element, filename, height, root) => {

  return html2canvas(element, {
    // width : 1000,
    height: 1500
  }).then(canvas => {
    let img = canvas.toDataURL('image/png');

    // const host = 'http://10.10.10.136:3001/ScreenShot';
    const host = 'http://ims.yksteel.co.kr:90/WebServer/ScreenShot';
    const option = {
      url   : host,
      method: 'POST',
      // headers: {
      //   'Access-Control-Allow-Origin': '*'
      // },
      data: {
        img,
        filename,
        root,
        height
      } 
    };

    return axios(option)
      .then(res => {
        // console.log(res);
        return res;
      })
      .catch(err => {
        console.log(err)
        return err;
      })
  });
}

export const gfc_chit_yn_YK_Tally = (scaleNumb) => {
  // const host = 'http://10.10.10.136:3001/ScreenShot/YK_Chit_YN';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/ScreenShot/YK_Chit_YN_Tally';
  // const host = `http://tally.yksteel.co.kr/Images/scaleChit/${scaleNumb.substring(0, 8)}/${scaleNumb}.jpg`;
  
  // console.log(host);

  const option = {
    url   : host,
    method: 'GET',
    headers: {
      // 'Access-Control-Allow-Origin': '*',
      // 'Content-Type': 'application/json',
      // 'Accept': 'application/json'
    },
    data: {
      scaleNumb
    } 
  };

  return axios(option)
    .then(res => {
      // console.log(res);
      return res;
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}

export const gfc_ftp_file_yn_YK = (scaleNumb) => {
  const host = 'http://ims.yksteel.co.kr:90/WebServer/ScreenShot/Ftp_File_Yn';
  
  // console.log(host);

  const option = {
    url   : host,
    method: 'POST',
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    data: {
      scaleNumb
    } 
  };

  return axios(option)
    .then(res => {
      // console.log(res);
      return res;
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}

export const gfc_chit_yn_YK = (scaleNo) => {
  // const host = 'http://10.10.10.136:3001/ScreenShot/YK_Chit_YN';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/ScreenShot/YK_Chit_YN';
  // const host = `http://tally.yksteel.co.kr/Images/scaleChit/${scaleNo.substring(0, 8)}/${scaleNo}.jpg`;
  
  // console.log(host);

  const option = {
    url   : host,
    method: 'GET',
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    data: {
      scaleNo
    } 
  };

  return axios(option)
    .then(res => {
      // console.log(res);
      return res;
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}

export const gfc_screenshot_srv_YK = (element, filename) => {

  return html2canvas(element, {
    // width : 1000,
    height: 1500,
    scale: 3
  }).then(canvas => {
    let img = canvas.toDataURL('image/png');

    // const host = 'http://10.10.10.136:3001/ScreenShot/YK_Chit';
    const host = 'http://ims.yksteel.co.kr:90/WebServer/ScreenShot/YK_Chit';
    const option = {
      url   : host,
      method: 'POST',
      // headers: {
      //   'Access-Control-Allow-Origin': '*'
      // },
      data: {
        img,
        filename
      } 
    };

    return axios(option)
      .then(res => {
        // console.log(res);
        return res;
      })
      .catch(err => {
        console.log(err)
        return err;
      })
  });
}

export const gfc_screenshot_del_yk = (filename) => {
  // const host = 'http://10.10.10.136:3001/ScreenShot/YK_Chit_DEL';
  const host = 'http://ims.yksteel.co.kr:90/WebServer/ScreenShot/YK_Chit_DEL';
  const option = {
    url   : host,
    method: 'POST',
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    data: {
      filename
    } 
  };

  return axios(option)
    .then(res => {
      // console.log(res);
      return res;
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}

export const gfc_test = (element, filename, root) => {    
  const host = 'http://10.10.10.136:3001/ScreenShot/TEST';
  const option = {
    url   : host,
    method: 'POST',
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    data: {

    } 
  };

  return axios(option)
    .then(res => {
      // console.log(res);
      return res;
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}

export const gfc_set_oracle_column = (result) => {
  let data = [];

  if(result.data === undefined) return data;
  if(result.data === null) return data;
  if(result.data.rows === undefined) return data;
  if(result.data.rows === null) return data;

  for(let i = 0; i < result.data.rows.length; i++){
  
    let col = {};
    for(let j = 0; j < result.data.rows[i].length; j++){
      col[result.data.metaData[j].name] = result.data.rows[i][j];
    }
    data.push(col);
  }

  return data;
}

export const gfc_file_upload = async(file, NOTICE_NO) => {
  let formData = new FormData();
  formData.append('body', NOTICE_NO);
  for (const key of Object.keys(file)) {
    //순서중요 body랑 file가 바뀌면 안됨.
    formData.append('file', file[key]);
  }

  const host = 'http://ims.yksteel.co.kr:90/WebServer/File/Upload';
  // const host = 'http://211.231.136.182:3001/File/Upload';
  const option = {
    url   : host,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }; 

  return axios(option)
    .then(res => {
      // console.log(res);
      return res;
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}

export const gfc_folder_delete = async(NOTICE_NO) => {
  const host = 'http://ims.yksteel.co.kr:90/WebServer/File/Delete';
  // const host = 'http://211.231.136.182:3001/File/Upload';
  const option = {
    url   : host,
    method: 'POST',
    // headers: {
      // 'Content-Type': 'multipart/form-data'
    // },
    data: {
      NOTICE_NO
    }
  }; 

  return axios(option)
    .then(res => {
      // console.log(res);
      return res;
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}

export const gfc_file_delete = async(NOTICE_NO, FILE) => {
  const host = 'http://ims.yksteel.co.kr:90/WebServer/File/DeleteFile';
  // const host = 'http://211.231.136.182:3001/File/Upload';
  const option = {
    url   : host,
    method: 'POST',
    // headers: {
      // 'Content-Type': 'multipart/form-data'
    // },
    data: {
      NOTICE_NO,
      FILE
    }
  }; 

  return axios(option)
    .then(res => {
      // console.log(res);
      return res;
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}