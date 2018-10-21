import React, { Component } from 'react';
import MenuTop from '../shared/MenuTop';

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <MenuTop/>
                Home
            </div>
        )
    }
}