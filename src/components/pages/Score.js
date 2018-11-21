import React, { Component } from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Row, Col, Input, Button } from 'mdbreact';
import { ToastContainer, toast } from "mdbreact";

import * as uiActions from '../../actions/uiActions';

class Score extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
           backEndURL: 'https://es3-stop-prod.herokuapp.com',
           results: []
        };

    }

    componentDidMount() {
        this.props.uiActions.loading("Preparando Resultado...");
        const { id } = this.props.match.params;

        axios.get(`${this.state.backEndURL}/matchResult/${id}`)
            .then(res => {
                if (res.data.status_code === 200) {
                    this.setState({results: res.data.content});
                    this.props.uiActions.stopLoading();

                } else {
                    toast.error(res.data.messages);
                }
            })
            .catch(() => toast.error("Erro inesperado."));

    }

    render() {
        return (
            <Row>
                <ToastContainer newestOnTop={true}/>
                    <div align="center">Resultados</div>
                    <Col md="12">
                        <div className="grey-text">
                            {this.state.results && this.state.results.map((e, i) => 
                                <Col key={i} md="12">
                                </Col>
                            )}
                        </div>
                    </Col>
                    <div className="text-center">
                        <Button color="deep-purple" className="col-md-12">
                            Home
                        </Button>
                    </div>
            </Row>
        )
    }
}

Score.propTypes = {
    uiActions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
    return {
        uiActions: bindActionCreators(uiActions, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(Score);