import React, { Component, useState } from 'react';
import moment from 'moment';
import '../styles/LineGraph.css'
import { Line } from 'react-chartjs-2';
import { getAll_temp } from '../API/api';
import {ptr} from "../App"


export default function Func(params) {
    var data1 = params.recovered
    var data2 = params.death
    var data3 = params.active
    var labels = params.labels
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(0)

    ptr = (start, end) => {
        console.log("chart change:" + start + " : " + end);
        setStart(start)
        setEnd(end)
    }

    const opa = '0.2'
   
    const graphData1 = {
        labels: labels,
        animationEnabled: true,
        datasets: [
            {
                label: 'Recovered',
                fill: true,
                lineTension: 0.1,
                backgroundColor: ' rgba(59, 218, 157,' + String(opa) + ')'  ,
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
                data: data1
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
                data: data3
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
                data: data2
            }
        ]
    };
    

    return (
        <div className='graph'>
            <h2 className="title"> {start} : {end} </h2>
            
            <Line data={graphData1} width={800}
                height={250}
                options={{ maintainAspectRatio: false }} />
        </div>
    );
}

