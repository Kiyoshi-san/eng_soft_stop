import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from "mdbreact";
import { Input, Button, Table, TableBody, TableHead } from 'mdbreact';
import { Container, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';

import axios from "axios";
import swal from 'sweetalert';

import MenuSide from '../shared/MenuSide';
import * as uiActions from '../../actions/uiActions';
import '../../css/backoffice.css';

class BackLigas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            salvarAlteracoes: false,
            descricaoLiga: '',
            listaLigas: [],
            efeitoSalvarAlteracoes: 'animated flash',
            league_id: 0,
            league_index: '',
            league_description: '',
            modalUploadImage: false,
            uploadImageURL: "https://api.cloudinary.com/v1_1/stopgame/image/upload",
            uploadImagePreset: "mbbotdvm",
            selectedFile: null
        };
    }

    
    /* Executa ao carregar o componente */
    componentDidMount() {
        this.listarLigas();
    }


    /* Faz o controle de alteração do state em elementos two-way data binding */
    handleChange = (event) => {

        this.setState({
            [event.target.id]: event.target.value,
            dirty: true
        });
    }


    /* Faz o controle de alteração do state em elementos two-way data binding */
    handleChangeLigas = (event) => {
        
        //Pega os atributos identificadores do campo editado
        let index = event.target.getAttribute("index");
        let model = event.target.getAttribute("model")

        //Altera seu valor diretamente
        this.state.listaLigas[index][model] = event.target.value;
        this.state.listaLigas[index]["has_changes"] = true;

        if(this.state.salvarAlteracoes === false)
        {

            //Anima o botão de salvar alterações
            document.getElementById("divSalvarAlteracoes").className = "";            
            setTimeout(() => {

                document.getElementById("divSalvarAlteracoes").className = this.state.efeitoSalvarAlteracoes;

                setInterval(() =>{
                    //Anima o botão de salvar alterações
                    document.getElementById("divSalvarAlteracoes").className = "";
                    setTimeout(() => {
                        document.getElementById("divSalvarAlteracoes").className = this.state.efeitoSalvarAlteracoes;
                    }, 0);
                }, 3000);
                
            }, 0);

            setTimeout(() =>{
                this.setState({
                    salvarAlteracoes: true
                });
            }, 1);           

        }

        this.setState({
            dirty: true
        });
        
    }


    /* Carrega a lista com as ligas existentes */
    listarLigas() {

        this.props.uiActions.loading("Preparando Visualização...");
        
        axios
        .get('https://backoffice4.free.beeceptor.com/league')
        .then(res => {
            this.setState({ 
                listaLigas: res.data.content,
                salvarAlteracoes: false
            })

            this.props.uiActions.stopLoading();
        })
        .catch(res => {
            toast.error('Erro ao listar as ligas. Erro: ' + res.response.data.messages);
            this.props.uiActions.stopLoading();
        });

    }


    /* Realiza a inserção da liga */
    enviarCadastroLiga(){

        let descricao = this.state.descricaoLiga;
                
        if (!descricao.trim()) {
            toast.warn("Informe uma descrição válida para a liga.");
            return;
        }
        
        this.props.uiActions.loading("Processando...");
            
        //axios
        //.post('https://es3-stop-prod.herokuapp.com/category', { "name": descricao })
        //.then(res => {

            this.props.uiActions.stopLoading();
            toast.success("Liga cadastrada com sucesso.");

            //this.listarLigas();
            this.setState({
                descricaoLiga: ''
            });
        //})
        //.catch(res => {
        //    this.props.uiActions.stopLoading();
        //    toast.error("Erro ao cadastrar a liga. Erro: " + res.response.data.messages);
        //});
    }


    /* Salva as alterações feitas nas ligas */
    salvarAlteracoesLigas() {

        this.props.uiActions.loading("Processando...");

        let ligas = [];

        //Atualiza só as ligas que tiveram alterações
        this.state.listaLigas.forEach((liga) => {
            
            if(liga["has_changes"] === true)
                ligas.push(liga);

        });
            
        //axios
        //.post('https://es3-stop-prod.herokuapp.com/category', { "name": descricao })
        //.then(res => {

            this.props.uiActions.stopLoading();
            toast.success("Ligas atualizadas com sucesso.");

            this.listarLigas();
            this.setState({
                salvarAlteracoes: false
            });
        //})
        //.catch(res => {
        //    this.props.uiActions.stopLoading();
        //    toast.error("Erro ao salvar as alterações nas ligas. Erro: " + res.response.data.messages);
        //});

    }    


    /* Abre o modal para adicionar imagem de fundo na liga*/
    clickUploadImage(liga_id, liga_index, liga_descricao){

        this.setState({
            league_id: liga_id,
            league_index: liga_index,
            league_description: liga_descricao,
            selectedFile: null
        }, () => {
            this.toggleModalUploadImage();
        });
        
    }


    /* Controla visibilidade do modal de upload de imagem */
    toggleModalUploadImage = () => {
        this.setState({
            modalUploadImage: !this.state.modalUploadImage
        });
    }


    /* Armazena os bytes da imagem selecionada para Upload */
    fileChangedHandler = (event) => {
        this.setState({selectedFile: event.target.files[0]})
    }


    /* Faz o upload da imagem de fundo no cloudinary e recupera a URL gerada */
    uploadImagemFundo = () => {
        
        //Recupera o current index da liga que stá sendo realizado upload
        let league_index = this.state.league_index;
        const formData = new FormData();
        formData.append('file', this.state.selectedFile);
        formData.append('upload_preset', this.state.uploadImagePreset);

        this.props.uiActions.loading("Realizando Upload...");

        axios
        .post(this.state.uploadImageURL, formData)
        .then(res => {

            this.props.uiActions.stopLoading();
            toast.success("Upload realizado com sucesso.");

            //Recupera a URL gerada pelo cloudinary para ser o background_image da liga
            this.state.listaLigas[league_index]["background_image"] = res.data.url;
            this.toggleModalUploadImage();

        })
        .catch(res => {
           this.props.uiActions.stopLoading();
           toast.error("Erro ao fazer upload da imagem. Erro: " + res.response.data.error.message);
        });
    }


    /* Exclusão de liga */
    excluirLiga(liga_id) {

        swal({
          title: "Tem certeza?",
          text: "- A tela será recarregada e as demais ligas poderão ter seus ranges ajustados (sugerimos que salve suas alterações antes de realizar esta operação).",
          icon: "warning",
          dangerMode: true,
          buttons: ["Cancelar", "OK"],
        })
        .then((willDelete) => {
          if (willDelete) {
        
            this.props.uiActions.loading("Processando...");

            // axios
            // .delete('https://es3-stop-prod.herokuapp.com/category', { data: { "category_id": categoria_id } })
            // .then(res => {
                 this.props.uiActions.stopLoading();
                 toast.success("Liga excluída com sucesso.");
    
                 this.listarLigas();
            // })
            // .catch(res => {
            //     this.props.uiActions.stopLoading();
            //     toast.error("Erro ao excluir a liga. Erro: " + res.response.data.messages);
            // });

          }
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
                            <p className="bq-title purple-text"><i className="fa fa-sitemap" aria-hidden="true"/> Ligas</p>
                        </blockquote>

                        {/* Lista de LIGAS */}
                        <div className="backContainer row">
                            <div className="col">

                                {/* Formulário de Cadastro - LIGAS */}
                                <div className="row">
                                    <div className="col-md-4 align-self-center">
                                        <Input type="text" id="descricaoLiga" placeHolder="Digite a descrição para inserir uma nova liga" className="form-control" value={this.state.descricaoLiga} onChange={this.handleChange}
                                            onKeyPress={ (event) => event.key === "Enter" ? this.enviarCadastroLiga() : ''} />
                                    </div>
                                    <div className="col-md-2 align-self-center">
                                        {/* Botão de Cadastrar */}
                                        <Button color="purple" onClick={() => this.enviarCadastroLiga()} title="Cadastrar nova liga">Cadastrar&nbsp;&nbsp; <i className="fa fa-plus" arria-hidden="true"/></Button> 
                                    </div>
                                    <div className="col-md-6 align-self-center text-right">
                                        <div id="divSalvarAlteracoes">
                                            {/* Botão de Salvar Alterações */}
                                            { this.state.salvarAlteracoes && <Button color="cyan" onClick={() => this.salvarAlteracoesLigas()} title="Salvar as alterações feitas nas ligas">Salvar Alterações&nbsp;&nbsp; <i className="fa fa-refresh" arria-hidden="true"/></Button> }
                                        </div>
                                    </div>
                                </div>

                                <br />

                                {/* Lista - LIGAS */}
                                <div className="row">
                                    <div className="col">
                                        <Table responsive hover>
                                            <caption>{this.state.listaLigas.length === 0 ? 'Nenhuma liga encontrada' : this.state.listaLigas.length + ' ligas encontradas'} </caption>
                                            <TableHead color="purple-color">
                                                <tr>
                                                    <th width="40%" className="text-right">DESCRIÇÃO</th>
                                                    <th width="10%" className="text-center">PONTUAÇÃO MÍNIMA</th>
                                                    <th width="10%" className="text-center">PONTUAÇÃO MÁXIMA</th>
                                                    <th width="30%" className="text-center">IMAGEM DE FUNDO</th>
                                                    <th width="5%" className="text-center"></th>
                                                    <th width="5%" className="text-center"></th>
                                                </tr>
                                            </TableHead>
                                            <TableBody>
                                                { this.state.listaLigas.map((res, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="text-right"><input type="text" className="form-control text-right" value={res.description} onChange={this.handleChangeLigas} model="description" index={i} /></td>
                                                            <td className="text-center" title="Quantidade mínima de pepitas necessárias para alcançar esta liga"><input className="inputNumber" readOnly={true} value={res.range_min} onChange={this.handleChangeLigas} model="range_min" index={i} /> &nbsp;&nbsp;<i className="fa fa-diamond purple-text" aria-hidden="true"/></td>
                                                            <td className="text-center" title="Quantidade máxima de pepitas antes de avançar para a próxima liga"><input className="inputNumber" readOnly={i === 0} value={res.range_max} onChange={this.handleChangeLigas} model="range_max" index={i} /> &nbsp;&nbsp;<i className="fa fa-diamond purple-text" aria-hidden="true"/></td>
                                                            <td className="text-center"><a href={res.background_image} target="_blank" rel="noopener noreferrer"><img src={res.background_image} alt={`Liga ${res.description}`} width={50} height={50} className="img-thumbnail" /></a>{/*<input type="text" className="form-control text-right" value={res.background_image} onChange={this.handleChangeLigas} model="background_image" index={i} />*/}</td>
                                                            <td className="text-center"><Button size="sm" color="indigo" onClick={ () => this.clickUploadImage(res.league_id, i, res.description) }  title="Upload de imagem de fundo da liga"><i className="fa fa-picture-o" arria-hidden="true" /> Alterar Imagem</Button></td>
                                                            <td className="text-center"><Button size="sm" color="danger" className={ i === this.state.listaLigas.length - 1 ? "disabled" : "" } onClick={ () => this.excluirLiga(res.league_id) } title="Excluir liga"><i className="fa fa-times" arria-hidden="true" /> Excluir</Button></td>
                                                        </tr>
                                                    )
                                                }) }
                                            </TableBody>
                                        </Table>
                                    </div>                            
                                </div>

                                {/* Modal - UPLOAD IMAGEM */}
                                <Container>
                                    <Modal isOpen={this.state.modalUploadImage} toggle={this.toggleModalUploadImage} size="lg">
                                    <ModalHeader toggle={this.toggleModalUploadImage} className="purple-color"><b>Upload de Imagem</b><h6>Liga {this.state.league_description}</h6></ModalHeader>
                                    <ModalBody>

                                        {/* Formulário de Cadastro - RESPOSTAS */}
                                        <br />
                                        <div className="row">
                                            <div className="col-md-12">
                                                <p>Selecione uma imagem para ser o fundo da Liga selecionada:</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-8 align-self-center">
                                                <input type="file" onChange={this.fileChangedHandler} />
                                            </div>
                                            <div className="col-md-4 align-self-center">
                                                <Button color="purple" onClick={() => this.uploadImagemFundo()} title="Realizar o upload da imagem">Upload&nbsp;&nbsp; <i className="fa fa-upload" arria-hidden="true"/></Button>
                                            </div>
                                        </div>                                      
                                        
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="purple" onClick={this.toggleModalUploadImage}>Fechar</Button>
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

BackLigas.propTypes = {
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
)(BackLigas);