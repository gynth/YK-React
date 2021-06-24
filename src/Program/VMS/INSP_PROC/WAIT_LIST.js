import React from 'react';
import GifPlayer from 'react-gif-player';

function WAIT_LIST(props) {
  return (
    <div style={{width:'750', margin:'2px 0 0 5px', height: '120px', borderBottom:'1px solid #A8A7A5'}}>
      <div style={{width:'calc(100% - 20px)', margin:'5px 0 0 10px', height:'50%'}}>
        <div style={{color:'#F93C02', float:'left', width:'300', fontWeight:'bold', fontSize:'35'}}>{props.data.scaleNumb}</div>
        <img style={{height:'50', float:'left', margin:'2px 0 0 120px'}} src={require('../../../Image/yk_01.png').default} alt='yk_01'/> 
        <div style={{fontSize:'35', float:'right', width:'250', textAlign:'right'}}>{props.data.carNumb}</div>
      </div>
      <div style={{width:'750', margin:'12px 0 0 10px', height:'calc(50% - 20px)'}}>
        <div style={{color:'#A8A7A5', float:'left', width:'300', fontSize:'23'}}>{props.data.date}</div>
        <div style={{float:'left', width:'100', height:'30', margin:'0 0 0 0'}}>
          <GifPlayer height='40' width='120' gif={require('../../../Image/yk_rec.gif').default} autoplay/>
        </div>
        <div style={{color:'#A8A7A5', fontSize:'23', float:'right', width:'320', textAlign:'right', margin:'0 20px 0 0'}}>{props.data.vendor}</div>
      </div>
    </div>
  );
}

export default WAIT_LIST;