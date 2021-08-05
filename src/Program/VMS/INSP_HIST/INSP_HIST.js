
import React, { Component } from 'react';
import { gfc_initPgm, gfc_getAtt, gfc_getMultiLang } from '../../../Method/Comm';
import axios from 'axios';
import { YK_TOKEN } from '../../../WebReq/WebReq';


class INSP_HIST extends Component {
  
  constructor(props){
    super(props)
    gfc_initPgm(props.pgm, props.nam, this)
  }

  Retrieve = () => {
    const host = 'http://211.231.136.182:3001/Token';
    const option = {
      url   : host,
      method: 'POST',
      // headers: {
      //   'Access-Control-Allow-Origin': '*'
      // },
      data: {
  
      } 
    };

    axios(option)
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(err => {
        console.log(err)
        return err;
      })
  }

  Delete = () => {
    const host = 'http://211.231.136.182:3001/TestSet';
    const option = {
      url   : host,
      method: 'POST',
      // headers: {
      //   'Access-Control-Allow-Origin': '*'
      // },
      data: {
  
      } 
    };

    axios(option)
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(err => {
        console.log(err)
        return err;
      })
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default INSP_HIST;