import React, { Component } from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import '../styles/StatsBox.css'
class StatsBox extends Component {



    render() {

        var card = (status, cases) => 
        <div className="card">
        <CardContent>
            <Typography variant="h5" color="textSecondary" gutterBottom>
                {status}
            </Typography>

            <Typography variant="h6" component="p">
                {cases}
            </Typography>
        </CardContent>
        </div>
        return (
            <div className="statBox">
                {card("Active", 345)}
                {card("Death", 234)}
                {card("Recovered", 123)}
            </div>
        );
    }
}


export default StatsBox;