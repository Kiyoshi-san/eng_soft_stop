import React, { Component } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';

import Dropdown from "./Dropdown";
import "../css/menu.css";

export default class Menu extends Component {
    constructor(props) {
        super (props);
        this.state = {
            listOpen: false, 
            listaMenu: [
                {
                    id: 0,
                    title: "Home",
                    selected: false,
                    key: "location",
                    itens: null
                }, {
                    id: 1,
                    title: "Loja",
                    selected: false,
                    key: "location",
                    itens: null
                }, {
                    id: 2,
                    title: "Perfil",
                    selected: false,
                    key: "location",
                    itens: [
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
            ]
        }
    }

    handleClickOutside() {
        this.setState({
            listOpen: false
        })
    }

    toggleList(id) {
        if (id === 2)
            this.setState(prevState => ({
                listOpen: !prevState.listOpen
            }))
    }
    
    render () {
        const { listaMenu, listOpen } = this.state;
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="#home">Stop App</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {listaMenu.map((item) => (
                            {item.itens === null &&
                            }
                        ))}
                    </Navbar.Text>
                </Navbar.Collapse>
                
            </Navbar>
            {<ul className="menu-list">
                {listaMenu.map((item) => (
                    <li className="menu-list-item" key={item.id} onClick={() => this.toggleList(item.id) }>
                        {item.title} 
                        {item.id === 2 && <Dropdown list={item.itens} listOpen={listOpen} />}
                    </li>
                ))}
            </ul>}
        );
    }
}