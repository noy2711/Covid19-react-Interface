import React, { Component, useState, useEffect } from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "../styles/Map.css";
import { Circle, Popup } from "react-leaflet";
import { getCovidData, getCountriesInfos, getWorldData, getCountries, getCountryData } from "../API/api";
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
            status: "deaths"
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

    onBtnPress = (status) => {
        this.setState({status: status})
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
        var allDates = []
        var rawData = await getCovidData("all")
            .then(y => {

                return y.filter(x => {
                    return x.country != "Diamond Princess" && x.country != "MS Zaandam"
                })
            })
            .then(x => {
                allDates = getDates(x[0].timeline.cases)
                return fixProvience(x)
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
                            iso3: hash[cntryName].iso3
                            //radius: Math.sqrt(hash[x.country].area) * 50000 * x.Active / hash[x.country].population
                        }
                    }


                })

            })


        var dataByDate = new Map()
        allDates.forEach(x => {
            dataByDate.set(x, [])
        })

        this.d = new Date(allDates[0])


        rawData.forEach(cntry => {

            const cases = cntry.timeline.cases
            const deaths = cntry.timeline.deaths
            const recovered = cntry.timeline.recovered

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
                dataByDate.get(allDates[i]).push(data)

            }

        });


        var interval = setInterval(() => {
            console.log("intervaling...");
            const dateSimple = moment(this.nextDate()).format("M/D/YY")
            if (dataByDate.has(dateSimple)) {
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


        /*
        // get to day number 150 [0, 250]
        for (let i = 0; i < 250; i++) {
            this.nextDate()
        }
        const dateSimple = moment(this.nextDate()).format("M/D/YY")
        if (dataByDate.has(dateSimple)) {
            const dd = dataByDate.get(dateSimple)
            var maxRatio = 0
            dd.forEach(element => {
                var ratio = element.cases / element.population;
                if (ratio > maxRatio)
                    maxRatio = ratio
            });

            this.setState({
                data: dd,
                date: dateSimple + "",
                maxRatio: maxRatio,
            })
        
        }
        */

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

            <div className="container">

                <div className="map"
                    style={this.size}
                >
                    <StatusButtons onBtnPress = {this.onBtnPress}/>

                    <h4 className="mapTitle">
                        {this.state.date}
                    </h4>

                    <TooltipComponent cssClass="tooltip-box" content={this.state.content} mouseTrail={true} showTipPointer={false}>
                        <MapGlobe func={this.setTooltip} data={this.state.data} ratio={this.state.maxRatio} status= {this.state.status}/>
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