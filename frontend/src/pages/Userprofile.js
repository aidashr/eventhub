import React, { Component } from "react";
import "./Userprofile.css";
import "./../App.css";
import Slider from './../components/Slider'
import Event from './../components/Event'
import DefaultUserProfileImage from "./../images/user.jpg";
import axios from 'axios'
import Cookies from 'js-cookie'

export class UserProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: 'USRENAME',
            first_name: 'FIRST_NAME',
            last_name: 'LAST_NAME',
            phone_number: 'PHONE_NUMBER',
            profile_image: 'PROFILE_IMAGE',
            has_image: true,
            is_owner: true,
            email: 'EMAIL',
            events_count: 'NUMBER',
            following_count: 'NUMBER',
            slider_items_to_show: 1,
            events: []
        }

        this.setSliderItemToShow = this.setSliderItemToShow.bind(this)
        window.addEventListener("resize", this.setSliderItemToShow)
    }

    componentDidMount() {
        this.setSliderItemToShow()

        var urlGetProfileDetails = "http://127.0.0.1:8000/users/" + Cookies.get('ID');
        axios.get(
            urlGetProfileDetails,
            { headers: { "authorization": 'Token ' + Cookies.get('TOKEN') } }
        ).then((res) => {
            if (res.status === 200) {
                this.setState({
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    username: res.data.username,
                    phone_number: res.data.phone_number,
                    email: res.data.email,
                    profile_image: res.data.profile_image
                });
                if (!this.state.profile_image)
                    this.setState({ profile_image: DefaultUserProfileImage })
            }
        }).catch((error) => {
            if (error.response) {
                console.log(this.state)
            }
        });

        var urlgetFollowing = "http://127.0.0.1:8000/users/" + Cookies.get('ID') + "/followings";
        axios.get(
            urlgetFollowing,
            { headers: { "authorization": 'Token ' + Cookies.get('TOKEN') } }
        ).then((res) => {
            if (res.status === 200) {
                this.setState({ following_count: res.data.length });
                console.log(this.state)
            }
        }).catch((error) => {
            if (error.response) {
                console.log(this.state)
            }
        });

        var urlGetEvents = "http://127.0.0.1:8000/event/lastest";
        axios.get(
            urlGetEvents
        ).then((res) => {
            if (res.status === 200) {
                this.setState({ events_count: res.data.length, events: res.data.results || [] })
                console.log(this.state)
            }
        }).catch((error) => {
            if (error.response) {
                console.log(error)
            }
        });
    }

    render() {
        return (
            <div className="user-profile-container">
                <div className="container-md">
                    <div className="user-profile-header">
                        <div className="user-profile-header-container">
                            <div className="user-profile-image-container">
                                <img className="user-profile-image-container-image" src={this.state.profile_image} alt="Profile" data-toggle="modal" data-target="#profileImageModal"></img>
                                <p className="user-profile-image-container-text" data-toggle="modal" data-target="#profileImageModal">Edit Profile Image</p>
                            </div>
                            <div className="user-profile-info-container">
                                <h3>{this.state.username}</h3>
                                <p>{this.state.first_name + " " + this.state.last_name}</p>
                                <div className="user-profile-info-container-details">
                                    <div className="user-profile-info-container-column mr-3 mr-md-4">
                                        <p className="user-profile-info-container-details-number">{this.state.events_count}</p>
                                        <p className="user-profile-info-container-details-text">Events</p>
                                    </div>
                                    <div className="user-profile-info-container-details-border" />
                                    <div className="user-profile-info-container-column ml-3 ml-md-4">
                                        <p className="user-profile-info-container-details-number">{this.state.following_count}</p>
                                        <p className="user-profile-info-container-details-text">Following</p>
                                    </div>
                                </div>
                                {this.state.is_owner ? (<button className="btn btn-primary" data-toggle="modal" data-target="#editProfileModal">Edit</button>) : null}
                            </div>
                        </div>
                    </div >
                    {console.log('DEBUG Userprofile ' + this.state)}
                    <Slider title="Events" children={this.state.events.map(event => <Event event={event} />)} itemsCount={this.state.events.length} itemsToShow={this.state.slider_items_to_show} alert={"No Latest Event"} />

                    {/* MODALS */}
                    {/* PROFILE IMAGE MODAL */}
                    <div class="modal fade" id="profileImageModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Edit Profile Image</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>

                                <div className="modal-content p-3">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Upload</span>
                                        </div>
                                        <div class="custom-file">
                                            <input type="file" class="custom-file-input" id="inputGroupFile01" />
                                            <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" data-dismiss="modal" disabled="{this.state.hasImage}">Delete Current Image</button>
                                    <button type="button" class="btn btn-primary" data-dismiss="modal">Upload</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* EDIT PROFILE MODAL */}
                    <div class="modal fade" id="editProfileModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-content p-3">
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary">Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >);
    }

    setSliderItemToShow = () => {
        if (960 <= window.innerWidth)
            this.setState({ slider_items_to_show: 3 });
        else if (576 <= window.innerWidth)
            this.setState({ slider_items_to_show: 2 });
        else
            this.setState({ slider_items_to_show: 1 });

    }
}

export default UserProfile;
