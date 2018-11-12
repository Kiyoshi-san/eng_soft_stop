import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { MDBTable, TableBody, TableHead, Fa, Input, Button, Modal, ModalBody, ModalHeader, ModalFooter, Row, Col, ToastContainer, toast, partidasDescription, Container, Card, CardBody } from 'mdbreact';
import axios from "axios";
import '../../css/home.css';

import Login from "./Login.js";
import Userhome from "./Userhome.js";

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
            listaCategorias: [],
            salaNome: "",
            qtdJogadores: 2,
            categoriasArrayEnvio: [],
            validacaoNomeSala: "hidden",
            validacaoQtdCategorias: "hidden",
            validacaoQtdJogadores: "hidden",
            itens: [],
            redirect: 0,
            time: {},
            seconds: 5
        }
        this.setActiveElement = this.setActiveElement.bind(this);

        /* Timer */
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        /* Fim Timer */
    }

    handleChange = (event) => {
        this.setState({
          [event.target.id]: event.target.value,
          dirty: true
        });
    }
    
    entrandoPartida(idsala) {
        let iddasala = idsala?idsala:this.state.idMatch
        axios
        .post('https://es3-stop-prod.herokuapp.com/match/' + iddasala + "/join", { "player_id": this.state.user.userId })
        .then(res => {
            this.props.uiActions.loading("Entrando na partida...");
            window.location.href = '/match';
        })
        .catch(res => {
            toast.error("Ocorreu um erro, tente novamente mais tarde")
            return false;            
        });
    }
    
    validaLogin = () => {
        let { user } = this.state;
        
        if (!user) {
            toast.warn("Por gentileza efetue o login")
            /* this.props.uiActions.loading("Efetuando login...");
            window.location.href = '/login'; */
            return false
        } else {
            return true;
        }
    }
    
    jogar = (e) => {
        /* if(e) {
            e.preventDefault();
            this.setState({
                idMatch: e.currentTarget.value
            }, () => {
                if(!this.validaLogin()) return
                else this.entrandoPartida();
            });
        } */
        if(!this.validaLogin()) return
        else this.entrandoPartida();
        return;        
    }

    toggle = e => {
        this.setState({
            modal: !this.state.modal
        });
        /* if(e) {
            e.preventDefault();
            this.setState({
                idMatch: e.currentTarget.value
            }, () => {
                this.matchDetail();
            });
        } */
        this.matchDetail();
    }

    info() {
        let { partidasDescription } = this.state;
        /* if(!partidasDescription.match_id) {
            toast.error("Selecione uma sala para obter informações");
            return
        } */
        
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

        /* Status do Jogo */
        let status;
        
        if(partidasDescription.status == 1) {
                status = "Iniciado"
        } else if(partidasDescription.status == 2) {
                status = "Espera"
        } else {
            status = ""
        }

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} >
                <ModalHeader className="text-center pt-3 deep-purple lighten-2" titleClass="w-100 font-weight-bold" toggle={this.toggle}><h3 className="white-text mb-3 pt-3 font-weight-bold">Sala {partidasDescription.description}</h3>
                </ModalHeader>
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
                                            <h5>N° máx. de Jogadores</h5>
                                        </td>
                                        <td> { partidasDescription.players_count } </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h5>Status do jogo</h5>
                                        </td>
                                        <td> { status } </td>
                                    </tr>
                                </TableBody>
                            </MDBTable>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className="justify-content-center">
                    {/* <Button color="secondary" className="roundedBtn" outline onClick={this.jogar}>Jogar</Button> */}
                    <Button color="secondary" className="roundedBtn" outline onClick={this.escolherItensBtnJogar}>Jogar</Button>
                    <Button color="danger" className="roundedBtn" outline onClick={this.toggle}>Cancelar</Button>
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

    setActiveElement = (e) => {
        if(e) {
            e.preventDefault();
            this.setState({
                idMatch: e.currentTarget.dataset.id
            }/* , () => {
                alert(this.state.idMatch)
            } */);
        }
        return;   
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
                    children.push(<td key={partidas[ctCol].match_id} className={partidas[ctCol].match_id == this.state.idMatch? "colTblActive colTbl" : "colTbl"} data-id={ partidas[ctCol].match_id } onClick={this.setActiveElement}> {partidas[ctCol].description}
                        {/* <div>
                            <button class="iconTbl iconTbl-gamepad" value={ partidas[ctCol].match_id } onClick={this.jogar}>
                                <Fa icon="gamepad" className="ml-1"/>
                            </button>
                            <button class="iconTbl iconTbl-info" value={ partidas[ctCol].match_id } onClick={ this.toggle }>
                                <Fa icon="info" className="ml-1"/>
                            </button>
                        </div> */}
                    </td>)
                } else {
                    children.push(<td className="colTbl"></td>)
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
    toggleGeral(nr, func) {
        func;
        if(this.validacaoNomeSala || this.validacaoQtdCategorias || this.validacaoQtdJogadores) return

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
        return
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
                    children.push(<td key={ lista[ctCol].category_id } className="colTbl">
                    <input id="categoriasArrayEnvio" name="categoriasArrayEnvio" type="checkbox" onChange={ this.fnHandleChangeCheck } value={ lista[ctCol].category_id }></input>
                    <label class="label-margin">{lista[ctCol].name}</label>
                    </td>)
                } else {
                    children.push(<td className="colTbl"></td>)
                }
                ctCol++;
            }
            table.push(<tr>{children}</tr>)
        }
        return table
    }

    criarSala() {
        if(!this.state.user) return

        return (
            <Modal isOpen={this.state.modal2} toggle={() => this.toggleGeral(2)} >
                <ModalHeader className="text-center pt-3 deep-purple lighten-2" titleClass="w-100 font-weight-bold" toggle={() => this.toggleGeral(2)}><h3 className="white-text mb-3 pt-3 font-weight-bold">Criar Sala</h3></ModalHeader>
                <ModalBody>
                        <section className="form-light">
                        <Row>
                            <Col md="12">
                                {/* Nome da Sala */}
                                <label className={this.state.validacaoNomeSala + " validacao"}>Insira um nome de sala válido</label>
                                <Input id="salaNome" label="Nome da Sala" onChange={ this.handleChange } group type="text" validate />

                                {/* Selecao de Categorias */}
                                <label className={this.state.validacaoQtdCategorias + " validacao"}>Insira ao menos 3 categorias</label>
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
                                    {/* Qtd jogadores */}
                                    <label className={this.state.validacaoQtdJogadores + " validacao"}>Insira ao menos 2 jogadores</label>
                                    <label>N° máx de Jogadores: { this.state.qtdJogadores ? this.state.qtdJogadores : 2 }</label>
                                    <input id="qtdJogadores" type="range" class="slider" value={ this.state.qtdJogadores } min="2" max="10" onChange={ this.handleChange } />
                                </div>
                            </Col>
                        </Row>
                        </section>
                </ModalBody>
                <ModalFooter className="justify-content-center">
                    <Button color="secondary" className="roundedBtn" outline onClick={() => this.toggleGeral(2, this.criarPartida())}>Criar</Button>
                    <Button color="danger" className="roundedBtn" outline onClick={() => this.toggleGeral(2)}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        )
    }

    itensList = () => {
        axios
        // .get('https://es3-stop-prod.herokuapp.com/items' + this.state.user.userId)
        .get('https://es3-stop-prod.herokuapp.com/items')
        .then(res => {
            this.setState({
                itens: res.data.content
            })
            return true
        })
        .catch(res => {
            return false;            
        });
    }

    
    fnHandleChangeCheckItens = () => {
        let itensArrayEnvio = []

        var els = document.getElementsByName("itensArrayEnvio");
        els.forEach((a) => {
            if ( a.checked ) {
                itensArrayEnvio.push({ "category_id": a.value })
            }
            this.setState({
                itensArrayEnvio
            })            
        })
    }

    iniciarTempoRedirect = () => {
        // alert("a")
        if(!this.state.redirect) {
            this.setState({
                redirect: 1
            })
        }
    }

    cancelarTempoRedirect = () => {
        if(this.state.redirect) {
            this.setState({
                redirect: 0
            })
        }
    }

    escolherItensBtnJogar() {

        if(!this.state.user) return

        this.iniciarTempoRedirect();
        console.log("a")

        // this.startTimer
        setTimeout(() => {
            this.setState({
                modal3: false
            })
            if(this.state.redirect) this.jogar()
            else return
        }, 10000)

    }

    modalEscolherItens() {
        let { itens } = this.state;

        let arrItens = [];
        itens.map(e => {
            arrItens.push(
                <div>
                    <input name="itensArrayEnvio" type="checkbox" onChange={ this.fnHandleChangeCheckItens } value={ e.item_id }></input>
                    
                    <label class="label-margin">{ e.item_name }</label>
                </div>
            )
        })

        return (
            <Modal isOpen={this.state.modal3} toggle={() => this.toggleGeral(3)} >
                <ModalHeader className="text-center pt-3 deep-purple lighten-2" titleClass="w-100 font-weight-bold" toggle={() => this.toggleGeral(3)}><h3 className="white-text mb-3 pt-3 font-weight-bold">Escolher Itens</h3></ModalHeader>
                {this.state.time.s}
                <ModalBody>
                    <Row>
                        <Col size="3" className="d-flex justify-content-center align-items-center">
                            <Fa size="4x" icon="gamepad" className="ml-1" />
                        </Col>
                        <Col size="9">
                            { arrItens }
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className="justify-content-center">
                    <Button color="secondary" className="roundedBtn" outline onClick={this.jogar}>Jogar</Button>
                    <Button color="danger" className="roundedBtn" outline onClick={() => {this.toggleGeral(3, this.cancelarTempoRedirect() )} }>Cancelar</Button>
                </ModalFooter>
            </Modal>
        )
    }

    /* Timer */
    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }

    componentDidMount() {
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({ time: timeLeftVar });
    }

    startTimer() {
        if (this.timer == 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });

        // Check if we're at zero.
        if (seconds == 0) {
            clearInterval(this.timer);
        }
    }
    
    /* Fim Timer */
    
    validacaoNomeSala = 0
    validacaoQtdCategorias = 0
    validacaoQtdJogadores = 0

    fnHandleChangeCheck = () => {
        let categoriasArrayEnvio = []

        var els = document.getElementsByName("categoriasArrayEnvio");
        els.forEach((a) => {
            if ( a.checked ) {
                categoriasArrayEnvio.push({ "category_id": a.value })
            }
            this.setState({
                categoriasArrayEnvio
            })            
        })
    }

    criarPartida() {
        let { salaNome } = this.state,
        { qtdJogadores } = this.state,
        { userId } = this.state.user,
        { categoriasArrayEnvio } = this.state

        if(!salaNome) {
            this.setState({
                validacaoNomeSala: "show"
            })
            this.validacaoNomeSala = 1
            setTimeout(
                () => {
                    this.setState({
                        validacaoNomeSala: "hidden"
                    })
                    this.validacaoNomeSala = 0
                }
            , 3000);
            return
        } else if(categoriasArrayEnvio.length < 3) {
            this.setState({
                validacaoQtdCategorias: "show"
            })
            this.validacaoQtdCategorias = 1
            setTimeout(
                () => {
                    this.setState({
                        validacaoQtdCategorias: "hidden"
                    })
                    this.validacaoQtdCategorias = 0
                }
            , 3000);
            return
        } else if(qtdJogadores < 2) {
            this.setState({
                validacaoQtdJogadores: "show"
            })
            this.validacaoQtdJogadores = 1
            setTimeout(
                () => {
                    this.setState({
                        validacaoQtdJogadores: "hidden"
                    })
                    this.validacaoQtdJogadores = 0
                }
            , 3000);
            return
        }
        
        axios
        .post('https://es3-stop-prod.herokuapp.com/match', {
            "description": salaNome,
            "players_count": qtdJogadores,
            "creator_player_id": userId,
            "categories": categoriasArrayEnvio
        })
        .then(res => {
            console.log("Sala Criada")
            this.matchesList()
        })
        /* .then(() => {
            let {partidas} = this.state;
            this.entrandoPartida(partidas[partidas.length].match_id)
        }) */
        .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao cadastrar a Partida. Erro: " + res.response.data.messages);
        });
    }

    loginComponent = () => {
        if(!this.state.user){
            return (
                <Login />
                )
        } else {
            return (
                <Userhome 
                    userData = {this.state.user}
                />
            )
        }
    }
    
    componentWillMount() {
        this.matchesList();
        this.categoryList();
        this.itensList();
    }
    
    render() {
        let { qtdCols } = this.state;
        return (
            <div className="home-container row">
                { this.info() }
                { this.criarSala() }
                { this.modalEscolherItens() }
                <div className="col-xs-8 col-sm-8 home-grid">
                    <div class="tblGridHeader">
                        <th className="tblTitle" align="center" colSpan={ qtdCols }>Salas</th>
                    </div>
                    <div className="home-grid-match">
                        <MDBTable bordered={true} striped={true}>
                            <ToastContainer 
                                newestOnTop={true}/>

                            <TableHead class="tblGridHeader" color="deep-purple" textWhite>
                            </TableHead>
                            <TableBody>
                                {
                                    this.componentTblMount()
                                }
                            </TableBody>
                        </MDBTable>
                    </div>
                    <div className="home-grid-btn">
                        <Button class="btn btn-deep-purple" onClick={this.toggle}><Fa icon="info iconCircle" className="ml-1"/> Info</Button>
                        <Button class="btn btn-deep-purple" onClick={() => this.toggleGeral(2, this.validaLogin())}><Fa icon="plus iconCircle" className="ml-1"/> Criar Sala</Button>
                        {/* <Button class="btn btn-deep-purple btnJogar" onClick={this.jogar}><Fa icon="gamepad iconCircle" className="ml-1"/> Jogar</Button> */}
                        <Button class="btn btn-deep-purple btnJogar" onClick={() => this.toggleGeral(3, this.escolherItensBtnJogar())}><Fa icon="gamepad iconCircle" className="ml-1"/> Jogar</Button>
                    </div>
                </div>
                <div className="col-xs-4 col-sm-4 home-grid-login">
                    { this.loginComponent() }
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