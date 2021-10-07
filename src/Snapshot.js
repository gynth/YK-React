import React, { Component } from 'react';
import { gfc_getParameter } from './Method/Comm';
import axios from 'axios';

class Snapshot extends Component {
  state = {
    img : []
  }

  Init = () => {
    const scaleNumb = gfc_getParameter(this.props, 'scaleNumb');
    
    const host = 'http://ims.yksteel.co.kr:90/WebServer/ScreenShot/YK_SnapshotList';
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
  
    axios(option)
      .then(res => {
        let imgList = [];

        for(let i = 0; i < res.data.length; i++){
          const root = `Screenshot/${scaleNumb.substring(0, 8)}/${scaleNumb}/${res.data[i]}`;
          imgList.push(
            <div key={i} >
              <input defaultValue={`파일명: ${res.data[i]}`} disabled/>
              <img src={`http://ims.yksteel.co.kr:90/WebServer/MobileChitImg/${root}?time=${new Date()}`} style={{width:'100%', height:'100%'}} alt='chit' />
            </div>
          )

          this.setState({
            img: imgList
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }



  componentDidMount() {
    this.Init();
  }

  render() {
    return (
      <div style={{width:'100%', height:'100%', overflow:'auto'}}>
        { this.state.img }
      </div>
    );
  }
}

export default Snapshot;