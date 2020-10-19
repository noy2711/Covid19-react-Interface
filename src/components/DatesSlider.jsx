import React, { Component } from 'react';
import { Slider } from '@material-ui/core';
import '../styles/DatesSlider.css'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import moment from "moment"

function valuetext(value, index) {
    return value + 1
}
class DatesSlider extends Component {
    render() {

        var marks = []
        var date = moment(new Date("2020-03-01"))
        var end = 28
        for (let index = 0; index < end; index++) {
            marks.push({ value: index, label: index == end-1 || index % 5 == 0 ? date.format("MM/DD") : "" })
            date = moment(date).add(1, 'days')

        }


        const IOSSlider = withStyles({
            root: {
                color: '#3880ff',
                height: 2,
                padding: '15px 0',
            },
            thumb: {
                height: 24,
                width: 24,
                backgroundColor: '#fff',
                marginTop: -12,
                marginLeft: -12,


            },
            active: {},
            valueLabel: {
                left: 'calc(-50% + 12px)',
                top: -22,
                '& *': {
                    background: 'transparent',
                    color: '#FFF',
                },
            },
            track: {
                height: 5,
            },
            rail: {
                height: 2,
                opacity: 0.5,
                backgroundColor: '#bfbfbf',
            },
            mark: {
                backgroundColor: '#bfbfbf',
                height: 10,
                width: 2,
                marginTop: -3,
            },
            markLabel: {
                color: '#fff'
            },
            markActive: {
                opacity: 1,
                backgroundColor: 'currentColor',
            },
        })(Slider);

        const onSliderInnerChange = (event, value) => {
            this.props.onChange(value, true)
        }
        
        return (
            <div className="contianer">
                <IOSSlider
                    defaultValue={[50, 80]}
                    getAriaValueText={valuetext}
                    valueLabelFormat={valuetext}
                    aria-labelledby="discrete-slider-always"
                    min={0}
                    step={1}
                    max={end}
                    marks={marks}
                    valueLabelDisplay="on"
                    onChange = {onSliderInnerChange}
                />
            </div>
        );
    }
}

export default DatesSlider;