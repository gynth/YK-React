import * as Cookies from "js-cookie";

export const setSessionCookie = (key, value, expire) => {
  // console.log(key + ":" + value);
  Cookies.remove(key); // 원래 쿠키 삭제
  Cookies.set(key, value ); // 키, 값,  만료일
};

export const getSessionCookie = (key) => {
  const sessionCookie = Cookies.get(key);

  if (sessionCookie === undefined) {
    return '';
  } 
  else 
  {
    // console.log("sessionCookie : " + sessionCookie)
    return sessionCookie;
  }
};