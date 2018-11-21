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
          loaded: false,
          words: [],
          matchInfo: {},
          backEndURL: 'https://es3-stop-prod.herokuapp.com',
          match: {}
        };

        this.partidasRef = firebase.database().ref().child('projetojogostop');
    }

    listenMatch(id) {
        // this.partidasRef
        //   .on(id, match => {
        //     this.setState({match});

        //     //Verifica Carregamento da página
        //     if (match.match_started) {
        //         this.props.uiActions.stopLoading();
        //         setInterval(() =>  this.setState((prevState) => ({ clock: prevState - 1}), 1000));
        //     }
        // });

        this.props.uiActions.stopLoading();
        setInterval(() =>  {
            this.setState((prevState) => ({ clock: prevState.clock - 1}));
            if (this.state.clock === 0) {
                this.stopApp();
            }
        }, 1000);
    }

    listenValidated(id) {
        setTimeout(() => {
            // this.partidasRef
            //   .on(id, match => {
            //     this.setState({match});
            
            //     //Verifica Carregamento da página
            //     if (match.match_validated) {
            //         this.props.uiActions.stopLoading();
            //         setInterval(() =>  this.setState((prevState) => ({ clock: prevState - 1}), 1000));
            //     }
            // });
            window.location.href = `/score/${id}`;
        }, 1000);
        
    }

    applySkills() {

    }

    componentDidMount() {
        this.props.uiActions.loading("Preparando Partida...");

        const { id } = this.props.match.params;
        const { user, inventario } = this.state;

        axios.get(`${this.state.backEndURL}/match/${id}`)
            .then(res => {
                if (res.data.status_code === 200) {
                    let content = res.data.content;

                    if (inventario.items)
                        content.categories.forEach((item) => item.enabled = true)

                    this.setState({matchInfo: res.data.content});
                    this.listenMatch(id);
                    this.applySkills();

                    if (res.data.content.players.some(item => item.mainUser && item.user === user.userId)) {
                        const match = this.state.match;
                        match.match_started = true;
                        this.partidasRef.child(id).update(match);
                    }

                } else {
                    toast.error(res.data.messages);
                }
            })
            .catch(() => toast.error("Erro inesperado."));

    }

    stopApp() {
        const body = {
            match_id: this.state.matchInfo.match_id,
	        letter: this.state.matchInfo.letter,
            match: [
                {
                    player_id: this.state.user.userId,
                    categories_ids: this.state.matchInfo.categories.map(item => item.id),
                    answers: this.state.words
                },
            ]
        };

        axios.post(`${this.state.backEndURL}/validation`, body)
            .then(res => {
                this.props.uiActions.loading("STOP");
                this.listenValidated(this.state.matchInfo.match_id);
            })
            .catch(() => toast.error("Erro inesperado."));
    }

    handleStop = (event) => {
        event.preventDefault();
        this.stopApp();
    }

    handleChange = (event) => {
        this.setState((prevState) => ({
            words: update(prevState.words, {[event.id]: {$set: event.value}})
        }));
    }

    handleDica = (event) => {
        axios.get(`${this.state.backEndURL}/hint/${this.state.matchInfo.letter}?categoria=${event.id}`)
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

    render() {
        const { clock } = this.state;

        return (
            <Container>
                <ToastContainer newestOnTop={true}/>
                <Row>
                    <Col md="12">
                        <form onSubmit={this.handleStop}>
                            <div align="center">Letra: </div><div>{this.state.matchInfo.letter}</div>
                            <div>0:{clock}</div>
                                {this.state.matchInfo.categories && this.state.matchInfo.categories.map((e, i) => 
                                <Row key={i}>
                                    <Col md="12">
                                        <Input id={e.id} label={methods.titleCase(e.name)} value={this.state.words[e.id]} 
                                            group type="text" onChange={this.handleChange} />
                                        <Button id={e.id} color="deep-purple" className="col-md-12" onClick={this.handleDica}
                                            disabled={!e.enabled} rounded>
                                            Dica
                                        </Button>
                                    </Col>
                                </Row>)}
                            <div className="text-center">
                                <Button color="deep-purple" className="col-md-12" type="submit" rounded>
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