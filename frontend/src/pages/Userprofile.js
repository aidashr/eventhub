import React, { Component } from "react";
import "./Userprofile.css";
import "./../App.css";
import Slider from './../components/Slider'
import Event from './../components/Event'
import DefaultUserProfileImage from "./../images/user.jpg";
import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export class UserProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: 'USRENAME',
            firstname: 'FIRSTNAME',
            lastname: 'LASTNAME',
            phonenumber: 'PHONENUMBER',
            profileimage: 'PROFILEIMAGE',
            hasImage: true,
            isOwner: true,
            email: 'EMAIL',
            eventsCount: 'NUM',
            followingCount: 'NUM',
            sliderItemsToShow: 1,
            events: []
        }

        this.setSliderItemToShow = this.setSliderItemToShow.bind(this)
        window.addEventListener("resize", this.setSliderItemToShow)
    }

    componentDidMount() {
        this.setSliderItemToShow()

        var urlGetProfileDetails = "http://127.0.0.1:8000/users/" + cookies.get('ID');
        axios.get(
            urlGetProfileDetails,
            { headers: { "authorization": 'Token ' + cookies.get('TOKEN') } }
        ).then((res) => {
            if (res.status === 200) {
                this.setState({
                    firstname: res.data.first_name,
                    lastname: res.data.last_name,
                    username: res.data.username,
                    phonenumber: res.data.phone_number,
                    email: res.data.email,
                    profileimage: res.data.profile_image
                });
                if (!this.state.profileimage)
                    this.setState({ profileimage: DefaultUserProfileImage })
                console.log(this.state)
            }
        }).catch((error) => {
            if (error.response) {
                console.log(this.state)
            }
        });

        var urlgetFollowing = "http://127.0.0.1:8000/users/" + cookies.get('ID') + "/followings";
        axios.get(
            urlgetFollowing,
            { headers: { "authorization": 'Token ' + cookies.get('TOKEN') } }
        ).then((res) => {
            if (res.status === 200) {
                this.setState({ followingCount: res.data.length });
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
                this.setState({ eventsCount: res.data.length, events: res.data.results || [] })
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
                                <img className="user-profile-image-container-image" src={this.state.profileimage} alt="Profile" data-toggle="modal" data-target="#profileImageModal"></img>
                                <p className="user-profile-image-container-text" data-toggle="modal" data-target="#profileImageModal">Edit Profile Image</p>
                            </div>
                            <div className="user-profile-info-container">
                                <h3>{this.state.username}</h3>
                                <p>{this.state.firstname + " " + this.state.lastname}</p>
                                <div className="user-profile-info-container-details">
                                    <div className="user-profile-info-container-column mr-3 mr-md-4">
                                        <p className="user-profile-info-container-details-number">{this.state.eventsCount}</p>
                                        <p className="user-profile-info-container-details-text">Events</p>
                                    </div>
                                    <div className="user-profile-info-container-details-border" />
                                    <div className="user-profile-info-container-column ml-3 ml-md-4">
                                        <p className="user-profile-info-container-details-number">{this.state.followingCount}</p>
                                        <p className="user-profile-info-container-details-text">Following</p>
                                    </div>
                                </div>
                                {this.state.isOwner ? (<button className="btn btn-primary" data-toggle="modal" data-target="#editProfileModal">Edit</button>) : null}
                                {!this.state.isOwner ?
                                    this.state.isFollowed ?
                                        <button className="btn btn-primary">Unfollow</button> :
                                        <button className="btn btn-primary">Follow</button>
                                    : null
                                }
                            </div>
                        </div>
                    </div >
                    {console.log('Userprofile ' + this.state.sliderItemsToShow)}
                    {0 < this.state.eventsCount ? <Slider title="Events" children={this.state.events.map(event => <Event event={event} />)} itemsToShow={this.state.sliderItemsToShow} /> : null}

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
            this.setState({ sliderItemsToShow: 3 });
        else if (576 <= window.innerWidth)
            this.setState({ sliderItemsToShow: 2 });
        else
            this.setState({ sliderItemsToShow: 1 });

    }
}

export default UserProfile;
