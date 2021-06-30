import React, { Component } from 'react';
import { gfc_initPgm, gfc_getAtt, gfc_getMultiLang } from '../../../Method/Comm';
import { YK_MILESTONE } from '../../../WebReq/WebReq';

class INSP_HIST extends Component {
  key = 'f689d57a2ae72d2cdd97dff4dd0fbe09';
  
  constructor(props){
    super(props)
    gfc_initPgm(props.pgm, props.nam, this)
  }

  Retrieve = () => {
    const aa = YK_MILESTONE('tally_process_pop.jsp?division=P005', {});
    aa.then(e => {
      console.log(e);
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