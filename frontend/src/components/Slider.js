import React, { Component } from 'react'
import $ from 'jquery'
import PorpsType from 'prop-types'
import './Slider.css'

export class Slider extends Component {

    componentDidMount() {
        var itemWidth = $('.slider-item').width()
        var marginRight = parseInt($('.slider-item').css('margin-right').replace("px", ""))

        $(".slider-left-arrow").on("click", function () {
            var left = $(".slider-items-container").scrollLeft()
            var firstItemIndex = Math.floor(left / (itemWidth + marginRight))
            var scrollLeftTo = (firstItemIndex - 1) * (itemWidth + marginRight)
            if (firstItemIndex < 1)
                scrollLeftTo = 0
            $(".slider-items-container").scrollLeft(scrollLeftTo)
        });

        $(".slider-right-arrow").on("click", function () {
            var left = $(".slider-items-container").scrollLeft()
            var firstItemIndex = Math.ceil(left / (itemWidth + marginRight))
            var scrollLeftTo = (firstItemIndex + 1) * (itemWidth + marginRight)
            console.log(firstItemIndex)
            $(".slider-items-container").scrollLeft(scrollLeftTo)
        });
    }

    render() {
        return (
            <div className="slider-container">
                <div className="slider-left-arrow">
                    <i class="fas fa-chevron-left"></i>
                </div>

                <div className="slider-items-container">
                    {this.props.children.map(child => <div className="slider-item">{child}</div>)}
                </div>

                <div className="slider-right-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        )
    }
}

Slider.PorpsType = {
    children: PorpsType.array.isRequired
}

export default Slider
