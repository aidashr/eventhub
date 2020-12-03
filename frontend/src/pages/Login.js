import { Component } from 'react';
import { Redirect } from 'react-router';
import axios from "axios";
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
      <div className="container-md">
        <div className="row justify-content-center pt-2 pt-md-4">
          <div className="col-auto shadow-lg border border-secondry rounded p-3" style={{ width: 400 }}>
            <form onSubmit={this.handleSubmit}>

              <h5 className="text text-center font-weight-bold mb-4">Login</h5>

              <small className="text text-danger">{this.state.er}</small>

              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <i className="fas fa-user fa-lg" style={{ width: 20 }}></i>
                  </div>
                </div>
                <input type="text" className="form-control" value={this.state.username} onChange={this.handleChange} placeholder="Username" />
              </div>
              {this.state.errusername ? <small className="text text-danger">{this.state.errusernameText}</small> : null}

              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <i className="fas fa-lock fa-lg" style={{ width: 20 }}></i>
                  </div>
                </div>
                <input type="text" className="form-control" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
              </div>
              {this.state.errpassword ? <small className="text text-danger">{this.state.errpasswordText}</small> : null}

              <button className="btn btn-primary rounded-pill font-weight-bold w-100 mb-3" value="Submit" onClick={this.handleSubmit} onSubmit={this.handleSubmit}>Login</button>
              <a className="btn btn-outline-primary rounded-pill font-weight-bold w-100" href="/sign-up">Create an account</a>
            </form>
          </div>
        </div>
      </div>
    );
  }
}


export default Login;
