import React from 'react';
import './Common.css';

const DetailDiv = (props) => {
  return (
    <div className='detail_box'>
      <h5><span className='bu'></span><span className='text'>{props.title}</span></h5>
      <table className='data_table'>
        <tbody>

          {props.children}
        </tbody>
      </table>
    </div>
  );
};

export default DetailDiv;