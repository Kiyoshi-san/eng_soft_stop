import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'mdbreact';
import { Button, Table, TableBody, TableHead } from 'mdbreact';
import { Container, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';

import axios from "axios";
import StorageKey from '../../util/StorageKey';
import banner from '../../images/shopBanner.png';
import config from '../../util/Config';

import * as uiActions from '../../actions/uiActions';
import '../../css/backoffice.css';

class Shop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO)),
            listaDicas: [],
            listaHabilidades: [],
            modalCompra: false,
            tipType: 1,
            skillType: 2,
            item_type: 0,
            item_id: 0,
            item_name: '',
            item_description: '',
            item_price: 0,
            item_quantity: 1
        }
    }


    /* Executa ao carregar o componente */
    componentDidMount() {
        this.listarDicas();
        this.listarHabilidades();
    }


    /* Atualizar o inventário do jogador */
    updateInventary(){

        let userId = JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO)).userId;

        return new Promise((resolve) =>{

            axios
            .get(`${config.inventory}/${userId}`)
            .then(res => {
                localStorage.setItem(StorageKey.INVENTARIO, JSON.stringify(res.data.content));
                resolve(true);
            })
            .catch(res => {
                resolve(false);
            });
        });        
    }


    /* Abre o modal para efetuar compra */
    clickComprar(item_type, item_id, item_name, item_description, item_price){

        this.setState({
            item_type: item_type,
            item_id: item_id,
            item_name: item_name,
            item_description: item_description,
            item_price: item_price,
            item_quantity: 1
        }, () => {
            this.toggleModalCompra();
        });
        
    }


    /* Controla visibilidade do modal de compra */
    toggleModalCompra = () => {
        this.setState({
            modalCompra: !this.state.modalCompra
        });
    }


    /* Aumenta a quantidade do item a ser comprada */
    clickAumentarQuantidade()
    {
        this.setState({
            item_quantity: (this.state.item_quantity + 1)
        });
    }


    /* Diminui a quantidade do item a ser comprada */
    clickDiminuirQuantidade()
    {
        if(this.state.item_quantity === 1)
            return false;

        this.setState({
            item_quantity: (this.state.item_quantity - 1)
        });
    }


    /* Efetua a compra do item */
    efetuarCompra() 
    {
        let body = {
            player_id: this.state.user.userId,
            item_id: this.state.item_id,
            quantity: this.state.item_quantity,
            purchasePrice: (this.state.item_quantity * this.state.item_price)
        }

        this.props.uiActions.loading("Processando...");
            
        axios
        .post(config.items.buy, body)
        .then(res => {

            //Atualiza inventário do jogador com os novos itens
            this.updateInventary()
            .then((res) =>{

                this.props.uiActions.stopLoading();
                toast.success("Compra efetuada com sucesso.");
                this.toggleModalCompra();

                this.setState({
                    item_type: 0,
                    item_id: 0,
                    item_name: '',
                    item_description: '',
                    item_price: 0,
                    item_quantity: 1
                });
            }); 
        })
        .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao efetuar a compra. Erro: " + res.response.data.messages);
        });
    }


    // *********************** INÍCIO - DICAS ***********************


    /* Lista as Dicas existentes */
    listarDicas() {
        
        this.props.uiActions.loading("Preparando Visualização...");

        axios
        .get(config.item.items)
        .then(res => {

            this.props.uiActions.stopLoading();

            //Recupera só os itens de Dicas que estejam disponíveis ou em breve
            let tips = res.data.content.filter(item => item["item_type"] === this.state.tipType && item["item_status"] < 2);
                
            this.setState({
                listaDicas: tips
            })
        })
        .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao listar as dicas. Erro: " + res.response.data.messages);
        });
    }
    // *********************** FIM - DICAS **************************

    // *********************** INÍCIO - HABILIDADES ***********************
    /* Lista as Dicas existentes */
    listarHabilidades() {
        
        this.props.uiActions.loading("Preparando Visualização...");

        axios
        .get(config.item.items)
        .then(res => {

            this.props.uiActions.stopLoading();

            //Recupera só os itens de Habilidades que estejam disponíveis ou em breve
            let tips = res.data.content.filter(item => item["item_type"] === this.state.skillType && item["item_status"] < 2);
                
            this.setState({
                listaHabilidades: tips
            })
        })
        .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao listar as habilidades. Erro: " + res.response.data.messages);
        });
    }


    // *********************** FIM - HABILIDADES **************************

    
    //Renderização da tela
    render(){
        return (
            <div className="backContainer">
                {/* ALERTAS */}
                <ToastContainer 
                    newestOnTop={true}/>

                {/* BANNER da Loja */}
                <center>
                    <div className="shopBanner">
                        <img className="d-block banner animated fadeInDown" src={banner} alt="STOP GAME SHOP" />
                    </div>
                </center>

                <br />
                <br />
                    
                {/* <!-- Section: Dicas --> */}
                <section>
                    <div className="card">
                        <div className="card-body">

                            {/* Título da SECTION DICAS */}
                            <blockquote className="blockquote bq-purple text-center animated fadeInLeft">                        
                                <p className="bq-title purple-text no-spacing"><i className="fa fa-lightbulb-o" aria-hidden="true"/> DICAS</p>
                                <span className="bq-span purple-text"> Que tal uma mãozinha praquelas categorias que sempre te deixam em apuros?</span>
                            </blockquote>

                            <br />

                            {/* Lista - DICAS */}
                            <div className="backContainer row">
                                <div className="col">
                                    <Table responsive hover>
                                        <TableHead color="purple-color">
                                            <tr>
                                                <th width="25%">NOME</th>
                                                <th width="45%">DESCRIÇÃO</th>
                                                <th width="20%" className="text-right">PREÇO</th>
                                                <th width="10%" className="text-center"></th>
                                            </tr>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.listaDicas.map((res, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td><h5><i className="fa fa-lightbulb-o purple-text" aria-hidden="true"/>&nbsp;&nbsp; {res.item_name}</h5></td>
                                                        <td><h6>{res.item_description}</h6></td>
                                                        <td className="text-right"><h5 style={{fontWeight: 400}}>{res.item_price} créditos</h5></td>
                                                        <td className="text-center">
                                                        {/* EM BREVE */}
                                                        { res.item_status === 0 && <Button rounded color="orange" className="disabled btn-md" title="Este item estará disponível para comprar em breve"><i className="fa fa-diamond" arria-hidden="true" /> Em breve</Button> }
                                                        {/* Botão COMPRAR */}
                                                        { res.item_status === 1 && <Button rounded color="success" className="btn-md" title="Comprar Dica" onClick={ () => this.clickComprar(this.state.tipType, res.item_id, res.item_name, res.item_description, res.item_price) }><i className="fa fa-diamond" arria-hidden="true" /> Comprar</Button>}
                                                        {/* INDISPONÍVEL */}
                                                        { res.item_status === 2 && <Button rounded color="red" className="disabled btn-md" title="Este item não está mais disponível para compra"><i className="fa fa-diamond" arria-hidden="true" /> Indisponível</Button> }
                                                        </td>
                                                    </tr>
                                                )
                                            }) }
                                        </TableBody>
                                    </Table>
                                </div>                            
                            </div>
                        
                        </div>
                </div>
                </section>

                <br />
                <br />

                {/* <!-- Section: Habilidades  --> */}
                <section>
                    <div className="card">
                        <div className="card-body">
                    
                            {/* Título da SECTION HABILIDADES */}
                            <blockquote className="blockquote bq-purple text-center animated fadeInRight">                        
                                <p className="bq-title purple-text no-spacing"><i className="fa fa-superpowers" aria-hidden="true"/> HABILIDADES</p>
                                <span className="bq-span purple-text"> Adquira habilidades especiais que te dão incríveis vantagens durante uma partida!</span>
                            </blockquote>

                            <br />

                            {/* Lista - HABILIDADES */}
                            <div className="backContainer row">
                                <div className="col">
                                    <Table responsive hover>
                                        <caption>{this.state.listaHabilidades.length === 0 ? 'Nenhuma habilidade encontrada' : ''} </caption>
                                        <TableHead color="purple-color">
                                            <tr>
                                                <th width="25%">NOME</th>
                                                <th width="45%">DESCRIÇÃO</th>
                                                <th width="20%" className="text-right">PREÇO</th>
                                                <th width="10%" className="text-center"></th>
                                            </tr>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.listaHabilidades.map((res, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td><h5><i className="fa fa-superpowers purple-text" aria-hidden="true"/>&nbsp;&nbsp; {res.item_name}</h5></td>
                                                        <td><h6>{res.item_description}</h6></td>
                                                        <td className="text-right"><h5 style={{fontWeight: 400}}>{res.item_price} créditos</h5></td>
                                                        <td className="text-center">
                                                        {/* EM BREVE */}
                                                        { res.item_status === 0 && <Button rounded color="orange" className="disabled btn-md" title="Este item estará disponível para comprar em breve"><i className="fa fa-diamond" arria-hidden="true" /> Em breve</Button> }
                                                        {/* Botão COMPRAR */}
                                                        { res.item_status === 1 && <Button rounded color="success" className="btn-md" title="Comprar Habilidade" onClick={ () => this.clickComprar(this.state.skillType, res.item_id, res.item_name, res.item_description, res.item_price) }><i className="fa fa-diamond" arria-hidden="true" /> Comprar</Button>}
                                                        {/* INDISPONÍVEL */}
                                                        { res.item_status === 2 && <Button rounded color="red" className="disabled btn-md" title="Este item não está mais disponível para compra"><i className="fa fa-diamond" arria-hidden="true" /> Indisponível</Button> }
                                                        </td>
                                                    </tr>
                                                )
                                            }) }
                                        </TableBody>
                                    </Table>
                                </div>                            
                            </div>

                        </div>
                    </div>
                </section>

                {/* MODAL de COMPRA */}
                <Container>
                    <Modal isOpen={this.state.modalCompra} toggle={this.toggleModalCompra} size="lg">
                    <ModalHeader toggle={this.toggleModalCompra} className="purple-color">
                        <b>Efetuar Compra</b>
                    </ModalHeader>
                    <ModalBody>
                        

                    <div className="card">                    
                        <div className="card-body">

                            <div className="price header">                                    
                                <h4 className="option" style={{fontWeight: 400}}><i className={`purple-text fa ${this.state.item_type === this.state.tipType ? 'fa-lightbulb-o' : 'fa-superpowers'}`} aria-hidden="true"/> { this.state.item_name }</h4>
                            </div>

                            <span className="grey-text">{ this.state.item_description }</span>
                        </div>
                    </div>
                            
                    <br />

                    <div className="backContainer row">
                        <div className="col-md-2">
                            <label style={{fontWeight: 500}}>Quantidade: </label>
                        </div>
                        <div className="col-md-2">
                            { this.state.item_quantity }
                        </div>
                        <div className="col-md-8">
                            <div className="btn-group radio-group ml-2">
                                <Button size="sm" color="info" title="Diminuir Quantidade" onClick={ () => this.clickDiminuirQuantidade() }><i className="fa fa-minus" aria-hidden="true"/></Button>
                                <Button size="sm" color="indigo" title="Aumentar Quantidade" onClick={ () => this.clickAumentarQuantidade() }><i className="fa fa-plus" aria-hidden="true"/></Button>
                            </div>
                        </div>
                    </div>
                    <div className="backContainer row">
                        <div className="col-md-2">
                            <label style={{fontWeight: 500}}>TOTAL: </label>
                        </div>
                        <div className="col-md-10">
                            { this.state.item_quantity * this.state.item_price } créditos
                        </div>
                    </div>
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button color="purple" onClick={this.toggleModalCompra}>Fechar</Button>
                        <Button color="success" onClick={ () => this.efetuarCompra() }><i className="fa fa-diamond" arria-hidden="true" /> Confirmar</Button>
                    </ModalFooter>
                    </Modal>
                </Container>
            </div>
        );
    }

}

Shop.propTypes = {
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
)(Shop);