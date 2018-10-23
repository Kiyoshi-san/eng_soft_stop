import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from "axios";
import { Container, Row, Col, Input, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import { Redirect } from 'react-router';
import { ToastContainer, toast } from "mdbreact";

import StorageKey from '../../util/StorageKey';
import * as uiActions from '../../actions/uiActions';
import "../../css/login.css";

import logo from '../../images/stop_logo_v2.png';
import rightArrow from '../../images/right-arrow-icon.png';

const loginLevel = 2;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sucsses: false,
            userName: "",
            userPassword: "",
            modal: false,
            cadLogin:"",
            cadSenha:""
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
                userPassword: "",
                modal: false
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
        
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
        
        if(this.state.modal) {
            axios.post('https://es3-stop-prod.herokuapp.com/auth/login', {data: { "user_name": this.state.cadLogin, "user_password": this.state.cadSenha }})
            .then(res => {
                toast.success("Usuário cadastrado com sucesso.");
            })
            .catch(res => {
                toast.error("Erro ao cadastrar o usuário. Erro: " + res.response.data.messages);
            })
        }
    }

    render() {
        const { sucsses } = this.state;

        if (sucsses) {
            // return <Redirect to='/home'/>;
        }

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
                        
                        <label className="sem-cadastro-login"><a onClick={() => this.toggle(1)}>Ainda não possui conta?</a></label>
                        <Modal isOpen={this.state.modal} toggle={() => this.toggle(1)} >
                        <ModalHeader className="text-center" titleClass="w-100 font-weight-bold" toggle={() => this.toggle(1)}>Cadastro de Usuário</ModalHeader>
                        <ModalBody>
                            <form className="mx-3 grey-text">
                                <Input id="cadLogin" label="Nome para login" icon="user" group type="text" onChange={this.handleChange} />
                                <Input id="cadSenha" label="Cadastro de Senha" icon="lock" group type="password" validate onChange={this.handleChange}/>
                            </form>
                        </ModalBody>
                        <ModalFooter className="justify-content-center">
                            <Button onClick={() => this.toggle(1)}>Login</Button>
                        </ModalFooter>
                        </Modal>
                        
                        <div className="text-center">
                            <Button color="primary-color-dark" className="btn-login-backoffice col-md-12" type="submit">Entrar<img src={rightArrow} className="rightArrow-backoffice" /></Button>
                        </div>
                    </form>
                </Row>
            </Container>
            </div>
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