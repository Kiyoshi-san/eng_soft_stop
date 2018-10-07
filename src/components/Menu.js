import React, { Component } from 'react';
import Dropdowndata from "./Dropdowndata";
import "../css/menu.css";

class Menu extends Component {
    constructor(props) {
        super (props);
        this.state = {
            // listOPen: false, //boolean variable for toggling the menu list
            // headerTitle: this.props.title //is equal to title prop
            listaMenu: [
                {
                    id: 0,
                    title: "Conta",
                    selected: false,
                    key: "location"
                }, {
                    id: 1,
                    title: "Personalizar",
                    selected: false,
                    key: "location"
                }, {
                    id: 2,
                    title: "Itens",
                    selected: false,
                    key: "location"
                }, {
                    id: 3,
                    title: "Sair",
                    selected: false,
                    key: "location"
                }
            ]
        }
    }

    fn_clicou(a) {
        // alert(a);
    }
    
    render () {
        const { listaMenu } = this.state;
        return (
            <div className="menu-wrapper">
                <div className="menu-header">
                    {<ul className="menu-list">
                        {listaMenu.map((item) => (
                            <li className="menu-list-item" key={item.id} onClick={() => this.fn_clicou(item.title)}>{item.title}</li>
                        ))}

                        <li className="menu-list-item" onClick={() => this.fn_clicou("Drop menu")}><Dropdowndata /></li>
                    </ul>}
                </div>                
            </div>
        );
    }
}

export default Menu;