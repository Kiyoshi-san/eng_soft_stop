import React, { Component } from 'react';

export default class Home extends Component {
    constructor(props) {
        super(props);
        window.location.reload();
    }

    render() {
        return (
            <div>
                Home
            </div>
        )
    }
}