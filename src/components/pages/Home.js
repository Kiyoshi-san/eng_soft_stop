import React, { Component } from 'react';
import Menu from "../shared/Menu";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
                <Menu />
                Home
            </div>
        )
    }
}