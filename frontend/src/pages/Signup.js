import { Component } from 'react';
import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();


class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cafename: '',
            cafe_username: '',
            cafe_phonenumber: '',
            cafe_email: '',
            cafe_password: '',
            cafe_confirmpassword: '',
            iscafe: false,

            errcafename: false,
            errcafe_username: false,
            errcafe_phonenumber: false,
            errcafe_email: false,
            errcafe_password: false,

            firstname: '',
            lastname: '',
            username: '',
            phonenumber: '',
            email: '',
            password: '',
            confirmpassword: '',
            isuser: false,

            errusername: false,
            errphonenumber: false,
            erremail: false,
            errpassword: false,

            is_regular: false,

            isSignedUp: false,

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
        console.log(this.state)
        event.preventDefault();
        if (this.state.cafe_confirmpassword != this.state.cafe_password
            || this.state.confirmpassword != this.state.password) {
            alert('Password doesnt match')
        }
        else if (this.state.iscafe) {
            axios.post(
                "http://127.0.0.1:8000/users/sign-up",
                {
                    cafe_name: this.state.cafename,
                    username: this.state.cafe_username,
                    phone_number: this.state.cafe_phonenumber,
                    email: this.state.cafe_email,
                    password: this.state.cafe_password,
                    is_regular: this.state.is_regular,
                },
                // { headers: { "content-type": "application/json" } }
            ).then((res) => {
                // console.log('Cafe Sign-up : ' + res.data.token) //LOG
                // console.log('cafe_name : ' + res.data.user.cafe_name);
                // console.log('username : ' + res.data.user.username);
                // console.log('phone_number : ' + res.data.user.phone_number);
                // console.log('email : ' + res.data.user.email);
                // console.log('password : ' + res.data.user.password);
                // console.log('id : ' + res.data.user.id);
                if (res.status === 200) {
                    this.setState({ isSignedUp: true });
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
                    this.setState({ isSignedUp: false });
                    console.log('id : ' + error.response.data.id);
                    console.log('cafe_username : ' + error.response.data.username);

                    this.state.errcafename = (error.response.data.cafe_name != undefined) ? true : false;
                    this.state.errcafe_username = (error.response.data.username != undefined) ? true : false;
                    this.state.errcafe_phonenumber = (error.response.data.phone_number != undefined) ? true : false;
                    this.state.errcafe_email = (error.response.data.email != undefined) ? true : false;
                    this.state.errcafe_password = (error.response.data.password != undefined) ? true : false;

                    this.state.errcafenameText = error.response.data.cafe_name;
                    this.state.errcafe_usernameText = error.response.data.username;
                    this.state.errcafe_phonenumberText = error.response.data.phone_number;
                    this.state.errcafe_emailText = error.response.data.email;
                    this.state.errcafe_passwordText = error.response.data.password;

                }
            });
        }
        else if (this.state.isuser) {
            axios.post(
                "http://127.0.0.1:8000/users/sign-up",
                {
                    first_name: this.state.firstname,
                    last_name: this.state.lastname,
                    username: this.state.username,
                    phone_number: this.state.phonenumber,
                    email: this.state.email,
                    password: this.state.password,
                    is_regular: true,
                },
                //{ headers: { "content-type": "application/json" } }
            ).then((res) => {
                // console.log('User Sign-up : ' + res.data.token) //LOG
                // console.log('username : ' + res.data.user.username);
                // console.log('first_name : ' + res.data.user.first_name);
                // console.log('last_name : ' + res.data.user.last_name);
                // console.log('email : ' + res.data.user.email);
                // console.log('password : ' + res.data.user.password);
                // console.log('phone_number : ' + res.data.user.phone_number);
                // console.log('id : ' + res.data.user.id);
                if (res.status === 200) {
                    this.setState({ isSignedUp: true });
                    //console.log(this.state) //LOG

                    cookies.set('TOKEN', res.data.token);
                    console.log(cookies.get('TOKEN'));//LOG

                    cookies.set('ID', res.data.user.id);
                    console.log(cookies.get('ID'));//LOG

                    cookies.set('Is_Regular', res.data.user.is_regular);
                    console.log(cookies.get('Is_Regular'));//LOG
                }
            }).catch((error) => {
                if (error.response) {
                    this.setState({ isSignedUp: false });

                    this.state.errusername = (error.response.data.username != undefined) ? true : false;
                    this.state.errphonenumber = (error.response.data.phone_number != undefined) ? true : false;
                    this.state.erremail = (error.response.data.email != undefined) ? true : false;
                    this.state.errpassword = (error.response.data.password != undefined) ? true : false;

                    this.state.errusernameText = error.response.data.username;
                    this.state.errphonenumberText = error.response.data.phone_number;
                    this.state.erremailText = error.response.data.email;
                    this.state.errpasswordText = error.response.data.password;

                }
            });
        }
    }

    cafeClick() {
        this.setState({ iscafe: true })
        this.setState({ isuser: false })
        this.setState({ is_regular: false })
        console.log("Cafe signIn clicked")
    }

    userClick() {
        this.setState({ isuser: true })
        this.setState({ iscafe: false })
        this.setState({ is_regular: true })
        console.log("User signIn clicked")
    }

    render() {
        return (
            <div className="container-md">
                <div className="row justify-content-center pt-2 pt-md-4">
                    <div className="col-auto shadow-lg border border-secondry rounded p-3" style={{ width: 400 }}>
                        <form onSubmit={this.handleSubmit}>

                            <h5 className="text text-center font-weight-bold mb-4">Signup</h5>

                            <nav>
                                <div class="nav nav-tabs nav-fill mb-3" id="nav-tab" role="tablist">
                                    <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#sign-up-nav-cafe" role="tab" aria-controls="nav-cafe" aria-selected="true">Cafe</a>
                                    <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#sign-up-nav-user" role="tab" aria-controls="nav-user" aria-selected="false">User</a>
                                </div>
                            </nav>

                            <div class="tab-content" id="nav-tabContent">
                                <div class="tab-pane fade show active" id="sign-up-nav-cafe" role="tabpanel" aria-labelledby="nav-home-tab">
                                    <div className="tab-pane fade show active" id="pills-cafe" role="tabpanel" aria-labelledby="pills-cafe-tab">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <i className="fas fa-user fa-lg" style={{ width: 20 }}></i>
                                                </div>
                                            </div>
                                            <input type="text" className="form-control" name="cafename" cafename={this.state.cafename} onChange={this.handleChange} placeholder="Cafe Name" />
                                        </div>
                                        {this.state.errcafename ? <small className="text text-danger">{this.state.errcafenameText}</small> : null}

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <i className="fas fa-user fa-lg" style={{ width: 20 }}></i>
                                                </div>
                                            </div>
                                            <input type="text" className="form-control" name="cafe_username" cafe_username={this.state.cafe_username} onChange={this.handleChange} placeholder="Username" />
                                        </div>
                                        {this.state.errcafe_username ? <small className="text text-danger">{this.state.errcafe_usernameText}</small> : null}

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <i className="fas fa-mobile-alt fa-lg" style={{ width: 20 }}></i>
                                                </div>
                                            </div>
                                            <input type="text" className="form-control" name="cafe_phonenumber" cafe_phonenumber={this.state.cafe_phonenumber} onChange={this.handleChange} placeholder="Phone Number" />
                                        </div>
                                        {this.state.errcafe_phonenumber ? <small className="text text-danger">{this.state.errcafe_phonenumberText}</small> : null}

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <i className="fas fa-at fa-lg" style={{ width: 20 }}></i>
                                                </div>
                                            </div>
                                            <input type="text" className="form-control" name="cafe_email" cafe_email={this.state.cafe_email} onChange={this.handleChange} placeholder="Email" />
                                        </div>
                                        {this.state.errcafe_email ? <small className="text text-danger">{this.state.errcafe_emailText}</small> : null}

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <i className="fas fa-lock fa-lg" style={{ width: 20 }}></i>
                                                </div>
                                            </div>
                                            <input type="text" className="form-control" name="cafe_password" cafe_password={this.state.cafe_password} onChange={this.handleChange} placeholder="Password" />
                                        </div>
                                        {this.state.errcafe_password ? <small className="text text-danger">{this.state.errcafe_passwordText}</small> : null}

                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <i className="fas fa-lock fa-lg" style={{ width: 20 }}></i>
                                                </div>
                                            </div>
                                            <input type="text" className="form-control" name="cafe_confirmpassword" cafe_confirmpassword={this.state.cafe_confirmpassword} onChange={this.handleChange} placeholder="Confirm Password" />
                                        </div>
                                        <button className="btn btn-primary rounded-pill font-weight-bold w-100 mb-3" onClick={this.cafeClick.bind(this)}>Sign Up</button>
                                        <a href="/sign-in" className="btn btn-outline-primary rounded-pill font-weight-bold w-100">Already registered?</a>
                                    </div>
                                </div>

                                <div class="tab-pane fade" id="sign-up-nav-user" role="tabpanel" aria-labelledby="nav-profile-tab">
                                    <div className="tab-pane fade show active" id="pills-user" role="tabpanel" aria-labelledby="pills-user-tab">

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <i className="fas fa-user fa-lg" style={{ width: 20 }}></i>
                                                </div>
                                            </div>
                                            <input className="form-control" type="text" name="firstname" firstname={this.state.firstname} onChange={this.handleChange} autoComplete="off" placeholder="First name" />
                                            <input className="form-control" type="text" name="lastname" lastname={this.state.lastname} onChange={this.handleChange} autoComplete="off" placeholder="Last name" />
                                        </div>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <i className="fas fa-user fa-lg" style={{ width: 20 }}></i>
                                                </div>
                                            </div>
                                            <input type="text" className="form-control" name="username" username={this.state.username} onChange={this.handleChange} placeholder="Username" />
                                        </div>
                                        {this.state.errusername ? <small className="text-danger">{this.state.errusernameText}</small> : null}

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <i class="fas fa-mobile-alt fa-lg" style={{ width: 20 }}></i>
                                                </div>
                                            </div>
                                            <input type="text" className="form-control" name="phonenumber" phonenumber={this.state.phonenumber} onChange={this.handleChange} placeholder="Phone Number" />
                                        </div>
                                        {this.state.errphonenumber ? <small className="text text-danger">{this.state.errphonenumberText}</small> : null}

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <i className="fas fa-at fa-lg" style={{ width: 20 }}></i>
                                                </div>
                                            </div>
                                            <input type="text" className="form-control" name="email" email={this.state.email} onChange={this.handleChange} placeholder="Email" />
                                        </div>
                                        {this.state.erremail ? <small className="text text-danger">{this.state.erremailText}</small> : null}

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <i className="fas fa-lock fa-lg" style={{ width: 20 }}></i>
                                                </div>
                                            </div>
                                            <input type="password" className="form-control" name="password" password={this.state.password} onChange={this.handleChange} placeholder="Password" />
                                        </div>
                                        {this.state.errpassword ? <small className="text text-danger">{this.state.errpasswordText}</small> : null}

                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <i className="fas fa-lock fa-lg" style={{ width: 20 }}></i>
                                                </div>
                                            </div>
                                            <input type="password" className="form-control" name="confirmpassword" confirmpassword={this.state.confirmpassword} onChange={this.handleChange} placeholder="Confirm Password" />
                                        </div>

                                        <button className="btn btn-primary rounded-pill font-weight-bold w-100 mb-3" onClick={this.userClick.bind(this)}>Sign Up</button>
                                        <a href="/sign-in" className="btn btn-outline-primary rounded-pill font-weight-bold w-100">Already registered?</a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;
