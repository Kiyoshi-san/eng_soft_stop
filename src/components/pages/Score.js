import React, { Component } from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button } from 'mdbreact';
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
            <Container>
                <ToastContainer newestOnTop={true}/>
                <Row>
                    <Col md="12">
                        <div align="center">Resultados</div>
                            {this.state.results && this.state.results.map((e, i) => 
                            <Row key={i}>
                                <Col md="12">
                                    {e.player_name}: {e.match_score}
                                </Col>
                            </Row>)}
                        <div className="text-center">
                            <a href="/home">
                                <Button color="deep-purple" className="col-md-12">
                                    home
                                </Button>
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
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