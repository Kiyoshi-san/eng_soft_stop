import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { MDBTable, TableBody, TableHead, Fa, Input, Button, Modal, ModalBody, ModalHeader, ModalFooter, Row, Col, Badge } from 'mdbreact';
import axios from "axios";
import '../../css/home.css';

import StorageKey from '../../util/StorageKey';

import * as uiActions from '../../actions/uiActions';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            partidas: [],
            partidasDescription: [],
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

    toggle = e => {
        this.setState({
            modal: !this.state.modal
        });
        if(e) {
            e.preventDefault();
            this.setState({
                idMatch: e.currentTarget.value
            }, () => {
                console.log(this.state.idMatch)
                this.matchDetail();
            });
        }
    }

    info() {
        let { partidasDescription } = this.state;

        /* Listando Categorias da Partida */
        let matchesCategoryList = [];
        if (partidasDescription.categories) {
            partidasDescription.categories.map(e => {
                matchesCategoryList.push(<p>- {e.name}</p>)
            })
        }
        
        /* Listando Categorias da Partida */
        let matchesPlayersList = [];
        if (partidasDescription.players) {
            partidasDescription.players.map(e => {
                matchesPlayersList.push(<p>- {e.user_name}</p>)
            })
        }

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} >
                <ModalHeader className="text-center" titleClass="w-100 font-weight-bold" toggle={this.toggle}>Sala {partidasDescription.description}</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col size="3" className="d-flex justify-content-center align-items-center">
                            <Fa size="4x" icon="gamepad" className="ml-1" />
                        </Col>
                        <Col size="9">
                            <MDBTable bordered={true} striped={true}>
                                <TableBody>
                                    <tr>
                                        <td>
                                            <h5>Categoria(s)</h5>
                                        </td>
                                        <td> { matchesCategoryList } </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h5>Jogadores</h5>
                                        </td>
                                        <td> { matchesPlayersList } </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h5>N° de Jogadores</h5>
                                        </td>
                                        <td> { partidasDescription.players_count } </td>
                                    </tr>
                                </TableBody>
                            </MDBTable>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className="justify-content-center">
                    <Button class="btn btn-deep-purple" onClick={this.jogar}>Jogar</Button>
                    <Button class="btn btn-danger" onClick={this.toggle}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        )
    }

    matchDetail() {
        axios
        .get('https://es3-stop-prod.herokuapp.com/match/' + this.state.idMatch)
        .then(res => {
            this.setState({
                partidasDescription: res.data.content
                // linhasTbl: [...this.state.linhasTbl, res.data.content.forEach(e => {e.description})]
            }, () => { return (this.info()) })
        })
        .catch(res => {
            return false;            
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
                    children.push(<td key={partidas[ctCol].match_id} className="colTbl-width"> {partidas[ctCol].description}
                        <div class="faOptions">
                            <label class="iconTbl iconTbl-gamepad" onClick={this.jogar}>
                                <Fa icon="gamepad" className="ml-1"/>
                            </label>
                            {/* <label class="iconTbl iconTbl-info" onClick={ () => {this.toggle(partidas[ctCol].match_id)} }> */}
                            <button class="iconTbl iconTbl-info" value={ partidas[ctCol].match_id } onClick={ this.toggle }>
                                <Fa icon="info" className="ml-1"/>
                            </button>
                        </div>
                    </td>)
                } else {
                    children.push(<td className="colTbl-width"></td>)
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
                <div className="col-xs-12 col-sm-7">
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