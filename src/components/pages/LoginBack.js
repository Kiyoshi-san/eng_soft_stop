import React, { Component } from 'react';
import { Redirect } from 'react-router';

import "../../css/login-back.css";

export default class LoginBack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sucsses: false,
            email: "",
            password: ""
        };
    }

    render() {
        const { sucsses } = this.state;

        if (sucsses) {
            return <Redirect to='/backoffice'/>;
        }

        return (
            <div>
            </div>
        );
    }
}