import React, { Component, useState, useEffect } from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "../styles/Map.css";
import { Circle, Popup } from "react-leaflet";
import { getCovidData, getCountriesInfos, getWorldData, getCountries, getCountryData } from "../API/api";
import moment from "moment"
import MapGlobe from './MapGlobe'
export default class WorldMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            date: moment(new Date("1/22/20")).format("M/D/YY")
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



    fixMe = (key) => {
        switch (key) {
            case "Russian Federation":
                return "Russia";

            case "Bolivia (Plurinational State of)":
                return "Bolivia"

            case "Bosnia and Herzegovina":
                return "Bosnia";

            case "Myanmar":
                return "Burma";

            case "Congo (Democratic Republic of the)":
                return "DRC";

            case "Czech Republic":
                return "Czechia";

            case "Iran (Islamic Republic of)":
                return "Iran";

            case "Korea (Democratic People's Republic of)":
                return "S. Korea";

            case "Republic of Kosovo":
                return "Kosovo";



            case "Libya":
                return "Libyan Arab Jamahiriya";


            case "Moldova (Republic of)":
                return "Moldova";


            case "Tanzania, United Republic of":
                return "Tanzania";

            case "United States of America":
                return "USA";

            case "United Kingdom of Great Britain and Northern Ireland":
                return "UK";


            case "United Arab Emirates":
                return "UAE";

            case "Venezuela (Bolivarian Republic of)":
                return "Venezuela";
            case "Viet Nam":
                return "Vietnam";


            case "Palestine, State of":
                return "West Bank and Gaza";

            default:
                return key;
        }
    }

    async componentDidMount() {



        var info = await getCountriesInfos().then(y => {
            return y.map(x => {

                return {
                    code: this.fixMe(x.name),
                    population: x.population,
                    area: x.area,
                    latlng: x.latlng,
                    iso3: x.alpha3Code,
                }
            })
        }).then(x => {

            x.push({
                code: "Macedonia",
                population: 2077000,
                area: 67000,
                latlng: [41.67, 21.74],
                iso3: "MKD"
            })

            x.push({
                code: "Brunei",
                population: 428962,
                area: 5765,
                latlng: [4.53, 114.72],
                iso3: "BRN"
            })



            console.log("Hash: ", x);
            return x
        })




        /* info = info.map(x => {
                    return {
                        code: x.name,
                        population: x.population,
                        area: x.area
                    }
                }) */



        const hash = Object.assign({}, ...info.map(s => ({ [s.code]: s })));
        var rawData = await getCovidData("all")
            .then(y => {

                return y.filter(x => {
                    return x.country != "Diamond Princess" && x.country != "MS Zaandam" &&
                        !(x.country == "UK" && x.province != null);
                })
            })
            .then(data => {
                return data.map(x => {
                    const cntryName = String(x.country).trim()

                    if (hash[cntryName] == null) {
                        console.log(`${cntryName}.doesn't exists in hash`);
                    } else {
                        return {
                            name: cntryName,
                            timeline: x.timeline,
                            population: hash[cntryName].population,
                            area: hash[cntryName].area,
                            lat: hash[cntryName].latlng[0],
                            lng: hash[cntryName].latlng[1],
                            iso3:hash[cntryName].iso3
                            //radius: Math.sqrt(hash[x.country].area) * 50000 * x.Active / hash[x.country].population
                        }
                    }


                })

            }).then(x => {
                console.log(x);
                return x
            })


        var dataByDate = new Map()
        Object.entries(rawData[0].timeline.cases).forEach(x => {
            dataByDate.set(x[0], [])
        })

        this.d = new Date(getDates(rawData[0].timeline.cases)[0])

        rawData.forEach(cntry => {

            const cases = getPureData(cntry.timeline.cases)
            const deaths = getPureData(cntry.timeline.deaths)
            const recovered = getPureData(cntry.timeline.recovered)
            const dates = getDates(cntry.timeline.cases)

            for (let i = 0; i < cases.length; i++) {
                const data = {
                    name: cntry.name,
                    population: cntry.population,
                    area: cntry.area,
                    lat: cntry.lat,
                    lng: cntry.lng,
                    iso3: cntry.iso3,
                    cases: cases[i],
                    deaths: deaths[i],
                    recovered: recovered[i],
                    radCases: Math.sqrt(cntry.area) * 50000 * cases[i] / cntry.population,
                    radDeaths: Math.sqrt(cntry.area) * 50000 * deaths[i] / cntry.population,
                    radRecovered: Math.sqrt(cntry.area) * 50000 * recovered[i] / cntry.population,

                }
                dataByDate.get(dates[i]).push(data)

            }

        });
        /*
                console.log("Final Data:", dataByDate);
                var interval = setInterval(() => {
                    console.log("intervaling...");
                    const dateSimple = moment(this.nextDate()).format("M/D/YY")
                    if (dataByDate.has(dateSimple)) {
                        console.log("Data entry:", dataByDate.get(dateSimple));
                        this.setState({
                            data: dataByDate.get(dateSimple),
                            date: dateSimple + ""
                        })
                    } else {
                        console.log(dateSimple, "not found");
                    }
                    if (this.d >= new Date()) {
                        console.log("intervaling existing...");
                        window.clearInterval(interval);
                    }
                }, 100)
        */

        const dateSimple = moment(this.nextDate()).format("M/D/YY")
        if (dataByDate.has(dateSimple)) {
            console.log("Data entry:", dataByDate.get(dateSimple));
            this.setState({
                data: dataByDate.get(dateSimple),
                date: dateSimple + ""
            })
        }

    }

    size = {
        width: window.innerWidth * 70 / 100,
        height: window.innerHeight * 60 / 100
    }


    render() {
        console.log("...." , this.state.data)
        return (
            <div className="container">

                <div className="map"
                    style={this.size}
                >
                    <h3 className="mapTitle">{this.state.date}</h3>

                    <MapGlobe data = {this.state.data}/>



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


function getPureData(data) {

    var arr = []
    Object.entries(data).forEach(x => {
        arr.push(x[1])
    })
    return arr
}

function getDates(data) {

    var arr = []
    Object.entries(data).forEach(x => {
        arr.push(x[0])
    })
    return arr
}