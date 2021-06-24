import React from 'react';
import { connect } from 'react-redux';

import { gfs_injectAsyncReducer } from './Method/Store';

import styles from './Main.module.css';
import ExplainInput from './Component/Control/ExplainInput';
import Button from './Component/Control/Button';

import { getDynamicSql_Mysql } from './db/Mysql/Mysql';
import { setSessionCookie, getSessionCookie} from './Cookies';

import { gfs_getStoreValue } from './Method/Store';

import * as YK_REQ from './WebReq/WebReq';

//#region 리듀서 생성
const loginReducer = (nowState, action) => {
  if(action.reducer !== 'LOGIN_REDUCER') {
    return {
      userIdFocus: nowState === undefined ? false : nowState.userIdFocus,
      pwdFocus   : nowState === undefined ? false : nowState.pwdFocus,
      userIdText : nowState === undefined ? '' : nowState.userIdText,
      pwdText    : nowState === undefined ? '' : nowState.pwdText,
    };
  }

  if(action.type === 'USERID_FOCUS'){
    return Object.assign({}, nowState, {
      userIdFocus  : action.userIdFocus
    });
  }else if(action.type === 'PWD_FOCUS'){
    return Object.assign({}, nowState, {
      pwdFocus  : action.pwdFocus
    });
  }else if(action.type === 'USERID_CHANGE'){
    return Object.assign({}, nowState, {
      userIdText   : action.userIdText
    });
  }else if(action.type === 'PWD_CHANGE'){
    return Object.assign({}, nowState, {
      pwdText   : action.pwdText
    });
  }
};

const userReducer = (nowState, action) => {
  if(action.reducer !== 'USER_REDUCER') {
    return {
      COP_CD    : nowState === undefined ? ''           : nowState.COP_CD,
      USER_ID   : nowState === undefined ? 'KKH'        : nowState.USER_ID,
      USER_NAM  : nowState === undefined ? '김경현'      : nowState.USER_NAM,
      LANGUAGE  : nowState === undefined ? 'KOR'        : nowState.LANGUAGE,
      // YMD_FORMAT: nowState === undefined ? 'yyyy-MM-DD' : nowState.YMD_FORMAT,
      YMD_FORMAT: nowState === undefined ? 'MM-DD-yyyy' : nowState.YMD_FORMAT,
      YM_FORMAT : nowState === undefined ? 'yyyy-MM'    : nowState.YM_FORMAT,
      NUM_FORMAT: nowState === undefined ? '0,0'        : nowState.NUM_FORMAT,
      NUM_ROUND : nowState === undefined ? '2R'         : nowState.NUM_ROUND
    };
  }

  if(action.type === 'USERID_FOCUS'){
    return Object.assign({}, nowState, {
      userIdFocus  : action.userIdFocus
    });
  }else if(action.type === 'PWD_FOCUS'){
    return Object.assign({}, nowState, {
      pwdFocus  : action.pwdFocus
    });
  }else if(action.type === 'USERID_CHANGE'){
    return Object.assign({}, nowState, {
      userIdText   : action.userIdText
    });
  }else if(action.type === 'PWD_CHANGE'){
    return Object.assign({}, nowState, {
      pwdText   : action.pwdText
    });
  }
};

//#endregion

gfs_injectAsyncReducer('LOGIN_REDUCER', loginReducer);
gfs_injectAsyncReducer('USER_REDUCER', userReducer);

const onClick = async(e, user_id, pass_cd) => {

  let result = await getDynamicSql_Mysql(
    'Common/Common',
    'login',
    [{user_id,
      pass_cd}]
  );

  if(result.data.result){
    if(result.data.data.length === 0){
      alert('로그인 정보가 잘못되었습니다.');
    }else{
      const width = window.screen.availWidth;
      const height = window.screen.availHeight;

      const winProperties = 'location=no, toolbar=no, menubar=no, resizable=yes, scrollbars=no, addressbar=no, width=' + (width) + ',height=' + (height);

      e.preventDefault(); 
      setSessionCookie('session', 'SUCCESS', 1/1440);   
      let win = window.open('Home', 'DK', winProperties);
      win.moveTo(0, 0);
    }
  }else{
    alert('로그인에 실패했습니다.')
  }
};

const Login = (props) => {
  
  let userIdParentBorder = undefined;
  let pwdParentBorder    = undefined;
  if(gfs_getStoreValue('LOGIN_REDUCER' , 'userIdFocus')){
    userIdParentBorder = 'black';
  }

  if(gfs_getStoreValue('LOGIN_REDUCER', 'pwdFocus')){
    pwdParentBorder = 'black';
  }

  let userIdspanVisible = undefined;
  let userIdinputTop    = undefined;
  let pwdspanVisible    = undefined;
  let pwdinputTop       = undefined;
  const userIdText = gfs_getStoreValue('LOGIN_REDUCER', 'userIdText');
  const pwdText = gfs_getStoreValue('LOGIN_REDUCER', 'pwdText');
  if(userIdText !== ''){
    userIdspanVisible = 'visible';
    userIdinputTop    = '42%';
  }

  if(pwdText !== ''){
    pwdspanVisible = 'visible';
    pwdinputTop    = '42%';
  }

  let btnBackGround = '#b2dffc';
  let btnDisabled   = true;
  if(userIdText !== '' && pwdText !== ''){
    btnBackGround = '#0095f6';
    btnDisabled   = false;
  }
  
  return (
    <div className={styles.Login_Main}>
      <h1 className={styles.Login_Text}>Login</h1>
      <div>
        <form>
            <ExplainInput placeholder='사용자ID' 
                          width='240px'
                          height='35px'
                          marginBottom='5px'
                          parentBorder={userIdParentBorder} 
                          smallVisible={userIdspanVisible}
                          location={userIdinputTop}
                          onFocus={props.onUserIdFocus}
                          onBlur={props.onUserIdBlur}
                          onChange={props.onUserIdChange} />
            
            <ExplainInput placeholder='비밀번호' 
                          width='240px'
                          height='35px'
                          marginBottom='20px'
                          parentBorder={pwdParentBorder} 
                          smallVisible={pwdspanVisible}
                          location={pwdinputTop}
                          onFocus={props.onPwdFocus}
                          onBlur={props.onPwdBlur}  
                          onChange={props.onPwdChange}
                          type='password'/>

          <div style={{textAlign:'center'}}>
            
          <Button value='로그인'
                  color='white'
                  disabled={btnDisabled}
                  backgroundColor={btnBackGround}
                  height='30px'
                  width='240px'
                  borderWidth='0px'
                  borderRadius='3px'
                  outline='0px' 
                  onClick={e => onClick(e, userIdText, pwdText)}/>
          </div>
        </form>
      </div>
    </div>
  );
};

//#region 액션 이벤트
const onUserIdFocusEvent = () => {
  return {
    reducer    : 'LOGIN_REDUCER',
    type       : 'USERID_FOCUS',
    userIdFocus: true
  }
}

const onUserIdBlurEvent = () => {
  return {
    reducer    : 'LOGIN_REDUCER',
    type       : 'USERID_FOCUS',
    userIdFocus: false
  }
}

const onPwdFocusEvent = () => {
  return {
    reducer : 'LOGIN_REDUCER',
    type    : 'PWD_FOCUS',
    pwdFocus: true
  }
}

const onPwdBlurEvent = () => {
  return {
    reducer : 'LOGIN_REDUCER',
    type    : 'PWD_FOCUS',
    pwdFocus: false
  }
}

const onUserIdChange = (e) => {
  return {
    reducer   : 'LOGIN_REDUCER',
    type      : 'USERID_CHANGE',
    userIdText: e.value.trim()
  }
}

const onPwdChange = (e) => {
  return {
    reducer: 'LOGIN_REDUCER',
    type   : 'PWD_CHANGE',
    pwdText: e.value.trim()
  }
}
//#endregion

//#region 스토어 매개변수
const mapStateToProps = (state, ownProps) => {
  
  return {
    userIdFocus: state.LOGIN_REDUCER.userIdFocus,
    pwdFocus   : state.LOGIN_REDUCER.pwdFocus,
    userIdText : state.LOGIN_REDUCER.userIdText,
    pwdText    : state.LOGIN_REDUCER.pwdText
  }
};
//#endregion

//#region 디스패치 함수
const mapDispatchToProps = (dispatch, ownProps) => {
  
  return {
    onUserIdFocus: (e) => {
      e.stopPropagation();
      dispatch(onUserIdFocusEvent());
    },
    onPwdFocus: (e) => {
      e.stopPropagation();
      dispatch(onPwdFocusEvent());
    },
    onUserIdBlur: (e) => {
      e.stopPropagation();
      dispatch(onUserIdBlurEvent());
    },
    onPwdBlur: (e) => {
      e.stopPropagation();
      dispatch(onPwdBlurEvent());
    },
    onUserIdChange: (e) => {
      e.stopPropagation();
      dispatch(onUserIdChange(e.target))
    },
    onPwdChange: (e) => {
      e.stopPropagation();
      dispatch(onPwdChange(e.target))
    }
  }
};
//#endregion

export default connect(mapStateToProps, mapDispatchToProps) (Login);