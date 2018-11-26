import React, { Component } from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { Row, Col, Button } from 'mdbreact';
import { ToastContainer, toast } from "mdbreact";
import update from 'immutability-helper';

import * as uiActions from '../../actions/uiActions';
import * as methods from '../../util/Methods';
import StorageKey from '../../util/StorageKey';
import config from '../../util/Config';

import '../../css/match.css';

class Match extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          user: JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO)),
          inventario: JSON.parse(localStorage.getItem(StorageKey.INVENTARIO)),
          letter: methods.randomLetter(),
          clock: 60,
          words: [],
          match: {},
          skills: []
        };
    }

    listenMatch(id) {
        this.props.uiActions.loading("Estamos conectando todos a partida...");
        this.staredRef = firebase.database().ref(`${id}/match_started`);

        this.staredRef
          .on('value', started => {
            if (started.val()) {
                this.listenFinished(id);
                this.props.uiActions.stopLoading();
                this.startGame(id);
            }
        });
    }

    listenFinished(id) {
        this.finishedRef = firebase.database().ref(`${id}/match_finished`);

        this.finishedRef
          .on('value', finished => {
            if (finished.val()) {
                this.stopApp();
                this.listenValidated(id);
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

    recuvueSkills() {
        const { match, user } = this.state;

        if (match.players) {
            this.setState({skills: match.players.map(e => {
                if (e.user_id !== user.userId) {
                    return e.items;
                }
            }).flat()});
        }
    }

    setStarted(id) {
        const { user, match, letter } = this.state;

        if (match.creator_player_id === user.userId) {
            const body = {
                match_id: id,
                letter: letter,
                match_players_count: match.players_count
            }

            axios.post(`${config.match.start}`, body)
                .then(res => {})
                .catch(() => toast.error("Erro inesperado."));
        }
    }

    startGame(id) {
        const { match, user } = this.state;

        this.startedTimeRef = firebase.database().ref(`${id}/match_started_time`);

        this.startedTimeRef.once('value', time => {
            let finalTime = new Date(time.val()).getTime() + 60000;

            setInterval(() =>  {
                this.setState({ clock: (finalTime - new Date().getTime())/1000});
                if (finalTime === new Date().getTime() && match.creator_player_id ===user.userId) {
                    this.setStop();
                }
            }, 1000);
        });
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

        axios.post(`${config.answer.validation}`, body)
            .then(res => {})
            .catch(() => toast.error("Erro inesperado."));
    }

    setStop() {
        const { id, user, clock } = this.props.match.params;
        
        this.finishedRef = firebase.database().ref(`${id}/match_finished`);
        this.finishedRef.set(true);

        axios.post(`${config.match.end}`, {match_id: id, tempo_termino: clock, id_jogador_finalizador: user.userId})
            .then(res => {})
            .catch(() => toast.error("Erro inesperado."));
    }

    handleStop = (event) => {
        event.preventDefault();
        this.setStop();
    }

    handleChange = (event) => {
        this.setState((prevState) => ({
            words: update(prevState.words, {[event.id]: {$set: event.value}})
        }));
    }

    handleDica = (event) => {
        axios.get(`${config.hint}/${this.state.match.letter}?categoria=${event.id}`)
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

        axios.get(`${config.match.match}/${id}`)
            .then(res => {
                if (res.data.status_code === 200) {
                    let match = res.data.content;

                    if (inventario.items !== 0)
                        match.categories.forEach((item) => item.enabled = true)

                    this.listenMatch(id);
                    this.setState({match});
                    this.recuvueSkills();
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
            <div>
                <ToastContainer newestOnTop={true}/>
                <div className="match-margin">
                    <form onSubmit={this.handleStop}>
                        <Row className="match-margin">
                            <Col md="5" className="responsive-aling">
                                <div align="center" className="text-style-label">
                                    LETRA
                                    <div className="circle-letter text-style">
                                        {match.letter && match.letter.toUpperCase()}
                                    </div>
                                </div>
                            </Col>
                            {clock && clock < 60 && clock > 0 && <Col md="7" className="text-style-clock">
                                <div className="circle-clock">00:{methods.secondFormat(clock)}</div>
                            </Col>}
                        </Row>
                        {match.categories && match.categories.map((e, i) => 
                        <Row key={i} className="default-aling">
                            <Col md="5" className="text-aling">
                                <div className="custom-label default-margin">{methods.titleCase(e.name)}</div>
                            </Col>
                            <Col md="6">
                                <input type="text" id={e.id} className="form-control custom-input default-margin"
                                 onChange={this.handleChange} value={this.state.words[e.id]}></input>
                            </Col>
                            <Col md="1">
                                <Button id={e.id} color="deep-purple" onClick={this.handleDica}
                                    disabled={!e.enabled} className="custom-button">
                                    <i className="fa fa-question" aria-hidden="true"></i>
                                </Button>
                            </Col>
                        </Row>)}
                        <Row className="text-center default-aling">
                            <Col md="5"></Col>
                            <Col md="7">
                                <Button color="deep-purple" className="btn-rounded" type="submit">
                                    Stop
                                </Button>
                            </Col>
                        </Row>
                    </form>
                </div>
                <div className="background"></div>
            </div>
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