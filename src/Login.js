import React from 'react';
import { connect } from 'react-redux';

import { gfs_injectAsyncReducer } from './Method/Store';

import Input from './Component/Control/Input';
import { gfo_getInput } from './Method/Component';

import { getDynamicSql_Mysql } from './db/Mysql/Mysql';
import { setSessionCookie, getSessionCookie} from './Cookies';

import { gfs_PGM_REDUCER, gfs_getStoreValue } from './Method/Store';

import './login.css';

const userReducer = (nowState, action) => {
  if(action.reducer !== 'USER_REDUCER') {
    return {
      COP_CD    : nowState === undefined ? ''           : nowState.COP_CD,
      USER_ID   : nowState === undefined ? 'KKH'        : nowState.USER_ID,
      USER_NAM  : nowState === undefined ? '김경현'      : nowState.USER_NAM,
      LANGUAGE  : nowState === undefined ? 'KOR'        : nowState.LANGUAGE,
      YMD_FORMAT: nowState === undefined ? 'yyyy-MM-DD' : nowState.YMD_FORMAT,
      // YMD_FORMAT: nowState === undefined ? 'MM-DD-yyyy' : nowState.YMD_FORMAT,
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

gfs_PGM_REDUCER('login');
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
      gfo_getInput('login', 'id').setValue('');
      gfo_getInput('login', 'pwd').setValue('');

      const width = window.screen.availWidth;
      const height = window.screen.availHeight;

      const winProperties = 'fullscreen=yes, location=no, toolbar=no, menubar=no, resizable=yes, scrollbars=no, addressbar=no, width=' + (width) + ',height=' + (height);

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
  
  return (
    <div className='login_box'>
		  <h2><img src={require('../src/Image/yk_07@2x.png').default} width='358' height='47' alt='와이케이스틸 로고' /></h2>

      
      <div className='input_box'>
        <div className='input_line'>
          <label>ID</label>
          <Input pgm='login' id='id' type='text' />
        </div>
        <div className='input_line'>
          <label>PASSWORD</label>
          <Input pgm='login' id='pwd' type='password' />
        </div>
        <button type='button' onClick={e => {
          const id  = gfo_getInput('login', 'id').getValue();
          const pwd = gfo_getInput('login', 'pwd').getValue();

          onClick(e, id, pwd);
        }}>로그인</button>
		  </div>
    </div>
    // <div>
    //   <h1>Login</h1>
    //   <div>
    //     <form>
    //         <ExplainInput placeholder='사용자ID' 
    //                       width='240px'
    //                       height='35px'
    //                       marginBottom='5px'
    //                       parentBorder={userIdParentBorder} 
    //                       smallVisible={userIdspanVisible}
    //                       location={userIdinputTop}
    //                       onFocus={props.onUserIdFocus}
    //                       onBlur={props.onUserIdBlur}
    //                       onChange={props.onUserIdChange} />
            
    //         <ExplainInput placeholder='비밀번호' 
    //                       width='240px'
    //                       height='35px'
    //                       marginBottom='20px'
    //                       parentBorder={pwdParentBorder} 
    //                       smallVisible={pwdspanVisible}
    //                       location={pwdinputTop}
    //                       onFocus={props.onPwdFocus}
    //                       onBlur={props.onPwdBlur}  
    //                       onChange={props.onPwdChange}
    //                       type='password'/>

    //       <div style={{textAlign:'center'}}>
            
    //       <Button value='로그인'
    //               color='white'
    //               disabled={btnDisabled}
    //               backgroundColor={btnBackGround}
    //               height='30px'
    //               width='240px'
    //               borderWidth='0px'
    //               borderRadius='3px'
    //               outline='0px' 
    //               onClick={e => onClick(e, userIdText, pwdText)}/>
    //       </div>
    //     </form>
    //   </div>
    // </div>
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

export default Login;