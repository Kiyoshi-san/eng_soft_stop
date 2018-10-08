import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Card from 'react-bootstrap/lib/Card';
import Form from 'react-bootstrap/lib/Form';

import "../../css/login.css";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="login-body">
                <Card className="login-card">
                <Card.Body>
                    <Card.Title>Login do Usuário</Card.Title>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="email" />
                        <Form.Text className="text-muted">
                        Use aqui seu email e senha cadastrados.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control type="password" placeholder="senha" />
                    </Form.Group>
                    <Form.Group id="formBasicChecbox">
                        <Form.Check type="checkbox" label="Mantenha-me logado" />
                    </Form.Group>
                    <Button variant="primary">Login</Button>
                </Card.Body>
                </Card>
            </div>

        );
    }
}