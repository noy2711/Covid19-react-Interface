import React, { Component, memo } from 'react';
import posed from 'react-pose';
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import {
    ComposableMap,
    Geographies,
    Geography,
    Sphere,
    Graticule,

} from "react-simple-maps";
import { rounded } from "../Utils/NumbersUtil"
import '../styles/MapGlobe.css'
class MapGlobe extends Component {
    constructor(props) {
        super(props)

        var csCases = scaleLinear()
            .domain([0.00, 0.03])
            .range(["#fff", "rgba(250, 250, 94, 0.89)"]);
        var csDeaths = scaleLinear()
            .domain([0.00, 0.001])
            .range(["#fff", "#ff5233"]);
        var csRecovered = scaleLinear()
            .domain([0.00, 0.02])
            .range(["#fff", "rgba(6, 255, 110, 0.767)"]);
        this.colorScales = [csCases, csDeaths, csRecovered]
        this.content = ""
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }
    geoUrl =
        "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }
    render() {




        const displayNumber = (d) => {

            switch (this.props.status) {
                case "cases":
                    return rounded(d.cases);
                case "deaths":
                    return rounded(d.deaths);
                case "recovered":
                    return rounded(d.recovered);

                default:
                    console.error("ERROR IN DISPLAY NUMBER");
                    return d.cases;
            }
        }


        const resizableScale = () => {
            let x = window.innerWidth;
            if (x > 1750)
                return 130
            if (x > 1360)
                return 100
            if (x > 970)
                return 70
            return 50
        }

        var data = this.props.data
        if (data.length > 0)
            return (
                <ComposableMap width={this.state.width / 2.5} data-tip="registerTip" data-for="registerTip" className="globeContainer"
                    projectionConfig={{
                        rotate: [-10, 0, 0],
                        scale: resizableScale(),

                    }}
                >

                    <Sphere stroke="#e4e5e6e3" strokeWidth={0.5} />
                    <Graticule stroke="#e4e5e6e3" strokeWidth={0.5} />
                    {data.length > 0 && (
                        <Geographies geography={this.geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {

                                    const d = data.find((s) =>
                                        String(s.iso3) === String(geo.properties.ISO_A3)
                                    );

                                    if (d)
                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                onMouseEnter={() => {
                                                    const { NAME, POP_EST } = geo.properties;
                                                    this.props.func(`${NAME} — ${displayNumber(d)}`);
                                                }}
                                                onMouseLeave={() => {
                                                    this.props.func(" ");
                                                }}
                                                style={{
                                                    default: {
                                                        outline: "red"
                                                    },
                                                    hover: {
                                                        stroke: "#000",
                                                        outline: "none"
                                                    },
                                                    pressed: {
                                                        outline: "red"
                                                    }
                                                }}
                                                fill={fillFunc(d, this.props.status, this.colorScales)}
                                            />
                                        )
                                    return (<></>)
                                })
                            }

                        </Geographies>
                    )}
                </ComposableMap>
            );
        else {
            return ('')
        }
    }
}
export default memo(MapGlobe)

function fillFunc(d, status, colorScales) {
    switch (status) {
        case "cases":
            return d ? colorScales[0](d.cases / d.population) : "#fff"
        case "deaths":
            return d ? colorScales[1](d.deaths / d.population) : "#fff"
        case "recovered":
            return d ? colorScales[2](d.recovered / d.population) : "#fff"
        default:
            return "#fff";
    }
}


