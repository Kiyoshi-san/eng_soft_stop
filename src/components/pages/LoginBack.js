import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from "axios";
import { Container, Row, Col, Input, Button } from 'mdbreact';
import { ToastContainer, toast } from "mdbreact";

import StorageKey from '../../util/StorageKey';
import * as uiActions from '../../actions/uiActions';
import config from '../../util/Config';

import "../../css/login.css";
import logo from '../../images/stop_logo_v2.png';
import rightArrow from '../../images/right-arrow-icon.png';

const loginLevel = 1;

class LoginBack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sucsses: false,
            userName: "",
            userPassword: ""
        };
    }

    handleChange = (event) => {
        this.setState({
          [event.target.id]: event.target.value
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
                userName: "",
                userPassword: ""
            });

            toast.error(`${error.response ? error.response.data.messages[0] : error}`);

            this.props.uiActions.stopLoading();
        });

    }

    validateLogin = (body, errorCallback) => {
        axios.post(`${config.auth.login}/${loginLevel}`, body)
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
                    window.location.href = '/backoffice-dashboard';
                } else {
                    errorCallback("Usuário ou senha inexistente.");
                }
            })
            .catch(error => errorCallback(error));
    }

    render() {
        return (
            <div className="div-container-login-backoffice">
            <Container className="container-login-backoffice">
                <ToastContainer newestOnTop={true}/>
                <Row>
                    <form className="form-login-back col-md-12" onSubmit={this.handleSubmit}>
                        <img src={logo} className="logo_stop-backoffice" alt="stop" />
                        <Col md="12">
                            <div className="grey-text">
                                <Col md="12">
                                    <Input id="userName" label="Usuário" icon="user" value={this.state.userName} 
                                        group type="text" onChange={this.handleChange} />
                                </Col>
                                <Col md="12">
                                    <Input id="userPassword" label="Senha" icon="lock" value={this.state.userPassword}
                                        group type="password" onChange={this.handleChange} />
                                </Col>
                            </div>
                        </Col>
                        <div className="text-center">
                            <Button color="primary-color-dark" className="btn-login-backoffice col-md-12" type="submit">
                                Entrar
                                <img src={rightArrow} className="rightArrow-backoffice" alt="" />
                            </Button>
                        </div>
                    </form>
                </Row>
            </Container>
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