import { Component } from 'react';
import './../App.css'
import './Navbar.css'
import Cookies from 'js-cookie'

class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            is_loged_in: '',
            profile_page_path: 'user-profile'
        }

        this.handleLogout = this.handleLogout.bind(this)
    }

    componentDidMount() {
        var is_regular = Cookies.get("IS_REGULAR")
        if (is_regular) {
            if (true === is_regular)
                this.setState({
                    is_loged_in: true,
                    profile_page_path: '/user-profile/'
                })
            else
                this.setState({
                    is_loged_in: true,
                    profile_page_path: '/cafe-profile/'
                })
        }
    }
    render() {
        return (
            <nav class="navbar navbar-expand-md navbar-dark bg-dark">
                <div className="container-md">
                    <a class="navbar-brand" href="/">Event Hub</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <div class="nav-bar-search input-group ml-auto mt-2 mt-md-0 mr-2">
                            <input type="text" class="form-control" placeholder="Search" aria-label="" aria-describedby="button-addon2" />
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button" id="button-addon2"><i class="fas fa-search"></i></button>
                            </div>
                        </div>
                        <ul class="navbar-nav ">
                            {this.state.is_loged_in ?
                                <>
                                    <li class="nav-item"><a class="nav-link" href="/" onClick={this.handleLogout}>Log out</a></li>
                                    <li class="nav-item"><a class="nav-link" href={this.state.profile_page_path + Cookies.get('ID')}>Profile</a></li>
                                </> :
                                <>
                                    <li class="nav-item"><a class="nav-link" href="/sign-up">Sign up</a></li>
                                    <li class="nav-item"><a class="nav-link" href="/sign-in">Log in</a></li>
                                </>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }

    handleLogout() {
        this.setState({ is_loged_in: false })
        Cookies.remove('ID')
        Cookies.remove('TOKEN')
        Cookies.remove('IS_REGULAR')
    }
}
export default Navbar;
