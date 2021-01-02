import React, { Component } from "react";

export class Cafe extends Component {
  render() {
    console.log(this.props.cafe);
    return (
      <div className='bg-light'>
        <div className='col w-100 border p-2 border-secondary rounded'>
          <div className='row no-gutters align-items-center'>
            <img
              className='border border-secondary rounded-circle mr-2'
              src={"http://127.0.0.1:8000" + this.props.cafe.profile_image}
              width={64}
              height={64}
            />
            <div className='font-weight-bold'>{this.props.cafe.username}</div>
          </div>

          <div className='row no-gutters'></div>
        </div>
      </div>
    );
  }
}

export default Cafe;
