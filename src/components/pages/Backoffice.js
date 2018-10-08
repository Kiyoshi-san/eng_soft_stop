import React, { Component } from 'react';
import '../../css/backoffice.css';
import axios from "axios";

export default class Backoffice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categorias: [],
            categ_val: "",
            palavra: "",
            addPalavra: null,
            componentePalavra: []
        };
    }
    
    componentDidMount() {
        axios
            .get('https://jsonplaceholder.typicode.com/users')
            /* .then(res => {
                this.setState({ 
                    categorias: res.data 
                })
            }) */

            this.setState({ 
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
            })
    }

    handleChange = e => {
        this.setState({ 
            categ_val: e.target.value,
            palavra: e.target.value
        });
        console.log(e.target.value);
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
        this.state.componentePalavra['componentePalavra-' + timestamp] = res;
        // set the state
        this.setState({ 
            componentePalavra: this.state.componentePalavra 
        });
    }

    
    render() {
        return (
            <div>
                <form onSubmit={ this.handleSubmit}>
                    <button onClick={ this.addPalavra } type="button">Add mais palavras</button>
                    {/* <label className="inputBkofc">
                        Categoria: <input type="text" name="categoria" onChange={this.handleChange }/>
                    </label> */}
                    <label className="inputBkofc">
                        Categoria: <select name="categoria" onChange={ this.handleChange }>
                            <option selected value="">Selecione</option>
                            { this.state.categorias.map(res => <option value={ res.id }>{ res.categoria }</option>) }
                        </select>
                    </label>
                    <label className="inputBkofc">
                        Palavra: <input type="text" name="palavra" onChange={this.handleChange }/>
                    </label>
                    <button type="submit">Add</button>
                </form>
            </div>
        )
    }
}