import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import RtspFullScreen from './RtspFullScreen';
import Snapshot from './Snapshot';
import HLSViewer from './HLSViewer';

class App extends React.Component{
  render(){
    return (
      <Router>
        {/* 김경현 이거 확인 main??? */}
        {/* <main> */}
          <Route exact path='/' component={Login} />
          <Route path='/Home'  component={Home} />
          <Route path='/RtspFullScreen' component={RtspFullScreen} />
          <Route path='/Snapshot' component={Snapshot} />
          <Route path='/HLSViewer' component={HLSViewer} />
        {/* </main> */}
      </Router>
    )
  }
}

export default App;