import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { Router, Route, Link } from 'react-router'
import { createBrowserHistory } from 'history'
import App from './App.tsx'

const About = () => {
  return <>About</>
}

ReactDOM.render(
  <Provider>
    <Router history={createBrowserHistory()}>
      <Route path="/" component={App} />
      <Route path="/about" component={About} />
    </Router>
  </Provider>
  , 
  document.getElementById("root")
)