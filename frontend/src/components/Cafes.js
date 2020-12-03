import React, { Component } from 'react'
import Cafe from './Cafe'

export class Cafes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cafes: [
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
        console.log(this.state.events);
    }

    render() {
        return (
            <div className="row no-gutters pb-2 pb-md-3">
                <div className="col w-100 rounded border border-secondary overflow-hidden">
                    <div className="row no-gutters bg-light border-bottom p-2"><h4 h4 className="mb-0"> Cafes</h4></div>
                    <div className="row no-gutters d-flex flex-nowrap overflow-auto py-2 pl-2">
                        {
                            this.state.cafes.map((cafe) => (
                                <Cafe key={cafe.id} cafe={cafe} />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Cafes
