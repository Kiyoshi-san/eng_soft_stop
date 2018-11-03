import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { MDBTable, TableBody, TableHead, Fa, Input, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import axios from "axios";
import '../../css/home.css';

import StorageKey from '../../util/StorageKey';

import * as uiActions from '../../actions/uiActions';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            partidas: [],
            linhasTbl: [],
            qtdCols: 4,
            user: JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO)),
            logado: false,
            idMatch:0
        }
    }

    jogar = () => {
        let { user } = this.state;

        if (!user) {
            this.props.uiActions.loading("Efetuando login...");
            window.location.href = '/login';
        } else {
            this.props.uiActions.loading("Entrando na partida...");
            window.location.href = '/match';            
        }

        return;        
    }

    toggle(idMatch) {
        this.setState({
            modal: !this.state.modal,
            idMatch
        });
        console.log(idMatch)
    }

    info() {
        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} >
                <ModalHeader className="text-center" titleClass="w-100 font-weight-bold" toggle={this.toggle}>Sala</ModalHeader>
                <ModalBody>
                    <form className="mx-3 grey-text">
                        <Input id="cadLogin" label="Nome para login" icon="user" group type="text" onChange={this.handleChange} />
                        <Input id="cadSenha" label="Cadastro de Senha" icon="lock" group type="password" validate onChange={this.handleChange} />
                    </form>
                </ModalBody>
                <ModalFooter className="justify-content-center">
                    <Button onClick={this.jogar}>Jogar</Button>
                </ModalFooter>
            </Modal>
        )
    }

    matchDetail() {
        axios
        .get('https://es3-stop-prod.herokuapp.com//match/{this.state.idMatch}')
        .then(res => {
            this.setState({
                partidas: res.data.content
                // linhasTbl: [...this.state.linhasTbl, res.data.content.forEach(e => {e.description})]
            })
        })
        .catch(res => {
            
        });
    }

    /* Lista as partidas existentes */
    matchesList() {    
        axios
        .get('https://es3-stop-prod.herokuapp.com/matches')
        .then(res => {
            this.setState({
                partidas: res.data.content
                // linhasTbl: [...this.state.linhasTbl, res.data.content.forEach(e => {e.description})]
            })
        })
        .catch(res => {
            
        });
    }

    /* Montando a tabela com as partidas */
    componentTblMount() {
        let { partidas } = this.state,
        ctRow = 0,
        ctCol = 0,
        { qtdCols } = this.state,
        rows = Math.ceil(partidas.length/qtdCols);

        let table = []

        for (ctRow; ctRow < rows; ctRow++) {
            let children = [],
            i = 0;
            for (i; i < qtdCols; i++) {
                if(partidas[ctCol]) {
                    children.push(<td key={partidas[ctCol].match_id}> {partidas[ctCol].description}
                        <div class="faOptions">
                            <label class="iconTbl iconTbl-gamepad" onClick={this.jogar}>
                                <Fa icon="gamepad" className="ml-1"/>
                            </label>
                            <label class="iconTbl iconTbl-info" onClick={ () => {this.toggle(partidas[ctCol].match_id)} }>
                                <Fa icon="info" className="ml-1"/>
                            </label>
                        </div>
                    </td>)
                } else {
                    children.push(<td></td>)
                }
                ctCol++;
            }
            table.push(<tr>{children}</tr>)
        }
        return table

    }
    
    componentWillMount() {
        this.matchesList();
    }
    
    render() {
        let { qtdCols } = this.state;
        return (
            <div className="home-container row">
                { this.info() }
                <div className="col-sm-6">
                    <MDBTable bordered={true} striped={true}>
                        <TableHead color="deep-purple" textWhite>
                            <tr>
                                <th align="center" colSpan={ qtdCols }>Salas</th>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {
                                this.componentTblMount()
                            }
                        </TableBody>
                    </MDBTable>

                </div>
            </div>
        )
    }

    componentDidMount() {
        this.props.uiActions.stopLoading();
    }
}

Home.propTypes = {
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
)(Home);