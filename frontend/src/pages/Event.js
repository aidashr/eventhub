import { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import TextField from "@material-ui/core/TextField";
import Rating from "@material-ui/lab/Rating";
import Icon from "@material-ui/core/Icon";
import "./Event.css";
import "./../App.css";
import DefaultUserProfileImage from "./../images/user.jpg";

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      title: "TITLE",
      avg_rate: 4.5,
      owner_id: 0,
      owner: "OWNER",
      description: "DESCRIPTION",
      is_description_completely_loaded: 0,
      capacity: 10,
      is_joined: true,
      start_at: "DATE",
      image: "IMAGE",
      participants: [],

      new_comment_field_content: null,
      comments: [],
    };

    this.handleOnMoreHyperlinkOfDescriptionClick = this.handleOnMoreLessHyperlinkOfDescriptionClick.bind(
      this
    );
    this.handleOnMoreHyperlinkOfCommentsClick = this.handleOnMoreLessHyperlinkOfCommentsClick.bind(
      this
    );
    this.haneleOnCommentFieldContentChange = this.haneleOnCommentFieldContentChange.bind(
      this
    );
    this.handleOnSendCommentButtonClick = this.handleOnSendCommentButtonClick.bind(
      this
    );
    this.handleOnHeartIconClick = this.handleOnHeartIconClick.bind(this);
  }

  componentDidMount() {
    //get event details
    axios
      .get("http://127.0.0.1:8000/event/" + this.state.id)
      .then(
        function (response) {
          this.setState({
            title: response.data.title,
            owner: response.data.user.username,
            description: response.data.description,
            image: response.data.image,
            is_description_completely_loaded:
              response.data.description.split(" ").length < 60 ? 0 : 1,
            start_at: response.data.start_time.split("T").join(" "),
          });
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });

    // get participants
    axios
      .get("http://127.0.0.1:8000/event/" + this.state.id + "/participate")
      .then(
        function (response) {
          var isPraticipate = false;
          response.data.forEach((element) => {
            console.log(element);
            isPraticipate |= Cookies.get("ID") === element.id;
          });

          this.setState({
            participants: response.data,
            is_joined: isPraticipate,
          });
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });

    //get comments
    axios
      .get("http://127.0.0.1:8000/event/" + this.state.id + "/comment")
      .then(
        function (response) {
          console.log(response);

          var isPraticipate = false;
          response.data.forEach((element) => {});

          this.setState({
            comments: response.data,
          });
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    console.log(this.state);

    return (
      <div className='background'>
        <div className='container-md'>
          <div className='event-details'>
            <img
              className='event-details-image'
              src={"http://127.0.0.1:8000" + this.state.image}
              alt='event'
            />
            <div className='event-details-content'>
              <div className='d-flex flex-row align-items-center'>
                <h3 className='m-0'>{this.state.title}</h3>
                <i class='fas fa-star fa-lg ml-2' style={{ color: "gold" }}></i>
                <p className='m-0 ml-1'>{this.state.avg_rate}</p>
                <p className='m-0 ml-auto'>{this.state.start_at}</p>
              </div>
              <h6>
                {"By "}
                <a href={"/profile/" + this.state.owner_id}>
                  {this.state.owner}
                </a>
              </h6>
              {this.state.is_joined ? <Rating value={2} /> : null}
              <small className='mb-2'>
                {1 === this.state.is_description_completely_loaded
                  ? this.state.description
                  : this.state.description.split(" ").slice(0, 60).join(" ")}
                {1 === this.state.is_description_completely_loaded ? (
                  <a
                    className='ml-1'
                    onClick={() =>
                      this.handleOnMoreLessHyperlinkOfDescriptionClick()
                    }>
                    {3 === this.state.is_description_completely_loaded
                      ? "Less"
                      : "More"}
                  </a>
                ) : null}
              </small>
              <div className='event-details-members-container'>
                <h5>Members</h5>
                <div className='d-flex flex-row'>
                  {this.state.participants
                    .filter((participant) => participant.user)
                    .slice(0, 3)
                    .map((participant) => (
                      <img
                        className='event-details-members-profile-image'
                        src={
                          "http://127.0.0.1:8000" +
                          participant.user.profile_image
                        }
                        alt='profile'
                      />
                    ))}
                  {3 < this.state.participants.length ? (
                    <a
                      className='event-details-members-others-profile-images unselectable'
                      data-toggle='modal'
                      data-target='#otherParticipantsModal'>
                      Others
                    </a>
                  ) : null}
                </div>
              </div>
              <div className='button-container'>
                {0 === this.state.capacity ? (
                  <button className='button btn btn-primary mr-2'>
                    Want to Join
                    <i class='fas fa-heart ml-2' style={{ color: "white" }}></i>
                  </button>
                ) : null}
                {!this.state.is_joined ? (
                  <button
                    className='button btn btn-primary'
                    id='#leftCapacitTooltip'
                    data-toggle='tooltip'
                    data-placement='top'
                    title={"left " + this.state.capacity}
                    onClick={() => this.handleOnJoinLeaveButtonClick()}
                    disabled={0 === this.state.capacity}>
                    Join
                    <i class='fas fa-plus ml-2' style={{ color: "white" }}></i>
                  </button>
                ) : null}
                {this.state.is_joined ? (
                  <button
                    className='button btn btn-danger'
                    onClick={() => this.handleOnJoinLeaveButtonClick()}>
                    Leave
                    <i class='fas fa-minus ml-2' style={{ color: "white" }}></i>
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className='event-comments'>
            <h5 className='mb-4'>Comments</h5>
            <div className='new-comment'>
              <img
                className='profile-image'
                src={DefaultUserProfileImage}
                alt='profile'
              />
              <div className='new-comment-form'>
                <TextField
                  className='w-100'
                  label='Comment'
                  variant='outlined'
                  size='small'
                  multiline
                  rowsMax={4}
                  onChange={this.haneleOnCommentFieldContentChange}
                  error={"" === this.state.new_comment_field_content}
                  helperText={
                    "" === this.state.new_comment_field_content
                      ? "Please fill out this field."
                      : null
                  }
                />
                <button
                  class='button btn btn-primary d-flex flex-row justify-content-center align-items-center ml-2'
                  onClick={this.handleOnSendCommentButtonClick}>
                  Send
                  <Icon className='ml-2'>send</Icon>
                </button>
              </div>
            </div>
            {this.state.comments.map((comment, index) => (
              <div className='comment'>
                <div className='d-flex flex-column align-items-center '>
                  <a href={"/profile/" + comment.user.id}>
                    <img
                      className='profile-image'
                      src={"http://127.0.0.1:8000" + comment.user.profile_image}
                      alt='profile'
                    />
                  </a>
                  <div className='d-flex flex-row align-items-center mt-2'>
                    {0 === comment.is_liked ? (
                      <i
                        class='far fa-heart fa-lg'
                        onClick={() => this.handleOnHeartIconClick(index)}></i>
                    ) : (
                      <i
                        class='fas fa-heart fa-lg'
                        style={{ color: "red" }}
                        onClick={() => this.handleOnHeartIconClick(index)}></i>
                    )}
                    <div className='font-weight-bold ml-2'>
                      {comment.like_count}
                    </div>
                  </div>
                </div>
                <div className='comment-content'>
                  <a className='username' href={"/profile/" + comment.user.id}>
                    {comment.user.username}
                  </a>
                  <p>
                    {comment.content}
                    {/* {1 === comment.is_content_completely_loaded ? (
                      <>
                        <a
                          className='ml-1'
                          onClick={() =>
                            this.handleOnMoreLessHyperlinkOfCommentsClick(index)
                          }>
                          Less
                        </a>
                      </>
                    ) : (
                      <>
                        {comment.content.split(" ").slice(0, 60).join(" ")}
                        <a
                          className='ml-1'
                          onClick={() =>
                            this.handleOnMoreLessHyperlinkOfCommentsClick(index)
                          }>
                          more
                        </a>
                      </>
                    )} */}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* MODAL */}
          {/* Other Praticipants Modal */}
          <div
            class='modal fade'
            id='otherParticipantsModal'
            tabindex='-1'
            aria-labelledby='exampleModalLabel'
            aria-hidden='true'>
            <div class='modal-dialog'>
              <div class='modal-content'>
                <div class='modal-header'>
                  <h5 class='modal-title' id='staticBackdropLabel'>
                    All Participants
                  </h5>
                  <button class='close' data-dismiss='modal' aria-label='Close'>
                    <span aria-hidden='true'>&times;</span>
                  </button>
                </div>
                <div class='modal-body'>
                  {this.state.participants.map((participant) =>
                    participant.user
                      ? this.getParticipantsModalItems(participant.user)
                      : null
                  )}
                </div>
                <div class='modal-footer'>
                  <button class='btn btn-primary' data-dismiss='modal'>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getParticipantsModalItems(user_info) {
    console.log(user_info);
    return (
      <div className='d-flex flex-row align-items-center bg-white shadow-sm rounded-lg border p-2 mb-2 w-100'>
        <a href={"/profile/" + user_info.id}>
          <img
            className='profile-image'
            src={"http://127.0.0.1:8000" + user_info.profile_image}
            alt='profile'
          />
        </a>
        <div className='d-flex flex-column ml-2'>
          <a
            className='text-body text-decoration-none font-weight-bold'
            href={"/profile/" + user_info.id}>
            {user_info.username}
          </a>
          <small className='m-0 text-secondary'>
            {user_info.first_name + " " + user_info.last_name}
          </small>
        </div>
        {user_info.is_followed ? (
          <button
            class='button btn btn-outline-danger ml-auto'
            onClick={this.handleOnFollowButtonClick}>
            Unfollow
          </button>
        ) : (
          <button
            class='button btn btn-outline-primary ml-auto'
            onClick={this.handleOnFollowButtonClick}>
            Follow
          </button>
        )}
      </div>
    );
  }

  handleOnMoreLessHyperlinkOfDescriptionClick() {
    this.setState({
      is_description_completely_loaded:
        this.state.is_description_completely_loaded ^ 2,
    });
  }

  handleOnJoinLeaveButtonClick() {
    this.setState({ is_joined: !this.state.is_joined });

    if (this.state.is_joined) {
      axios
        .post(
          "http://127.0.0.1:8000/event/" + this.state.id + "/participate",
          { user: Cookies.get("ID") },
          {
            headers: {
              Authorization: "TOKEN " + Cookies.get("TOKEN"),
            },
          }
        )
        .then(function (response) {})
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios
        .delete(
          "http://127.0.0.1:8000/event/" +
            this.state.id +
            "/participate/" +
            Cookies.get("ID"),
          {
            headers: {
              Authorization: "TOKEN " + Cookies.get("TOKEN"),
            },
          }
        )
        .then(function (response) {})
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  haneleOnCommentFieldContentChange(e) {
    if (e.target.value)
      this.setState({ new_comment_field_content: e.target.value });
    else this.setState({ new_comment_field_content: null });
  }

  handleOnSendCommentButtonClick(e) {
    if (null === this.state.new_comment_field_content)
      this.setState({ new_comment_field_content: "" });
    else {
      axios
        .post(
          "http://127.0.0.1:8000/event/" + this.state.id + "/comment",
          { comment: this.state.new_comment_field_content },
          {
            headers: {
              Authorization: "TOKEN " + Cookies.get("TOKEN"),
            },
          }
        )
        .then(function (response) {})
        .catch(function (error) {
          console.log(error);
        });

      this.setState({ new_comment_field_content: null });
    }
  }

  handleOnHeartIconClick(index) {
    this.setState((state) => {
      const comments = state.comments.map((comment, i) => {
        if (i === index) {
          const newComment = {
            id: comment.id,
            content: comment.content,
            like_count: comment.like_count,
            is_liked: comment.is_liked ^ 1,
            is_content_completely_loaded: comment.is_content_completely_loaded,
            user: comment.user,
          };
          return newComment;
        } else {
          return comment;
        }
      });

      return { comments };
    });
  }

  handleOnMoreLessHyperlinkOfCommentsClick(index) {
    this.setState((state) => {
      const comments = state.comments.map((comment, i) => {
        if (i === index) {
          const newComment = {
            id: comment.id,
            content: comment.content,
            like_count: comment.like_count,
            is_liked: comment.is_liked,
            is_content_completely_loaded:
              comment.is_content_completely_loaded ^ 2,
            user: comment.user,
          };
          return newComment;
        } else {
          return comment;
        }
      });

      return { comments };
    });
  }
}

export default Event;
