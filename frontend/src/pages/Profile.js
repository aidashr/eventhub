import { Component } from "react";
import axios from "axios";
import moment from "moment";
import Cookies from "js-cookie";
import Slider from "../components/Slider";
import Event from "../components/Event";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DefaultUserProfileImage from "./../images/user.jpg";
import "./../App.css";
import "./Profile.css";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile_id: this.props.match.params.id,
      is_regular: false,
      username: "USERNAME",
      cafe_name: "CAFE_NAME",
      first_name: "FIRST_NAME",
      last_name: "LAST_NAME",
      email: "EMAIL",
      phone_number: "PHONE_NUMBER",
      profile_image: DefaultUserProfileImage,
      profile_image_selected_file: null,
      profile_image_selected_file_content: "Choose Image",
      is_owner: true,
      is_followed: false,
      events_count: "NUMBER",
      events: [],
      future_events: [],
      previous_events: [],
      followers_count: "NUMBER",
      followers: [
        {
          id: 1,
          username: "SahandNZ",
          first_name: "Sahand",
          last_name: "Nazarzadeh",
          profile_image: DefaultUserProfileImage,
        },
      ],
      following_count: "NUMBER",
      following: [
        {
          id: 1,
          username: "SahandNZ",
          first_name: "Sahand",
          last_name: "Nazarzadeh",
          profile_image: DefaultUserProfileImage,
        },
      ],

      slider_items_to_show: 2,

      edit_profile_username: "",
      edit_profile_username_has_error: false,
      edit_profile_username_helper_text: "",

      edit_profile_cafe_name: "",
      edit_profile_cafe_name_has_error: false,
      edit_profile_cafe_name_helper_text: "",

      edit_profile_first_name: "",
      edit_profile_first_name_has_error: false,
      edit_profile_first_name_helper_text: "",

      edit_profile_last_name: "",
      edit_profile_last_name_has_error: false,
      edit_profile_last_name_helper_text: "",

      edit_profile_email: "",
      edit_profile_email_has_error: false,
      edit_profile_email_helper_text: "",

      edit_profile_phone_number: "",
      edit_profile_phone_number_has_error: false,
      edit_profile_phone_number_helper_text: "",

      active_step: 0,
      steps: ["Details", "Upload Image"],
      tags: [
        { title: "Book Review", code: "book_review" },
        { title: "Movie Review", code: "movie_review" },
        { title: "Board Game", code: "board_game" },
        { title: "Video Game", code: "video_game" },
        { title: "Game", code: "game" },
        { title: "Sports Events", code: "sports_events" },
      ],

      new_event_title: "",
      new_event_title_has_error: false,
      new_event_title_helper_text: "",

      new_event_tags: [],
      new_event_tags_has_error: false,
      new_event_tags_helper_text: "",

      new_event_date: new Date(),
      new_event_date_has_error: false,
      new_event_date_helper_text: "",

      new_event_time: new Date(),
      new_event_time_has_error: false,
      new_event_time_helper_text: "",

      new_event_capacity: "",
      new_event_capacity_has_error: false,
      new_event_capacity_helper_text: "",

      new_event_description: "",
      new_event_description_has_error: false,
      new_event_description_helper_text: "",

      new_event_image_selected_file: "",
      new_event_image_selected_file_content: "Choose Image",
    };

    this.setSliderItemToShow = this.setSliderItemToShow.bind(this);
    this.handleOnProfileImageInputChange = this.handleOnProfileImageInputChange.bind(
      this
    );
    this.handleOnDeleteProfileImageButtonClick = this.handleOnDeleteProfileImageButtonClick.bind(
      this
    );
    this.handleOnProfileImageUploadButtonClick = this.handleOnProfileImageUploadButtonClick.bind(
      this
    );
    this.handleOnUnfollowButtonClick = this.handleOnUnfollowButtonClick.bind(
      this
    );
    this.handleOnFollowButtonClick = this.handleOnFollowButtonClick.bind(this);
    this.handleOnUsernameTextFieldChange = this.handleOnUsernameTextFieldChange.bind(
      this
    );
    this.handleOnCafeNameTextFieldChange = this.handleOnCafeNameTextFieldChange.bind(
      this
    );
    this.handleOnFirstNameTextFieldChange = this.handleOnFirstNameTextFieldChange.bind(
      this
    );
    this.handleOnLastNameTextFieldChange = this.handleOnLastNameTextFieldChange.bind(
      this
    );
    this.handleOnEmailTextFieldChange = this.handleOnEmailTextFieldChange.bind(
      this
    );
    this.handleOnPhoneNumberTextFieldChange = this.handleOnPhoneNumberTextFieldChange.bind(
      this
    );
    this.handleOnSaveChangesButtonClick = this.handleOnSaveChangesButtonClick.bind(
      this
    );

    this.handleOnNewEventTitleTextFieldChange = this.handleOnNewEventTitleTextFieldChange.bind(
      this
    );
    this.handleOnNewEventTagsTextFieldChange = this.handleOnNewEventTagsTextFieldChange.bind(
      this
    );
    this.handleOnNewEventDatePickerChange = this.handleOnNewEventDatePickerChange.bind(
      this
    );
    this.handleOnNewEventTimePickerChange = this.handleOnNewEventTimePickerChange.bind(
      this
    );
    this.handleOnNewEventParticipantsNumberTextFieldChange = this.handleOnNewEventParticipantsNumberTextFieldChange.bind(
      this
    );
    this.handleOnNewEventDescriptionTextFieldChange = this.handleOnNewEventDescriptionTextFieldChange.bind(
      this
    );
    this.handleOnNewEventImageInputChange = this.handleOnNewEventImageInputChange.bind(
      this
    );
    this.handleReset = this.handleReset.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);

    window.addEventListener("resize", this.setSliderItemToShow);
  }

  componentDidMount() {
    this.setSliderItemToShow();
    //set is_owner
    this.setState({ is_owner: this.state.profile_id === Cookies.get("ID") });

    //get profile info
    axios
      .get("http://127.0.0.1:8000/users/" + this.state.profile_id, {
        headers: {
          Authorization: "TOKEN " + Cookies.get("TOKEN"),
        },
      })
      .then(
        function (response) {
          this.setState({
            is_regular: response.data.is_regular,

            username: response.data.username,
            edit_profile_username: response.data.username,

            email: response.data.email,
            edit_profile_email: response.data.email,

            phone_number: response.data.phone_number,
            edit_profile_phone_number: response.data.phone_number,
          });

          if (this.state.is_regular)
            this.setState({
              first_name: response.data.first_name,
              edit_profile_first_name: response.data.first_name,

              last_name: response.data.last_name,
              edit_profile_last_name: response.data.last_name,
            });
          else
            this.setState({
              cafe_name: response.data.cafe_name,
              edit_profile_cafe_name: response.data.cafe_name,
            });

          if (response.data.profile_image)
            this.setState({
              profile_image:
                "http://127.0.0.1:8000" + response.data.profile_image,
            });
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });

    //get following status
    axios
      .get("http://127.0.0.1:8000/users/" + Cookies.get("ID") + "/followings", {
        headers: {
          Authorization: "TOKEN " + Cookies.get("TOKEN"),
        },
      })
      .then(
        function (response) {
          var isFollowed = false;
          response.data.results.forEach((element) => {
            isFollowed = Number(this.state.profile_id) === element.followed.id;
          });
          this.setState({ is_followed: isFollowed });
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });

    //get events
    axios
      .get(
        "http://127.0.0.1:8000/users/" +
          this.state.profile_id +
          "/future-events"
      )
      .then(
        function (response) {
          this.setState({
            future_events: response.data,
            events_count: response.data.length,
          });
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(
        "http://127.0.0.1:8000/users/" + this.state.profile_id + "/past-events"
      )
      .then(
        function (response) {
          this.setState({
            previous_events: response.data,
            events_count: this.state.events_count + response.data.length,
          });
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });

    //get followers
    axios
      .get(
        "http://127.0.0.1:8000/users/" + this.state.profile_id + "/followers",
        {
          headers: {
            Authorization: "TOKEN " + Cookies.get("TOKEN"),
          },
        }
      )
      .then(
        function (response) {
          this.setState({
            followers: response.data.results,
            followers_count: response.data.count,
          });
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });

    //get followings
    axios
      .get(
        "http://127.0.0.1:8000/users/" + this.state.profile_id + "/followings",
        {
          headers: {
            Authorization: "TOKEN " + Cookies.get("TOKEN"),
          },
        }
      )
      .then(
        function (response) {
          this.setState({
            following: response.data.results,
            following_count: response.data.count,
          });
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div className='background'>
        <div className='container-md'>
          <div className='profile-header'>
            <div className='profile-header-container'>
              {this.state.is_owner ? (
                <div
                  className='profile-image-container own-profile'
                  data-toggle='modal'
                  data-target='#profileImageModal'>
                  <img
                    className='own-profile-image'
                    src={this.state.profile_image}
                    alt='Profile'
                  />
                  <p className='own-profile-text'>Edit Profile Image</p>
                </div>
              ) : (
                <div className='profile-image-container'>
                  <img src={this.state.profile_image} alt='Profile' />
                </div>
              )}
              <div className='profile-info-container'>
                <h3>{this.state.username}</h3>
                {this.state.is_regular ? (
                  <p>{this.state.first_name + " " + this.state.last_name}</p>
                ) : (
                  <p>{this.state.cafe_name}</p>
                )}

                <div className='profile-info-container-details'>
                  <div className='profile-info-container-column mr-3 mr-md-4'>
                    <p className='profile-info-container-details-number'>
                      {this.state.events_count}
                    </p>
                    <p className='profile-info-container-details-text'>
                      Events
                    </p>
                  </div>
                  <div className='profile-info-container-details-border' />
                  <div
                    className='profile-info-container-column ml-3 ml-md-4 mr-3 mr-md-4'
                    data-toggle='modal'
                    data-target='#followersModal'>
                    <p className='profile-info-container-details-number'>
                      {this.state.followers_count}
                    </p>
                    <p className='profile-info-container-details-text'>
                      Followers
                    </p>
                  </div>
                  <div className='profile-info-container-details-border' />
                  <div
                    className='profile-info-container-column ml-3 ml-md-4'
                    data-toggle='modal'
                    data-target='#followingModal'>
                    <p className='profile-info-container-details-number'>
                      {this.state.following_count}
                    </p>
                    <p className='profile-info-container-details-text'>
                      Following
                    </p>
                  </div>
                </div>
                {this.state.is_owner ? (
                  <button
                    className='btn btn-primary'
                    data-toggle='modal'
                    data-target='#editProfileModal'>
                    Edit
                  </button>
                ) : this.state.is_followed ? (
                  <button
                    className='btn btn-primary'
                    onClick={this.handleOnUnfollowButtonClick}>
                    Unfollow
                  </button>
                ) : (
                  <button
                    className='btn btn-primary'
                    onClick={this.handleOnFollowButtonClick}>
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>

          {this.state.is_regular ? (
            <>
              {/* <div className='profile-events-container'>
                <Slider
                  title='Events'
                  children={this.state.events.map((event) => (
                    <Event event={event} />
                  ))}
                  itemsCount={this.state.events.length}
                  itemsToShow={this.state.slider_items_to_show}
                  alert={"No Latest Event"}
                />
              </div> */}
            </>
          ) : (
            <>
              <div className='profile-events-container'>
                <Slider
                  title='Future Events'
                  children={this.state.future_events.map((event) => (
                    <Event event={event} />
                  ))}
                  itemsCount={this.state.future_events.length}
                  itemsToShow={this.state.slider_items_to_show}
                  buttonCondition={Cookies.get("ID") === this.state.profile_id}
                  buttonContent='New Event'
                  modalId='createNewEventModal'
                />
              </div>
              <Slider
                title='Previous Events'
                children={this.state.previous_events.map((event) => (
                  <Event event={event} />
                ))}
                itemsCount={this.state.previous_events.length}
                itemsToShow={this.state.slider_items_to_show}
              />
            </>
          )}

          {/* MODALS */}
          {/* PROFILE IMAGE MODAL */}
          <div
            class='modal fade'
            id='profileImageModal'
            tabindex='-1'
            role='dialog'>
            <div class='modal-dialog' role='document'>
              <div class='modal-content'>
                <div class='modal-header'>
                  <h5 class='modal-title' id='exampleModalLabel'>
                    Edit Profile Image
                  </h5>
                  <button
                    type='button'
                    class='close'
                    data-dismiss='modal'
                    aria-label='Close'>
                    <span aria-hidden='true'>&times;</span>
                  </button>
                </div>

                <div className='modal-content p-3'>
                  <div class='input-group'>
                    <div class='input-group-prepend'>
                      <span class='input-group-text'>Profile Image</span>
                    </div>
                    <div class='custom-file'>
                      <input
                        class='custom-file-input'
                        type='file'
                        accept='image/*'
                        onChange={this.handleOnProfileImageInputChange}
                      />
                      <label class='custom-file-label'>
                        {this.state.profile_image_selected_file_content}
                      </label>
                    </div>
                  </div>
                </div>

                <div class='modal-footer'>
                  <button
                    class='btn btn-primary'
                    data-dismiss='modal'
                    disabled={
                      DefaultUserProfileImage === this.state.profile_image
                    }
                    onClick={this.handleOnDeleteProfileImageButtonClick}>
                    Delete Current Image
                  </button>
                  <button
                    class='btn btn-primary'
                    data-dismiss='modal'
                    onClick={this.handleOnProfileImageUploadButtonClick}>
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* EDIT PROFILE MODAL */}
          <div
            class='modal fade'
            id='editProfileModal'
            tabindex='-1'
            role='dialog'>
            <div class='modal-dialog' role='document'>
              <div class='modal-content'>
                <div class='modal-header'>
                  <h5 class='modal-title' id='exampleModalLabel'>
                    Edit Profile
                  </h5>
                  <button
                    type='button'
                    class='close'
                    data-dismiss='modal'
                    aria-label='Close'>
                    <span aria-hidden='true'>&times;</span>
                  </button>
                </div>
                <div className='modal-body p-4'>
                  <TextField
                    className='w-100 mb-4'
                    label='Username'
                    required
                    value={this.state.edit_profile_username}
                    onChange={this.handleOnUsernameTextFieldChange}
                    error={this.state.edit_profile_username_has_error}
                    helperText={this.state.edit_profile_username_helper_text}
                  />
                  {this.state.is_regular ? (
                    <>
                      <TextField
                        className='w-100 mb-4'
                        label='First Name'
                        required
                        value={this.state.edit_profile_first_name}
                        onChange={this.handleOnFirstNameTextFieldChange}
                        error={this.state.edit_profile_first_name_has_error}
                        helperText={
                          this.state.edit_profile_first_name_helper_text
                        }
                      />
                      <TextField
                        className='w-100 mb-4'
                        label='Last Name'
                        required
                        value={this.state.edit_profile_last_name}
                        onChange={this.handleOnLastNameTextFieldChange}
                        error={this.state.edit_profile_last_name_has_error}
                        helperText={
                          this.state.edit_profile_last_name_helper_text
                        }
                      />
                    </>
                  ) : (
                    <TextField
                      className='w-100 mb-4'
                      label='Cafe Name'
                      required
                      value={this.state.edit_profile_cafe_name}
                      onChange={this.handleOnCafeNameTextFieldChange}
                      error={this.state.edit_profile_cafe_name_has_error}
                      helperText={this.state.edit_profile_cafe_name_helper_text}
                    />
                  )}
                  <TextField
                    className='w-100 mb-4'
                    label='Email'
                    required
                    value={this.state.edit_profile_email}
                    onChange={this.handleOnEmailTextFieldChange}
                    error={this.state.edit_profile_email_has_error}
                    helperText={this.state.edit_profile_cafe_name_helper_text}
                  />
                  <TextField
                    className='w-100'
                    label='Phone Number'
                    required
                    value={this.state.edit_profile_phone_number}
                    onChange={this.handleOnPhoneNumberTextFieldChange}
                    error={this.state.edit_profile_phone_number_has_error}
                    helperText={
                      this.state.edit_profile_phone_number_helper_text
                    }
                  />
                </div>
                <div class='modal-footer'>
                  <button
                    type='button'
                    class='btn btn-primary'
                    onClick={this.handleOnSaveChangesButtonClick}>
                    Save changes
                  </button>
                  <button
                    type='button'
                    class='btn btn-primary'
                    data-dismiss='modal'>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FOLLOWERS MODAL */}
          {0 < this.state.followers_count ? (
            <div
              class='modal fade'
              id='followersModal'
              tabindex='-1'
              role='dialog'>
              <div class='modal-dialog' role='document'>
                <div class='modal-content'>
                  <div class='modal-header'>
                    <h5 class='modal-title' id='exampleModalLabel'>
                      Followers
                    </h5>
                    <button
                      type='button'
                      class='close'
                      data-dismiss='modal'
                      aria-label='Close'>
                      <span aria-hidden='true'>&times;</span>
                    </button>
                  </div>
                  <div class='modal-body'>
                    <div className='profile-info-modal-container'>
                      {this.state.followers.map((element) =>
                        element.follower
                          ? this.getFollowersModalItems(element.follower)
                          : null
                      )}
                    </div>
                  </div>

                  <div class='modal-footer'>
                    <button
                      type='button'
                      class='btn btn-primary'
                      data-dismiss='modal'>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* FOLLOWING MODAL */}
          {0 < this.state.following_count ? (
            <div
              class='modal fade'
              id='followingModal'
              tabindex='-1'
              role='dialog'>
              <div class='modal-dialog' role='document'>
                <div class='modal-content'>
                  <div class='modal-header'>
                    <h5 class='modal-title' id='exampleModalLabel'>
                      Followings
                    </h5>
                    <button
                      type='button'
                      class='close'
                      data-dismiss='modal'
                      aria-label='Close'>
                      <span aria-hidden='true'>&times;</span>
                    </button>
                  </div>

                  <div class='modal-body'>
                    <div className='profile-info-modal-container'>
                      {this.state.following.map((element) =>
                        element.followed
                          ? this.getFollowingModalItems(element.followed)
                          : null
                      )}
                    </div>
                  </div>

                  <div class='modal-footer'>
                    <button
                      type='button'
                      class='btn btn-primary'
                      data-dismiss='modal'>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* New Event MODAL */}
          <div
            class='modal fade'
            id='createNewEventModal'
            tabindex='-1'
            role='dialog'>
            <div class='modal-dialog' role='document'>
              <div class='modal-content'>
                <div class='modal-header'>
                  <h5 class='modal-title' id='exampleModalLabel'>
                    Create New Event
                  </h5>
                  <button
                    type='button'
                    class='close'
                    data-dismiss='modal'
                    aria-label='Close'>
                    <span aria-hidden='true'>&times;</span>
                  </button>
                </div>

                <div class='modal-body p-4'>
                  {0 === this.state.active_step ? (
                    <div className='mb-4'>
                      <TextField
                        className='w-100 mb-2'
                        label='Title'
                        required
                        value={this.state.new_event_title}
                        onChange={this.handleOnNewEventTitleTextFieldChange}
                        error={this.state.new_event_title_has_error}
                        helperText={this.state.new_event_title_helper_text}
                      />
                      <Autocomplete
                        className='w-100 mb-2'
                        multiple
                        options={this.state.tags}
                        getOptionLabel={(option) => option.title}
                        defaultValue={this.state.new_event_tags}
                        onChange={(event, values) =>
                          this.handleOnNewEventTagsTextFieldChange(values)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            className='w-100'
                            label='Event tags'
                            placeholder='Tags'
                            required
                            error={this.state.new_event_tags_has_error}
                            helperText={this.state.new_event_tags_helper_text}
                          />
                        )}
                      />
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <div className='d-flex flex-row mb-2'>
                          <KeyboardDatePicker
                            className='mr-2'
                            margin='normal'
                            label='Event date'
                            format='MM/dd/yyyy'
                            value={this.state.new_event_date}
                            onChange={this.handleOnNewEventDatePickerChange}
                            error={this.state.new_event_date_has_error}
                            helperText={this.state.new_event_date_helper_text}
                          />
                          <KeyboardTimePicker
                            margin='normal'
                            label='Event time'
                            defaultValue={this.state.new_event_time}
                            value={this.state.new_event_time}
                            onChange={this.handleOnNewEventTimePickerChange}
                            error={this.state.new_event_time_has_error}
                            helperText={this.state.new_event_time_helper_text}
                          />
                        </div>
                      </MuiPickersUtilsProvider>
                      <TextField
                        className='w-100 mb-2'
                        label='Participants Number'
                        type='number'
                        required
                        value={this.state.new_event_capacity}
                        onChange={
                          this.handleOnNewEventParticipantsNumberTextFieldChange
                        }
                        error={this.state.new_event_capacity_has_error}
                        helperText={this.state.new_event_capacity_helper_text}
                      />
                      <TextField
                        className='w-100'
                        label='Description'
                        required
                        multiline
                        rows={6}
                        value={this.state.new_event_description}
                        onChange={
                          this.handleOnNewEventDescriptionTextFieldChange
                        }
                        error={this.state.new_event_description_has_error}
                        helperText={
                          this.state.new_event_description_helper_text
                        }
                      />
                    </div>
                  ) : null}

                  {1 === this.state.active_step ? (
                    <div className='mb-4'>
                      <TextField
                        type='file'
                        label='Description'
                        required></TextField>
                      <div class='input-group'>
                        <div class='input-group-prepend'>
                          <span class='input-group-text'>Event Image</span>
                        </div>
                        <div class='custom-file'>
                          <input
                            class='custom-file-input'
                            type='file'
                            accept='image/*'
                            onChange={this.handleOnNewEventImageInputChange}
                          />
                          <label class='custom-file-label'>
                            {this.state.new_event_image_selected_file_content}
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <Stepper
                    className='p-0'
                    activeStep={this.state.active_step}
                    alternativeLabel>
                    {this.state.steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </div>

                <div className='modal-footer'>
                  {this.state.steps.length === this.state.active_step ? (
                    <div>
                      <button
                        className='btn btn-primary mr-2'
                        data-dismiss='modal'>
                        Close
                      </button>
                      <button
                        className='btn btn-primary'
                        onClick={this.handleReset}>
                        Reset
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        className='btn btn-primary mr-2'
                        onClick={this.handleBack}
                        disabled={0 === this.state.active_step}>
                        Back
                      </button>
                      <button
                        className='btn btn-primary'
                        onClick={this.handleNext}>
                        {this.state.steps.length - 1 === this.state.active_step
                          ? "Finish"
                          : "Next"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  setSliderItemToShow() {
    if (960 <= window.innerWidth) this.setState({ slider_items_to_show: 3 });
    else if (576 <= window.innerWidth)
      this.setState({ slider_items_to_show: 2 });
    else this.setState({ slider_items_to_show: 1 });
  }

  getFollowingModalItems(user_info) {
    return (
      <div className='profile-info-modal-item'>
        <a href={"/profile/" + user_info.id}>
          <img
            src={user_info.profile_image || DefaultUserProfileImage}
            alt='profile'
          />
        </a>
        <div className='info'>
          <p>{user_info.username}</p>
          {user_info.cafe_name ? (
            <small>{user_info.cafe_name}</small>
          ) : (
            <small>{user_info.first_name + " " + user_info.last_name}</small>
          )}
        </div>
        <button
          class='btn btn-outline-danger'
          onClick={() =>
            this.handleOnFollowingModalItemUnFollowButtonClick(user_info.id)
          }>
          Unfollow
        </button>
      </div>
    );
  }

  getFollowersModalItems(user_info) {
    return (
      <div className='profile-info-modal-item'>
        <a href={"/profile/" + user_info.id}>
          <img
            src={user_info.profile_image || DefaultUserProfileImage}
            alt='profile'
          />
        </a>
        <div className='info'>
          <p>{user_info.username}</p>
          {user_info.cafe_name ? (
            <small>{user_info.cafe_name}</small>
          ) : (
            <small>{user_info.first_name + " " + user_info.last_name}</small>
          )}
        </div>
        <button
          class='btn btn-outline-danger'
          onClick={() =>
            this.handleOnFollowersModalItemRemoveButtonClick(user_info.id)
          }>
          Remove
        </button>
      </div>
    );
  }

  handleOnFollowingModalItemUnFollowButtonClick(id) {
    axios
      .delete(
        "http://127.0.0.1:8000/users/" +
          this.state.profile_id +
          "/following/" +
          id,
        {
          headers: {
            Authorization: "Token " + Cookies.get("TOKEN"),
          },
        }
      )
      .then(function (response) {
        console.log(response);
      });
  }
  handleOnFollowersModalItemRemoveButtonClick(id) {
    axios
      .delete(
        "http://127.0.0.1:8000/users/" +
          this.state.profile_id +
          "/followers/" +
          id,
        {
          headers: {
            Authorization: "Token " + Cookies.get("TOKEN"),
          },
        }
      )
      .then(function (response) {
        console.log(response);
      });
  }

  handleOnProfileImageInputChange(e) {
    this.setState({
      profile_image_selected_file: e.target.files[0],
      profile_image_selected_file_content: e.target.files[0].name,
    });
  }

  handleOnDeleteProfileImageButtonClick() {
    axios
      .put(
        "http://127.0.0.1:8000/users/" + this.state.profile_id,
        {
          profile_image: null,
        },
        {
          headers: {
            Authorization: "TOKEN " + Cookies.get("TOKEN"),
          },
        }
      )
      .then(
        function (response) {
          this.setState({ profile_image: DefaultUserProfileImage });
        }.bind(this)
      );
  }

  handleOnProfileImageUploadButtonClick() {
    var formData = new FormData();
    formData.append("profile_image", this.state.profile_image_selected_file);
    axios
      .put("http://127.0.0.1:8000/users/" + this.state.profile_id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "TOKEN " + Cookies.get("TOKEN"),
        },
      })
      .then(
        function (response) {
          this.setState({
            profile_image:
              "http://127.0.0.1:8000/media/" +
              this.state.profile_image_selected_file_content,
          });
        }.bind(this)
      );
  }

  handleOnFollowButtonClick() {
    axios
      .post(
        "http://127.0.0.1:8000/users/" + Cookies.get("ID") + "/following",
        {
          cafe: this.state.profile_id,
        },
        {
          headers: {
            Authorization: "Token " + Cookies.get("TOKEN"),
          },
        }
      )
      .then(function (response) {
        console.log(response);
      });

    this.setState({ is_followed: true });
  }

  handleOnUnfollowButtonClick() {
    axios
      .delete(
        "http://127.0.0.1:8000/users/" +
          Cookies.get("ID") +
          "/following/" +
          this.state.profile_id,
        {
          headers: {
            Authorization: "Token " + Cookies.get("TOKEN"),
          },
        }
      )
      .then(function (response) {
        console.log(response);
      });

    this.setState({ is_followed: false });
  }

  handleOnUsernameTextFieldChange(e) {
    this.setState({
      edit_profile_username: e.target.value,
      edit_profile_username_has_error: false,
    });
  }
  handleOnCafeNameTextFieldChange(e) {
    this.setState({
      edit_profile_cafe_name: e.target.value,
      edit_profile_cafe_name_has_error: false,
    });
  }
  handleOnFirstNameTextFieldChange(e) {
    this.setState({
      edit_profile_first_name: e.target.value,
      edit_profile_cafe_name_has_error: false,
    });
  }
  handleOnLastNameTextFieldChange(e) {
    this.setState({
      edit_profile_last_name: e.target.value,
      edit_profile_last_name_has_error: false,
    });
  }
  handleOnEmailTextFieldChange(e) {
    this.setState({
      edit_profile_email: e.target.value,
      edit_profile_email_has_error: false,
    });
  }
  handleOnPhoneNumberTextFieldChange(e) {
    this.setState({
      edit_profile_phone_number: e.target.value,
      edit_profile_phone_number_has_error: false,
    });
  }
  handleOnSaveChangesButtonClick() {
    axios
      .put(
        "http://127.0.0.1:8000/users/" + this.state.profile_id,
        {
          username: this.state.edit_profile_username,
          cafe_name: this.state.edit_profile_cafe_name,
          first_name: this.state.edit_profile_first_name,
          last_name: this.state.edit_profile_last_name,
          email: this.state.edit_profile_email,
          phone_number: this.state.edit_profile_phone_number,
        },
        {
          headers: {
            Authorization: "TOKEN " + Cookies.get("TOKEN"),
          },
        }
      )
      .then(function (response) {
        console.log(response);
      });
  }

  handleOnNewEventTitleTextFieldChange(e) {
    this.setState({
      new_event_title: e.target.value,
      new_event_title_has_error: false,
    });
  }
  handleOnNewEventTagsTextFieldChange(values) {
    this.setState({ new_event_tags: values, new_event_tags_has_error: false });
  }
  handleOnNewEventDatePickerChange(date) {
    this.setState({ new_event_date: date, new_event_date_has_error: false });
  }
  handleOnNewEventTimePickerChange(time) {
    this.setState({ new_event_time: time, new_event_time_has_error: false });
  }
  handleOnNewEventParticipantsNumberTextFieldChange(e) {
    this.setState({
      new_event_capacity: e.target.value,
      new_event_capacity_has_error: false,
    });
  }
  handleOnNewEventDescriptionTextFieldChange(e) {
    this.setState({
      new_event_description: e.target.value,
      new_event_description_has_error: false,
    });
  }

  handleOnNewEventImageInputChange(e) {
    this.setState({
      new_event_image_selected_file: e.target.files[0],
      new_event_image_selected_file_content: e.target.files[0].name,
    });
  }

  handleReset() {
    this.setState({
      active_step: 0,
      new_event_title: "",
      new_event_title_helper_text: null,
      new_event_tags: [],
      new_event_tags_helper_text: null,
      new_event_date: "",
      new_event_date_helper_text: null,
      new_event_time: "",
      new_event_time_helper_text: null,
      new_event_capacity: "",
      new_event_capacity_helper_text: null,
      new_event_description: "",
      new_event_description_helper_text: null,
      new_event_image_selected_file: "",
      new_event_image_selected_file_content: "",
    });
  }

  handleNext() {
    if (0 === this.state.active_step) {
      if ("" === this.state.new_event_title)
        this.setState({
          new_event_title_has_error: true,
          new_event_title_helper_text: "Please fill out title field.",
        });

      if (0 === this.state.new_event_tags.length) {
        this.setState({
          new_event_tags_has_error: true,
          new_event_tags_helper_text: "Please fill out tags field.",
        });
      }

      if ("" === this.state.new_event_date)
        this.setState({
          new_event_date_has_error: true,
          new_event_date_helper_text: "Please pick a date.",
        });

      if ("" === this.state.new_event_time)
        this.setState({
          new_event_time_has_error: true,
          new_event_time_helper_text: "Please pick a time.",
        });

      if ("" === this.state.new_event_capacity)
        this.setState({
          new_event_capacity_has_error: true,
          new_event_capacity_helper_text: "Please fill out capacity field.",
        });

      if ("" === this.state.new_event_description)
        this.setState({
          new_event_description_has_error: true,
          new_event_description_helper_text:
            "Please fill out description field.",
        });

      if (
        "" !== this.state.new_event_title &&
        "" !== this.state.new_event_tags &&
        "" !== this.state.new_event_date &&
        "" !== this.state.new_event_time &&
        "" !== this.state.new_event_capacity &&
        "" !== this.state.new_event_description
      ) {
        this.setState({ active_step: this.state.active_step + 1 });
      }
    }

    if (1 === this.state.active_step) {
      var formData = new FormData();
      formData.append("image", this.state.new_event_image_selected_file);
      formData.append("title", this.state.new_event_title);
      formData.append("description", this.state.new_event_description);
      formData.append(
        "start_time",
        moment(this.state.new_event_date).format("YYYY-MM-DD") +
          "T" +
          moment(this.state.new_event_time).format("hh:mm:ss")
      );
      formData.append("capacity", this.state.new_event_capacity);
      formData.append("tags", "movie_review$book_review");
      formData.append("user", this.state.profile_id);
      axios
        .post("http://127.0.0.1:8000/event", formData, {
          headers: {
            Authorization: "Token " + Cookies.get("TOKEN"),
          },
        })
        .then(function (response) {
          console.log(response);
        });
    }

    this.setState({ active_step: this.state.active_step + 1 });
  }

  handleBack() {
    this.setState({ active_step: this.state.active_step - 1 });
  }
}

export default Profile;
