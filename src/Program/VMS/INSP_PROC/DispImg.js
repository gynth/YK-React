import React from 'react';

function DispImg(props) {
  return (
    <div>
      {/* <img src={'data:image/jpeg;base64,' + value.chit} style={{width:'100%', height:690}} alt='chit' /> */}
      <span>공차앞</span> 
      <span>2021-08-17 13:46:32</span>
      <span>충청북도 충주시 목행동 264-13</span>
      <img style={{width:'100%', height:450, background:'red'}} alt='DISP1' />
    </div>
  );
}

export default DispImg;