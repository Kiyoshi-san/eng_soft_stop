import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from "axios";
import { Input, Button, Table, TableBody, TableHead  } from 'mdbreact';
import { Container, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import { ToastContainer, toast } from "mdbreact";
import swal from 'sweetalert';

import MenuSide from '../shared/MenuSide';
import * as uiActions from '../../actions/uiActions';
import config from '../../util/Config';

import '../../css/backoffice.css';

class BackPalavra extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listaCategorias: [],
            listaPalavras: [],
            descricaoCategoria: '',
            descricaoResposta: '',
            show: true,
            modalRespostas: false,
            modoCrudCategoria: 1 //inserção
        };
    }
    
    /* Executa ao carregar o componente */
    componentDidMount() {
        this.categoryList();
    }

    // *********************** INÍCIO - CATEGORIAS ***********************

    /* Lista as categorias existentes */
    categoryList() {

        this.props.uiActions.loading("Preparando Visualização...");
        
        axios
        .get(config.category.categories)
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


    /* Realiza a inserção da categoria */
    enviarCadastroCategoria(){

        let descricao = this.state.descricaoCategoria;
                
        if (!descricao.trim()) {
            toast.warn("Informe uma descrição válida para a categoria.");
            return;
        }
        
        this.props.uiActions.loading("Processando...");
            
        axios
        .post(config.category.category, { "name": descricao })
        .then(res => {

            this.props.uiActions.stopLoading();
            toast.success("Categoria cadastrada com sucesso.");

            this.categoryList();
            this.setState({
                descricaoCategoria: ''
            });
        })
        .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao cadastrar a categoria. Erro: " + res.response.data.messages);
        });
    }
    

    /* Entrar em modo de atualização da categoria */
    modoAtualizacaoCategoria(categoria_id, categoria_nome) {

        window.scrollTo(0, 0);
        this.setState({ 
            modoCrudCategoria: 2, //Atualização
            descricaoCategoria: categoria_nome,
            category_id: categoria_id
        });

    }

    /* Realiza a atualização da categoria */
    enviarAtualizacaoCategoria(){

        let id = this.state.category_id;
        let descricao = this.state.descricaoCategoria;
                
        if (!descricao.trim()) {
            toast.warn("Informe uma descrição válida para a categoria.");
            return;
        }
        
        this.props.uiActions.loading("Processando...");
            
         axios
         .put(`${config.category.category}/${id}`, { "name": descricao } )
         .then(res => {
            this.props.uiActions.stopLoading();
            toast.success("Categoria atualizada com sucesso.");

             this.categoryList();
             this.modoInsercaoCategoria();
         })
         .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao atualizar a categoria. Erro: " + res.response.data.messages);
         });
    }

    /* Cancela a atualização da categoria*/
    modoInsercaoCategoria(){
        this.setState({ 
            modoCrudCategoria: 1, //Inserção
            descricaoCategoria: '',
            category_id: 0
        });
    }


    /* Abre o modal para adicionar respostas na categoria*/
    clickAdicionarRespostas(categoria_id, categoria_name){

        this.setState({
            category_id: categoria_id,
            category_name: categoria_name
        }, () => {
            this.toggleModalRespostas();
            this.respostasList();
        });
        
    }


    /* Exclusão de categoria */
    excluirCategoria(categoria_id) {

        swal({
          title: "Tem certeza?",
          text: "- As respostas desta categoria também serão removidas.",
          icon: "warning",
          dangerMode: true,
          buttons: ["Cancelar", "OK"],
        })
        .then((willDelete) => {
          if (willDelete) {
        
            this.props.uiActions.loading("Processando...");

            axios
            .delete(config.category.category, { data: { "category_id": categoria_id } })
            .then(res => {
                this.props.uiActions.stopLoading();
                toast.success("Categoria excluída com sucesso.");
    
                this.categoryList();
                this.modoInsercaoCategoria();
            })
            .catch(res => {
                this.props.uiActions.stopLoading();
                toast.error("Erro ao excluir a categoria. Erro: " + res.response.data.messages);
            });

          }
        });
    }

    // *********************** FIM - CATEGORIAS **************************

    // *********************** INÍCIO - RESPOSTAS ***********************

    /* Lista as Respostas existentes de uma determinada categoria */
    respostasList() {

        this.setState({
            listaPalavras: []
        }, () => {
        
            this.props.uiActions.loading("Preparando Visualização...");

            axios
            .get(`${config.answer.answers}?category=` + this.state.category_id)
            .then(res => {
                    
                    this.props.uiActions.stopLoading();
                    this.setState({
                        listaPalavras: res.data.content
                    })
                })
            .catch(res => {
                this.props.uiActions.stopLoading();
                toast.error("Erro ao listar as respostas. Erro: " + res.response.data.messages);
            });
        });        
    }


    /* Controla visibilidade do modal de respostas */
    toggleModalRespostas = () => {
        this.setState({
            modalRespostas: !this.state.modalRespostas
        });
    }


    /* Cadastra uma nova resposta para uma determinada categoria */
    enviarCadastroResposta() {

        let descricao = this.state.descricaoResposta;

        if (!descricao.trim()) {
            toast.warn("Informe uma descrição válida para a resposta.");
            return;
        }

        let categoriaId = this.state.category_id;
        
        this.props.uiActions.loading("Processando...");

        axios
        .post(config.answer.answer, { "category_id": categoriaId, "description": descricao })
        .then(res => {

            this.props.uiActions.stopLoading();
            toast.success("Resposta cadastrada com sucesso.");

            this.respostasList();
            this.setState({
                descricaoResposta: ''
            });
        })
        .catch(res => {
            this.props.uiActions.stopLoading();
            toast.error("Erro ao cadastrar a resposta. Erro: " + res.response.data.messages);
        })
    }


    /* Exclusão de resposta */
    excluirResposta(answer_id){

        swal({
          title: "Tem certeza?",
          text: "- A resposta será removida da categoria.",
          icon: "warning",
          dangerMode: true,
          buttons: ["Cancelar", "OK"],
        })
        .then((willDelete) => {
          if (willDelete) {
        
            this.props.uiActions.loading("Processando...");
  
            axios
            .delete(config.answer.answer, { data: { "answer_id": answer_id } })
            .then(res => {
                this.props.uiActions.stopLoading();
                this.respostasList();
                toast.success("Resposta excluída com sucesso.");
            })
            .catch(res => {
                this.props.uiActions.stopLoading();
                toast.error("Erro ao excluir a resposta. Erro: " + res.response.data.messages);
            });
  
          }
        });
    }


    // *********************** FIM - RESPOSTAS **************************

    /* Faz o controle de alteração do state em elementos two-way data binding */
    handleChange = (event) => {
        this.setState({
          [event.target.id]: event.target.value,
          dirty: true
        });
    }


    //Renderização da tela
    render() {
        return (
            <div className="backContainer">
            <MenuSide />
            {/* ALERTAS */}
            <ToastContainer 
                newestOnTop={true}/>
                <div className="content">
                {/* Título da página */}
                <blockquote className="blockquote bq-purple">                        
                    <p className="bq-title purple-text"><i className="fa fa-graduation-cap" aria-hidden="true"/> Categorias</p>
                </blockquote>

                {/* Lista de Categorias */}
                <div className="backContainer row">
                    <div className="col">

                        {/* Formulário de Cadastro - CATEGORIAS */}
                        <div className="row">
                            <div className="col-md-4 align-self-center">
                                <Input type="text" id="descricaoCategoria" placeHolder="Digite a descrição para inserir uma nova categoria" className="form-control" value={this.state.descricaoCategoria} onChange={this.handleChange}
                                    onKeyPress={ (event) => event.key === "Enter" ? (this.state.modoCrudCategoria === 1 ? this.enviarCadastroCategoria() : this.enviarAtualizacaoCategoria()) : '' }/>
                            </div>
                            <div className="col-md-2 align-self-center">
                                {/* Botão de Cadastrar */}
                                { this.state.modoCrudCategoria === 1 && <Button color="purple" onClick={() => this.enviarCadastroCategoria()} title="Cadastrar nova categoria">Cadastrar&nbsp;&nbsp; <i className="fa fa-plus" arria-hidden="true"/></Button> }
                                {/* Botão de Atualizar */}
                                { this.state.modoCrudCategoria === 2 && <Button color="light-blue" onClick={() => this.enviarAtualizacaoCategoria()} title="Atualizar categoria">Atualizar&nbsp;&nbsp; <i className="fa fa-refresh" arria-hidden="true"/></Button> }
                                {/* Botão de Cancelar Atualização */}
                                { this.state.modoCrudCategoria === 2 && <Button color="elegant" onClick={() => this.modoInsercaoCategoria()} title="Cancelar atualização da categoria">Cancelar&nbsp;&nbsp; <i className="fa fa-times" arria-hidden="true"/></Button> }
                            </div>
                            <div className="col-md-6 align-self-center">
                                &nbsp;
                            </div>
                        </div>

                        <br />

                        {/* Lista - CATEGORIAS */}
                        <div className="row">
                            <div className="col">
                                <Table responsive hover>
                                    <caption>{this.state.listaCategorias.length === 0 ? 'Nenhuma categoria encontrada' : this.state.listaCategorias.length + ' categorias encontradas'} </caption>
                                    <TableHead color="purple-color">
                                        <tr>
                                            <th width="90%">DESCRIÇÃO</th>
                                            <th width="5%" className="text-center"></th>
                                            <th width="5%" className="text-center"></th>
                                        </tr>
                                    </TableHead>
                                    <TableBody>
                                        { this.state.listaCategorias.map((res, i) => {
                                            return (
                                                <tr key={i} className="clickable">
                                                    <td onClick={ () => this.modoAtualizacaoCategoria(res.category_id, res.name) }>{res.name}</td>                                                    
                                                    <td className="text-center"><Button size="sm" color="purple" onClick={ () => this.clickAdicionarRespostas(res.category_id, res.name) } title="Cadastrar respostas para a categoria"><i className="fa fa-commenting" arria-hidden="true" /> Respostas</Button></td>
                                                    <td className="text-center"><Button size="sm" color="danger" onClick={ () => this.excluirCategoria(res.category_id) } title="Excluir categoria"><i className="fa fa-times" arria-hidden="true" /> Excluir</Button></td>
                                                </tr>
                                            )
                                        }) }
                                    </TableBody>
                                </Table>
                            </div>                            
                        </div>

                        {/* Modal - RESPOSTAS */}
                        <Container>
                            <Modal isOpen={this.state.modalRespostas} toggle={this.toggleModalRespostas} size="lg">
                            <ModalHeader toggle={this.toggleModalRespostas} className="purple-color"><b>Respostas</b><h6>{this.state.category_name}</h6></ModalHeader>
                            <ModalBody>

                                {/* Formulário de Cadastro - RESPOSTAS */}
                                <div className="row">
                                    <div className="col-md-8 align-self-center">
                                        <Input type="text" id="descricaoResposta" placeHolder="Digite uma nova resposta para esta categoria" className="form-control" value={this.state.descricaoResposta} onChange={this.handleChange} onKeyPress={(event) => event.key === "Enter" ? this.enviarCadastroResposta() : ''}/>
                                    </div>
                                    <div className="col-md-4 align-self-center">
                                        <Button color="purple" onClick={() => this.enviarCadastroResposta()} title="Cadastrar nova resposta">Cadastrar&nbsp;&nbsp; <i className="fa fa-plus" arria-hidden="true"/></Button>
                                    </div>
                                </div>  

                                <br /> 

                                {/* Lista - RESPOSTAS */}
                                <div className="row">
                                    <div className="col">
                                        <Table small responsive hover>
                                            <caption>{this.state.listaPalavras.length === 0 ? 'Nenhuma resposta encontrada' : this.state.listaPalavras.length + ' respostas encontradas'} </caption>
                                            <TableHead color="purple-color">
                                                <tr>
                                                    <th width="95%">DESCRIÇÃO</th>
                                                    <th width="5%" className="text-center"></th>
                                                </tr>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.listaPalavras.map(res => {
                                                    return (
                                                        <tr>
                                                            <td>{res.description}</td>                                                            
                                                            <td className="text-center"><Button size="sm" color="danger" onClick={ () => this.excluirResposta(res.answer_id) } title="Excluir resposta"><i className="fa fa-times" arria-hidden="true" /></Button></td>
                                                        </tr>
                                                    )
                                                }) }
                                            </TableBody>
                                        </Table>
                                    </div>                            
                                </div>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="purple" onClick={this.toggleModalRespostas}>Fechar</Button>
                            </ModalFooter>
                            </Modal>
                        </Container>

                    </div>
                </div>
                </div>
            </div>
        )
    }
}

BackPalavra.propTypes = {
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
)(BackPalavra);