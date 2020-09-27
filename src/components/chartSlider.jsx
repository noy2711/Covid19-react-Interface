import React, { Component } from 'react';
import {ptr} from "../App"
export default class ChartSlider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            start: "1",
            end: "5"
        }
    }

    render() {
        return (
            <div>
                <button onClick={() => {ptr(this.state.start, this.state.end)}}></button>
            </div>
        );
    }
}