import React from "react"
import { Route, BrowserRouter as Router } from "react-router-dom"
import Login from "./Login"
import Home from "./Home"

class App extends React.Component{
  render(){
    return (
      <Router>
        <main>
          <Route exact path="/" component={Login} />
          <Route path="/Home"  component={Home} />
        </main>
      </Router>
    )
  }
}

export default App;