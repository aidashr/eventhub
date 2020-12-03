import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import { Redirect } from 'react-router';
import { Col, Row, Form } from "react-bootstrap";
import ReactRoundedImage from "react-rounded-image";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './Userprofile.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


class Userprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      username: '',
      phonenumber: '',
      email: '',
      password: '',

      is_regular: false,
    };

    this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    var url = "http://127.0.0.1:8000/users/" + cookies.get('ID');

    axios.get(
      url,
      { headers: { "authorization": 'Token ' + cookies.get('TOKEN') } }
    ).then((res) => {
      if (res.status === 200) {
        this.setState({ firstname: res.data.first_name })
        this.setState({ lastname: res.data.last_name })
        this.setState({ username: res.data.username })
        this.setState({ phonenumber: res.data.phone_number })
        this.setState({ email: res.data.email })
        console.log(this.state) //LOG
      }
    }).catch((error) => {
      if (error.response) {
        console.log(this.state) //LOG
      }
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }



  render() {
    return (
      <div className="row py-5 px-4">
        <div className="col-md-7 mx-auto">
          <div className="shadow rounded overflow-hidden">

            <div className="px-3 pt-1 pb-2 cover">
              <div className="media align-items-end profile-head">

                <div className="profile">
                  <ReactRoundedImage
                    className='profileImage'
                    image={'https://c402277.ssl.cf1.rackcdn.com/photos/10596/images/carousel_small/RAWP2115_mini.jpg?1451407554'}
                    roundedSize="0"
                    imageWidth="150"
                    imageHeight="150" />
                </div>

                <div className="media-body mb-5 text-white"
                  style={{ paddingLeft: 10, paddingBottom: 10 }}>
                  <h4 className="mt-0 mb-0" >{this.state.username}</h4>
                  <p className="small mb-4">{this.state.firstname}  {this.state.lastname}</p>
                </div>

              </div>
            </div>

            <div>
              <div className="bg-light p-4 d-flex justify-content-end text-center">
                <ul className="list-inline mb-0">
                  <li className="list-inline-item">
                    <h5 className="font-weight-bold mb-0 d-block">0</h5>
                    <small className="text-muted">
                      <i className="fas fa-image mr-1"></i>
                    Events
                  </small>
                  </li>

                  <li className="list-inline-item">
                    <h5 className="font-weight-bold mb-0 d-block">0</h5>
                    <small className="text-muted">
                      <i className="fas fa-user mr-1"></i>
                    Followers
                  </small>
                  </li>

                  <li className="list-inline-item">
                    <h5 className="font-weight-bold mb-0 d-block">0</h5>
                    <small className="text-muted">
                      <i className="fas fa-user mr-1"></i>
                    Following
                  </small>
                  </li>

                </ul>
              </div>
            </div>

            <div className="py-4 px-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0">Recent Events</h5>
              </div>
              <div className="row">
                <div className="col-lg-6 mb-2 pr-lg-1">
                  <img src="https://nas-national-prod.s3.amazonaws.com/styles/hero_image/s3/sfw_15586958314_eabee7f9c4_o.jpg?itok=4qWlyGTr"
                    alt=""
                    className="img-fluid rounded shadow-sm" />
                </div>
                <div className="col-lg-6 mb-2 pl-lg-1">
                  <img src="https://nas-national-prod.s3.amazonaws.com/styles/hero_image/s3/sfw_15586958314_eabee7f9c4_o.jpg?itok=4qWlyGTr"
                    alt=""
                    className="img-fluid rounded shadow-sm" />
                </div>
                <div className="col-lg-6 pr-lg-1 mb-2">
                  <img src="https://nas-national-prod.s3.amazonaws.com/styles/hero_image/s3/sfw_15586958314_eabee7f9c4_o.jpg?itok=4qWlyGTr"
                    alt=""
                    className="img-fluid rounded shadow-sm" />
                </div>
                <div className="col-lg-6 pl-lg-1">
                  <img src="https://nas-national-prod.s3.amazonaws.com/styles/hero_image/s3/sfw_15586958314_eabee7f9c4_o.jpg?itok=4qWlyGTr"
                    alt=""
                    className="img-fluid rounded shadow-sm" />
                </div>
              </div>
            </div>

            <div className="editProfile " style={{ paddingTop: 10, paddingBottom: 20, paddingRight: 10, paddingLeft: 10 }}>
              <Popup
                trigger={
                  <button className="btn btn-outline-dark btn-block">
                    Edit profile
                      </button>}
                modal>
                <Edit />
              </Popup>
            </div>

          </div>
        </div >
      </div >
    );
  }
}

class Edit extends Userprofile {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      username: '',
      phonenumber: '',
      email: '',
      password: '',
      confirmpassword: '',

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


  componentDidMount() {
    var url = "http://127.0.0.1:8000/users/" + cookies.get('ID');

    axios.get(
      url,
      { headers: { "authorization": 'Token ' + cookies.get('TOKEN') } }
    ).then((res) => {
      if (res.status === 200) {
        this.setState({ firstname: res.data.first_name })
        this.setState({ lastname: res.data.last_name })
        this.setState({ username: res.data.username })
        this.setState({ phonenumber: res.data.phone_number })
        this.setState({ email: res.data.email })
        console.log(this.state) //LOG
      }
    }).catch((error) => {
      if (error.response) {
        console.log(this.state) //LOG
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }


  render() {
    return (
      <div className="outer_signup">
        <div className="inner">
          <form onSubmit={this.handleSubmit}>
            <div className="tab-pane fade show active" id="pills-user" role="tabpanel" aria-labelledby="pills-user-tab">
              <Form>
                <Row>
                  <Col className="colFirst">
                    <Form.Control
                      type="firstname"
                      name="firstname"
                      value={this.state.firstname}
                      onChange={this.handleChange}
                      placeholder="First name" />
                  </Col>
                  <Col className="colLast">
                    <Form.Control
                      type="lastname"
                      name="lastname"
                      value={this.state.lastname}
                      onChange={this.handleChange}
                      placeholder="Last name" />
                  </Col>
                </Row>
              </Form>

              <div className="form-group">
                <input
                  type="username"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                  defaultValue={this.state.username}
                  type="text" className="form-control" placeholder="Username" />
              </div>

              <div className="form-group">
                <input
                  type="phonenumber"
                  name="phonenumber"
                  value={this.state.phonenumber}
                  onChange={this.handleChange}
                  type="text" className="form-control" placeholder="Phone Number" />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  type="email" className="form-control" placeholder="Email" />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  type="password" className="form-control" placeholder="Password" />
              </div>

              <div className="form-group">
                <input
                  type="confirmpassword"
                  name="confirmpassword"
                  value={this.state.confirmpassword}
                  onChange={this.handleChange}
                  type="password" className="form-control" placeholder="Confirm Password" />
              </div>

              <button className="btn btn-primary rounded-pill font-weight-bold w-100 mb-3"
              //onClick={this.userClick.bind(this)}
              >
                Change
            </button>

            </div>
          </form>
        </div >
      </div >
    )
  }
}

export default Userprofile
