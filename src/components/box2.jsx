import React, { Component } from 'react';
import Box from '../components/box';

export default class box2 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            x: "1",
        }
    }


    f1 = () => {
        console.log("f1 has been called from box2");
        this.setState({x: "5"})
    }


    render() {
        return (
            <div>
                <Box func={this.f1}/>
                <h1>Box2: {this.state.x}</h1>
            </div>
        );
    }
}


