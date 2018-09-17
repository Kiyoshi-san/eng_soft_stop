import React, { Component } from 'react';

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listOPen: false, //boolean variable for toggling the menu list
            headerTitle: this.props.title //is equal to title prop
        }
    }

    handleClickOutside() {
        this.setState({
            listOpen: false
        })
    }

    toggleList() {
        this.setState(prevState => ({
            listOpen: !prevState.listOpen
        }))
    }

    render() {
        const { list } = this.props;
        const { listOpen, headerTitle } = this.state;
        return (
            <div className="dd-wrapper">
                <div className="dd-header" onClick={() => this.toggleList()}>
                    <div className="dd-header-title">{headerTitle}</div>
                    {listOpen
                        ? <div>Up</div> //<FontAwesome name="angle-up" size="2x" />
                        : <div>Down</div> //<FontAwesome name="angle-down" size="2x" />
                    }
                </div>

                {listOpen && <ul className="dd-list">
                    {list.map((item) => (
                        <li className="dd-list-item" key={item.id} >{item.title}</li>
                    ))}

                </ul>}

            </div>
        );
    }
}