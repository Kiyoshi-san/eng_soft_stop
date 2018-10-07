import React, { Component } from 'react';

import axios from "axios";

export default class Backoffice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoria: ""
            
        };
    }

    handleChange = e => {
        this.setState({ 
            categoria: e.target.value 
        });
    }
    
    handleSubmit = e => {
        e.preventDefault();

        const cadastroCategoria = {
            categoria: this.state.categoria
        }

        axios
            .post('https://jsonplaceholder.typicode.com/users', { cadastroCategoria })
            .then(res => {
                console.log(res);
                console.log(res.data);
            }) 
            
    }
    
    render() {
        return (
            <div>
                <form onSubmit={ this.handleSubmit}>
                    <label>
                        Categoria: <input type="text" name="categoria" onChange={this.handleChange }/>
                    </label>
                    <label>
                        Palavra: <input type="text" name="palavra" onChange={this.handleChange }/>
                    </label>
                    <button type="submit">Add</button>
                </form>
            </div>
        )
    }
}