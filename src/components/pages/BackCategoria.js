import React, { Component } from 'react';
import '../../css/backoffice.css';
import axios from "axios";
import MenuBackoffice from "../MenuBackoffice";

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
            componentePalavra: []
        };
    }
    
    idx = 0;
    
    componentDidMount() {
        axios
            .get(`${'https://cors-anywhere.herokuapp.com/'}https://es3-stop-prod.herokuapp.com/categories`)
            .then(res => {
                // console.log(res.data.content)
                
                this.setState({ 
                    categorias: res.data.content
                })
            })
            
            /* this.setState({ 
                categorias: [{
                    id: 1,
                    categoria: "Carro"
                }, {
                    id: 2,
                    categoria: "Cor"
                }, {
                    id: 3,
                    categoria: "CEP"
                }, {
                    id: 4,
                    categoria: "Marca"
                }]
            }) */


            // Carregando a lista de palavras ja cadastradas
            axios
                .get(`${'https://cors-anywhere.herokuapp.com/'}https://es3-stop-prod.herokuapp.com/categories`)
                .then(res => {
                    // console.log(res.data.content)
                    
                    this.setState({ 
                        categorias: res.data.content
                    })
                })
        }
        
        handleChange = e => {
            this.setState({ 
                categ_val: e.target.value,
                palavra: e.target.value
            });
        }
        
        /* Enviando dados para salvar */
        handleSubmit = e => {
        e.preventDefault();

        const cadastroCategoria = {
            categ_val: this.state.categ_val,
            palavras: this.state.palavra
        }

        axios
            .post('https://jsonplaceholder.typicode.com/users', { cadastroCategoria })
            .then(res => {
                console.log(res);
                console.log(res.data);
            }) 
            
    }


    addComponentePalavra = (res) => {
        //create a unike key for each new componentePalavra item
        var timestamp = (new Date()).getTime();

        // update the state object
        // this.state.componentePalavra['componentePalavra-' + timestamp] = res;
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

    render() {
        return (
            <Row className="backContainer">
            {/* <div className="row bck--container"> */}
                <MenuBackoffice />
                <div className="col-xs-12 col-md-8">
                    <form className="container" autoComplete="off" onSubmit={ this.handleSubmit}>
                        <div className="container botoes">
                            <button className="btn btn-primary botao" onClick={this.addComponentePalavra} type="button">Add mais Categorias</button>

                            {this.state.componentePalavra.length ?
                                <button className="btn btn-danger botao" type="button" onClick={this.deleteComponentePalavra}>Remover palavra</button> : ""}
                                {console.log(this.state.componentePalavra)}

                            <button className="btn btn-success botao" type="submit">Enviar</button>
                        </div>

                        {/* <label className="inputBkofc">
                            Categoria: <input type="text" name="categoria" onChange={this.handleChange }/>
                        </label> */}
                        <label className="inputBkofc">
                        Categoria: <input type="text" name="palavra" className="form-control" onChange={this.handleChange }/>
                        </label>

                        { Object.keys(this.state.componentePalavra).map(function(key) {
                            return (
                                <label className="inputBkofc">
                                    Categoria: <input type="text" name="palavra" className="form-control" onChange={this.handleChange }/>
                                    {/* <button type="button" data-idx={ Object.keys(this.state.componentePalavra).length - 1 } onClick={ this.deleteComponentePalavra }>X</button> */}
                                </label>
                            )
                        }.bind(this)) }

                    </form>
                </div>
                <div className="col-xs-12 col-md-4">
                    <table class="table">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">Categorias</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.state.categorias.map(res => {
                                return (
                                    <tr>
                                        <td>{res.name}</td>
                                    </tr>
                                )
                            }) }
                        </tbody>
                    </table>
                </div>
            {/* </div> */}
            </Row>
        )
    }
}