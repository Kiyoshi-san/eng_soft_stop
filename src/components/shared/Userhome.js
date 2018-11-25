import React from 'react';
import { Row, Col, Fa, Button } from 'mdbreact';
import { ToastContainer, } from "mdbreact";


import "../../css/login.css";
import * as uiActions from '../../actions/uiActions';

let Userhome = ({nick, userInventory}) => {
    let perfil = () => {        
        uiActions.loading("Carregando dados...");
        window.location.href = '/profile';
    }

    let logout = () => {        
        uiActions.loading("Efetuando logout...");
        window.location.href = '/logout';
    }


    return (
        <div className="col-xs-12 col-sm-12">
            <ToastContainer newestOnTop={true}/>
            <Row>
                <form className="form-login">
                    <div className="tituloLogin" align="center">Usuário</div>
                    <div className="row login-form-body">
                        <div className="imgPerfil col-sm-5">
                            <Fa size="4x" icon="user" className="ml-1" />
                        </div>
                        <div className="col-sm-7">
                            <Col md="12">
                                <b>Nick:</b> { nick.userName }
                            </Col>
                            <Col md="12">
                                <b>Pepitas:</b> {userInventory.score} <i className="fa fa-diamond" aria-hidden="true" />
                            </Col>
                        </div>
                    </div>
                    
                    <div>
                        <div className="row text-center">
                            <div className="col-sm-5 btn-shell">
                                <Button className="btn btn-deep-purple btn-login-home" onClick={perfil}><Fa icon="info iconCircle" className="ml-1"/>Perfil</Button>
                            </div>
                            <div className="col-sm-5 btn-shell">
                                <Button className="btn btn-deep-purple btn-login-home" onClick={logout}><Fa icon="sign-out iconCircle" className="ml-1"/>Deslogar</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Row>
        </div>
    );
}

export default Userhome;