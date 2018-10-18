import React, { Component } from 'react';
import '../../css/backoffice.css';
import axios from "axios";

import {Row} from 'react-bootstrap';

export default class BackPalavra extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categorias: [],
            categ_val: "",
            palavra: "",
            listaPalavras: [],
            addPalavra: null,
            componentePalavra: [],
            success: 0
        };
    }
    
    idx = 0;
    
    categoryList() {
        console.log("categorylist")
        axios
        // .get(`${'https://cors-anywhere.herokuapp.com/'}https://es3-stop-prod.herokuapp.com/categories`)
        .get('https://es3-stop-prod.herokuapp.com/categories')
        .then(res => {
            // console.log(res.data.content)
            
            this.setState({ 
                categorias: res.data.content
            })
        })
    }
    
    palavrasList() {
        console.log("palavraslist")
        // Carregando a lista de palavras ja cadastradas
        axios
            // .get(`${'https://cors-anywhere.herokuapp.com/'}https://es3-stop-prod.herokuapp.com/categories`)
            .get('https://es3-stop-prod.herokuapp.com/categories')
            .then(res => {
                // console.log(res.data.content)
                
                this.setState({ 
                    categorias: res.data.content
                })
            })
    }

    componentDidMount() {
        this.categoryList();
        this.palavrasList();
    }

    enviarCadastroResposta = cadastroResposta => {
        let valor = cadastroResposta.value;
        if (valor.trim()) {
            axios
                // .post(`${'https://cors-anywhere.herokuapp.com/'}https://es3-stop-prod.herokuapp.com/answer`, { "category_id":this.state.category_id, "description":valor })
                .post('https://es3-stop-prod.herokuapp.com/answer', { "category_id": this.state.category_id, "description": valor })
            .then(res => {
                this.palavrasList();
                if(this.state.success === 0) {
                    // alert("Cadastrado com sucesso");
                }
                this.setState ({
                    success: 1
                })
            })
            .catch(res => {
                this.setState ({
                    success: 0
                })
            })
        }
    }

    enviarCadastroCategoria = cadastroCategoria => {
        let valor = cadastroCategoria;
        if (valor.trim()) {
            axios
                // .post(`${'https://cors-anywhere.herokuapp.com/'}https://es3-stop-prod.herokuapp.com/answer`, { "category_id":this.state.category_id, "description":valor })
                .post('https://es3-stop-prod.herokuapp.com/category', { "name":valor })
                .then(res => {
                    alert("Cadastrado com sucesso");
                    document.getElementsByName("categoriaName")[0].value = "";
                    this.categoryList();
                })
                .catch(res => {
                    alert("Algo deu errado")
                })
        }
    }

    /* Enviando Resposta para salvar */
    handleSubmitResposta = e => {
        e.preventDefault();
        
        // const cadastroResposta = new FormData(e.target);
        // const cadastroResposta = new FormData(this.form);
        
        let cadastroResposta = document.getElementsByName("description")[0].value;
        let selectCategoria = Number(document.getElementsByName("categoria")[0].value);
        
        if (!cadastroResposta.trim()) {
            alert("Por favor preencha uma resposta válida");
            return;
        }
        
        if (!selectCategoria) {
            alert("Por favor selecione uma categoria");
            return;
        }
        // this.state.success ? alert("Cadastrado com sucesso") : null;
        // window.location.reload();
        selectCategoria = 0;
        // cadastroResposta.forEach((a) => a.value = "");
        this.enviarCadastroResposta(cadastroResposta);
        cadastroResposta = "";
    }

    /* Enviando Categoria para salvar */
    handleSubmitCategoria = e => {
        e.preventDefault();
        
        // const cadastroResposta = new FormData(e.target);
        // const cadastroResposta = new FormData(this.form);
        
        let cadastroCategoria = document.getElementsByName("categoriaName")[0].value;
                
        if (!cadastroCategoria.trim()) {
            alert("Por favor preencha uma categoria válida");
            return;
        }
        
        // cadastroResposta.forEach((a) => a.value = "");
        this.enviarCadastroCategoria(cadastroCategoria);
    }

    excluir = e => {
        console.log(e.target.value)
        let excluir_id = e.target.value;
        
        if (window.confirm("Deseja realmente excluir a categoria?")) {
            axios
                // .delete(`${'https://cors-anywhere.herokuapp.com/'}https://es3-stop-prod.herokuapp.com/category`, { data: { "category_id": excluir_id } })
                .delete('https://es3-stop-prod.herokuapp.com/category', { data: { "category_id": excluir_id } })
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    this.categoryList();
                    alert("Excluido com sucesso")
                })
        }
    }

    loadingTableAnswer = () => {
        axios
        // .get(`${'https://cors-anywhere.herokuapp.com/'}https://es3-stop-prod.herokuapp.com/categories`)
        .get('https://es3-stop-prod.herokuapp.com/answers?category=' + this.state.category_id)
        .then(res => {
            console.log("res")
            console.log(res.data.content)
            console.log("res")
                this.setState({
                    listaPalavras: res.data.content
                })
            })
        .catch(res => {
            console.log("erro")
            console.log(res)
            console.log("erro")
        })
    }

    handleChange = e => {
        console.log(e.target.value)
        this.setState({ 
            category_id: e.target.value
        }, () => {
            this.loadingTableAnswer();
        });
    }

    addComponentePalavra = (res) => {
        //create a unike key for each new componentePalavra item

        // update the state object
        this.state.componentePalavra[this.idx] = res;
        this.idx++;
        
        // set the state
        this.setState({ 
            componentePalavra: this.state.componentePalavra
        });

    }

    deleteComponentePalavra = (e) => {
        let array_del = this.state.componentePalavra;
        
        /* let idx = e.target.getAttribute("data-idx")
        console.log(idx)
        array_del.splice(idx, 1);
        this.setState({
            componentePalavra: array_del
        }) */        

        array_del.pop();
        this.setState({
            componentePalavra: array_del
        })
        console.log(array_del)
    }

    handleSwitch(elem, state) {
        console.log('handleSwitch. elem:', elem);
        console.log('name:', elem.props.name);
        console.log('new state:', state);
    }

    render() {
        return (
            <Row className="backContainer">
            {/* <div className="row bck--container"> */}
                <h1 class="bkfcTitulo">Cadastro</h1>
                <div className="col-xs-12 col-sm-12">
                    <form className="container" autoComplete="off"/*  onSubmit={ this.handleSubmit} */>
                        {/* Categorias */}
                        <div className="backContainer row">
                            <div className="col-xs-12 col-sm-6">
                                <div className="container botoes">
                                    {/* <button className="btn btn-primary botao" onClick={this.addComponentePalavra} type="button">Add mais Respostas</button> */}

                                    {this.state.componentePalavra.length ?
                                        <button className="btn btn-danger botao" type="button" onClick={this.deleteComponentePalavra}>Remover palavra</button> : ""}
                                        {console.log(this.state.componentePalavra)}

                                    {/* <button className="btn btn-success botao">Enviar</button> */}
                                </div>

                                {/* <label className="inputBkofc">
                                    Categoria: <input type="text" name="categoria" onChange={this.handleChange }/>
                                </label> */}

                                <table className="table table__categ">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col">Categorias</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="col"><input type="text" name="categoriaName" placeHolder="Adicionar uma Categoria" className="form-control" onChange={this.handleChange} /></th>
                                            <th scope="col"><button className="btn btn-success botao" onClick={this.handleSubmitCategoria}/*  type="submit" */>Enviar</button></th>
                                        </tr>
                                        { this.state.categorias.map(res => {
                                            return (
                                                <tr>
                                                    <td>{res.name}</td>
                                                    <td><button className="btn-danger" value={res.category_id} onClick={this.excluir}>-</button></td>
                                                </tr>
                                            )
                                        }) }
                                    </tbody>
                                </table>
                            </div>
                            {/* <label className="inputBkofc">
                                Palavra: <input type="text" name="description" className="form-control" onChange={this.handleChange }/>
                            </label> */}

                            { Object.keys(this.state.componentePalavra).map(function(key) {
                                return (
                                    <label className="inputBkofc">
                                        Palavra: <input type="text" name="description" className="form-control" /* onChange={this.handleChange } *//>
                                        {/* <button type="button" data-idx={ Object.keys(this.state.componentePalavra).length - 1 } onClick={ this.deleteComponentePalavra }>X</button> */}
                                    </label>
                                )
                            }.bind(this)) }

                            {/* Respostas */}
                            <div className="col-xs-12 col-sm-6">
                                <table class="table">
                                    <thead class="thead-dark">
                                        <tr>
                                            <th scope="col">Respostas</th>
                                            <th scope="col">
                                                <label className="inputBkofc">
                                                    <select name="categoria" className="form-control selectClass" onChange={ this.handleChange }>
                                                        <option selected value={0}>Selecione uma Categoria</option>
                                                        { this.state.categorias.map(res => <option value={ res.category_id }>{ res.name }</option>) }
                                                    </select>
                                                </label>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="col"><input type="text" name="description" placeHolder="Adicionar uma Resposta" className="form-control" onChange={this.handleChange} /></th>
                                            <th scope="col"><button className="btn btn-success botao" onClick={this.handleSubmitResposta}/*  type="submit" */>Enviar</button></th>
                                        </tr>
                                        {this.state.listaPalavras.map(res => {
                                            return (
                                                <tr>
                                                    <td>{res.description}</td>
                                                    <td><button className="btn-danger" value={res.category_id} onClick={this.excluir}>-</button></td>
                                                </tr>
                                            )
                                        }) }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>
                </div>
            {/* </div> */}
            </Row>
        )
    }
}