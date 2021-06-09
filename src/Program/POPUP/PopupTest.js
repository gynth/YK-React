import React from 'react';
import { Component } from 'react';

import Layout from '../../Component/Layout/Layout';
import SearchDiv from '../../Component/Control/SearchDiv';
import Input from '../../Component/Control/Input';
import { gfc_getAtt } from '../../Method/Comm';
import { gfp_openPopup } from '../../Method/Popup';

class PopupTest extends Component {

  // constructor(props){
  //   super(props);
  // }
  
  render() {

    return(        
      <Layout split       ='horizontal'
              minSize     ={[54]}
              defaultSize ={54}
              resizerStyle='none' 
      >
        <SearchDiv>
            <Input pgm={this.props.pgm}
                   id='search_user_nam'
                   label={gfc_getAtt('사용자명')} />
            <Input pgm={this.props.pgm}
                   id='search_user_id'
                   label={gfc_getAtt('사용자ID')} />
                   
        </SearchDiv>
        <div>HIHI</div>
      </Layout>
    );
  }
}

PopupTest.propTypes = {

};

PopupTest.defaultProps = {

};

export default PopupTest;