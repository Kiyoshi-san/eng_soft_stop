import React, { Component } from 'react';
import axios from "axios";
import { Redirect } from 'react-router';

import StorageKey from '../../util/StorageKey';
import "../../css/login.css";

const loginLevel = 2;

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            dirty: false,
            sucsses: false,
            userName: "",
            userPassword: ""
        };
    }

    handleChange = (event) => {
        this.setState({
          [event.target.id]: event.target.value,
          dirty: true
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const body = {
            user_name: this.state.userName,
            user_password: this.state.userPassword
        }

        this.validateLogin(body, (error) => {
            this.setState({
                sucsses: false,
                message: `Não foi possível efetuar o login pelo seguinte erro:
                    ${error.response.data.messages[0]}`,
                userName: "",
                userPassword: ""
            });
        });
    }

    validateLogin = (body, errorCallback) => {
        axios.post(`https://es3-stop-prod.herokuapp.com/auth/login/${loginLevel}`, body)
            .then(res => {
                if (res.data.status_code === 200) {
                    this.setState({
                        sucsses: true,
                    });
                    localStorage.setItem(StorageKey.AUTENTICACAO, JSON.stringify({
                        type: loginLevel,
                        userId: res.data.content.user_id,
                        userName: res.data.content.user_name
                    }));
                } else {
                    errorCallback("Usuário ou senha inexistente.");
                }
            })
            .catch(error => errorCallback(error));
    }

    render() {
        const { sucsses, message, dirty } = this.state;

        if (sucsses) {
            window.location.reload();
            return <Redirect to='/home'/>;
        }

        return (
            <div>
            </div>
        );
    }
}