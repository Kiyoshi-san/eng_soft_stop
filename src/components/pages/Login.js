import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Card from 'react-bootstrap/lib/Card';
import Form from 'react-bootstrap/lib/Form';
import { Redirect } from 'react-router';

import "../../css/login.css";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sucsses: false,
            email: "",
            password:    ""
        };
    }

    handleChange = (event) => {
        this.setState({
          [event.target.id]: event.target.value
        });
      }

    loginValidate = () => {
        if (this.state.email === "vitao" && this.state.password === "vitao") {
            this.setState({sucsses: true});
        }
    }

    render() {
        const { sucsses } = this.state;

        if (sucsses) {
            return <Redirect to='/home'/>;
        }

        return (
            <div className="d-flex login-body">
                <Card className="login-card">
                <Card.Body>
                    <Card.Title>Login do Usuário</Card.Title>
                    <form onSubmit={this.loginValidate}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="email" value={this.state.email}
                                onChange={this.handleChange} />
                            <Form.Text className="text-muted">
                            Use aqui seu email e senha cadastrados.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control type="password" placeholder="senha" value={this.state.password}
                                onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group id="formBasicChecbox">
                            <Form.Check type="checkbox" label="Mantenha-me logado" />
                        </Form.Group>
                        <Button variant="primary" type="submit">Login</Button>
                    </form>
                </Card.Body>
                </Card>
                <Card bg="primary" text="white" className="login-card">
                <Card.Body>
                    <Card.Title>Em Breve</Card.Title>
                    <Card.Text>
                        Em breve estaremos disponibilizando o cadastro a todos usuários,
                        por enquanto estamos preparando a melhor experiência pra você ;)
                    </Card.Text>
                </Card.Body>
                </Card>
            </div>

        );
    }
}