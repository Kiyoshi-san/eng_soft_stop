import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from "mdbreact";
import { Input, Button, Table, TableBody, TableHead  } from 'mdbreact';
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
            efeitoSalvarAlteracoes: 'animated zoomInUp'
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
            }, 0);
        }

        this.setState({
            salvarAlteracoes: true,
            dirty: true
        });
        
    }


    /* Carrega a lista com as ligas existentes */
    listarLigas() {

        this.props.uiActions.loading("Preparando Visualização...");
        
        axios
        .get('https://backoffice2.free.beeceptor.com/league')
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
                                                    <th width="35%" className="text-left">IMAGEM DE FUNDO</th>
                                                    <th width="5%" className="text-center"></th>
                                                </tr>
                                            </TableHead>
                                            <TableBody>
                                                { this.state.listaLigas.map((res, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="text-right"><input type="text" className="form-control text-right" value={res.description} onChange={this.handleChangeLigas} model="description" index={i} /></td>
                                                            <td className="text-center" title="Quantidade mínima de pepitas necessárias para alcançar esta liga"><input type="number" className={`inputNumber ${(i === this.state.listaLigas.length - 1 ? "disabled" : "" )}` } step="10" value={res.range_min} onChange={this.handleChangeLigas} model="range_min" index={i} /> &nbsp;&nbsp;<i className="fa fa-diamond purple-text" aria-hidden="true"/></td>
                                                            <td className="text-center" title="Quantidade máxima de pepitas antes de avançar para a próxima liga"><input type="number" className={`inputNumber ${(i === 0 ? "disabled" : "" )}` } step="10" max="999999999" value={res.range_max} onChange={this.handleChangeLigas} model="range_max" index={i} /> &nbsp;&nbsp;<i className="fa fa-diamond purple-text" aria-hidden="true"/></td>
                                                            <td className="text-left"><input type="text" className="form-control text-right" value={res.background_image} onChange={this.handleChangeLigas} model="background_image" index={i} /></td>
                                                            <td className="text-center"><Button size="sm" color="danger" className={ i === this.state.listaLigas.length - 1 ? "disabled" : "" } onClick={ () => this.excluirLiga(res.id) } title="Excluir liga"><i className="fa fa-times" arria-hidden="true" /> Excluir</Button></td>
                                                        </tr>
                                                    )
                                                }) }
                                            </TableBody>
                                        </Table>
                                    </div>                            
                                </div>

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