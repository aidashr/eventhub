import React, { Component } from 'react'
import PorpsType from 'prop-types'

export class Event extends Component {
    render() {
        return (
            <div className="col-12 col-md-6 col-lg-4 pr-2">
                <div className="row no-gutters">
                    <div className="col w-100 border border-secondary rounded">
                        <div className="row no-gutters bg-light p-2 align-items-center">
                            <img className="border border-secondary rounded-circle p-1 mr-2" src={this.props.event.user.image} width={48} height={48} alt="..." />
                            <div className="font-weight-bold">{this.props.event.user.user_name}</div>
                        </div>

                        <div className="row no-gutters">
                            <div id={'imagesCarouselControls' + this.props.event.id} class="carousel slide" data-ride="carousel" data-interval="false">
                                <ol class="carousel-indicators">
                                    <li data-target={'#imagesCarouselControls' + this.props.event.id} data-slide-to="0" class="active"></li>
                                    <li data-target={'#imagesCarouselControls' + this.props.event.id} data-slide-to="1"></li>
                                    <li data-target={'#imagesCarouselControls' + this.props.event.id} data-slide-to="2"></li>
                                </ol>
                                <div class="carousel-inner">
                                    <div class="carousel-item active"><img className="d-block w-100" src={this.props.event.image} alt="..." /></div>
                                    <div class="carousel-item"><img className="d-block w-100" src={this.props.event.image} alt="..." /></div>
                                    <div class="carousel-item"><img className="d-block w-100" src={this.props.event.image} alt="..." /></div>
                                </div>
                                <a class="carousel-control-prev" href={'#imagesCarouselControls' + this.props.event.id} role="button" data-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Previous</span>
                                </a>
                                <a class="carousel-control-next" href={'#imagesCarouselControls' + this.props.event.id} role="button" data-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Next</span>
                                </a>
                            </div>
                        </div>

                        <div className="row no-gutters bg-light p-2">
                            <div className="col w-100">
                                <div className="row no-gutters" data-toggle="tooltip" data-placement="top" title={'start at ' + this.props.event.start_time}><h5>{this.props.event.title}</h5></div>
                                <div className="row no-gutters">{this.props.event.description}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Event.PorpsType = {
    event: PorpsType.object.isRequired
}

export default Event
