import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Main from "./pages/Main";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Userprofile from './pages/Userprofile'
import EventDetails from './pages/EventDetails'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Main}></Route>
          <Route exact path="/sign-up" component={Signup}></Route>
          <Route exact path="/sign-in" component={Login}></Route>
          <Route exact path="/user-profile" component={Userprofile}></Route>
          <Route exact path="/Event-Details" component={EventDetails}></Route>
        </div>
      </Router>
    );
  }
}

export default App;
