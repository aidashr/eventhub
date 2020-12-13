import { Component } from 'react';
import React from "react";
import { Redirect } from 'react-router';
import axios from "axios";
import Cookies from 'universal-cookie';
import './EventDetails.css';

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Avatar from 'react-avatar';
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'


const cookies = new Cookies();

let post;
let listItems;


class EventDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Title',
            description: 'description',
            created_at: '',
            start_time: '2020/2/25',
            start_time_Date: 'd',
            Cafe_ID: '',
            username: 'username',
            date: '',
            time: '',

            mem_length: 0,

            modal: false
        };


        this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleClose() {
        this.setState({ modal: false })
    }
    handleShow() {
        this.setState({ modal: true })
    }

    componentDidMount() {
        this.setState({ modal: false })
        cookies.set('Event_ID', '1');

        var url = "http://127.0.0.1:8000/event/" + cookies.get('Event_ID');
        axios.get(
            url
        ).then((res) => {
            if (res.status === 200) {
                this.setState({ id: res.data.id })
                this.setState({ title: res.data.title })
                this.setState({ description: res.data.description })
                this.setState({ created_at: res.data.created_at })
                this.setState({ start_time: res.data.start_time })
                this.setState({ Cafe_ID: res.data.user.id })
                this.setState({ username: res.data.user.username })

                var data = this.state.start_time.split('T')
                this.setState({ date: data[0] })
                this.setState({ time: data[1] })
            }
        }).catch((error) => {
            if (error.response) {
                console.log(error) // LOG
            }
        });

        var url2 = url + '/participate';
        axios.get(
            url2
        ).then((res) => {
            if (res.status === 200) {
                post = res.data || []
                this.setState({ mem_length: res.data.length })

                listItems = post.map((post) =>
                    <ListGroup.Item className='Mem-card' key={post.id}>
                        <Avatar className="Mem-avatar" name={post.user.first_name + ' ' + post.user.last_name} size="70" round={true} />
                        <div>
                            <span className="Mem-user">{post.user.username}</span>
                        </div>
                        <div>
                            <span className="Mem-name">{post.user.first_name} {post.user.last_name} </span>
                        </div>
                    </ListGroup.Item >
                );
            }
        }).catch((error) => {
            if (error.response) {
                console.log(error) // LOG
            }
        });



    }

    render() {
        if (this.state.isLogedIn) {
            if (this.state.is_regular)
                return <Redirect to={{ pathname: "/user-profile" }} />;
            if (!this.state.is_regular)
                return <Redirect to={{ pathname: "/user-profile" }} />;
        }
        return (
            <div>
                <Card className='Event-Cards'>
                    <div className='TopContainer'>
                        <div className='one'>
                            <Image className='Event-Image'
                                thumbnail
                                fluid
                                style={{
                                    padding: 5
                                }}
                                src="https://c402277.ssl.cf1.rackcdn.com/photos/10596/images/carousel_small/RAWP2115_mini.jpg?1451407554" />
                        </div>
                        <div className="two">
                            <div style={{ float: 'right' }}>
                                <h3>Starts at : {this.state.date} {this.state.time}</h3>
                            </div>
                            <h1>{this.state.title}</h1>
                            <h2>By {this.state.username}</h2>
                            <h2>{this.state.description}</h2>
                        </div>
                    </div>
                    <Card.Body>
                        <div className="Avatars" onClick={this.handleShow.bind(this)}>
                            <span>Members : </span>
                            <Avatar name='A A' size="40" round={true} />
                            <Avatar className="Avatar1" name='A B' size="40" round={true} />
                            <Avatar className="Avatar2" name='A C' size="40" round={true} />
                            <span >{this.state.mem_length} more </span>
                        </div>
                        <Button className='Join-btn' variant="primary">Join</Button>
                    </Card.Body>
                </Card>

                <Modal
                    show={this.state.modal}
                    onHide={this.handleClose.bind(this)}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Members
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup>
                            <ListGroup.Item className='Mem-card'>
                                <Avatar className="Mem-avatar" name='A B' size="70" round={true} />
                                <div>
                                    <span className="Mem-user">A B </span>
                                </div>
                                <div>
                                    <span className="Mem-name">Fname Lname </span>
                                </div>
                            </ListGroup.Item>
                            {listItems}
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div >
        );
    }
}



export default EventDetails;
