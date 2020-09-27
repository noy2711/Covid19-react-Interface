import React, { Component, useState, useEffect } from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "../styles/Map.css";
import { Circle, Popup } from "react-leaflet";
import { getCountriesInfos, getWorldData, getCountries, getCountryData } from "../API/api";
import moment from "moment"
export default class WorldMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: []
        }
        document.title = "noy website"
    }
    
    d = new Date()

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

    async componentDidMount() {



        var info = await getCountriesInfos()
        info = info.map(x => {
            return {
                code: x.alpha2Code,
                population: x.population,
                area: x.area
            }
        })


        const hash = Object.assign({}, ...info.map(s => ({ [s.code]: s })));

        console.log("before get world data");
        var rawData = await getWorldData()
        console.log("after get world data");
        rawData = rawData.map(x => {
            return {
                info: x,
                population: hash[x.CountryCode].population,
                area: hash[x.CountryCode].area,
                radius: Math.sqrt(hash[x.CountryCode].area) * 50000 * x.Active / hash[x.CountryCode].population
            }
        }).filter(x => {
            return x.info.City === "";
        })


        var dataByDate = new Map()
        rawData.forEach(elem => {
            if (dataByDate.has(elem.info.Date)) {
                dataByDate.get(elem.info.Date).push(elem)
            } else {
                dataByDate.set(elem.info.Date, [elem])
                var tmpDate = new Date(elem.info.Date)
                if (this.d > tmpDate) {
                    this.d = tmpDate
                }
            }
        });


        console.log("hashmap size = ", dataByDate.size);
        var interval = setInterval(() => {

            const dateSimple = this.nextDate()
            const dateVar = dateSimple + "T00:00:00Z"
            if (dataByDate.has(dateVar)) {
                this.setState({
                    data: dataByDate.get(dateVar),
                    date: dateSimple + ""
                })
            }
            if (this.d >= new Date()) {
                window.clearInterval(interval);
            }
        }, 100)

    }



    size = {
        width: window.innerWidth * 70 / 100,
        height: window.innerHeight * 60 / 100
    }


    render() {
        return (
            <div className="container">

                <div className="map"
                    style={this.size}
                >
                    <h3 className="mapTitle">{this.state.date}</h3>
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
                            class = 'center'
                            max-height =  '100%'
                            max-width = '100%'


                        />

                        {
                            this.state.data.map(x =>
                                x.population ? <Circle
                                    className="mapc"
                                    center={[x.info.Lat, x.info.Lon]}
                                    color='rgba(233, 34, 34, 0.733)'
                                    fillColor="red"
                                    fillOpacity={0.2}
                                    radius={x.radius}
                                ></Circle> : <div></div>
                            )

                        }




                    </LeafletMap>
                    
                    

                </div>
            </div>

        );

    }
}
