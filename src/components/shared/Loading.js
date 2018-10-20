import React, { Component } from 'react';

export default class Loading extends Component {
    constructor(){
        super();
        this.state = {
            loading: false
        }

    }

    render() {
        const { loading } = this.state;

        if (loading) {
            return <div></div>;
        }

        return <div></div>;
    }
}