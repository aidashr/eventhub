import { Component } from 'react';
import React from "react";
import { Redirect } from 'react-router';
import axios from "axios";
import Cookies from 'universal-cookie';
import './Search.css';
import CafeSearch from "./../components/CafeSearch";
import EventSearch from "./../components/EventSearch"



import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Avatar from 'react-avatar';
import ListGroup from 'react-bootstrap/ListGroup'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Image from 'react-bootstrap/Image'


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            searchText: '',
            searchResults: [],
            cafe: [],
            listItems: [],

            event: [],
            listItems1: [],

            image: 'https://c402277.ssl.cf1.rackcdn.com/photos/10596/images/carousel_small/RAWP2115_mini.jpg?1451407554',

            mem_length: 0
        };


        this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    componentDidMount() {

        this.setState({ searchText: '' })

        var url = 'http://127.0.0.1:8000/cafe/search'
        axios.get(
            url,
            { params: { page: '1', search: this.state.searchText } }
        ).then((res) => {
            if (res.status === 200) {
                this.setState({ cafe: res.data.results || [] })
                this.setState({
                    listItems: this.state.cafe.map((cafe) => (
                        <CafeSearch key={cafe.id} cafe={cafe} />
                    ))
                })
            }
        }).catch((error) => {
            if (error.response) {
                console.log(error) // LOG
            }
        });

        /////////////////////////////////////


        var url1 = 'http://127.0.0.1:8000/event/search'
        axios.get(
            url1,
            { params: { page: '1', search: this.state.searchText } }
        ).then((res) => {
            if (res.status === 200) {
                this.setState({ event: res.data.results || [] })
                this.setState({
                    listItems1: this.state.event.map((event) => (
                        <EventSearch key={event.id} event={event} />
                    ))
                })
            }
        }).catch((error) => {
            if (error.response) {
                console.log(error) // LOG
            }
        });

    }

    render() {
        return (
            <div>
                <Tabs className='Search-Tabs' defaultActiveKey="home" variant="pills" className="mb-3" fill>

                    <Tab eventKey="home" title="Cafes" className='Cafe-Tab'>
                        <div >
                            <Card className="Cafe-Search" >
                                <div>
                                    <h2>
                                        Cafes Search Results:
                                    </h2>
                                </div>
                                <Card.Body className="Search-Body">
                                    <ListGroup>
                                        {this.state.listItems}
                                        {this.state.listItems}
                                        {this.state.listItems}
                                        {this.state.listItems}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </div >
                    </Tab>
                    <Tab eventKey="profile" title="Events">
                        <div >
                            <Card className="Cafe-Search">
                                <div>
                                    <h2>
                                        Events Search Results :
                                    </h2>
                                </div>
                                <Card.Body className="Search-Body">
                                    <ListGroup>
                                        {this.state.listItems1}
                                        {this.state.listItems1}
                                        {this.state.listItems1}
                                        {this.state.listItems1}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </div >
                    </Tab>
                </Tabs>
            </div>

        );
    }
}



export default Search;
