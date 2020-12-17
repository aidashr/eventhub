import React, { Component } from 'react'
import Slider from './../components/Slider'
import Event from './../components/Event'
import Cafe from '../components/Cafe'
import './Main.css'
import axios from 'axios'

export class Main extends Component {

    constructor(props) {
        super(props)

        this.state = {
            slider_items_to_show: 1,
            last_events: [],
            last_cafes: []
        }

        this.setSliderItemToShow = this.setSliderItemToShow.bind(this)
        window.addEventListener("resize", this.setSliderItemToShow)
    }

    componentDidMount() {
        this.setSliderItemToShow()

        var urlGetLastEvents = "http://127.0.0.1:8000/event/lastest";
        axios.get(
            urlGetLastEvents
        ).then((res) => {
            if (res.status === 200) {
                this.setState({ last_events: res.data.results || [] })
                console.log(this.state)
            }
        }).catch((error) => {
            if (error.response) {
                console.log(error)
            }
        });

        var urlGetLastCafes = "http://127.0.0.1:8000/cafe/lastest";
        axios.get(
            urlGetLastCafes
        ).then((res) => {
            if (res.status === 200) {
                this.setState({ last_cafes: res.data.results || [] })
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
            <div className="container-md">
                <div className="events-container">
                    <Slider title="Events" children={this.state.last_events.map(event => <Event event={event} />)} itemsCount={this.state.last_events.length} itemsToShow={this.state.slider_items_to_show} alert={"No Latest Event"} />
                </div>
                <div className="cafes-container">
                    <Slider title="Cafes" children={this.state.last_cafes.map(cafe => <Cafe cafe={cafe} />)} itemsCount={this.state.last_cafes.length} itemsToShow={this.state.slider_items_to_show} alert={"No Latest Cafe"} />
                </div>
            </div>
        )
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

export default Main
