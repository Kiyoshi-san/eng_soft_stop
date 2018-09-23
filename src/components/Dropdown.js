import React, { Component } from 'react';

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listOpen: false, //boolean variable for toggling the menu list
        }
    }

    render() {
        const { list, listOpen } = this.props;
        return (
            <div className="dd-wrapper">
                {listOpen && list !== null && <ul className="menu-toggle">
                    {list.map((item) => (
                        <li key={item.id} >{item.title}</li>
                    ))}
                </ul>}
            </div>
        );
    }
}