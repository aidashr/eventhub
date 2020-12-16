import React, { Component } from 'react'

export class CafeSearch extends Component {
    render() {
        return (
            <div className="col-12 pr-2">
                <div className="row no-gutters">
                    <div className="col w-100 border border-secondary rounded">
                        <div className="row no-gutters bg-light p-2 align-items-center">
                            <img className="border border-secondary rounded-circle p-1 mr-2" src={this.props.cafe.image} width={48} height={48} />
                            <div className="font-weight-bold">{this.props.cafe.cafe_name}</div>
                        </div>

                        <div className="row no-gutters">
                        </div>

                        <div className="row no-gutters bg-light p-2">
                            <div className="col w-100">
                                <div className="row no-gutters justify-content-between">
                                    <div className="col-auto font-weight-bold">{this.props.cafe.username}</div>
                                </div>
                                <div className="row no-gutters">{this.props.cafe.cafe_address}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CafeSearch
