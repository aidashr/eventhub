import { Component } from 'react';
import { Redirect } from 'react-router';
import axios from "axios";
import Cookies from 'js-cookie'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',

      errusername: false,
      errpassword: false,

      is_regular: false
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
    axios.get('http://127.0.0.1:8000/users/login',
      { params: { username: this.state.username, password: this.state.password } })
      .then((res) => {
        console.log('Login Token : ' + res.data) //LOG
        this.setState({ is_regular: res.data.user.is_regular })
        if (res.status === 200) {
          this.setState({ isLogedIn: true });

          Cookies.set('TOKEN', res.data.token);
          Cookies.set('ID', res.data.user.id);
          Cookies.set('IS_REGULAR', res.data.user.is_regular);
        }
      }).catch((error) => {
        if (error.response) {
          this.setState({ isLogedIn: false });

          this.setState({ errusername: (error.response.data.username !== undefined) ? true : false })
          this.setState({ errpassword: (error.response.data.password !== undefined) ? true : false })

          this.setState({ errusernameText: error.response.data.username })
          this.setState({ errpasswordText: error.response.data.password })
          this.setState({ er: error.response.data.non_field_errors })

        }
      });
  }

  render() {
    if (this.state.isLogedIn) {
      if (this.state.is_regular)
        return <Redirect to={{ pathname: "/user-profile/" + Cookies.get('ID') }} />;
      if (!this.state.is_regular)
        return <Redirect to={{ pathname: "/cafe-profile/" + Cookies.get('ID') }} />;
    }
    return (
      <div className="container-md">
        <div className="row justify-content-center pt-2 pt-md-4">
          <div className="col-auto shadow-lg border border-secondry rounded p-3" style={{ width: 400 }}>
            <form onSubmit={this.handleSubmit}>

              <h5 className="text text-center font-weight-bold mb-4">Login</h5>

              <small className="text text-danger">{this.state.er}</small>
              <div className="input-group mb-2">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="fas fa-user fa-lg" style={{ width: 20 }}></i>
                    </div>
                  </div>
                  <input type="text" className="form-control" name="username" username={this.state.username} onChange={this.handleChange} placeholder="Username" />
                </div>
                <div>
                  {this.state.errusername ? <small className="text text-danger">{this.state.errusernameText}</small> : null}
                </div>
              </div>

              <div className="input-group mb-2">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="fas fa-lock fa-lg" style={{ width: 20 }}></i>
                    </div>
                  </div>
                  <input type="password" className="form-control" name="password" password={this.state.password} onChange={this.handleChange} placeholder="Password" />
                </div>
                <div>
                  {this.state.errpassword ? <small className="text text-danger">{this.state.errpasswordText}</small> : null}
                </div>
              </div>


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
