import React, { Component } from 'react'
import Cafes from "./../components/Cafes";
import Events from "./../components/Events";

export class Main extends Component {
    render() {
        return (
            <div className="container-md">
                <Events />
                <Cafes />
            </div>
        )
    }
}

export default Main
