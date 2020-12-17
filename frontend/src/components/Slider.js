import React, { Component } from 'react'
import $ from 'jquery'
import PorpsType from 'prop-types'
import './Slider.css'

export class Slider extends Component {

    constructor(props) {
        super(props)

        this.state = {
            items_to_show: this.props.itemsToShow,
            items_count: this.props.itemsCount
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.items_to_show !== nextProps.itemsToShow) {
            this.setState({ items_to_show: nextProps.itemsToShow })
        }
        if (this.state.items_to_show)
            this.setState({ items_count: nextProps.itemsCount })
    }

    componentDidMount() {
        this.setProperties();
    }

    componentDidUpdate() {
        this.setProperties()
    }

    render() {

        const items = []
        for (var i = 0; i < this.props.children.length; i++)
            items.push(<div className="slider-item">{this.props.children[i]}</div>)
        return (
            <div className="slider-container">
                {this.props.title ? <div className="slider-header"><div className="slider-header-title">{this.props.title}</div></div> : null}
                <div className="slider-body">
                    <div className="slider-left-arrow">
                        <i class="fas fa-chevron-left fa-lg"></i>
                    </div>

                    <div className="slider-items-container">
                        {this.state.items_count === 0 ? <div className="slider-items-alert">{this.props.alert}</div> : items}
                    </div>

                    <div className="slider-right-arrow">
                        <i class="fas fa-chevron-right fa-lg"></i>
                    </div>
                </div>
            </div>
        )
    }

    setProperties() {
        if (0 < this.state.items_count) {
            var itemsContainerWidth = $('.slider-items-container').width();
            var margin = parseInt($('.slider-item').css('margin-right').replace("px", ""))
            var itemsToShow = parseInt(this.props.itemsToShow)
            var itemWidth = Math.floor((itemsContainerWidth - margin * (itemsToShow - 1)) / itemsToShow)
            $('.slider-item').css({ 'min-width': itemWidth.toString() + 'px' })

            $(".slider-items-container").scrollLeft(0)

            $(".slider-left-arrow").on("click", function () {
                var left = $(".slider-items-container").scrollLeft()
                var firstItemIndex = Math.floor(left / (itemWidth + margin))
                var scrollLeftTo = (firstItemIndex - 1) * (itemWidth + margin)
                $(".slider-items-container").scrollLeft(scrollLeftTo)
            });

            $(".slider-right-arrow").on("click", function () {
                var left = $(".slider-items-container").scrollLeft()
                var firstItemIndex = Math.ceil(left / (itemWidth + margin))
                var scrollLeftTo = (firstItemIndex + 1) * (itemWidth + margin)
                $(".slider-items-container").scrollLeft(scrollLeftTo)
            });
        }
    }
}

Slider.PorpsType = {
    children: PorpsType.array.isRequired,
    itemsToShow: PorpsType.object.isRequired,
    alert: PorpsType.object.isRequired
}

export default Slider
