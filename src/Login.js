import React from 'react';

import Input from './Component/Control/Input';
import { gfo_getCombo, gfo_getInput } from './Method/Component';
import { getDynamicSql_Oracle } from './db/Oracle/Oracle';
// import { setSessionCookie, getSessionCookie} from './Cookies';
import { setSessionCookie} from './Cookies';
import { gfs_PGM_REDUCER } from './Method/Store';
import './login.css';
import Combobox from '../src/Component/Control/Combobox';
import { gfc_yk_call_sp } from './Method/Comm';

gfs_PGM_REDUCER('login');

const onLogin = async(e, user_id, pass_cd) => {
  let result = await getDynamicSql_Oracle(
    'Common/Common',
    'LOGIN',
    [{user_id, pass_cd}]
  ); 

  if(result.data.result === false){
    alert('로그인 정보가 잘못되었습니다.');
    return;
  }

  if(result.data.rows.length > 0){
    gfo_getInput('login', 'id').setValue('');
    gfo_getInput('login', 'pwd').setValue('');

    const width = window.screen.availWidth;
    const height = window.screen.availHeight;
    const areaTp = gfo_getCombo('login', 'areaTp');
    setSessionCookie('login', user_id);
    setSessionCookie('areaTp', areaTp.getValue());

    const winProperties = 'fullscreen=yes, location=no, toolbar=no, menubar=no, resizable=yes, scrollbars=no, addressbar=no, width=' + (width) + ',height=' + (height);

    e.preventDefault(); 
    let win = window.open('Home', 'YK', winProperties);
    win.moveTo(0, 0);
  }else{
    alert('로그인 정보가 잘못되었습니다.');
  }
}

const onClick = async(e, user_id, pass_cd) => {
  onLogin(e, user_id, pass_cd);
};

const Login = (props) => {
  
  return (
    <div className='login_box'>
		  <h2><img src={require('../src/Image/yk_07@2x.png').default} width='358' height='47' alt='와이케이스틸 로고' /></h2>

      
      <div className='input_box'>
        <Combobox pgm     = 'login'
                  id      = 'areaTp'
                  value   = 'itemCode'
                  display = 'item'
                  placeholder = '사용자 구역'
                  height  = {42}
                  oracleSpData = {gfc_yk_call_sp('SP_ZM_PROCESS_POP', {
                    p_division    : 'P530'
                  })}
                  emptyRow
        />
        <div className='input_line'>
          <label>ID</label>
          <Input pgm='login' id='id' type='text' />
        </div>
        <div className='input_line'>
          <label>PASSWORD</label>
          <Input pgm='login' id='pwd' type='password' onKeyDown={e => {
            if(e.keyCode === 13){
              const id  = gfo_getInput('login', 'id').getValue();
              const pwd = gfo_getInput('login', 'pwd').getValue();

              onLogin(e, id, pwd);
            }
          }} />
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

export default Login;