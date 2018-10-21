import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from "axios";
import { Input, Button } from 'mdbreact';
import { Redirect } from 'react-router';

import StorageKey from '../../util/StorageKey';
import * as uiActions from '../../actions/uiActions';
import "../../css/login.css";
import "../../css/login-back.css";

import logo from '../../images/stop_logo_v2.png';

const loginLevel = 1;

class LoginBack extends Component {
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

        this.props.uiActions.loading("Efetuando login...");

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

        this.props.uiActions.stopLoading();
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
        const { sucsses } = this.state;

        if (sucsses) {
            return <Redirect to='/'/>;
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <img src={logo} className="logo_stop" alt="stop" />
                    <div className="grey-text">
                        <Input id="userName" label="Usuário" icon="user" value={this.state.userName} 
                            group type="text" onChange={this.handleChange} />
                        <Input id="userPassword" label="Senha" icon="lock" value={this.state.userPassword}
                            group type="password" onChange={this.handleChange} />
                    </div>
                    <div className="text-center">
                        <Button type="submit">Entrar</Button>
                    </div>
                </form>
            </div>
        );
    }
}

LoginBack.propTypes = {
    uiActions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
    return {
        uiActions: bindActionCreators(uiActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(LoginBack);