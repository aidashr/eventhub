import React, { Component } from "react";
import PorpsType from "prop-types";

export class Event extends Component {
  render() {
    return (
      <div style={{ borderRadius: "8px", border: "1px solid gray" }}>
        <div className='row no-gutters bg-light p-2 align-items-center'>
          <a href={"/profile/" + this.props.event.user.id}>
            <img
              className='shadow-lg border border-secondary rounded-circle mr-2'
              src={
                "http://127.0.0.1:8000" + this.props.event.user.profile_image
              }
              width={48}
              height={48}
              alt='profile'
            />
          </a>
          <a
            href={"/profile/" + this.props.event.user.id}
            className='text-decoration-none text-body font-weight-bold'>
            {this.props.event.user.username}
          </a>
        </div>

        {this.props.event.image ? (
          <div className='row no-gutters w-100'>
            <img
              className='d-block w-100'
              src={"http://127.0.0.1:8000" + this.props.event.image}
              alt='event'
            />
          </div>
        ) : null}

        <div className='row no-gutters bg-light p-2'>
          <div className='col w-100'>
            <div
              className='row no-gutters'
              data-toggle='tooltip'
              data-placement='top'
              title={"start at " + this.props.event.start_time}>
              <h5>{this.props.event.title}</h5>
            </div>
            <div className='row no-gutters'>{this.props.event.description}</div>
          </div>
        </div>
      </div>
    );
  }
}

Event.PorpsType = {
  event: PorpsType.object.isRequired,
};

export default Event;
