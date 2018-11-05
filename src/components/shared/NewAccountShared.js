import React, { Component } from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';

import * as uiActions from '../../actions/uiActions';
import logo from '../../images/Diamond_512.gif';
import error from '../../images/error.png';

class NewAccountShared extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cadLogin:"",
            cadSenha:"",
            messages: "",
            erro: false,
            loading: false
        }
    }

    handleChange = (event) => {
        this.setState({
          [event.target.id]: event.target.value
        });
    }

    cleanError = () => {
        this.setState({
            erro: !this.state.erro
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            loading: true,
            messages: "Enviando usuário..."
        });        
        axios.post('https://es3-stop-prod.herokuapp.com/auth/login', { "user_name": this.state.cadLogin, "user_password": this.state.cadSenha })
            .then(() => {
                this.setState({
                    loading: false,
                    messages: ""
                });
                this.toggle();
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    erro: true,
                    messages: "Erro ao cadastrar o usuário."
                });
            });
    }

    toggle = () => {
        this.props.toggle();
    }

    render() {
        const { loading, erro } = this.state;

        return (
            <div>
                <Modal isOpen={this.props.modal} toggle={this.toggle} >
                    <form className="mx-3 grey-text" onSubmit={this.handleSubmit}>
                        <ModalHeader className="text-center" titleClass="w-100 font-weight-bold" toggle={this.toggle}>Cadastro de Usuário</ModalHeader>
                        <ModalBody>
                            {loading || erro ?
                                <div className="justify-content-center">
                                    <img src={erro ? error : logo} className="logo_stop-backoffice" alt="stop" />
                                    <div className="d-flex justify-content-center">
                                        {this.state.messages}
                                        {erro && <a className="text-primary" onClick={this.cleanError}>Tentar novamente</a>}
                                    </div>
                                </div>
                                :
                                <div>
                                    <Input id="cadLogin" label="Nome para login" icon="user" group type="text" onChange={this.handleChange} />
                                    <Input id="cadSenha" label="Cadastro de Senha" icon="lock" group type="password" validate onChange={this.handleChange}/>
                                </div>
                            }
                        </ModalBody>
                        <ModalFooter className="justify-content-center">
                            <Button type="submit">Cadastrar</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        )
    }

    componentDidMount() {
        this.props.uiActions.stopLoading();
    }
}

NewAccountShared.propTypes = {
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
)(NewAccountShared);