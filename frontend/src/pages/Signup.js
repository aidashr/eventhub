import { Component } from 'react';
import axios from "axios";
// import { Redirect } from 'react-router';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Redirect } from 'react-router';
import { Col, Row, Form } from "react-bootstrap";
import './Login-Signup.css';
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
        if (this.state.isSignedUp) {
            if (this.state.is_regular)
                return <Redirect to={{ pathname: "/user-profile" }} />;
            if (!this.state.is_regular)
                return <Redirect to={{ pathname: "/user-profile" }} />;
        }
        return (
            <div className="outer_signup">
                <div className="inner">
                    <form onSubmit={this.handleSubmit}>
                        <h4 className="text-center font-weight-bold mb-4">Sign up</h4>
                        <Tabs fill className="signUnTabs" defaultActiveKey="Cafe" id="uncontrolled-tab-example">
                            <Tab className="CafeSignUpTab" tabClassName="tabsColor" eventKey="Cafe" title="Cafe">
                                <div className="tab-pane fade show active" id="pills-cafe" role="tabpanel" aria-labelledby="pills-cafe-tab">
                                    <div className="form-group">
                                        <input
                                            type="cafename"
                                            name="cafename"
                                            cafename={this.state.cafename}
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            type="text" className="form-control" placeholder="Cafe Name" />

                                        {this.state.errcafename ? <h6 style={{ color: 'red' }}><i>{this.state.errcafenameText}</i></h6> : null}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="cafe_username"
                                            name="cafe_username"
                                            cafe_username={this.state.cafe_username}
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            type="text" className="form-control" placeholder="Username" />

                                        {this.state.errcafe_username ? <h6 style={{ color: 'red' }}><i>{this.state.errcafe_usernameText}</i></h6> : null}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="cafe_phonenumber"
                                            name="cafe_phonenumber"
                                            cafe_phonenumber={this.state.cafe_phonenumber}
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            type="text" className="form-control" placeholder="Phone Number" />

                                        {this.state.errcafe_phonenumber ? <h6 style={{ color: 'red' }}><i>{this.state.errcafe_phonenumberText}</i></h6> : null}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="cafe_email"
                                            name="cafe_email"
                                            cafe_email={this.state.cafe_email}
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            type="email" className="form-control" placeholder="Email" />

                                        {this.state.errcafe_email ? <h6 style={{ color: 'red' }}><i>{this.state.errcafe_emailText}</i></h6> : null}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="cafe_password"
                                            name="cafe_password"
                                            cafe_password={this.state.cafe_password}
                                            onChange={this.handleChange}
                                            type="password" className="form-control" placeholder="Password" />

                                        {this.state.errcafe_password ? <h6 style={{ color: 'red' }}><i>{this.state.errcafe_passwordText}</i></h6> : null}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="cafe_confirmpassword"
                                            name="cafe_confirmpassword"
                                            cafe_confirmpassword={this.state.cafe_confirmpassword}
                                            onChange={this.handleChange}
                                            type="password" className="form-control" placeholder="Confirm Password" />
                                    </div>

                                    <button className="btn btn-primary rounded-pill font-weight-bold w-100 mb-3"
                                        onClick={this.cafeClick.bind(this)}>
                                        Sign Up
                  </button>

                                    <Link to="/sign-in" className="btn btn-outline-primary rounded-pill font-weight-bold w-100">Already registered?</Link>

                                </div>
                            </Tab>
                            <Tab className="UserSignUoTab" tabClassName="tabsColor" eventKey="User" title="User">
                                <div className="tab-pane fade show active" id="pills-user" role="tabpanel" aria-labelledby="pills-user-tab">
                                    <Form>
                                        <Row>
                                            <Col>
                                                <div className="form-group">
                                                    <input
                                                        type="firstname"
                                                        name="firstname"
                                                        firstname={this.state.firstname}
                                                        onChange={this.handleChange}
                                                        autoComplete="off"
                                                        type="text" className="form-control" placeholder="First name" />
                                                </div>
                                            </Col>
                                            <Col className="colLast">
                                                <div className="form-group">
                                                    <input
                                                        type="lastname"
                                                        name="lastname"
                                                        lastname={this.state.lastname}
                                                        onChange={this.handleChange}
                                                        autoComplete="off"
                                                        type="text" className="form-control" placeholder="Last name" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>

                                    <div className="form-group">
                                        <input
                                            type="username"
                                            name="username"
                                            username={this.state.username}
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            type="text" className="form-control" placeholder="Username" />

                                        {this.state.errusername ? <h6 style={{ color: 'red' }}><i>{this.state.errusernameText}</i></h6> : null}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="phonenumber"
                                            name="phonenumber"
                                            phonenumber={this.state.phonenumber}
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            type="text" className="form-control" placeholder="Phone Number" />

                                        {this.state.errphonenumber ? <h6 style={{ color: 'red' }}><i>{this.state.errphonenumberText}</i></h6> : null}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="email"
                                            name="email"
                                            email={this.state.email}
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            type="email" className="form-control" placeholder="Email" />

                                        {this.state.erremail ? <h6 style={{ color: 'red' }}><i>{this.state.erremailText}</i></h6> : null}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="password"
                                            name="password"
                                            password={this.state.password}
                                            onChange={this.handleChange}
                                            type="password" className="form-control" placeholder="Password" />

                                        {this.state.errpassword ? <h6 style={{ color: 'red' }}><i>{this.state.errpasswordText}</i></h6> : null}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="confirmpassword"
                                            name="confirmpassword"
                                            confirmpassword={this.state.confirmpassword}
                                            onChange={this.handleChange}
                                            type="password" className="form-control" placeholder="Confirm Password" />
                                    </div>

                                    <button className="btn btn-primary rounded-pill font-weight-bold w-100 mb-3"
                                        onClick={this.userClick.bind(this)}>
                                        Sign Up
                  </button>

                                    <Link to="/sign-in" className="btn btn-outline-primary rounded-pill font-weight-bold w-100">Already registered?</Link>

                                </div>
                            </Tab>
                        </Tabs>

                    </form>
                </div>
            </div >
        );
    }
}

export default Signup;
