import React, { Component } from 'react';
import '../index.css'

class Rectangle extends Component {

    rectangleStyle = {
        width: this.props.x,
        height: this.props.x * 2,
        border: '2px solid rgb(245, 143, 143)',
        margin: '2px'

    }
    render() {
        return (
            <div style = {this.rectangleStyle}>
                noy
                
            </div>
        );
    }
}

export default Rectangle;