import React, { Component } from 'react'
import Event from "./Event"
import axios from 'axios'

export class Events extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [
                {
                    id: 1,
                    title: 'new event',
                    description: 'description',
                    start_time: '2020/10/23 18:00',
                    image: 'https://nas-national-prod.s3.amazonaws.com/styles/hero_image/s3/sfw_15586958314_eabee7f9c4_o.jpg?itok=4qWlyGTr',
                    user:
                    {
                        image: 'https://c402277.ssl.cf1.rackcdn.com/photos/10596/images/carousel_small/RAWP2115_mini.jpg?1451407554',
                        user_name: 'sahand'
                    }
                },
                {
                    id: 2,
                    title: 'new event',
                    description: 'description',
                    start_time: '2020/10/23 18:00',
                    image: 'https://nas-national-prod.s3.amazonaws.com/styles/hero_image/s3/sfw_15586958314_eabee7f9c4_o.jpg?itok=4qWlyGTr',
                    user:
                    {
                        image: 'https://c402277.ssl.cf1.rackcdn.com/photos/10596/images/carousel_small/RAWP2115_mini.jpg?1451407554',
                        user_name: 'sahand'
                    }
                },
                {
                    id: 3,
                    title: 'new event',
                    description: 'description',
                    start_time: '2020/10/23 18:00',
                    image: 'https://nas-national-prod.s3.amazonaws.com/styles/hero_image/s3/sfw_15586958314_eabee7f9c4_o.jpg?itok=4qWlyGTr',
                    user:
                    {
                        image: 'https://c402277.ssl.cf1.rackcdn.com/photos/10596/images/carousel_small/RAWP2115_mini.jpg?1451407554',
                        user_name: 'sahand'
                    }
                },
                {
                    id: 4,
                    title: 'new event',
                    description: 'description',
                    start_time: '2020/10/23 18:00',
                    image: 'https://nas-national-prod.s3.amazonaws.com/styles/hero_image/s3/sfw_15586958314_eabee7f9c4_o.jpg?itok=4qWlyGTr',
                    user:
                    {
                        image: 'https://c402277.ssl.cf1.rackcdn.com/photos/10596/images/carousel_small/RAWP2115_mini.jpg?1451407554',
                        user_name: 'sahand'
                    }
                },
                {
                    id: 5,
                    title: 'new event',
                    description: 'description',
                    start_time: '2020/10/23 18:00',
                    image: 'https://nas-national-prod.s3.amazonaws.com/styles/hero_image/s3/sfw_15586958314_eabee7f9c4_o.jpg?itok=4qWlyGTr',
                    user:
                    {
                        image: 'https://c402277.ssl.cf1.rackcdn.com/photos/10596/images/carousel_small/RAWP2115_mini.jpg?1451407554',
                        user_name: 'sahand'
                    }
                },
            ]
        }
    }


    render() {
        return (
            <div className="row no-gutters py-2 py-md-3">
                <div className="col rounded border border-secondary w-100">
                    <div className="row no-gutters bg-light border-bottom p-2"><h4 className="mb-0"> Events</h4></div>
                    <div className="row no-gutters d-flex flex-nowrap overflow-auto py-2 pl-2">
                        {
                            this.state.events.map((event) => (
                                <Event key={event.id} event={event} />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Events
