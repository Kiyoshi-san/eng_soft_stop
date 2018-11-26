import React, { Component } from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from "mdbreact";
import { Button, Table, TableBody, TableHead } from 'mdbreact';
import { Container, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import swal from 'sweetalert';

import MenuSide from '../shared/MenuSide';
import * as uiActions from '../../actions/uiActions';
import config from '../../util/Config';

import '../../css/backoffice.css';

class BackStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listaDicas: [],
            listaHabilidades: [],
            modalDicas: false,
            modalHabilidades: false,
            modoCrudDica: 1, //inserção
            tipType: 1,
            tipStatus: 0,
            tipId: 0,
            tipIdx: '',
            tipNome: '',
            tipDescricao: '',
            tipPreco: '',
            modoCrudHabilidade: 1, //inserção
            skillType: 2,
            skillStatus: 0,
            skillId: 0,
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
    
    
    /* Faz o controle de alteração do status do ITEM */
    handleChangeStatusItem = (event) => {

        this.setState({
          [event.target.name]: parseInt(event.target.value, 10),
          dirty: true
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

            //Recupera só os itens de Dicas
            let tips = res.data.content.filter(item => item["item_type"] === this.state.tipType);
                
            this.setState({
                listaDicas: tips
            })
        })
        .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao listar as dicas. Erro: " + res.response.data.messages);
        });
    }


    /* Abre o modal para adicionar dicas*/
    clickDicas(){
        this.modoInsercaoDica();
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
            item_idx: this.state.tipIdx,
            item_name: this.state.tipNome,
            item_description: this.state.tipDescricao,
            item_price: this.state.tipPreco,
            item_type: this.state.tipType,
            item_status: this.state.tipStatus
        }
                
        if (!body.item_idx.trim() || !body.item_name.trim() || !body.item_description.trim() || !body.item_price.trim()) {
            toast.warn("Favor preencher todos os campos.");
            return;
        }

        //Parses to int and check
        body.item_price = parseInt(body.item_price);

        if(!Number.isInteger(parseInt(body.item_price)))
        {
            toast.warn("O preço deve ser um número inteiro representando a quantidade de créditos.");
            return;
        }
        
        this.props.uiActions.loading("Processando...");
            
        axios
        .post(config.item.item, body)
        .then(res => {

            this.props.uiActions.stopLoading();
            toast.success("Dica cadastrada com sucesso.");

            this.listarDicas();
            this.setState({
                tipIdx: '',
                tipNome: '',
                tipDescricao: '',
                tipPreco: '',
                tipStatus: 0
            });
        })
        .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao cadastrar a dica. Erro: " + res.response.data.messages);
        });
    }


    /* Realiza a atualização da dica */
    atualizarDica(){

        let body = {
            item_id: this.state.tipId,
            item_idx: this.state.tipIdx,
            item_name: this.state.tipNome,
            item_description: this.state.tipDescricao,
            item_price: this.state.tipPreco,
            item_type: this.state.tipType,
            item_status: this.state.tipStatus
        }
                
        if (!body.item_idx.trim() || !body.item_name.trim() || !body.item_description.trim() || !body.item_price.toString().trim()) {
            toast.warn("Favor preencher todos os campos.");
            return;
        }

        //Parses to int and check
        body.item_price = parseInt(body.item_price);

        if(!Number.isInteger(parseInt(body.item_price)))
        {
            toast.warn("O preço deve ser um número inteiro representando a quantidade de créditos.");
            return;
        }
        
        this.props.uiActions.loading("Processando...");
            
         axios
         .put(config.item.item, body)
         .then(res => {

            this.props.uiActions.stopLoading();

            toast.success("Dica atualizada com sucesso.");
            this.listarDicas();
            this.modoInsercaoDica();
         })
         .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao atualizar a dica. Erro: " + res.response.data.messages);
         });
    }


    /* Exclusão de dica */
    excluirDica(item_id){

        swal({
          title: "Tem certeza?",
          text: "- A dica será removida da loja e nenhum jogador conseguirá mais utilizá-la.",
          icon: "warning",
          dangerMode: true,
          buttons: ["Cancelar", "OK"],
        })
        .then((willDelete) => {
          if (willDelete) {
        
            this.props.uiActions.loading("Processando...");
  
            axios
            .delete(config.item.item, { data: { "item_id": item_id } })
            .then(res => {
                this.props.uiActions.stopLoading();

                this.modoInsercaoDica();
                this.listarDicas();
                toast.success("Dica excluída com sucesso.");
            })
            .catch(res => {
                this.props.uiActions.stopLoading();
                toast.error("Erro ao excluir a dica. Erro: " + res.response.data.messages);
            });
  
          }
        });
    }


    /* Entrar em modo de inserção da dica */
    modoInsercaoDica(tip) {

        this.setState({ 
            modoCrudDica: 1, //Inserção
            tipId: 0,
            tipIdx: '',
            tipNome: '',
            tipDescricao: '',
            tipPreco: '',
            tipStatus: 0
        });

    }


    /* Entrar em modo de atualização da dica */
    modoAtualizacaoDica(tip) {

        this.setState({ 
            modoCrudDica: 2, //Atualização
            tipId: tip.item_id,
            tipIdx: tip.item_idx,
            tipNome: tip.item_name,
            tipDescricao: tip.item_description,
            tipPreco: tip.item_price,
            tipStatus: tip.item_status
        });

    }


    // *********************** FIM - DICAS **************************


    // *********************** INÍCIO - HABILIDADES ***********************


    /* Lista as Habilidaes existentes */
    listarHabilidades() {
        
        this.props.uiActions.loading("Preparando Visualização...");

        axios
        .get(config.item.items)
        .then(res => {

            this.props.uiActions.stopLoading();

            //Recupera só os itens de Habilidades
            let skills = res.data.content.filter(item => item["item_type"] === this.state.skillType);
                
            this.setState({
                listaHabilidades: skills
            })
        })
        .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao listar as habilidades. Erro: " + res.response.data.messages);
        });
    }


    /* Abre o modal para adicionar habilidades*/
    clickHabilidades(){
        this.modoInsercaoHabilidade();
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
            item_idx: this.state.skillIdx,
            item_name: this.state.skillNome,
            item_description: this.state.skillDescricao,
            item_price: this.state.skillPreco,
            item_type: this.state.skillType,
            item_status: this.state.skillStatus
        }
                
        if (!body.item_idx.trim() || !body.item_name.trim() || !body.item_description.trim() || !body.item_price.trim()) {
            toast.warn("Favor preencher todos os campos.");
            return;
        }

        //Parses to int and check
        body.item_price = parseInt(body.item_price);

        if(!Number.isInteger(parseInt(body.item_price)))
        {
            toast.warn("O preço deve ser um número inteiro representando a quantidade de créditos.");
            return;
        }
        
        this.props.uiActions.loading("Processando...");
            
        axios
        .post(config.item.item, body)
        .then(res => {

            this.props.uiActions.stopLoading();
            toast.success("Habilidade cadastrada com sucesso.");

            this.listarHabilidades();
            this.setState({
                skillIdx: '',
                skillNome: '',
                skillDescricao: '',
                skillPreco: '',
                skillStatus: 0
            });
        })
        .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao cadastrar a habilidade. Erro: " + res.response.data.messages);
        });
    }


    /* Realiza a atualização da habilidade */
    atualizarHabilidade(){

        let body = {
            item_id: this.state.skillId,
            item_idx: this.state.skillIdx,
            item_name: this.state.skillNome,
            item_description: this.state.skillDescricao,
            item_price: this.state.skillPreco,
            item_type: this.state.skillType,
            item_status: this.state.skillStatus
        }
                
        if (!body.item_idx.trim() || !body.item_name.trim() || !body.item_description.trim() || !body.item_price.toString().trim()) {
            toast.warn("Favor preencher todos os campos.");
            return;
        }

        //Parses to int and check
        body.item_price = parseInt(body.item_price);

        if(!Number.isInteger(parseInt(body.item_price)))
        {
            toast.warn("O preço deve ser um número inteiro representando a quantidade de créditos.");
            return;
        }
        
        this.props.uiActions.loading("Processando...");
            
         axios
         .put(config.item.item, body)
         .then(res => {

            this.props.uiActions.stopLoading();

            toast.success("Habilidade atualizada com sucesso.");
            this.listarHabilidades();
            this.modoInsercaoHabilidade();
         })
         .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao atualizar a habilidade. Erro: " + res.response.data.messages);
         });
    }


    /* Exclusão de habilidade */
    excluirHabilidade(item_id){

        swal({
          title: "Tem certeza?",
          text: "- A habilidade será removida da loja e nenhum jogador conseguirá mais utilizá-la.",
          icon: "warning",
          dangerMode: true,
          buttons: ["Cancelar", "OK"],
        })
        .then((willDelete) => {
          if (willDelete) {
        
            this.props.uiActions.loading("Processando...");
  
            axios
            .delete(config.item.item, { data: { "item_id": item_id } })
            .then(res => {
                this.props.uiActions.stopLoading();

                this.modoInsercaoHabilidade();
                this.listarHabilidades();
                toast.success("Habilidade excluída com sucesso.");
            })
            .catch(res => {
                this.props.uiActions.stopLoading();
                toast.error("Erro ao excluir a habilidade. Erro: " + res.response.data.messages);
            });
  
          }
        });
    }


    /* Entrar em modo de inserção da habilidade */
    modoInsercaoHabilidade(tip) {

        this.setState({ 
            modoCrudHabilidade: 1, //Inserção
            skillId: 0,
            skillIdx: '',
            skillNome: '',
            skillDescricao: '',
            skillPreco: '',
            skillStatus: 0
        });

    }


    /* Entrar em modo de atualização da habilidade */
    modoAtualizacaoHabilidade(skill) {

        this.setState({ 
            modoCrudHabilidade: 2, //Atualização
            skillId: skill.item_id,
            skillIdx: skill.item_idx,
            skillNome: skill.item_name,
            skillDescricao: skill.item_description,
            skillPreco: skill.item_price,
            skillStatus: skill.item_status
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
                                        <div className="col-md-6 animated jackInTheBox">

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
                                        <div className="col-md-6 animated jackInTheBox">

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
                                                <input id="tipIdx" className="form-control" maxLength={4} value={this.state.tipIdx} onChange={this.handleChange}/>
                                            </div>
                                            <div className="col-md-6 align-self-center">
                                                <label htmlFor="tipNome" className="grey-text">Nome</label>
                                                <input id="tipNome" className="form-control" value={this.state.tipNome} onChange={this.handleChange}/>
                                            </div>
                                            <div className="col-md-4 align-self-center">
                                                <label htmlFor="tipPreco" className="grey-text">Preço (créditos)</label>
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
                                                {/* Botão de Cadastrar */}
                                                { this.state.modoCrudDica === 1 && <Button color="purple" onClick={() => this.cadastrarDica()} title="Cadastrar nova dica">Cadastrar&nbsp;&nbsp; <i className="fa fa-plus" arria-hidden="true"/></Button> }
                                                {/* Botão de Atualizar */}
                                                { this.state.modoCrudDica === 2 && <Button color="light-blue" onClick={() => this.atualizarDica()} title="Atualizar dica">Atualizar&nbsp;&nbsp; <i className="fa fa-refresh" arria-hidden="true"/></Button> }
                                                {/* Botão de Cancelar Atualização */}
                                                { this.state.modoCrudDica === 2 && <Button color="elegant" onClick={() => this.modoInsercaoDica()} title="Cancelar atualização da dica">Cancelar&nbsp;&nbsp; <i className="fa fa-times" arria-hidden="true"/></Button> }                                                
                                            </div>
                                        </div>
                                        <br />
                                        <div className="row">
                                            <div className="col-md-12 align-self-center">
                                                <label>STATUS</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12 align-self-center">
                                                <input onChange={this.handleChangeStatusItem} checked={this.state.tipStatus === 0 ? true : false} type="radio" id="tipEmBreve" name="tipStatus" value="0" />
                                                <label htmlFor="tipEmBreve" className="orange-text sideRight" style={{fontWeight: 500}}>&nbsp;&nbsp;Em Breve</label>

                                                <input onChange={this.handleChangeStatusItem} checked={this.state.tipStatus === 1 ? true : false} type="radio" id="tipDisponivel" name="tipStatus" value="1" />
                                                <label htmlFor="tipDisponivel" className="green-text sideRight" style={{fontWeight: 500}}>&nbsp;&nbsp;Disponível</label>

                                                <input onChange={this.handleChangeStatusItem} checked={this.state.tipStatus === 2 ? true : false} type="radio" id="tipIndisponivel" name="tipStatus" value="2"/>
                                                <label htmlFor="tipIndisponivel" className="red-text sideRight" style={{fontWeight: 500}}>&nbsp;&nbsp;Indisponível</label>
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
                                                            <th width="10%">STATUS</th>
                                                            <th width="8%">IDX</th>
                                                            <th width="26%">NOME</th>
                                                            <th width="38%">DESCRIÇÃO</th>
                                                            <th width="13%" className="text-right">PREÇO</th>
                                                            <th width="5%" className="text-center"></th>
                                                        </tr>
                                                    </TableHead>
                                                    <TableBody>
                                                        {this.state.listaDicas.map((res, i) => {
                                                            return (
                                                                <tr key={i} className="clickable" onClick={ () => this.modoAtualizacaoDica(res) }>
                                                                    <td><span className={`badge badge-pill ${res.item_status === 0 ? "orange" : (res.item_status === 1 ? "green" : "pink")}`}>{res.item_status === 0 ? "Em Breve" : (res.item_status === 1 ? "Disponível" : "Indisponível")}</span></td>
                                                                    <td>{res.item_idx}</td>
                                                                    <td>{res.item_name}</td>
                                                                    <td>{res.item_description}</td>
                                                                    <td className="text-right">{res.item_price} créditos</td>
                                                                    <td className="text-center"><Button size="sm" color="danger" onClick={ () => this.excluirDica(res.item_id) } title="Excluir dica"><i className="fa fa-times" arria-hidden="true" /></Button></td>
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
                                                <input id="skillIdx" className="form-control" maxLength={4} value={this.state.skillIdx} onChange={this.handleChange}/>
                                            </div>
                                            <div className="col-md-6 align-self-center">
                                                <label htmlFor="skillNome" className="grey-text">Nome</label>
                                                <input id="skillNome" className="form-control" value={this.state.skillNome} onChange={this.handleChange}/>
                                            </div>
                                            <div className="col-md-4 align-self-center">
                                                <label htmlFor="skillPreco" className="grey-text">Preço (créditos)</label>
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
                                                {/* Botão de Cadastrar */}
                                                { this.state.modoCrudHabilidade === 1 && <Button color="purple" onClick={() => this.cadastrarHabilidade()} title="Cadastrar nova habilidade">Cadastrar&nbsp;&nbsp; <i className="fa fa-plus" arria-hidden="true"/></Button> }
                                                {/* Botão de Atualizar */}
                                                { this.state.modoCrudHabilidade === 2 && <Button color="light-blue" onClick={() => this.atualizarHabilidade()} title="Atualizar habilidade">Atualizar&nbsp;&nbsp; <i className="fa fa-refresh" arria-hidden="true"/></Button> }
                                                {/* Botão de Cancelar Atualização */}
                                                { this.state.modoCrudHabilidade === 2 && <Button color="elegant" onClick={() => this.modoInsercaoHabilidade()} title="Cancelar atualização da habilidade">Cancelar&nbsp;&nbsp; <i className="fa fa-times" arria-hidden="true"/></Button> }                                                
                                            </div>
                                        </div>
                                        <br />
                                        <div className="row">
                                            <div className="col-md-12 align-self-center">
                                                <label>STATUS</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12 align-self-center">
                                                <input onChange={this.handleChangeStatusItem} checked={this.state.skillStatus === 0 ? true : false} type="radio" id="skillEmBreve" name="skillStatus" value="0" />
                                                <label htmlFor="skillEmBreve" className="orange-text sideRight" style={{fontWeight: 500}}>&nbsp;&nbsp;Em Breve</label>

                                                <input onChange={this.handleChangeStatusItem} checked={this.state.skillStatus === 1 ? true : false} type="radio" id="skillDisponivel" name="skillStatus" value="1" />
                                                <label htmlFor="skillDisponivel" className="green-text sideRight" style={{fontWeight: 500}}>&nbsp;&nbsp;Disponível</label>

                                                <input onChange={this.handleChangeStatusItem} checked={this.state.skillStatus === 2 ? true : false} type="radio" id="skillIndisponivel" name="skillStatus" value="2"/>
                                                <label htmlFor="skillIndisponivel" className="pink-text sideRight" style={{fontWeight: 500}}>&nbsp;&nbsp;Indisponível</label>
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
                                                            <th width="10%">STATUS</th>
                                                            <th width="8%">IDX</th>
                                                            <th width="26%">NOME</th>
                                                            <th width="38%">DESCRIÇÃO</th>
                                                            <th width="13%" className="text-right">PREÇO</th>
                                                            <th width="5%" className="text-center"></th>
                                                        </tr>
                                                    </TableHead>
                                                    <TableBody>
                                                        {this.state.listaHabilidades.map((res, i) => {
                                                            return (
                                                                <tr key={i} className="clickable" onClick={ () => this.modoAtualizacaoHabilidade(res) }>
                                                                    <td><span className={`badge badge-pill ${res.item_status === 0 ? "orange" : (res.item_status === 1 ? "green" : "pink")}`}>{res.item_status === 0 ? "Em Breve" : (res.item_status === 1 ? "Disponível" : "Indisponível")}</span></td>
                                                                    <td>{res.item_idx}</td>
                                                                    <td>{res.item_name}</td>
                                                                    <td>{res.item_description}</td>
                                                                    <td className="text-right">{res.item_price} créditos</td>
                                                                    <td className="text-center"><Button size="sm" color="danger" onClick={ () => this.excluirHabilidade(res.item_id) } title="Excluir habilidade"><i className="fa fa-times" arria-hidden="true" /></Button></td>
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