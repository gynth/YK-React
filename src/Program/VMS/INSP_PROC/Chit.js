import React from 'react';

function Chit(props) {
  return (
    <div className='data_list' id='content2'>
      <div className='doc'>
        <h5>계 량 증 명 서</h5>
        <ul>
          <li>
            <span className='t'>일&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;시</span>
            <span className='v'>2021-06-17 06:02:02</span>
          </li>
          <li>
            <span className='t'>계량번호</span>
            <span className='v'>202106170001</span>
          </li>
          <li>
            <span className='t'>차량번호</span>
            <span className='v'>경남 81사7885</span>
          </li>
          <li>
            <span className='t'>업&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;체</span>
            <span className='v'>(주)거산</span>
          </li>
          <li>
            <span className='t'>제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;품</span>
            <span className='v'>원재료.철강.국내분철</span>
          </li>
          <li>
            <span className='t'>입차중량</span>
            <span className='v'>44,420</span>
          </li>
          <li>
            <span className='t'>지&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;역</span>
            <span className='v'>부산</span>
          </li>
          <li>
            <span className='t'>검&nbsp;&nbsp;수&nbsp;&nbsp;자</span>
            <span className='v'>유명훈</span>
          </li>
        </ul>
      </div>
      <div className='memo'>
        <h5>MEMO</h5>
        <textarea></textarea>
      </div>
    </div>
  );
}

export default Chit;