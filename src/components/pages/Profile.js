import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'mdbreact';
import swal from 'sweetalert';
import { Card, CardBody, CardTitle, Badge } from 'mdbreact';
import { Container, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import { Table, TableBody, TableHead } from 'mdbreact';

import axios from "axios";
import StorageKey from '../../util/StorageKey';

import * as uiActions from '../../actions/uiActions';
import '../../css/backoffice.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO)),
            inventary: JSON.parse(localStorage.getItem(StorageKey.INVENTARIO)),
            backEndURL: 'https://es3-stop-prod.herokuapp.com',
            listaLigas: [],
            listaItens: [],
            tipsAmount: 0,
            skillsAmount: 0,
            modalLigas: false,
            modalMeusItens: false,
            modalCompraCredito: false,
            tipType: 1,
            skillType: 2,
            item_type: 0,
            userCredits: 0
        }
    }


    /* Executa ao carregar o componente */
    componentDidMount() {
        this.listarLigas();

        let tipsAmount = this.state.inventary.items.filter(item => item["item_type"] === this.state.tipType);
        let skillsAmount = this.state.inventary.items.filter(item => item["item_type"] === this.state.skillType);

        this.setState({
            tipsAmount: tipsAmount.length,
            skillsAmount: skillsAmount.length,
            userCredits: this.state.inventary.credits
        });
    }


    /* Atualizar o inventário do jogador */
    updateInventary(){

        let userId = JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO)).userId;

        return new Promise((resolve) =>{

            axios
            .get(this.state.backEndURL + '/inventory/' + userId)
            .then(res => {
                localStorage.setItem(StorageKey.INVENTARIO, JSON.stringify(res.data.content));
                resolve(true);
            })
            .catch(res => {
                resolve(false);
            });
        });        
    }


    // *********************** INÍCIO - LIGAS ***********************


    /* Abre o modal para visualizar as ligas */
    clickLigas(){

        this.setState({
            
        }, () => {
            this.toggleModalLigas();
        });
        
    }


    /* Controla visibilidade do modal de compra de créditos */
    toggleModalLigas = () => {
        this.setState({
            modalLigas: !this.state.modalLigas
        });
    }


    /* Carrega a lista com as ligas existentes */
    listarLigas() {
        
        axios
        .get(this.state.backEndURL + '/leagues')
        .then(res => {
            this.setState({ 
                listaLigas: res.data.content
            })
        })
        .catch(res => {
            toast.error('Erro ao listar as ligas. Erro: ' + res.response.data.messages);
        });

    }



    // *********************** FIM - LIGAS ***********************  
    


    // *********************** INÍCIO - MEUS ITENS ***********************


    // *********************** FIM - MEUS ITENS ***********************


     /* Abre o modal para visualizar os itens */
    clickMeusItens(item_type){

        let items = this.state.inventary.items.filter(item => item["item_type"] === item_type);

        this.setState({
            item_type: item_type,
            listaItens: items
        }, () => {
            this.toggleModalMeusItens();
        });       
        
    }


    /* Controla visibilidade do modal de visualizar os itens */
    toggleModalMeusItens = () => {
        this.setState({
            modalMeusItens: !this.state.modalMeusItens
        });
    }



    // *********************** INÍCIO - SALDO ***********************


    /* Abre o modal para efetuar compra de créditos */
    clickComprarCredito(){

        this.setState({
            
        }, () => {
            this.toggleModalCompraCredito();
        });
        
    }


    /* Controla visibilidade do modal de compra de créditos */
    toggleModalCompraCredito = () => {
        this.setState({
            modalCompraCredito: !this.state.modalCompraCredito
        });
    }


    /* Efetiva a compra dos créditos */
    efetuarCompraCredito(quantity){

        let body = {
            player_id: this.state.user.userId,
            type: 0, //Credit
            cashAmount: quantity
        }

        swal({
            title: "Tem certeza?",
            text: "- O valor será debitado da sua conta",
            icon: "warning",
            dangerMode: true,
            buttons: ["Cancelar", "OK"],
          })
          .then((willBuy) => {
            if (willBuy) {
          
                this.props.uiActions.loading("Efetuando compra...");

                axios
                .post(this.state.backEndURL + '/cash', body)
                .then(res => {

                    //Atualiza inventário do jogador com a nova quantidade de créditos
                    this.updateInventary()
                    .then((res) =>{

                        this.props.uiActions.stopLoading();
                        swal("Feito!", "Compra de " + quantity + " créditos concluída", "success");

                        this.setState({
                            userCredits: this.state.userCredits + quantity
                        });
      
                        this.toggleModalCompraCredito();
                    });                   

                })
                .catch(res => {
                    this.props.uiActions.stopLoading();
                    toast.error("Erro ao efetuar compra dos créditos. Erro: " + res.response.data.messages);
                });
  
            }
          });
    }


    // *********************** FIM - SALDO ***********************


    //Renderização da tela
    render(){
        return (
            <div className="backContainer">
                {/* ALERTAS */}
                <ToastContainer 
                    newestOnTop={true}/>
                
                {/* Título da página */}
                <blockquote className="blockquote bq-purple">                        
                    <p className="bq-title purple-text"><i className="fa fa-user-circle" aria-hidden="true"/> Perfil</p>
                </blockquote>

                <div className="backContainer row">
                    <div className="col-md-10 offset-1">
                    
                        <div className="card">                    
                            <div className="card-body">

                                <div className="price header white-text purple-gradient rounded-top dash-padding text-center" style={{marginBottom: 20}}>                                    
                                    <h4 className="option" style={{fontWeight: 500}}><i className="fa fa-user-circle" aria-hidden="true"/> - { this.state.user.userName }</h4>
                                </div>

                                <div className="row">

                                    {/* ITENS */}
                                    <div className="col-md-4 animated flash">

                                        <Card border="purple" className="rgba-grey-slight">
                                            <CardBody className="purple-text">
                                                <CardTitle tag="h5"><i className="fa fa-diamond" aria-hidden="true" /> PONTUAÇÃO</CardTitle>
                                                <br />
                                                <h1 className="text-center" style={{fontWeight: 500}}>{ this.state.inventary.score }</h1><h6 className="text-center grey-text"> PEPITAS</h6>
                                                <br />                                              
                                                <h5 className="text-center clickable" style={{fontWeight: 500}} onClick={ () => this.clickLigas() }><Badge color="purple-color"><i className="fa fa-star-o" aria-hidden="true" />&nbsp;&nbsp; LIGA { this.state.inventary.league_description.toUpperCase() } &nbsp;&nbsp;<i className="fa fa-star-o" aria-hidden="true" /></Badge></h5>
                                            </CardBody>
                                        </Card>

                                    </div>
                                
                                    {/* PONTUAÇÃO */}
                                    <div className="col-md-4 animated flash">

                                        <Card border="info" className="rgba-grey-slight">
                                            <CardBody className="text-info">
                                                <CardTitle tag="h5"><i className="fa fa-cubes" aria-hidden="true" /> MEUS ITENS</CardTitle>
                                                <br />

                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h1 className="text-center" style={{fontWeight: 500}}>{ this.state.tipsAmount }</h1><h6 className="text-center grey-text"> DICAS</h6>
                                                        <br />                                              
                                                        <h5 className="text-center clickable" style={{fontWeight: 500}} onClick={ () => this.clickMeusItens(this.state.tipType) }><Badge color="info">VISUALIZAR &nbsp;&nbsp;<i className="fa fa-lightbulb-o" aria-hidden="true" /></Badge></h5>
                                                    </div>
                                                    <div className="col-md-6" style={{borderLeft: '1px solid grey'}}>
                                                        <h1 className="text-center" style={{fontWeight: 500}}>{ this.state.skillsAmount }</h1><h6 className="text-center grey-text"> HABILIDADES</h6>
                                                        <br />                                              
                                                        <h5 className="text-center clickable" style={{fontWeight: 500}} onClick={ () => this.clickMeusItens(this.state.skillType) }><Badge color="info">VISUALIZAR &nbsp;&nbsp;<i className="fa fa-superpowers" aria-hidden="true" /></Badge></h5>
                                                    </div>
                                                </div>                                                
                                                
                                            </CardBody>
                                        </Card>

                                    </div>

                                    {/* CRÉDITOS */}
                                    <div className="col-md-4 animated flash">

                                        <Card border="success" className="rgba-grey-slight">
                                            <CardBody className="text-success">
                                                <CardTitle tag="h5"><i className="fa fa-money" aria-hidden="true" /> SALDO</CardTitle>
                                                <br />
                                                <h1 className="text-center" style={{fontWeight: 500}}>{ this.state.userCredits }</h1><h6 className="text-center grey-text"> CRÉDITO(S)</h6>
                                                <br />
                                                <h5 className="text-center clickable" style={{fontWeight: 500}} onClick={ () => this.clickComprarCredito() }><Badge color="success">COMPRAR MAIS &nbsp;&nbsp;<i className="fa fa-money" aria-hidden="true" /></Badge></h5>                                                
                                            </CardBody>
                                        </Card>

                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {/* MODAL de LIGAS */}
                <Container>
                    <Modal isOpen={this.state.modalLigas} toggle={this.toggleModalLigas} size="lg">
                    <ModalHeader toggle={this.toggleModalLigas} className="purple-color">
                        <b>Ligas</b>
                    </ModalHeader>
                    <ModalBody>

                        {/* Lista - LIGAS */}
                        <br />
                        <div className="row">
                            <div className="col">
                                <Table responsive>
                                    <TableBody>
                                        { this.state.listaLigas.map((res, i) => {
                                            return (
                                                <tr key={i} className={ this.state.inventary.league_id === res.league_id ? 'current' : '' }>
                                                    <td className="text-center">
                                                        { this.state.inventary.league_id === res.league_id && <h6 className="text-center grey-text"><b>VOCÊ ESTÁ AQUI: </b></h6>}
                                                        <h5 className="text-center purple-text" style={{fontWeight: 500}}>{ res.description.toUpperCase() }</h5><h6 className="text-center grey-text"><Badge color="purple-color">{ res.range_min } + <i className="fa fa-diamond" aria-hidden="true" /></Badge></h6>
                                                    </td>
                                                </tr>
                                            )
                                        }) }
                                    </TableBody>
                                </Table>
                            </div>                            
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="purple" onClick={this.toggleModalLigas}>Fechar</Button>
                    </ModalFooter>
                    </Modal>
                </Container>


                {/* MODAL de MEUS ITENS */}
                <Container>
                    <Modal isOpen={this.state.modalMeusItens} toggle={this.toggleModalMeusItens} size="lg">
                    <ModalHeader toggle={this.toggleModalMeusItens} className="purple-color">
                        <b>Minhas { this.state.item_type === this.state.tipType ? ' Dicas' : ' Habilidades' }</b>
                    </ModalHeader>
                    <ModalBody>

                        {/* Lista - ITENS */}
                        <br />
                        <div className="row">
                            <div className="col">
                                <Table hover responsive>
                                    <caption>{this.state.listaItens.length === 0 ? 'Nenhuma ' + (this.state.item_type === this.state.tipType ? ' dica' : ' habilidade') + ' encontrada' : this.state.listaItens.length + (this.state.item_type === this.state.tipType ? ' dicas' : ' habilidades') + ' encontradas'} </caption>
                                    <TableHead color="purple-color">
                                        <tr>
                                            <th width="80%">DESCRIÇÃO</th>
                                            <th width="20%" className="text-center">QUANTIDADE</th>
                                        </tr>
                                    </TableHead>
                                    <TableBody>
                                        { this.state.listaItens.map((res, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td><i className={`purple-text fa ${this.state.item_type === this.state.tipType ? 'fa-lightbulb-o' : 'fa-superpowers'}`} aria-hidden="true"/> { res.item_name }</td>
                                                    <td className="text-center">X { res.quantity }</td>
                                                </tr>
                                            )
                                        }) }
                                    </TableBody>
                                </Table>
                            </div>                            
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="purple" onClick={this.toggleModalMeusItens}>Fechar</Button>
                    </ModalFooter>
                    </Modal>
                </Container>


                {/* MODAL de COMPRA DE CRÉDITO */}
                <Container>
                    <Modal isOpen={this.state.modalCompraCredito} toggle={this.toggleModalCompraCredito} size="lg">
                    <ModalHeader toggle={this.toggleModalCompraCredito} className="purple-color">
                        <b>Compra de Créditos</b>
                    </ModalHeader>
                    <ModalBody>

                        <div className="row">
                            <div className="col-md-12">
                                <p>Selecione a opção de crédito desejada: </p>
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-md-4">
                                <Card border="success" className="clickable rgba-grey-slight" onClick={ () => this.efetuarCompraCredito(50) }>
                                    <CardBody className="text-success">
                                        <CardTitle tag="h6" className="text-center">ECONÔMICA</CardTitle>
                                        <br />
                                        <h1 className="text-center" style={{fontWeight: 500}}>50</h1><h6 className="text-center grey-text"> CRÉDITOS</h6>
                                        <br />                                              
                                        <h5 className="text-center" style={{fontWeight: 500}}>R$ 3,90</h5>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-md-4">
                                <Card border="success" className="clickable rgba-grey-slight" onClick={ () => this.efetuarCompraCredito(250) }>
                                    <CardBody className="text-success">
                                        <CardTitle tag="h6" className="text-center">JUSTA</CardTitle>
                                        <br />
                                        <h1 className="text-center" style={{fontWeight: 500}}>250</h1><h6 className="text-center grey-text"> CRÉDITOS</h6>
                                        <br />                                              
                                        <h5 className="text-center" style={{fontWeight: 500}}>R$ 18,90</h5>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-md-4">
                                <Card border="success" className="clickable rgba-grey-slight" onClick={ () => this.efetuarCompraCredito(500) }>
                                    <CardBody className="text-success">
                                        <CardTitle tag="h6" className="text-center">AVASSALADORA</CardTitle>
                                        <br />
                                        <h1 className="text-center" style={{fontWeight: 500}}>500</h1><h6 className="text-center grey-text"> CRÉDITOS</h6>
                                        <br />                                              
                                        <h5 className="text-center" style={{fontWeight: 500}}>R$ 36,90</h5>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="purple" onClick={this.toggleModalCompraCredito}>Fechar</Button>
                    </ModalFooter>
                    </Modal>
                </Container>

            </div>
        );
    }

}

Profile.propTypes = {
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
)(Profile);