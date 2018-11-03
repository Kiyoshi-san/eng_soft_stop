import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from "mdbreact";
import { Button, Table, TableBody, TableHead } from 'mdbreact';
import { Container, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';

import axios from "axios";

import MenuSide from '../shared/MenuSide';
import * as uiActions from '../../actions/uiActions';
import '../../css/backoffice.css';

class BackStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listaDicas: [],
            listaHabilidades: [],
            modalDicas: false,
            modalHabilidades: false,
            tipIdx: '',
            tipNome: '',
            tipDescricao: '',
            tipPreco: '',
            skillIdx: '',
            skillNome: '',
            skillDescricao: '',
            skillPreco: ''
        };
    }

    
    /* Executa ao carregar o componente */
    componentDidMount() {

    }

    /* Faz o controle de alteração do state em elementos two-way data binding */
    handleChange = (event) => {
        this.setState({
          [event.target.id]: event.target.value,
          dirty: true
        });
    }


    // *********************** INÍCIO - DICAS ***********************


    /* Lista as Dicas existentes */
    listarDicas() {

        axios
        .get('https://es3-stop-prod.herokuapp.com/tips')
        .then(res => {
                
                this.setState({
                    listaDicas: res.data.content
                })
            })
        .catch(res => {
            toast.error("Erro ao listar as dicas. Erro: " + res.response.data.messages);
        });    
    }


    /* Abre o modal para adicionar dicas*/
    clickDicas(){
        this.toggleModalDicas();
        this.listarDicas();        
    }


    /* Controla visibilidade do modal de Dicas */
    toggleModalDicas = () => {
        this.setState({
            modalDicas: !this.state.modalDicas
        });
    }


    /* Cadastra uma nova dica */
    cadastrarDica() {

        let body = {
            idx: this.state.tipIdx,
            nome: this.state.tipNome,
            descricao: this.state.tipDescricao,
            preco: this.state.tipPreco
        }
                
        if (!body.idx.trim() || !body.nome.trim() || !body.descricao.trim() || !body.preco.trim()) {
            toast.warn("Favor preencher todos os campos.");
            return;
        }
        
        this.props.uiActions.loading("Processando...");
            
        axios
        .post('https://es3-stop-prod.herokuapp.com/tip', body)
        .then(res => {

            this.props.uiActions.stopLoading();
            toast.success("Dica cadastrada com sucesso.");

            this.listarDicas();
            this.setState({
                tipIdx: '',
                tipNome: '',
                tipDescricao: '',
                tipPreco: ''
            });
        })
        .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao cadastrar a dica. Erro: " + res.response.data.messages);
        });
    }


    // *********************** FIM - DICAS **************************


    // *********************** INÍCIO - HABILIDADES ***********************


    /* Lista as Habilidaes existentes */
    listarHabilidades() {

        axios
        .get('https://es3-stop-prod.herokuapp.com/skills')
        .then(res => {
                
                this.setState({
                    listaHabilidades: res.data.content
                })
            })
        .catch(res => {
            toast.error("Erro ao listar as habilidades. Erro: " + res.response.data.messages);
        });    
    }


    /* Abre o modal para adicionar habilidades*/
    clickHabilidades(){
        this.toggleModalHabilidades();
        this.listarHabilidades();        
    }


    /* Controla visibilidade do modal de Habilidades */
    toggleModalHabilidades = () => {        
        this.setState({
            modalHabilidades: !this.state.modalHabilidades
        });
    }

    /* Cadastra uma nova habilidade */
    cadastrarHabilidade() {

        let body = {
            idx: this.state.skillIdx,
            nome: this.state.skillNome,
            descricao: this.state.skillDescricao,
            preco: this.state.skillPreco
        }
                
        if (!body.idx.trim() || !body.nome.trim() || !body.descricao.trim() || !body.preco.trim()) {
            toast.warn("Favor preencher todos os campos.");
            return;
        }
        
        this.props.uiActions.loading("Processando...");
            
        axios
        .post('https://es3-stop-prod.herokuapp.com/skill', body)
        .then(res => {

            this.props.uiActions.stopLoading();
            toast.success("Habilidade cadastrada com sucesso.");

            this.listarHabilidades();
            this.setState({
                skillIdx: '',
                skillNome: '',
                skillDescricao: '',
                skillPreco: ''
            });
        })
        .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao cadastrar a habilidade. Erro: " + res.response.data.messages);
        });
    }


    // *********************** FIM - DICAS **************************


    //Renderização da tela
    render(){
        return (
            <div className="backContainer">
                <MenuSide />
                {/* ALERTAS */}
                <ToastContainer 
                    newestOnTop={true}/>

                    <div className="content">
                        {/* Título da página */}
                        <blockquote className="blockquote bq-purple">                        
                            <p className="bq-title purple-text"><i className="fa fa-shopping-basket" aria-hidden="true"/> Loja</p>
                        </blockquote>

                        {/* Lista de LIGAS */}
                        <div className="backContainer row">
                            <div className="col">

                                {/* <!-- Section: Pricing v.4 --> */}
                                <section className="text-center my-5">

                                    {/* <!-- Grid row --> */}
                                    <div className="row">

                                        {/* <!-- Grid column --> */}
                                        <div className="col-md-3 animated jackInTheBox">

                                            {/* <!-- Card --> */}
                                            <div className="card clickable rgba-grey-slight view overlay" onClick={() => { this.clickDicas() } }>
                                                <div className="mask rgba-white-light"></div>

                                                {/* <!-- Content --> */}
                                                <div className="card-body">

                                                    {/* <!-- Price --> */}
                                                    <div className="price header white-text purple-gradient rounded-top dash-padding">                                    
                                                        <h1 className="font-weight-bold dash-padding">
                                                            <i className="fa fa-lightbulb-o" aria-hidden="true"/>
                                                            <br />
                                                            <br />
                                                            DICAS
                                                        </h1>
                                                    </div>

                                                    {/* <!--Price --> */}
                                                    
                                                    <br />
                                                    <p className="grey-text dash-padding">Clique para adicionar novas DICAS que estarão disponíveis para compra pelos jogadores na loja.</p>

                                                </div>
                                                {/* <!-- Content --> */}

                                            </div>
                                            {/* <!-- Card --> */}

                                        </div>
                                        {/* <!-- Grid column --> */}

                                        {/* <!-- Grid column --> */}
                                        <div className="col-md-3 animated jackInTheBox">

                                            {/* <!-- Card --> */}
                                            <div className="card clickable rgba-grey-slight view overlay" onClick={() => { this.clickHabilidades() } }>
                                                <div className="mask rgba-white-light"></div>

                                                {/* <!-- Content --> */}
                                                <div className="card-body">

                                                    {/* <!-- Price --> */}
                                                    <div className="price header white-text purple-gradient rounded-top dash-padding">                                    
                                                        <h1 className="font-weight-bold dash-padding">
                                                            <i className="fa fa-superpowers" aria-hidden="true"/>
                                                            <br />
                                                            <br />
                                                            HABILIDADES
                                                        </h1>
                                                    </div>

                                                    {/* <!--Price --> */}
                                                    
                                                    <br />
                                                    <p className="grey-text dash-padding">Clique para adicionar novas cartas de HABILIDADES ESPECIAIS que estarão disponíveis para compra pelos jogadores na loja.</p>

                                                </div>
                                                {/* <!-- Content --> */}

                                            </div>
                                            {/* <!-- Card --> */}

                                        </div>
                                        {/* <!-- Grid column --> */}                                        

                                    </div>
                                    {/* <!-- Grid row --> */}

                                </section>
                                {/* <!-- Section: Pricing v.4 --> */}

                                {/* Modal - DICAS */}
                                <Container>
                                    <Modal isOpen={this.state.modalDicas} toggle={this.toggleModalDicas} size="lg">
                                    <ModalHeader toggle={this.toggleModalDicas} className="purple-color"><b>Dicas</b></ModalHeader>
                                    <ModalBody>

                                        {/* Formulário de Cadastro - DICAS */}
                                        <div className="row">
                                            <div className="col-md-2 align-self-center">
                                                <label htmlFor="tipIdx" className="grey-text">IDX</label>
                                                <input id="tipIdx" className="form-control" value={this.state.tipIdx} onChange={this.handleChange}/>
                                            </div>
                                            <div className="col-md-6 align-self-center">
                                                <label htmlFor="tipNome" className="grey-text">Nome</label>
                                                <input id="tipNome" className="form-control" value={this.state.tipNome} onChange={this.handleChange}/>
                                            </div>
                                            <div className="col-md-4 align-self-center">
                                                <label htmlFor="tipPreco" className="grey-text">Preço (R$)</label>
                                                <input id="tipPreco" className="form-control" value={this.state.tipPreco} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="row">
                                            <div className="col-md-8 align-self-center">
                                                <label htmlFor="tipDescricao" className="grey-text">Descrição</label>
                                                <textarea type="text" id="tipDescricao" className="form-control" rows="3" value={this.state.tipDescricao} onChange={this.handleChange}></textarea>
                                            </div>
                                            <div className="col-md-4 align-self-center">
                                                <Button color="purple" onClick={() => this.cadastrarDica()} title="Cadastrar nova dica">Cadastrar&nbsp;&nbsp; <i className="fa fa-plus" arria-hidden="true"/></Button>
                                            </div>
                                        </div>

                                        <br /> 

                                        {/* Lista - DICAS */}
                                        <div className="row">
                                            <div className="col">
                                                <Table small responsive hover>
                                                    <caption>{this.state.listaDicas.length === 0 ? 'Nenhuma dica encontrada' : this.state.listaDicas.length + ' dicas encontradas'} </caption>
                                                    <TableHead color="purple-color">
                                                        <tr>
                                                            <th width="5%">IDX</th>
                                                            <th width="30%">NOME</th>
                                                            <th width="50%">DESCRIÇÃO</th>
                                                            <th width="10%" className="text-right">PREÇO</th>
                                                            <th width="5%" className="text-center"></th>
                                                        </tr>
                                                    </TableHead>
                                                    <TableBody>
                                                        {this.state.listaDicas.map(res => {
                                                            return (
                                                                <tr>
                                                                    <td>{res.tip_idx}</td>
                                                                    <td>{res.name}</td>
                                                                    <td>{res.descrition}</td>
                                                                    <td className="text-right">R$ {res.price}</td>
                                                                    <td className="text-center"><Button size="sm" color="danger" onClick={ () => this.excluirDica(res.tip_id) } title="Excluir dica"><i className="fa fa-times" arria-hidden="true" /></Button></td>
                                                                </tr>
                                                            )
                                                        }) }
                                                    </TableBody>
                                                </Table>
                                            </div>                            
                                        </div>
                                        
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="purple" onClick={this.toggleModalDicas}>Fechar</Button>
                                    </ModalFooter>
                                    </Modal>
                                </Container>


                                {/* Modal - HABILIDADES */}
                                <Container>
                                    <Modal isOpen={this.state.modalHabilidades} toggle={this.toggleModalHabilidades} size="lg">
                                    <ModalHeader toggle={this.toggleModalHabilidades} className="purple-color"><b>Habilidades</b></ModalHeader>
                                    <ModalBody>

                                        {/* Formulário de Cadastro - HABILIDADES */} 
                                        <div className="row">
                                            <div className="col-md-2 align-self-center">
                                                <label htmlFor="skillIdx" className="grey-text">IDX</label>
                                                <input id="skillIdx" className="form-control" value={this.state.skillIdx} onChange={this.handleChange}/>
                                            </div>
                                            <div className="col-md-6 align-self-center">
                                                <label htmlFor="skillNome" className="grey-text">Nome</label>
                                                <input id="skillNome" className="form-control" value={this.state.skillNome} onChange={this.handleChange}/>
                                            </div>
                                            <div className="col-md-4 align-self-center">
                                                <label htmlFor="skillPreco" className="grey-text">Preço (R$)</label>
                                                <input id="skillPreco" className="form-control" value={this.state.skillPreco} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="row">
                                            <div className="col-md-8 align-self-center">
                                                <label htmlFor="skillDescricao" className="grey-text">Descrição</label>
                                                <textarea type="text" id="skillDescricao" className="form-control" rows="3" value={this.state.skillDescricao} onChange={this.handleChange}></textarea>
                                            </div>
                                            <div className="col-md-4 align-self-center">
                                                <Button color="purple" onClick={() => this.cadastrarHabilidade()} title="Cadastrar nova habilidade">Cadastrar&nbsp;&nbsp; <i className="fa fa-plus" arria-hidden="true"/></Button>
                                            </div>
                                        </div>

                                        <br /> 

                                        {/* Lista - HABILIDADES */}
                                        <div className="row">
                                            <div className="col">
                                                <Table small responsive hover>
                                                    <caption>{this.state.listaHabilidades.length === 0 ? 'Nenhuma habilidade encontrada' : this.state.listaHabilidades.length + ' habilidades encontradas'} </caption>
                                                    <TableHead color="purple-color">
                                                        <tr>
                                                            <th width="5%">IDX</th>
                                                            <th width="30%">NOME</th>
                                                            <th width="50%">DESCRIÇÃO</th>
                                                            <th width="10%" className="text-right">PREÇO</th>
                                                            <th width="5%" className="text-center"></th>
                                                        </tr>
                                                    </TableHead>
                                                    <TableBody>
                                                        {this.state.listaHabilidades.map(res => {
                                                            return (
                                                                <tr>
                                                                    <td>{res.skill_idx}</td>
                                                                    <td>{res.name}</td>
                                                                    <td>{res.descrition}</td>
                                                                    <td className="text-right">R$ {res.price}</td>
                                                                    <td className="text-center"><Button size="sm" color="danger" onClick={ () => this.excluirHabilidade(res.skill_id) } title="Excluir habilidade"><i className="fa fa-times" arria-hidden="true" /></Button></td>
                                                                </tr>
                                                            )
                                                        }) }
                                                    </TableBody>
                                                </Table>
                                            </div>                            
                                        </div>
                                        
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="purple" onClick={this.toggleModalHabilidades}>Fechar</Button>
                                    </ModalFooter>
                                    </Modal>
                                </Container>

                            </div>
                        </div>
                    </div>
            </div>
        );
    }

}

BackStore.propTypes = {
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
)(BackStore);