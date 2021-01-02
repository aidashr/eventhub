import { Component } from "react";
import axios from "axios";
import Rating from "@material-ui/lab/Rating";
import Cafe from "./../components/Cafe";
import "./Search.css";
import "./../App.css";

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active_type: 3,
      active_tag: 63,
      cafes: [],
      events: [],
    };
  }

  componentDidMount() {
    var queryParameters = new URLSearchParams(this.props.location.search);
    var input = queryParameters.get("input");

    axios
      .get("http://127.0.0.1:8000/cafe/search", {
        params: {
          page: 1,
          search: input,
        },
      })
      .then(
        function (response) {
          this.setState({ cafes: response.data.results });
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {});

    axios
      .get("http://127.0.0.1:8000/event/search", {
        params: {
          page: 1,
          search: input,
        },
      })
      .then(
        function (response) {
          this.setState({ events: response.data.results });
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {});
  }

  render() {
    return (
      <div className='background'>
        <div className='container-md'>
          <div className='main-container'>
            <div className='filter-container'>
              <div className='filter-content'>
                <h5>Result Type</h5>
                <div class='form-check ml-4'>
                  <input
                    class='form-check-input'
                    type='checkbox'
                    checked={1 === (this.state.active_type & 1)}
                    onClick={() =>
                      this.setState({ active_type: this.state.active_type ^ 1 })
                    }
                  />
                  <label class='form-check-label'>Cafe</label>
                </div>
                <div class='form-check ml-4'>
                  <input
                    class='form-check-input'
                    type='checkbox'
                    checked={2 === (this.state.active_type & 2)}
                    onClick={() =>
                      this.setState({ active_type: this.state.active_type ^ 2 })
                    }
                  />
                  <label class='form-check-label'>Event</label>
                </div>
              </div>

              {2 === (this.state.active_type & 2) ? (
                <div className='filter-content'>
                  <h5 className='mb-2'>Events</h5>
                  <div className='mb-2'>
                    <h6 className='mb-1'>Time</h6>
                  </div>
                  <div className='mb-2'>
                    <h6 className='mb-1'>Price</h6>
                  </div>
                  <div className='mb-2'>
                    <h6>Category</h6>
                    <div class='form-check ml-4'>
                      <input
                        class='form-check-input'
                        type='checkbox'
                        checked={1 === (this.state.active_tag & 1)}
                        onClick={() =>
                          this.setState({
                            active_tag: this.state.active_tag ^ 1,
                          })
                        }
                      />
                      <label class='form-check-label'>book review</label>
                    </div>
                    <div class='form-check ml-4'>
                      <input
                        class='form-check-input'
                        type='checkbox'
                        checked={2 === (this.state.active_tag & 2)}
                        onClick={() =>
                          this.setState({
                            active_tag: this.state.active_tag ^ 2,
                          })
                        }
                      />
                      <label class='form-check-label'>movie review</label>
                    </div>
                    <div class='form-check ml-4'>
                      <input
                        class='form-check-input'
                        type='checkbox'
                        checked={4 === (this.state.active_tag & 4)}
                        onClick={() =>
                          this.setState({
                            active_tag: this.state.active_tag ^ 4,
                          })
                        }
                      />
                      <label class='form-check-label'>game</label>
                    </div>
                    <div class='form-check ml-4'>
                      <input
                        class='form-check-input'
                        type='checkbox'
                        checked={8 === (this.state.active_tag & 8)}
                        onClick={() =>
                          this.setState({
                            active_tag: this.state.active_tag ^ 8,
                          })
                        }
                      />
                      <label class='form-check-label'>board game</label>
                    </div>
                    <div class='form-check ml-4'>
                      <input
                        class='form-check-input'
                        type='checkbox'
                        checked={16 === (this.state.active_tag & 16)}
                        onClick={() =>
                          this.setState({
                            active_tag: this.state.active_tag ^ 16,
                          })
                        }
                      />
                      <label class='form-check-label'>video game</label>
                    </div>
                    <div class='form-check ml-4'>
                      <input
                        class='form-check-input'
                        type='checkbox'
                        checked={32 === (this.state.active_tag & 32)}
                        onClick={() =>
                          this.setState({
                            active_tag: this.state.active_tag ^ 32,
                          })
                        }
                      />
                      <label class='form-check-label'>sports events</label>
                    </div>
                  </div>
                  <div className='d-flex flex-row'>
                    <h6 className='mb-0'>rate</h6>
                    <Rating className='ml-2' value={1} />
                  </div>
                </div>
              ) : null}
            </div>
            <div className='result-container'>
              <div className='d-flex flex-row align-items-center border-bottom p-2'>
                <small className='font-weight-bold mr-2'>Sort By</small>
                <button className='btn btn-light btn-sm mr-2'>popular</button>
                <button className='btn btn-light btn-sm mr-2'>comments</button>
                <button className='btn btn-light btn-sm mr-2'>time</button>
              </div>
              <div className='p-2'>
                {1 === (this.state.active_type & 1) ? (
                  <div>
                    {this.state.cafes.map((cafe) => (
                      <div className='mb-2'>{this.getCafe(cafe)}</div>
                    ))}
                  </div>
                ) : null}
                {2 === (this.state.active_type & 2) ? (
                  <div>
                    {this.state.events.map((event) => (
                      <div className='mb-2'>{this.getEvent(event)}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getEvent(event) {
    console.log(event);
    return (
      <div style={{ borderRadius: "8px", border: "1px solid gray" }}>
        <div className='row no-gutters bg-light p-2 align-items-center'>
          <a href={"/profile/" + event.user.id}>
            <img
              className='shadow-lg border border-secondary rounded-circle mr-2'
              src={event.user.profile_image}
              width={48}
              height={48}
              alt='profile'
            />
          </a>
          <a
            href={"/profile/" + event.user.id}
            className='text-decoration-none text-body font-weight-bold'>
            {event.user.username}
          </a>
        </div>

        {event.image ? (
          <div className='row no-gutters w-100'>
            <img className='d-block w-100' src={event.image} alt='event' />
          </div>
        ) : null}

        <div className='row no-gutters bg-light p-2'>
          <div className='col w-100'>
            <div
              className='row no-gutters'
              data-toggle='tooltip'
              data-placement='top'
              title={"start at " + event.start_time}>
              <h5>{event.title}</h5>
            </div>
            <div className='row no-gutters'>{event.description}</div>
          </div>
        </div>
      </div>
    );
  }

  getCafe(cafe) {
    return (
      <div className='bg-light'>
        <div className='col w-100 border p-2 border-secondary rounded'>
          <div className='row no-gutters align-items-center'>
            <a href={"/profile/" + cafe.id}>
              <img
                className='border border-secondary rounded-circle mr-2'
                src={cafe.profile_image}
                width={64}
                height={64}
              />
            </a>
            <a href={"/profile/" + cafe.id}>
              <div className='font-weight-bold'>{cafe.username}</div>
            </a>
          </div>

          <div className='row no-gutters'></div>
        </div>
      </div>
    );
  }
}

export default Search;
