import React, { Component } from 'react'
import { styles } from "./styles/ScreenInfoStyles";
export default class ScreenInfo extends Component {
    
    render() {
        return (
            <div style={styles.container}>
                Width: {window.innerWidth} <br/>
                Height: {window.innerHeight}
            </div>
        )
    }
}
