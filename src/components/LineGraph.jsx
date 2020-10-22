import React, { Component, useState } from 'react';
import moment from 'moment';
import '../styles/LineGraph.css'
import { Line } from 'react-chartjs-2';
import { Slider } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

var comboBox = [];
var allLabels = [];
export default class LineGraph extends Component {
    // TODO: make chart y-axis exponential
    constructor(props) {
        super(props)
        var i = 100
        var f = 200
        const allCountries = ['Choose a country', 'World'].concat(getCountriesList(this.props.countries))
        const labelsData = getDateRange(this.props.world.cases)
        allLabels = labelsData
        const opa = 0.2
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            allCountries: allCountries,
            value: allCountries[0],
            inputValue: allCountries[0],
            start: i,
            end: f,
            allLabels: labelsData,
            graphData: {
                labels: labelsData.slice(i, f),
                animationEnabled: true,
                datasets: [
                    {
                        label: 'Recovered',
                        fill: true,
                        lineTension: 0.1,
                        backgroundColor: ' rgba(59, 218, 157,' + String(opa) + ')',
                        borderColor: ' rgba(59, 218, 157,0.9)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: ' rgba(59, 218, 157,0.9)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: ' rgba(59, 218, 157,1)',
                        pointHoverBorderColor: ' rgba(59, 218, 157,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: getValues(this.props.world.recovered, i, f)
                    },
                    {
                        label: 'Death',
                        fill: true,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(252, 98, 119, ' + String(opa) + ')',
                        borderColor: 'rgba(252, 98, 119, 0.9)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(252, 98, 119, 0.9)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(252, 98, 119, 1)',
                        pointHoverBorderColor: 'rgba(252, 98, 119,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: getValues(this.props.world.deaths, i, f)
                    },
                    {
                        label: 'Active',
                        fill: true,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(231, 175, 110, ' + String(opa) + ')',
                        borderColor: 'rgba(231, 175, 110, 0.9)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(231, 175, 110, 0.9)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(231, 175, 110,1)',
                        pointHoverBorderColor: 'rgba(231, 175, 110,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: getValues(this.props.world.cases, i, f)
                    }
                ]
            },
        }
    }



    componentDidMount() {

        window.addEventListener('resize', () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }, true);
    }


    render() {


        var onSliderChange = (event, val) => {


            const i = val[0]
            const f = val[1]

            var cnt = null
            if (this.state.value == null)
                return
            if (this.state.value == "World") {
                cnt = this.props.world
            } else {
                cnt = getCountryData(this.props.countries, this.state.value)
            }
            this.state.graphData.labels = getDateRange(cnt.cases).slice(i, f)

            this.state.graphData.datasets[2].data = getValues(cnt.cases, i, f)
            this.state.graphData.datasets[1].data = getValues(cnt.deaths, i, f)
            this.state.graphData.datasets[0].data = getValues(cnt.recovered, i, f)
            this.setState({
                graphData: this.state.graphData,
                start: i,
                end: f,
            })






        }
        return (
            <div>
                <div className="contianer">
                    <IOSSlider
                        defaultValue={[this.state.start, this.state.end]}
                        //getAriaValueText={valuetext}
                        valueLabelFormat={valuetext}
                        aria-labelledby="discrete-slider-always"
                        onChangeCommitted={onSliderChange}
                        step={1}
                        max={this.state.allLabels.length - 1}
                        marks={setMarks(this.state.allLabels)}
                        valueLabelDisplay="on"
                    />
                </div>
                <div className='graph'>
                   
                    <Line data={this.state.graphData}
                        width={this.state.width * 0.6}
                        height={this.state.height * 0.6}
                        animationEnabled="true"
                        options={{ maintainAspectRatio: false}} />
                </div>
            </div>

        );
    }
}

function getValues(data, iInx, fInx) {

    const arr = Object.entries(data).slice(iInx, fInx).map(x => {
        return x[1]
    })
    return arr
}
function valuetext(value, index) {
    return moment(new Date(allLabels[value])).format("MM/DD")
}


function getCountriesList(countries) {
    const countriesArr = countries.map(x => {
        return x.country;
    })
    return Array.from(new Set(countriesArr));
}
function getCountryData(data, cntry) {

    console.log("User181:", data);
    for (let i = 0; i < data.length; i++) {
        const c = data[i];
        if (c.country == cntry)
            return c.timeline

    }
}

function getDateRange(data) {

    const arr = Object.entries(data)
    var dates = []
    const minDate = moment(new Date(arr[0][0]))
    const maxDate = moment(new Date(arr[arr.length - 1][0]))

    for (let curr = minDate; curr <= maxDate; curr.add(1, 'days')) {
        dates.push(curr.format("MM/DD"))

    }

    return dates
}

const IOSSlider = withStyles({
    root: {
        color: '#3881ff71',
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
        height: 3,
        opacity: 0.5,
        backgroundColor: '#bfbfbf',
        marginTop: 1,
    },
    mark: {
        backgroundColor: '#fff',
        height: 3,
        width: 2,

        marginTop: 1,
    },
    markLabel: {
        color: '#fff'
    },
    markActive: {
        opacity: 1,
        backgroundColor: '#fff',
    },
})(Slider);

function setMarks(labels) {
    var marks = []
    let x = 0
    var start = moment(new Date(labels[0]))
    for (let i = 0; i <= labels.length; i++) {

        if (start.format("DD") == "01") {
            marks.push({
                value: i,
                label: start.format("MMMM")
            })
        }

        start = start.add(1, 'days')
    }

    return marks
}