import React, { Component } from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { Row, Col, Input, Button } from 'mdbreact';
import { ToastContainer, toast } from "mdbreact";
import update from 'immutability-helper';

import * as matchActions from '../../actions/matchActions';
import * as uiActions from '../../actions/uiActions';

import * as methods from '../../util/Methods';
import StorageKey from '../../util/StorageKey';

class Match extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          user: JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO)),
          clock: 60,
          loaded: false,
          words: [],
          backEndURL: 'https://es3-stop-prod.herokuapp.com'
        };

        this.partidasRef = firebase.database().ref().child('projetojogostop');
    }

    listenMatch() {
        this.partidasRef
          .on(this.props.match.matchId, match => {
            let matchObj = match;

            if (!matchObj.listReady) {
                matchObj.listReady = this.props.match.userList.map(item => {return { user: item, ready: false }});
                matchObj.ready = false;

                this.partidasRef.child(this.props.match.matchId).update(matchObj);
            }

            if (!this.state.loaded) {
                matchObj.listReady = this.state.listReady.map(item => {return {user: item, ready: item === this.state.user.userId}});
                this.partidasRef.child(this.props.match.matchId).update(matchObj);
            }

            if (match.listReady.every(item => item.ready)) {
                matchObj.ready = true;
                this.partidasRef.child(this.props.match.matchId).update(matchObj);
            }

            //Verifica Carregamento da página
            if (match.loaded) {
                this.props.uiActions.stopLoading();
                setInterval(() =>  this.setState((prevState) => ({ clock: prevState - 1}), 1000));
            }
        });
    }

    componentDidMount() {
        this.listenMatch();
    }

    handleStop = (event) => {
        event.preventDefault();

        const body = {
            match_id: this.props.match.matchId,
	        letter: this.props.match.letter,
            match: [
                {
                    player_id: this.state.user.userId,
                    categories_ids: this.props.match.categoryList.map(item => item.id),
                    answers: this.state.words
                },
            ]
        }

        axios.post(`${this.state.backEndURL}/validation`, body)
            .then(res => {
                
            })
            .catch(() => toast.error("Erro inesperado."));
    }

    handleChange = (event) => {
        this.setState((prevState) => ({
            words: update(prevState.words, {[event.id]: {$set: event.value}})
        }));
    }

    handleDica = (event) => {
        axios.get(`${this.state.backEndURL}/hint/${this.props.match.letter}?categoria=${event.id}`)
            .then(res => {
                if (res.data.status_code === 200) {
                    this.setState({
                        sucsses: true,
                    });
                } else {
                    toast.error(res.data.messages);
                }
            })
            .catch(() => toast.error("Erro inesperado."));
    }

    render() {
        const { clock } = this.state;

        return (
            <Row>
                <ToastContainer newestOnTop={true}/>
                <form onSubmit={this.handleStop}>
                    <div align="center">Letra</div><div>{this.props.match.letter}</div>
                    <div>0:{clock}</div>
                    <Col md="12">
                        <div className="grey-text">
                            {this.props.match && this.props.match.categoryList.map((e, i) => 
                                <Col key={i} md="12">
                                    <Input id={e.id} label={methods.titleCase(e.name)} value={this.state.words[e.id]} 
                                        group type="text" onChange={this.handleChange} />
                                    <Button id={e.id} color="deep-purple" className="col-md-12" onClick={this.handleDica}>
                                        Dica
                                    </Button>
                                </Col>
                            )}
                        </div>
                    </Col>
                    <div className="text-center">
                        <Button color="deep-purple" className="col-md-12" type="submit">
                            Stop
                        </Button>
                    </div>
                </form>
            </Row>
        )
    }
}

Match.propTypes = {
    uiActions: PropTypes.object,
    matchActions: PropTypes.object,
    match: PropTypes.object
};

function mapStateToProps(state) {
    return {
      match: state.match.match
    };
  }

function mapDispatchToProps(dispatch) {
    return {
        matchActions: bindActionCreators(Object.assign({}, uiActions, matchActions), dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Match);