import ReactDOM from 'react-dom';
import PopupFrame from '../Component/Popup/PopupFrame';

export const gfp_openPopup = (parent, src, width, height, param, callback) => {

  const rootId = Math.floor(Math.random() * 10000000).toString();

  const frameDiv = document.createElement('div');
  frameDiv.id = 'POPUP_' + parent.props.pgm + '_' + rootId;
  // console.log(`margin:${height / 2 * -1}px 0px 0px ${width / 2 * -1}px`);
  frameDiv.style = `position:absolute; 
                    top:50%; 
                    left:50%; 
                    width:${width}px;
                    height:${height}px;
                    margin:${height / 2 * -1}px 0px 0px ${width / 2 * -1}px
                   `;
                  //  
                   
  document.body.appendChild(frameDiv);

  ReactDOM.render(<PopupFrame parent={parent} 
                              src={src}
                              rootId={rootId}
                              width={width} 
                              height={height} 
                              param={param}
                              callback={e => {
                                callback(e)
                              }}/>, frameDiv);
}