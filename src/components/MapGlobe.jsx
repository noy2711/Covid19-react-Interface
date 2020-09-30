import React, { Component } from 'react';
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import {
    ComposableMap,
    Geographies,
    Geography,
    Sphere,
    Graticule
} from "react-simple-maps";


export default class MapGlobe extends Component {
    render() {
        const geoUrl =
            "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

        const colorScale = scaleLinear()
            .domain([0.00, 0.68])
            .range(["#ffedea", "#ff5233"]);

        var data = this.props.data
        console.log(data);
        return (
            <ComposableMap
                projectionConfig={{
                    rotate: [-10, 0, 0],
                    scale: 147,
                }}
            >
                <Sphere stroke="#e4e5e6e3" strokeWidth={0.5} />
                <Graticule stroke="#e4e5e6e3" strokeWidth={0.5} />
                {data.length > 0 && (
                    <Geographies geography={geoUrl}>
                        {console.log("Data length", data.length)}
                        {({ geographies }) =>
                            geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} />)
                        }

                       
                    </Geographies>
                )}
            </ComposableMap>
        );
    }
}


