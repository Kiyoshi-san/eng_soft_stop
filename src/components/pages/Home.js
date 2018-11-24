import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { MDBTable, TableBody, TableHead, Fa, Input, Button, Modal, ModalBody, ModalHeader, ModalFooter, Row, Col, ToastContainer, toast } from 'mdbreact';
import axios from "axios";

import Login from "../shared/Login";
import Userhome from "../shared/Userhome";
import * as uiActions from '../../actions/uiActions';
import StorageKey from '../../util/StorageKey';
import config from '../../util/Config';

import '../../css/home.css';
import banner from '../../images/homeBanner.png';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            partidas: [],
            partidasDescription: [],
            linhasTbl: [],
            qtdCols: 4,
            user: JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO)),
            inventary: JSON.parse(localStorage.getItem(StorageKey.INVENTARIO)),
            logado: false,
            idMatch: 0,
            listaCategorias: [],
            salaNome: "",
            qtdJogadores: 2,
            categoriasArrayEnvio: [],
            validacaoNomeSala: "hidden",
            validacaoQtdCategorias: "hidden",
            validacaoQtdJogadores: "hidden",
            redirect: 0,
            time: {},
            seconds: 5,
            tempo: 10,
            itens: [],
            item_type: 0,
        }
    }

    handleChange = (event) => {
        this.setState({
          [event.target.id]: event.target.value,
          dirty: true
        });
    }

    /* Pegando uma letra aleatoria */
    randomLetter () {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      
        text = possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
      }

    /* Dados para enviar para a Partida */
    colhendoDadosEntrandoPartida(idsala) {
        axios
        .get(`${config.match.match}/${this.state.idMatch}`)
        .then(res => {
            this.setState({
                partidasDescription: res.data.content
            });

            let iddasala = idsala?idsala:this.state.idMatch;
            let partidasDescription = res.data.content;
            
            /* Listando Categorias da Partida */
            let matchesCategoryList = [];

            if (partidasDescription.categories) {
                partidasDescription.categories.map(e => 
                    matchesCategoryList.push({"id":e.category_id,"name":e.name})
                );
            }
            
            /* Listando Jogadores da Partida */
            let matchesPlayersList = [],
            player = {};
    
            if (partidasDescription.players) {
                partidasDescription.players.map(e => {
                    player = {"id":e.user_id, "main":e.user_id === this.state.user.userId? true : false};
                    return matchesPlayersList.push(player);
                })
            }
    
            /* Pegando os itens selecionados */
            let elements = document.getElementsByName("selectedItens");
            let arrSelectedItens = [];

            elements.forEach((a) => {
                if ( a.checked ) {
                    arrSelectedItens.push({ "id": a.value, "userId": this.state.user.userId })
                }
            });

            let letter = this.randomLetter();
    
            let userGameData = {
                "matchid": iddasala,
                "letter": letter,
                "userList": matchesPlayersList,
                "categoryList": matchesCategoryList,
                "skillList": arrSelectedItens
              }

              this.entrandoPartida(iddasala, userGameData)

        })
        .catch(res => {
            return false;            
        });
        
    }

    entrandoPartida(iddasala, userGameData) {
        this.props.uiActions.loading("Entrando na partida...");

        axios
        .post(`${config.match.match}/${iddasala}/join`, { "player_id": this.state.user.userId })
        .then(res => {
            window.location.href = `/match/${iddasala}`;
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
            return false
        } else {
            return true;
        }
    }

    toggle = e => {
        this.setState({
            modal: !this.state.modal
        });
        this.matchDetail();
    }

    info() {
        let { partidasDescription } = this.state;
        
        /* Listando Categorias da Partida */
        let matchesCategoryList = [];
        if (partidasDescription.categories) {
            partidasDescription.categories.map(e => 
                matchesCategoryList.push(<p>- {e.name}</p>)
            );
        }
        
        /* Listando Jogadores da Partida */
        let matchesPlayersList = [];
        if (partidasDescription.players) {
            partidasDescription.players.map(e => 
                matchesPlayersList.push(<p>- {e.user_name}</p>)
            );
        }

        /* Status do Jogo */
        let status;
        
        if(partidasDescription.status === 1) {
                status = "Iniciado"
        } else if(partidasDescription.status === 2) {
                status = "Espera"
        } else {
            status = ""
        }

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} >
                <ModalHeader className="text-center pt-3 deep-purple lighten-2" titleclassName="w-100 font-weight-bold" toggle={this.toggle}><h3 className="white-text mb-3 pt-3 font-weight-bold">Sala {partidasDescription.description}</h3>
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
                    <Button color="secondary" className="roundedBtn" outline onClick={this.jogar}>Jogar</Button>
                    <Button color="danger" className="roundedBtn" outline onClick={this.toggle}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        )
    }

    matchDetail() {
        axios
        .get(`${config.match.match}/${this.state.idMatch}`)
        .then(res => {
            this.setState({
                partidasDescription: res.data.content
            }, () => { return (this.info()) })
        })
        .catch(res => {
            return false;            
        });
    }

    /* Lista as partidas existentes */
    matchesList() {
        axios
        .get(`${config.match.match}`)
        .then(res => {
            this.setState({
                partidas: res.data.content
            })
        })
        .catch(() => toast.error("Houve um erro na listagem de partidas"));
    }

    setActiveElement = (e) => {
        if(e) {
            e.preventDefault();
            this.setState({
                idMatch: e.currentTarget.dataset.id
            });
        }
    }

    /* Montando a tabela com as partidas */
    componentTblMount() {
        const { partidas, qtdCols, idMatch } = this.state;
        let ctRow = 0, ctCol = 0, rows = Math.ceil(partidas.length/qtdCols), table = [];

        for (ctRow; ctRow < rows; ctRow++) {
            let children = [],
            i = 0;
            for (i; i < qtdCols; i++) {
                if(partidas[ctCol]) {
                    children.push(<td key={partidas[ctCol].match_id} className={partidas[ctCol].match_id === idMatch?
                        "colTblActive colTbl" : "colTbl"} data-id={ partidas[ctCol].match_id } onClick={this.setActiveElement}>
                            {partidas[ctCol].description}
                        </td>);
                } else {
                    children.push(<td className="colTbl"></td>);
                }
                ctCol++;
            }
            table.push(<tr>{children}</tr>);
        }

        if (table.length) {
            table = [<tr className="text-center"><td>Não há partidas cadastradas</td></tr>];
        }

        return table;
    }

    /* Abrindo Modal
    - 2 - Criar Sala
    */
    toggleGeral(nr, func) {
        if (func)
        func();

        if(this.validacaoNomeSala || this.validacaoQtdCategorias || this.validacaoQtdJogadores) return

        let modalNumber = 'modal' + nr
        this.setState({
          [modalNumber]: !this.state[modalNumber]
        });
    }

    /* Lista as categorias existentes */
    categoryList() {
        axios
        .get(`${config.catogory.catogories}`)
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
                    <label className="label-margin">{lista[ctCol].name}</label>
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
                <ModalHeader className="text-center pt-3 deep-purple lighten-2" titleclassName="w-100 font-weight-bold" toggle={() => this.toggleGeral(2)}><h3 className="white-text mb-3 pt-3 font-weight-bold">Criar Sala</h3></ModalHeader>
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
                                    {this.componentTableGeral(this.state.listaCategorias)}
                                    </TableBody>
                                </MDBTable>

                                <div>
                                    {/* Qtd jogadores */}
                                    <label className={this.state.validacaoQtdJogadores + " validacao"}>Insira ao menos 2 jogadores</label>
                                    <label>N° máx de Jogadores: { this.state.qtdJogadores ? this.state.qtdJogadores : 2 }</label>
                                    <input id="qtdJogadores" type="range" className="slider" value={ this.state.qtdJogadores } min="2" max="10" onChange={ this.handleChange } />
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

    
    fnHandleChangeCheckItens = () => {
        let itensArrayEnvio = []

        let els = document.getElementsByName("itensArrayEnvio");
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

    /* Selecao de Itens do usuario para entrar na partida */
    escolherItensBtnJogar() {
        if(!this.validaLogin())
        return

        /* Colocar a validação, se nao tiver uma sala add nao abrirá a modal de escolha de itens */
        /* if() */
        
        this.iniciarTempoRedirect();
        
        let arrItens = [];
        let elemItens = {}

        let items = this.state.inventary.items
        items.map(e => {
            elemItens = {
                "item_id":e.item_id,
                "item_name":e.item_name
            };
            return arrItens.push(elemItens);
        })
        
        // this.startTimer
        this.setState({
            modal3: false,
            itens: arrItens
        }, () => {
                let tempo = 10
                this.setState({
                    tempo: 10
                })
                setInterval(() => {
                    tempo = tempo-1;
                    
                    if(tempo >= 0) {
                        this.setState({
                            tempo: tempo
                        })
                    } else return
                }, 1000);
                setTimeout(() => {
                    if(this.state.redirect) this.jogar()
                    else return
                }, 10000)
            }
        )        
    }

    /* Modal para escolher os itens antes da partida */
    modalEscolherItens() {
        const { user, itens } = this.state;
        
        if (user) {
            let arrItens = [];
            
            if(itens.length) {
                itens.map(e => 
                    arrItens.push(
                        <div>
                            <input name="selectedItens" type="checkbox" onChange={ this.fnHandleChangeCheckItens } value={ e.item_id }></input>
                            
                            <label className="label-margin">{ e.item_name }</label>
                        </div>
                    )
                );
            } else {
                arrItens = [];
                arrItens[0] = "Não há itens disponiveis";           
            }

            return (
                <Modal isOpen={this.state.modal3} toggle={() => this.toggleGeral(3)} >
                    <ModalHeader className="text-center pt-3 deep-purple lighten-2" titleclassName="w-100 font-weight-bold" toggle={() => this.toggleGeral(3)}><h3 className="white-text mb-3 pt-3 font-weight-bold">Escolher Itens</h3></ModalHeader>
                    {this.state.time.s}
                    <ModalBody>
                        <Row>
                            <Col size="3" className="d-flex justify-content-center align-items-center">
                                <Fa size="4x" icon="gamepad" className="ml-1" />
                            </Col>
                            <Col size="6">
                                { arrItens }
                            </Col>
                            <Col size="3">
                                <div className="crono">
                                    { this.state.tempo }
                                </div>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter className="justify-content-center">
                        <Button color="secondary" className="roundedBtn" outline onClick={this.jogar}>Jogar</Button>
                        <Button color="danger" className="roundedBtn" outline onClick={() => {this.toggleGeral(3, this.cancelarTempoRedirect )} }>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }
    
    setSelectedItens = () => {
        let arrSelectedItens = []

        let els = document.getElementsByName("selectedItens");
        els.forEach((a) => {
            if ( a.checked ) {
                arrSelectedItens.push({ "player_id": this.state.user.userId, "item_id": a.value })
            }
        })

        localStorage.setItem(StorageKey.SELECTEDITEMS, JSON.stringify(arrSelectedItens));
    }
    
    /* Entrando na partida */
    jogar = (e) => {
        this.setSelectedItens();

        if(!this.validaLogin()) return
        else this.colhendoDadosEntrandoPartida();

        return;
    }
    
    validacaoNomeSala = 0
    validacaoQtdCategorias = 0
    validacaoQtdJogadores = 0

    fnHandleChangeCheck = () => {
        let categoriasArrayEnvio = []

        let els = document.getElementsByName("categoriasArrayEnvio");
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
        .post(`${config.match.match}`, {
            "description": salaNome,
            "players_count": qtdJogadores,
            "creator_player_id": userId,
            "categories": categoriasArrayEnvio
        })
        .then(res => {
            this.matchesList()
        })
        .catch(err => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao cadastrar a Partida. Erro: " + err.response.data.messages);
        });
    }
    
    componentDidMount() {
        this.props.uiActions.loading("Preparando seu app...")
        this.matchesList();
        this.categoryList();
    }
    
    render() {
        const { qtdCols, user, inventary } = this.state;

        return (
            <div>
                <ToastContainer newestOnTop={true}/>
                <center>
                    <div className="shopBanner">
                        <img className="d-block banner animated fadeInDown" src={banner} alt="STOP GAME SHOP" />
                    </div>
                </center>

            <div className="home-container row">

                { this.info() }
                { this.criarSala() }
                { this.modalEscolherItens() }
                <div className="col-xs-8 col-sm-8 home-grid">
                    <div className="tblGridHeader">
                        <th className="tblTitle" align="center" colSpan={qtdCols}>Salas</th>
                    </div>
                    <div className="home-grid-match">
                        <MDBTable bordered={true} striped={true}>

                            <TableHead className="tblGridHeader" color="deep-purple" textWhite>
                            </TableHead>
                            <TableBody>
                                {this.componentTblMount()}
                            </TableBody>
                        </MDBTable>
                    </div>
                    <div className="home-grid-btn">
                        <Button className="btn btn-deep-purple" onClick={this.toggle}><Fa icon="info iconCircle" className="ml-1"/> Info</Button>
                        <Button className="btn btn-deep-purple" onClick={() => this.toggleGeral(2, this.validaLogin)}><Fa icon="plus iconCircle" className="ml-1"/> Criar Sala</Button>
                        <Button className="btn btn-deep-purple btnJogar" onClick={() => this.toggleGeral(3, this.escolherItensBtnJogar())}><Fa icon="gamepad iconCircle" className="ml-1"/> Jogar</Button>
                    </div>
                </div>
                <div className="col-xs-4 col-sm-4 home-grid-login">
                    {user ? <Userhome nick={user} userInventory={inventary} /> : <Login />}
                </div>
            </div>
            </div>
        )
    }
}

Home.propTypes = {
    uiActions: PropTypes.object,
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
