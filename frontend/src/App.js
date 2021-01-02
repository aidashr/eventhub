import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Main from "./pages/Main";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Userprofile from './pages/Userprofile'
import Cafeprofile from './pages/Cafeprofile'
import EventDetails from './pages/EventDetails'
import Search from './pages/Search'

class App extends Component {
  render() {
    return (
      <Router>
<<<<<<< HEAD
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Main}></Route>
          <Route exact path="/sign-up" component={Signup}></Route>
          <Route exact path="/sign-in" component={Login}></Route>
          <Route exact path="/user-profile" component={Userprofile}></Route>
          <Route exact path="/Event-Details" component={EventDetails}></Route>
          <Route exact path="/search-result" component={Search}></Route>
        </div>
=======
        <Navbar />
        <Route exact path="/" component={Main}></Route>
        <Route exact path="/sign-up" component={Signup}></Route>
        <Route exact path="/sign-in" component={Login}></Route>
        <Route exact path="/Event-Details" component={EventDetails}></Route>
        <Route exact path="/search-result" component={Search}></Route>
        <Route exact path="/user-profile/:id" component={Userprofile}></Route>
        <Route exact path="/cafe-profile/:id" component={Cafeprofile}></Route>
>>>>>>> dev
      </Router>
    );
  }
}

export default App;
