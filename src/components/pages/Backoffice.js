import React, { Component } from 'react';
import '../../css/backoffice.css';
import axios from "axios";
import MenuBackoffice from "../MenuBackoffice";
import BackPalavra from "../BackPalavra";

export default class Backoffice extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    
    render() {
        return (
            <div>
                <MenuBackoffice />
                <BackPalavra />
            </div>
        )
    }
}