import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

function SideBarUserName(props) {
  const user_nam = useSelector((e) => {
    if(e['USER_REDUCER'] === undefined){
      return null;
    }else{
      return e['USER_REDUCER'].USER_NAM;
    }
  }, shallowEqual);

  return (
    <span className="user">{user_nam}</span>
  );
}

export default SideBarUserName;