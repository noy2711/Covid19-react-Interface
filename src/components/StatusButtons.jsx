import React, { Component } from 'react';
import '../styles/StatusButtons.css'

class StatusButtons extends Component {
    style = {}

    constructor(props) {
        super(props)
        this.state = {
            deathStyle: {},
            activeStyle: {},
            recoveredStyle: {},
        }
    }

  

    btnPress = (status, color) => {
        this.props.onBtnPress(status)
        const press = {
            boxShadow: `inset 0 50px 0 0 ${color}`,
            color: "white",
            borderColor: "#FFF",
        }
        const deathUnPress = {
            boxShadow: "inset 0 50px 0 0 white",
            border: "2px solid #db3c3c",
            color: "#db3c3c"
        }
        const recoverUnPress = {
            boxShadow: "inset 0 50px 0 0 white",
            border: "2px solid rgb(64, 185, 64)",
            color: "rgb(64, 185, 64)"
        }
        const activeUnPress = {
            boxShadow: "inset 0 50px 0 0 white",
            border: "2px solid orange",
            color: "orange"
        }

        switch (status) {
            case "deaths":
                this.setState({
                    deathStyle: press,
                    recoveredStyle: recoverUnPress,
                    activeStyle: activeUnPress
                })
                break;
            case "recovered":
                this.setState({
                    deathStyle: deathUnPress,
                    recoveredStyle: press,
                    activeStyle: activeUnPress
                })
                break;
            case "cases":
                this.setState({
                    deathStyle: deathUnPress,
                    recoveredStyle: recoverUnPress,
                    activeStyle: press
                })
                break;
        }
    }
    render() {
        return <div className="StatusBtns">

            <div id="deathBtn"
                onClick={() => { this.btnPress("deaths", "#db3c3c") }}
                style={this.state.deathStyle}
            >
                <div className="text">Deaths</div>
            </div>

            <div id="activeBtn"
                onClick={() => { this.btnPress("cases", "orange") }}
                style={this.state.activeStyle}
            >
                <div className="text">Active</div>
            </div>

            <div id="recoveredBtn"
                onClick={() => { this.btnPress("recovered", "rgb(64, 185, 64)") }}
                style={this.state.recoveredStyle}
            >
                <div className="text">Recovered</div>
            </div>
        </div >

    }
}

export default StatusButtons;
