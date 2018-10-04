import React, { Component } from 'react';

import Button from 'react-bootstrap/lib/Button';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
                <Button variant="primary">Primary</Button>
            </div>
        )
    }
}