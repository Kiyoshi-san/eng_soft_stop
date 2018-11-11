import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from "axios";
import { Container, Row, Col, Fa, Input, Button } from 'mdbreact';
import { ToastContainer, toast } from "mdbreact";

import StorageKey from '../../util/StorageKey';
import NewAccountShared from '../shared/NewAccountShared';

import "../../css/login.css";
import logo from '../../images/stop_logo_v2.png';
import rightArrow from '../../images/right-arrow-icon.png';
import * as uiActions from '../../actions/uiActions';

let Userhome = ({userData}) => {
    console.log(userData.userName)

    let perfil = () => {        
        uiActions.loading("Carregando dados...");
        window.location.href = '/perfil';
    }

    let logout = () => {        
        uiActions.loading("Efetuando logout...");
        window.location.href = '/logout';
    }


    return (
        <div className="col-xs-12 col-sm-12">
            <ToastContainer newestOnTop={true}/>
            <Row>
                <form class="form-login">
                    <div className="tituloLogin" align="center">Login</div>
                    <div className="row">
                        <div className="imgPerfil col-sm-5">
                            <Fa size="4x" icon="user" className="ml-1" />
                        </div>
                        <div className="col-sm-7">
                            <Col md="12">
                                <b>Nick:</b> { userData.userName }
                            </Col>
                            <Col md="12">
                                <b>Pontos:</b> 380
                            </Col>
                        </div>
                    </div>
                    
                    <div className="text-center">

                        <div className="row">
                            <div className="col-sm-5">
                                <Button className="btn btn-deep-purple" onClick={perfil}><Fa icon="info iconCircle" className="ml-1"/>Perfil</Button>
                            </div>
                            <div className="col-sm-5">
                                <Button className="btn btn-deep-purple" onClick={logout}><Fa icon="sign-out" className="ml-1"/>Deslogar</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Row>
        </div>
    );
}

export default Userhome;