import React, { Component } from "react";
// import logo from '../logo.svg';
import logo from '../images/stop_logo.png';
import Menu from "./Menu";

export default class Header extends Component {
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="logo_stop" alt="logo" />
                {/* <img src={logo} className="App-logo" alt="logo" /> */}
                <Menu />
            </header>
        );
    }
}