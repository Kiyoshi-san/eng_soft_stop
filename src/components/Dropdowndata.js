import React, { Component } from "react";
import Dropdown from "./Dropdown";

export default class Dropdowndata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perfil: [
                {
                    id: 0,
                    title: "Conta",
                    selected: false,
                    key: "location"
                },{
                    id: 1,
                    title: "Personalizar",
                    selected: false,
                    key: "location"
                },{
                    id: 2,
                    title: "Itens",
                    selected: false,
                    key: "location"
                },{
                    id: 3,
                    title: "Sair",
                    selected: false,
                    key: "location"
                }
            ]
        }
    }
    
    render() {
        return(
            <Dropdown
                title="Perfil"
                list={ this.state.perfil }
            />
        );
    }
}