import React, { Component } from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { Container, Row, Col, Input, Button } from 'mdbreact';
import { ToastContainer, toast } from "mdbreact";
import update from 'immutability-helper';

import * as uiActions from '../../actions/uiActions';

import * as methods from '../../util/Methods';
import StorageKey from '../../util/StorageKey';

class Match extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          user: JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO)),
          inventario: JSON.parse(localStorage.getItem(StorageKey.INVENTARIO)),
          clock: 60,
          words: [],
          match: {},
          skills: [],
          backEndURL: 'https://es3-stop-prod.herokuapp.com'
        };

    }

    listenMatch(id) {
        this.staredRef = firebase.database().ref(`${id}/match_started`);

        this.staredRef
          .on('value', started => {
            if (started.val()) {
                this.listenFinished();
                this.props.uiActions.stopLoading();
                setInterval(() =>  {
                    this.setState((prevState) => ({ clock: prevState.clock - 1}));
                    if (this.state.clock === 0) {
                        this.stopApp();
                    }
                }, 1000);
            }
        });
    }

    listenFinished(id) {
        this.finishedRef = firebase.database().ref(`${id}/match_finished`);

        this.finishedRef
          .on('value', finished => {
            if (finished.val()) {
                this.stopApp();
                this.listenValidated();
            }
        });
    }

    listenValidated(id) {
        this.validatedRef = firebase.database().ref(`${id}/match_is_all_scores_calculated`);

        this.validatedRef
          .on('value', validated => {
            if (validated.val()) {
                window.location.href = `/score/${id}`;
            }
        });
    }

    applySkills() {
        const { match, user } = this.state;

        if (match.skills) {
            this.setState({skills: match.skills.map(e => {
                if (e.userId !== user.userId) {
                    return e.id;
                }
            })});
        }
    }

    setStarted(id) {
        // axios.post(`${this.state.backEndURL}/match/${id}/start`)
        //     .then(res => {})
        //     .catch(() => toast.error("Erro inesperado."));
    }

    stopApp() {
        this.props.uiActions.loading("STOP");

        const body = {
            match_id: this.state.match.match_id,
	        letter: this.state.match.letter,
            match: [
                {
                    player_id: this.state.user.userId,
                    categories_ids: this.state.match.categories.map(item => item.id),
                    answers: this.state.words
                },
            ]
        };

        axios.post(`${this.state.backEndURL}/validation`, body)
            .then(res => {})
            .catch(() => toast.error("Erro inesperado."));
    }

    handleStop = (event) => {
        event.preventDefault();
        this.finishedRef.set(true);
        this.stopApp();
    }

    handleChange = (event) => {
        this.setState((prevState) => ({
            words: update(prevState.words, {[event.id]: {$set: event.value}})
        }));
    }

    handleDica = (event) => {
        axios.get(`${this.state.backEndURL}/hint/${this.state.match.letter}?categoria=${event.id}`)
            .then(res => {
                if (res.data.status_code === 200) {
                    this.setState((prevState) => ({
                        words: update(prevState.words, {[event.id]: {$set: res.data.content}})
                    }));
                } else {
                    toast.error(res.data.messages);
                }
            })
            .catch(() => toast.error("Erro inesperado."));
    }

    componentDidMount() {
        this.props.uiActions.loading("Preparando Partida...");

        const { id } = this.props.match.params;
        const { inventario } = this.state;

        axios.get(`${this.state.backEndURL}/match/${id}`)
            .then(res => {
                if (res.data.status_code === 200) {
                    let match = res.data.content;

                    if (inventario.items)
                        match.categories.forEach((item) => item.enabled = true)

                    this.setState({match});
                    this.listenMatch(id);
                    this.applySkills();
                    this.setStarted(id);
                } else {
                    toast.error(res.data.messages);
                }
            })
            .catch(() => toast.error("Erro inesperado."));

    }

    render() {
        const { clock, match } = this.state;

        return (
            <Container>
                <ToastContainer newestOnTop={true}/>
                <Row>
                    <Col md="12">
                        <form onSubmit={this.handleStop}>
                            <Row>
                                <Col md="5">
                                    <div align="center">Letra: {match.letter && match.letter.toUpperCase()}</div>
                                </Col>
                                {clock && clock < 60 && clock > 0 && <Col md="7">
                                    <div>00:{methods.secondFormat(clock)}</div>
                                </Col>}
                            </Row>
                                {match.categories && match.categories.map((e, i) => 
                                <Row key={i}>
                                    <Col md="10">
                                        <Input id={e.id} label={methods.titleCase(e.name)} value={this.state.words[e.id]} 
                                            group type="text" onChange={this.handleChange}/>
                                    </Col>
                                    <Col md="2">
                                        <Button id={e.id} color="deep-purple" onClick={this.handleDica}
                                            disabled={!e.enabled}>
                                            Dica
                                        </Button>
                                    </Col>
                                </Row>)}
                            <div className="text-center">
                                <Button color="deep-purple" className="col-md-4" type="submit">
                                    Stop
                                </Button>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

Match.propTypes = {
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
)(Match);