import React, { Component } from 'react';
import moment from 'moment';
import '../styles/box.css'
import { Line } from 'react-chartjs-2';
import { getData, setData } from '../components/chartSlider'
class Box extends Component {

    async componentDidMount() {
        console.log("Box1 mounted");
        await sleep(5000)
        this.props.func()
        console.log("done");


    }

    render() {



        return (
            <div className='ewrwer'>
            </div>
        );
    }
}
export default Box;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
