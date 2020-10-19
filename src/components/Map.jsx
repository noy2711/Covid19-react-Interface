import React, { Component, useState, useEffect } from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "../styles/Map.css";
import { Circle, Popup } from "react-leaflet";
import { getCovidData, getCountriesInfos, getWorldData, getCountries, getCountryData } from "../API/api";
import { getWorldDataByDate, getCountryDataByDate } from "../Utils/DataClean";
import moment from "moment"
import MapGlobe from './MapGlobe'
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import '../styles/StatusButtons.css'
import StatusButtons from './StatusButtons'
import 'fontsource-roboto';
import Typography from '@material-ui/core/Typography';

export default class WorldMap extends Component {
    constructor(props) {

        super(props)

        this.state = {
            data: [],
            date: moment(new Date("1/22/20")).format("M/D/YY"),
            maxRatio: 1,
            content: "",
            status: "deaths",
            worldData: [],
            width: window.innerWidth,
            height: window.innerHeight
        }
        document.title = "noy website"
    }

    d = new Date("1/22/20")

    makeCircle = (center, radius) => {
        return (
            <Circle
                className="mapc"
                center={center}
                color='rgba(233, 34, 34, 0.733)'
                fillColor="red"
                fillOpacity={0.2}
                radius={radius}
            ></Circle>

        )

    }

    nextDate = () => {
        this.d = moment(this.d).add(1, 'days')
        return this.d.format("YYYY-MM-DD");
    }


    onBtnPress = (status) => {
        this.setState({ status: status })
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    async componentDidMount() {

        window.addEventListener('resize', this.updateDimensions);




        var worldDataByDate = await getWorldDataByDate();
        var dataByDate = await getCountryDataByDate();

        if(this.props.flag == false)
        {
            this.d = this.props.date
            this.props.onChange(this.d)
            
        }

        var play = () => {

        }
    
        window.myStopFunc = () => {
            console.log("map timinline stopped!!");
        }
        


        var interval = setInterval(() => {
            console.log("intervaling...");



            const dateSimple = moment(this.nextDate()).format("M/D/YY")
            if (dataByDate.has(dateSimple)) {
                this.setState({
                    data: dataByDate.get(dateSimple),
                    date: dateSimple + "",
                    worldData: worldDataByDate.get(dateSimple)
                })
            } else {
                console.log(dateSimple, "not found");
            }
            if (this.d >= new Date()) {
                console.log("intervaling existing...");
                window.clearInterval(interval);
            }
        }, 100)


    }

    size = {
        width: window.innerWidth * 70 / 100,
        height: window.innerHeight * 60 / 100
    }

    setTooltip = (x) => {
        this.setState({
            content: x
        })
    }

    render() {

        return (

            <div className="container" style={{ width: this.state.width * 0.9 }}>

                <StatusButtons
                    onBtnPress={this.onBtnPress}
                    worldCount={this.state.worldData}
                />

                <div className="map"
                    style={this.size}
                >

                    <h4 className="mapTitle">
                        {this.state.date}
                    </h4>

                    <TooltipComponent cssClass="tooltip-box" content={this.state.content} mouseTrail={true} showTipPointer={false}>
                        <MapGlobe func={this.setTooltip} data={this.state.data} ratio={this.state.maxRatio} status={this.state.status} />
                    </TooltipComponent>


                </div>
            </div>

        );

    }
}

const oldMap = () => {
    return (
        <div>
            <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />


            <LeafletMap
                className="tile"
                style={this.size}
                center={this.props.center} zoom={this.props.zoom}

            >
                <TileLayer

                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    noWrap='true'
                    minZoom='2'
                    maxZoom='5'
                    class='center'
                    max-height='100%'
                    max-width='100%'


                />

                {
                    this.state.data.map(x =>
                        x.population ? <Circle
                            className="mapc"
                            center={[x.lat, x.lng]}
                            color='rgba(233, 34, 34, 0.733)'
                            fillColor="red"
                            fillOpacity={0.2}
                            radius={x.radCases}
                        ></Circle> : <div></div>
                    )

                }




            </LeafletMap>
        </div>
    )
}

function remove(arr, toRemove) {
    var res = []

    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.code != toRemove)
            res.push(element)
    }
    console.log("after remove: ", res);
    return res
}

// 4. helper function 1
function getPureData(data) {

    var arr = []
    Object.entries(data).forEach(x => {
        arr.push(x[1])
    })
    return arr
}

// 4. helper function 2
function getDates(data) {

    var arr = []
    Object.entries(data).forEach(x => {
        arr.push(x[0])
    })
    return arr
}
// 4. helper function 3 => return the data that contain provience==null
function fixProvience(arr) {

    var res = []

    // convert cases,... to pure values
    arr = arr.map(x => {
        return {
            country: x.country,
            province: x.province,
            timeline: {
                cases: getPureData(x.timeline.cases),
                deaths: getPureData(x.timeline.deaths),
                recovered: getPureData(x.timeline.recovered),
            }
        }
    })

    // make array of country names that have duplicates
    var d = new Map()
    arr.forEach(x => {
        if (d.has(x.country)) {
            d.set(x.country, 2)
        } else {
            d.set(x.country, 1)
        }
    });
    console.log("d:", d);
    console.log("arr: ", arr);

    d.forEach((v, k) => {
        const cntryName = k;
        const dupCnt = v
        // is not dup
        if (dupCnt == 1) {
            // just add to res
            res.push(arr.find(x => x.country == cntryName))
        }
        // is dup
        else {
            // if provinces = null <=> if any(provinces = null)
            if (arr.some(x => x.province == null && x.country == cntryName)) {
                // add only to res list
                res.push(arr.find(x => x.country == cntryName && x.province == null))

                // if provinces != null <=> if all(province != null)
            } else {
                const len = arr[0].timeline.cases.length
                // sum of all cases, deaths, recovered
                var cases = new Array(len).fill(0);
                var deaths = new Array(len).fill(0);
                var recovered = new Array(len).fill(0);

                // get all entrys with country name = countryName
                var tmpCountries = arr.filter(x => x.country == cntryName)

                // loop on all and make sums
                tmpCountries.forEach(prov => {
                    for (let i = 0; i < prov.timeline.cases.length; i++) {
                        cases[i] += prov.timeline.cases[i];
                        deaths[i] += prov.timeline.deaths[i];
                        recovered[i] += prov.timeline.recovered[i];
                    }
                });

                // build new object then add it to res list
                const countryObject = {
                    country: cntryName,
                    timeline: {
                        cases: cases,
                        deaths: deaths,
                        recovered: recovered,
                    }
                }

                res.push(countryObject)

            }
        }
    });

    return res
}