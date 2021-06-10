import React from 'react';
import { Component } from 'react';
import { jsonMaxValue } from '../../JSON/jsonControl';
import { Rnd } from 'react-rnd';
import ReactDOM from 'react-dom';
import { gfs_PGM_REDUCER, gfs_dispatch, gfs_getStoreValue } from '../../Method/Store';

class PopupFrame extends Component {
  popupOpenYn = null;
  parentNode = null;
  rootId = 0;

  zIndex = 0;
  state = {
    width  : this.props.width,
    height : this.props.height,
    child  : undefined,
    pgm    : '',
    nam    : ''
  }

  constructor(props){
    super(props);
    this.rootId = this.props.rootId;

    this.zIndex = jsonMaxValue(gfs_getStoreValue('WINDOWFRAME_REDUCER', 'windowState'), 'windowZindex');

    this.popupOpenYn = document.querySelector('[id^="POPUP_OWNER"]');
    
    var bg = document.createElement('div');
    bg.id = 'POPUP_OWNER_' + props.parent.props.pgm + '_' + this.rootId;
    bg.style = `position: fixed;
                z-index: ${this.zIndex};
                left: 0px;
                top: 0px;
                width: 100%;
                height: 100%;
                overflow: auto;
                background: rgba(0,0,0,0.4)`;
    if(this.popupOpenYn === null){
      document.body.append(bg);
    }else{
      this.parentNode = ReactDOM.findDOMNode(this.props.parent);
      this.parentNode.append(bg);
    }
  }

  componentWillUnmount(){
    const pgm = this.state.pgm + this.props.rootId;
    const rtnValue = gfs_getStoreValue(pgm);

    gfs_dispatch('WINDOWFRAME_REDUCER', 'CLOSEWINDOW', 
      ({
        activeWindow: {programId: pgm
                      }
      })
    );

    this.props.callback(rtnValue);
  }

  componentDidMount(){  
    const popup = import(`../../Program/POPUP/${this.props.src}`);
    popup.then(
      e => {
        //지금 팝업은 메뉴도 없고,
        // 다국어 테이블도 없고해서 그냥 하드코딩한다.
        // 차후에 결정되면 메뉴등록해서 nam가져올지 다국어에서 nam가져올지 결정
        const pgm = e.default.name + this.props.rootId;
        const nam = e.default.name;
        gfs_PGM_REDUCER(pgm);

        this.setState({pgm: e.default.name, nam: nam});

        this.setState({
          child: 
          <div className='win_body'>
            <e.default pgm={pgm} nam={nam}/>
          </div>
        });
      }
    )
  }
  
  render() {

    return(     
      <Rnd size={{
        width: this.state.width,
        height:this.state.height
      }}
      dragHandleClassName='win_header'
      // bounds='parent'
      style={{
        zIndex: this.zIndex + 1
      }}
      onResizeStop= {(e, dir, ref, delta, position) => this.setState({width: this.state.width < delta.width ? this.state.width - delta.width : this.state.width + delta.width,
                                                                      height: this.state.height < delta.height ? this.state.height - delta.height : this.state.height + delta.height})}
      >
        <div style={{width:'100%'}} 
             className='content'
             >
        
          <div className='win_header' style={{cursor:'move'}}>
            <h4>[{this.state.pgm}] {this.state.nam}</h4>
            
            <div className='win_controller'>

              <button type='button' className='close' 
                      onClick={() => {
                        ReactDOM.unmountComponentAtNode(document.getElementById('POPUP_' + this.props.parent.props.pgm + '_' + this.rootId));

                        if(this.parentNode === null){
                          document.body.removeChild(document.getElementById('POPUP_OWNER_' + this.props.parent.props.pgm + '_' + this.rootId));
                        }else{
                          this.parentNode.removeChild(document.getElementById('POPUP_OWNER_' + this.props.parent.props.pgm + '_' + this.rootId));
                        }
                      }}
                      onMouseDown={e => e.stopPropagation()} >
              </button>
            </div>
          </div>
          
          {this.state.child}
        </div>
      </Rnd>    
    );
  }
}

PopupFrame.propTypes = {

};

PopupFrame.defaultProps = {

};

export default PopupFrame;