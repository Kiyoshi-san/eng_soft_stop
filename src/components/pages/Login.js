import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from "axios";
import { Container, Row, Col, Input, Button } from 'mdbreact';
import { ToastContainer, toast } from "mdbreact";

import StorageKey from '../../util/StorageKey';
import * as uiActions from '../../actions/uiActions';
import NewAccountShared from '../shared/NewAccountShared';

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
            this.props.uiActions.stopLoading();
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

                    this.updateInventary()
                    .then(() =>{
                        window.location.href = '/home';
                    });
                    
                } else {
                    errorCallback("Usuário ou senha inexistente.");
                }
            })
            .catch(error => errorCallback(error));
    }

    updateInventary(){
        return new Promise((resolve, reject) =>{

            localStorage.setItem(StorageKey.INVENTARIO, JSON.stringify({
                credits: 40,
                score: 650,
                league_id: 10,
                league_description: 'Rubi',
                items: [{
                    item_type: 1,
                    item_name: 'Dica 1',
                    quantity: 3
                },{
                    item_type: 1,
                    item_name: 'Dica 2',
                    quantity: 2
                },{
                    item_type: 2,
                    item_name: 'Habilidade 1',
                    quantity: 1
                }]
            }))

            resolve();

        });        
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
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
                        
                        <label className="sem-cadastro-login"><a onClick={this.toggle}>Ainda não possui conta?</a></label>
                        <NewAccountShared modal={this.state.modal} toggle={this.toggle} />
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