import React, { Component } from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button } from 'mdbreact';
import { ToastContainer, toast } from "mdbreact";
import { MDBTable, MDBTableBody, MDBTableHead  } from 'mdbreact';

import * as uiActions from '../../actions/uiActions';

import '../../css/score.css';

class Score extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
           backEndURL: 'https://es3-stop-prod.herokuapp.com',
           header: [
              {
                label: [<i key="cell1" className="fa fa-graduation-cap mr-2 grey-text" aria-hidden="true"></i>, 'Posição'],
                field: 'id',
                sort: 'asc',
              },
              {
                label: [<i key="cell1" className="fa fa-user mr-2 grey-text" aria-hidden="true"></i>, 'Nome'],
                field: 'name',
                sort: 'asc'
              },
              {
                label: [<i key="cell1" className="fa fa-diamond mr-2 grey-text" aria-hidden="true"></i>, 'Pontuação'],
                field: 'score',
                sort: 'asc'
              }
           ],
           results: []
        };

    }

    componentDidMount() {
        this.props.uiActions.loading("Preparando Resultado...");
        const { id } = this.props.match.params;

        axios.get(`${this.state.backEndURL}/matchResult/${id}`)
            .then(res => {
                if (res.data.status_code === 200) {
                    this.setState({
                        results: res.data.content.map((e, i) => {
                            return {
                                id: ++i,
                                name: e.player_name,
                                score: e.match_score
                            }
                        })
                    });
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
                        <blockquote className="blockquote bq-purple space">                        
                            <p className="bq-title purple-text"><i class="fa fa-list-alt" aria-hidden="true" /> Resultados</p>
                        </blockquote>
                        <MDBTable btn fixed>
                            <MDBTableHead columns={this.state.header}/>
                            <MDBTableBody rows={this.state.results} />
                        </MDBTable>
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