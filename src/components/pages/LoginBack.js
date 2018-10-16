import React, { Component } from 'react';
import axios from "axios";
import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';
import Card from 'react-bootstrap/lib/Card';
import Form from 'react-bootstrap/lib/Form';
import { Redirect } from 'react-router';

import StorageKey from '../../storage/StorageKey';
import "../../css/login.css";
import "../../css/login-back.css";

const loginLevel = 1;

export default class LoginBack extends Component {
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
            return <Redirect to='/home'/>;
        }

        return (
            <div className="d-flex login-body">
                {dirty && !sucsses && message !== "" && <Alert dismissible variant="danger" className="login-alert">
                    <Alert.Heading>Ops houve um erro!</Alert.Heading>
                    <p>
                        {message}.
                    </p>
                </Alert>}
                <Card bg="secondary" className="login-card">
                <Card.Body>
                    <Card.Title>Login do Usuário</Card.Title>
                    <form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="userName">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" placeholder="usuário" value={this.state.userName}
                                onChange={this.handleChange} />
                            <Form.Text className="text-muted">
                            Use aqui seu email e senha cadastrados.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="userPassword">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control type="password" placeholder="senha" value={this.state.userPassword}
                                onChange={this.handleChange} />
                        </Form.Group>
                        <Button variant="secondary" type="submit">Entrar</Button>
                    </form>
                </Card.Body>
                </Card>
            </div>
        );
    }
}