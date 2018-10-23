import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from "axios";
import { Container, Row, Col, Input, Button } from 'mdbreact';
import { Redirect } from 'react-router';
import { ToastContainer, toast } from "mdbreact";

import StorageKey from '../../util/StorageKey';
import * as uiActions from '../../actions/uiActions';
import "../../css/login.css";

const loginLevel = 2;

class Login extends Component {
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
                    window.location.href = '/home';
                } else {
                    errorCallback("Usuário ou senha inexistente.");
                }
            })
            .catch(error => errorCallback(error));
    }

    render() {
        const { sucsses } = this.state;

        if (sucsses) {
            // return <Redirect to='/home'/>;
        }

        return (
            <Container>
                <ToastContainer newestOnTop={true}/>
                <Row>
                    <Col md="6">
                        <form onSubmit={this.handleSubmit}>
                            <p className="h5 text-center mb-4">Login do usuário</p>
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
                    </Col>
                </Row>
            </Container>
        );
    }
}

Login.propTypes = {
    uiActions: PropTypes.object
};

function mapDispatchToProps(dispatch) {
    return {
        uiActions: bindActionCreators(uiActions, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(Login);