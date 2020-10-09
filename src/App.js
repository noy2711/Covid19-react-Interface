import React, { useEffect, useState, Component } from 'react';
import './App.css';
import WorldMap from './components/Map';
import DatesSlider from './components/DatesSlider';
import LineGraph from './components/LineGraph'
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { blueGrey, grey, lightBlue, red, blue } from '@material-ui/core/colors';
import { getCovidData } from "./API/api";
import {Globe} from '@styled-icons/entypo'
import {ChartArea} from '@styled-icons/fa-solid'
import {LineChart} from '@styled-icons/remix-line'

export var ptr = null
export default class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      countries: [],
      world: [],
      flag: true,
    }
    document.title = "Covid19 Worldwide"
  }

  async componentDidMount() {
    await getCovidData("all").then(
      res => {
        this.setState({ countries: res })
      }
    ).then(
        // TODO: preproccess data + add location
    )

    await getCovidData("all", "world").then(
      res => {
        this.setState({ world: res })
      }
    )
  }

  render() {

    // put this in a seperate file
    const AntSwitch = withStyles((theme) => ({
      root: {
        width: 70,
        height: 22,
        padding: 2.2,
        display: 'flex',
      },
      switchBase: {
        padding: 2,
        color: this.state.flag ? lightBlue[700] : grey[300],
        transform: this.state.flag ? 'translateX(-1px)' : 'translateX(48px)',
      },
      thumb: {
        width: 20,
        height: 20,
        boxShadow: 'none',
      },
      track: {
        border: this.state.flag ? `1px solid ${theme.palette.grey[800]}` : `1px solid ${theme.palette.grey[200]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: this.state.flag ? grey[300] : lightBlue[700],
      },
      checked: {},
    }))(Switch);


    return (
      <div>
        <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css' />
        <div id='stars'></div>
        <div id='stars2'></div>
        <div id='stars3'></div>

        <div className="mapStatContainer">
          <Typography component="div">
            <Grid component="label" container alignItems="center" spacing={1}>


              <Grid item  >
                <Globe className={this.state.flag ? "glowGlobe" : "noglow"} size="40" />
              </Grid>

              <Grid item>
                <AntSwitch onChange={() => this.setState({ flag: !this.state.flag })} name="checkedC" />
              </Grid>

              <Grid item >
                <LineChart  className={!this.state.flag ? "glowChart" : "noglow"} size="37"/>
              </Grid>

            </Grid>
          </Typography>



          {ToggleMapChart(this.state.flag, this.state.countries, this.state.world)}


        </div>
      </div>


    );
  }
}

function ToggleMapChart(isMap, countries, world) {
  
  if (isMap) {
    return (

      <div>
        <DatesSlider />
        <WorldMap
          center={{ lat: 34.80746, lng: -40.4796 }}
          zoom={2}
        />
      </div>

    )
  } else {
    // Add data: active, death, recovered, labels
    
    if (world.length != 0) {
      console.log("app world: ", world);
      return (
        <div>
          <LineGraph countries = {countries} world = {world}/>
  
        </div>
      )
    } else {
      return (
        <div>  
        </div>
      )
    }
    

  }
}


