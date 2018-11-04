import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { MDBTable, TableBody, TableHead, Fa, Input, Button, Modal, ModalBody, ModalHeader, ModalFooter, Row, Col, ToastContainer, toast, partidasDescription, Container, Card, CardBody } from 'mdbreact';
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
            idMatch: 0,
            qtdJogadores: 0,
            listaCategorias: []
        }
    }

    handleChange = (event) => {
        this.setState({
          [event.target.id]: event.target.value,
          dirty: true
        });
    }
    
    entrandoPartida() {
        axios
        .get('https://es3-stop-prod.herokuapp.com/match/' + this.state.idMatch + "/join")
        .then(res => {
            this.props.uiActions.loading("Entrando na partida...");
            window.location.href = '/match';
        })
        .catch(res => {
            toast.error("Ocorreu um erro, tente novamente mais tarde")
            return false;            
        });
    }
    
    jogar = (e) => {
        if(e) {
            e.preventDefault();
            this.setState({
                idMatch: e.currentTarget.value
            }, () => {
                if (!user) {
                    // toast.warn("Por gentileza efetue o login")
                    this.props.uiActions.loading("Efetuando login...");
                    window.location.href = '/login';
                } else {
                    this.entrandoPartida();
                }
            });
        }
        let { user } = this.state;


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
                            <button class="iconTbl iconTbl-gamepad" value={ partidas[ctCol].match_id } onClick={this.jogar}>
                                <Fa icon="gamepad" className="ml-1"/>
                            </button>
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

    /* Abrindo Modal
    - 2 - Criar Sala
    */
    toggleGeral(nr) {
        let modalNumber = 'modal' + nr
        this.setState({
          [modalNumber]: !this.state[modalNumber]
        });
    }

    /* Lista as categorias existentes */
    categoryList() {    
        axios
        .get('https://es3-stop-prod.herokuapp.com/categories')
        .then(res => {
            this.setState({ 
                listaCategorias: res.data.content
            })
            this.props.uiActions.stopLoading();
        })
        .catch(res => {
            toast.error('Erro ao listar as categorias. Erro: ' + res.response.data.messages);
            this.props.uiActions.stopLoading();
        });
    }
    

    /* Montando uma tabela Geral */
    componentTableGeral(lista) {
        let ctRow = 0,
        ctCol = 0,
        { qtdCols } = this.state,
        rows = Math.ceil(lista.length/qtdCols);

        let table = []

        for (ctRow; ctRow < rows; ctRow++) {
            let children = [],
            i = 0;
            for (i; i < qtdCols; i++) {
                if(lista[ctCol]) {
                    children.push(<td key={ lista[ctCol].value } className="colTbl-width">
                    <input type="checkbox" onChange={ this.handleChange } value={ lista[ctCol].value }></input>
                    <label class="label-margin">{lista[ctCol].name}</label>
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

    criarSala() {
        this.categoryList()
        let { listaCategorias } = this.state;

        return (
            <Modal isOpen={this.state.modal2} toggle={() => this.toggleGeral(2)} >
                <ModalHeader className="text-center pt-3 deep-purple lighten-2" titleClass="w-100 font-weight-bold" toggle={() => this.toggleGeral(2)}><h3 className="white-text mb-3 pt-3 font-weight-bold">Criar Sala</h3></ModalHeader>
                <ModalBody>
                        <section className="form-light">
                        <Row>
                            <Col md="12">
                                <Input label="Nome da Sala" group type="text" validate />
                                    <MDBTable className="tblCategory" bordered={true} striped={true}>
                                        <TableBody>
                                        { 
                                            /* this.state.listaCategorias.map((res, i) => {
                                                return (
                                                    <tr key={i} className="clickable">
                                                        <td><input type="checkbox" onChange={ this.handleChange } value={ i }></input><label class="label-margin">{res.name}</label></td>
                                                    </tr>
                                                )
                                            })  */
                                            this.componentTableGeral(this.state.listaCategorias)
                                        }
                                        </TableBody>
                                    </MDBTable>
                                <div>
                                    <label>N° máx de Jogadores: { this.state.qtdJogadores ? this.state.qtdJogadores : 0 }</label>
                                    <input id="qtdJogadores" type="range" class="slider" value={ this.state.qtdJogadores } min="0" max="10" onChange={ this.handleChange } />
                                </div>
                            </Col>
                        </Row>
                        </section>
                </ModalBody>
                <ModalFooter className="justify-content-center">
                    <Button color="secondary" className="roundedBtn" outline onClick={() => this.toggleGeral(2)}>Criar</Button>
                    <Button color="danger" className="roundedBtn" outline onClick={() => this.toggleGeral(2)}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        )
    }
    
    componentWillMount() {
        this.matchesList();
    }
    
    render() {
        let { qtdCols } = this.state;
        return (
            <div className="home-container row">
                { this.info() }
                { this.criarSala() }
                <div className="col-xs-12 col-sm-12">
                    <MDBTable bordered={true} striped={true}>
                        <ToastContainer 
                            newestOnTop={true}/>

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
                <div className="col-xs-12 col-sm-12">
                    <Button class="btn btn-deep-purple" onClick={() => this.toggleGeral(2)}>Criar Sala</Button>
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