import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import Navbar from './pages/Navbar';
import Signup from './pages/Signup';
import Userprofile from './pages/Userprofile'
import './pages/Userprofile.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <div>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/sign-up" component={Signup}></Route>
            <Route exact path="/sign-in" component={Login}></Route>
            <Route exact path="/user-profile" component={Userprofile}></Route>
          </div>
        </div>
      </Router>
    );
  }
}

const Home = () => (
  <div className="HomePage">
    <h1>Home Page</h1>
  </div>
)

export default App;
