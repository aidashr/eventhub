import { Component } from 'react';
import { Redirect } from 'react-router';
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Cookies from 'universal-cookie';


const cookies = new Cookies();


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',

      errusername: false,
      errpassword: false,

      is_regular: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    //'http://127.0.0.1:8000/users/login?username=matin&password=1234'
    axios.get('http://127.0.0.1:8000/users/login',
      { params: { username: this.state.username, password: this.state.password } })
      .then((res) => {
        console.log('Login Token : ' + res.data.token) //LOG
        console.log('username : ' + res.data.user.username); //LOG
        console.log('password : ' + res.data.user.password); //LOG
        console.log('Id : ' + res.data.user.id) //LOG
        console.log('is_regular : ' + res.data.user.is_regular) //LOG
        this.state.is_regular = res.data.user.is_regular;
        if (res.status === 200) {
          this.setState({ isLogedIn: true });
          console.log(this.state) //LOG

          cookies.set('TOKEN', res.data.token);
          console.log(cookies.get('TOKEN'));//LOG

          cookies.set('ID', res.data.user.id);
          console.log(cookies.get('ID'));//LOG

          cookies.set('Is_Regular', res.data.user.is_regular);
          console.log(cookies.get('Is_Regular'));//LOG
        }
      }).catch((error) => {
        if (error.response) {
          this.setState({ isLogedIn: false });
          this.state.errusername = (error.response.data.username != undefined) ? true : false;
          this.state.errpassword = (error.response.data.password != undefined) ? true : false;

          this.state.errusernameText = error.response.data.username;
          this.state.errpasswordText = error.response.data.password;
          this.state.er = error.response.data.non_field_errors;
        }
      });
  }

  render() {
    if (this.state.isLogedIn) {
      if (this.state.is_regular)
        return <Redirect to={{ pathname: "/user-profile" }} />;
      if (!this.state.is_regular)
        return <Redirect to={{ pathname: "/user-profile" }} />;
    }
    return (
      <div className="outer">
        <div className="inner">

          <h4 className="text-center font-weight-bold mb-4">Login</h4>

          <form onSubmit={this.handleSubmit}>

            <h6 style={{ color: 'red' }}><i>{this.state.er}</i></h6>

            <div className="form-group">
              <input
                type="username"
                name='username'
                username={this.state.username}
                onChange={this.handleChange}
                autoComplete="off"
                type="text" className="form-control" placeholder="Username" />

              {this.state.errusername ? <h6 style={{ color: 'red' }}><i>{this.state.errusernameText}</i></h6> : null}
            </div>

            <div className="form-group">
              <input
                type="password"
                name='password'
                className="form-control"
                password={this.state.password}
                placeholder="Password"
                onChange={this.handleChange}
                type="password" className="form-control"
              />

              {this.state.errpassword ? <h6 style={{ color: 'red' }}><i>{this.state.errpasswordText}</i></h6> : null}
            </div>

            <button
              className="btn btn-primary rounded-pill font-weight-bold w-100 mb-3"
              value="Submit"
              onClick={this.handleSubmit}
              onSubmit={this.handleSubmit}
            >
              Login
            </button>

            <Link to="/sign-up" className="btn btn-outline-primary rounded-pill font-weight-bold w-100">Create an account</Link>

          </form>
        </div>
      </div>
    );
  }
}


export default Login;
