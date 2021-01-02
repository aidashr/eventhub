import { Component } from "react";
import Cookies from "js-cookie";
import "./../App.css";
import "./Navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_loged_in: "",
      serach_input: "Search",
      profile_page_path: "user-profile",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    var is_regular = Cookies.get("IS_REGULAR");
    console.log(Cookies.get());
    if (is_regular) this.setState({ is_loged_in: true });
  }
  render() {
    return (
      <nav class='navbar navbar-expand-md sticky-top navbar-dark bg-dark'>
        <div className='container-md'>
          <a class='navbar-brand' href='/'>
            Event Hub
          </a>
          <button
            class='navbar-toggler'
            type='button'
            data-toggle='collapse'
            data-target='#navbarSupportedContent'
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'>
            <span class='navbar-toggler-icon'></span>
          </button>

          <div class='collapse navbar-collapse' id='navbarSupportedContent'>
            <div class='nav-bar-search input-group ml-auto mt-2 mt-md-0 me-2'>
              <input
                type='text'
                class='form-control'
                placeholder={this.state.serach_input}
                onChange={this.handleChange}
              />
              <div class='input-group-append'>
                <a
                  class='btn btn-outline-secondary'
                  href={"/search?input=" + this.state.serach_input}>
                  <i class='fas fa-search'></i>
                </a>
              </div>
            </div>
            <ul class='navbar-nav'>
              {this.state.is_loged_in ? (
                <>
                  <li class='nav-item'>
                    <a class='nav-link' href='/' onClick={this.handleLogout}>
                      Log out
                    </a>
                  </li>
                  <li class='nav-item'>
                    <a class='nav-link' href={"/profile/" + Cookies.get("ID")}>
                      Profile
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li class='nav-item'>
                    <a class='nav-link' href='/sign-up'>
                      Sign up
                    </a>
                  </li>
                  <li class='nav-item'>
                    <a class='nav-link' href='/sign-in'>
                      Log in
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  handleChange(e) {
    this.setState({ serach_input: e.target.value });
  }

  handleLogout() {
    Cookies.remove("ID");
    Cookies.remove("TOKEN");
    Cookies.remove("IS_REGULAR");
    this.props.history.push("/");
    this.setState({ is_loged_in: false });
  }
}
export default Navbar;
