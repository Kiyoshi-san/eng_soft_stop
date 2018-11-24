import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from "mdbreact";
import { Chart } from 'react-chartjs-2';
import axios from "axios";

import MenuSide from '../shared/MenuSide';
import * as uiActions from '../../actions/uiActions';
import config from '../../util/Config';

import '../../css/backoffice.css';

class BackDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categorias: 0,
            respostas: 0,
            jogadores: 0,
            partidasCriadas: 0,
            partidasIniciadas: 0,
            partidasFinalizadas: 0
        };
    }

    popularGraficoPartidas() {
        
        axios
        .get(config.backoffice)
        .then(res => {

            this.setState({ 
                categorias: res.data.content.categories_count,
                respostas: res.data.content.answers_count,
                jogadores: res.data.content.players_count,
                partidasCriadas: res.data.content.created_matches_count,
                partidasIniciadas: res.data.content.started_matches_count,
                partidasFinalizadas: res.data.content.finished_matches_count
            }, () => {

                //doughnut
                let ctxD = document.getElementById("doughnutChart").getContext('2d');
                new Chart(ctxD, {
                    type: 'doughnut',
                    data: {
                        labels: ["CRIADAS", "EM PROGRESSO", "FINALIZADAS"],
                        datasets: [
                            {
                                data: [this.state.partidasCriadas, this.state.partidasIniciadas, this.state.partidasFinalizadas],
                                backgroundColor: ["#F7464A", "#4fc3f7", "#FDB45C"],
                                hoverBackgroundColor: ["#FF5A5E", "#81d4fa", "#FFC870"]
                            }
                        ]
                    },
                    options: {
                        responsive: false
                    }
                });
                this.props.uiActions.stopLoading();
            });
        })
        .catch(res => {
            toast.error('Erro ao carregar os dados do dashboard. Erro: ' + res.response.data.messages);
            this.props.uiActions.stopLoading();
        });
    }

    componentDidMount() {
        this.props.uiActions.loading("Preparando Visualização...");
        this.popularGraficoPartidas();
    }

    //Renderização da tela
    render() {
        return (
            <div className="backContainer">
                <MenuSide />
                {/* ALERTAS */}
                <ToastContainer 
                    newestOnTop={true}/>

                {/* Título da página */}
                <div className="content">
                    <blockquote className="blockquote bq-purple">                        
                        <p className="bq-title purple-text"><i className="fa fa-dashboard" aria-hidden="true"/> Dashboard</p>
                    </blockquote>

                    <div className="backContainer row">
                        <div className="col">

                            {/* <!-- Section: Pricing v.4 --> */}
                            <section className="text-center my-5">

                                {/* <!-- Grid row --> */}
                                <div className="row">

                                    {/* <!-- Grid column --> */}
                                    <div className="col-md-12 animated jackInTheBox">

                                        {/* <!-- Card --> */}
                                        <div className="card rgba-grey-slight">
                                            {/* <div className="mask rgba-white-light"></div> */}
                                            
                                            {/* <!-- Content --> */}
                                            <div className="card-body">

                                                <div className="price header white-text purple-gradient rounded-top dash-padding" style={{marginBottom: 20}}>                                    
                                                    <h4 className="option" style={{fontWeight: 500}}><i className="fa fa-gamepad" aria-hidden="true"/> Partidas</h4>
                                                </div>

                                                {/* <!-- Price --> */}
                                                <div className="price header white-text rounded-top dash-padding">  
                                                    <center>
                                                        <canvas id="doughnutChart" width="400" height="200"></canvas>
                                                    </center>
                                                </div>

                                            </div>
                                            {/* <!-- Content --> */}

                                        </div>
                                        {/* <!-- Card --> */}

                                    </div>
                                    {/* <!-- Grid column --> */}

                                </div>
                                {/* <!-- Grid row --> */}

                            </section>
                            {/* <!-- Section: Pricing v.4 --> */}

                            {/* <!-- Section: Pricing v.4 --> */}
                            <section className="text-center my-5">

                                {/* <!-- Grid row --> */}
                                <div className="row">

                                    {/* <!-- Grid column --> */}
                                    <div className="col-md-4 animated jackInTheBox">

                                        {/* <!-- Card --> */}
                                        <div className="card rgba-grey-slight view overlay">
                                            <div className="mask rgba-white-light"></div>

                                            {/* <!-- Content --> */}
                                            <div className="card-body">

                                                {/* <!-- Price --> */}
                                                <div className="price header white-text purple-gradient rounded-top dash-padding">                                    
                                                    <h1 className="font-weight-bold">
                                                        <i className="fa fa-graduation-cap" aria-hidden="true"/>
                                                        <br />
                                                        {this.state.categorias} categorias
                                                    </h1>
                                                </div>

                                                {/* <!--Price --> */}
                                                
                                                <p className="grey-text dash-padding">Quantidade total de categorias cadastradas na aplicação.</p>

                                            </div>
                                            {/* <!-- Content --> */}

                                        </div>
                                        {/* <!-- Card --> */}

                                    </div>
                                    {/* <!-- Grid column --> */}

                                    {/* <!-- Grid column --> */}
                                    <div className="col-md-4 animated jackInTheBox">

                                        {/* <!-- Card --> */}
                                        <div className="card rgba-grey-slight view overlay">
                                            <div className="mask rgba-white-light"></div>

                                            {/* <!-- Content --> */}
                                            <div className="card-body">

                                                {/* <!-- Price --> */}
                                                <div className="price header white-text purple-gradient rounded-top dash-padding">                                    
                                                    <h1 className="font-weight-bold">
                                                        <i className="fa fa-commenting" aria-hidden="true"/>
                                                        <br />
                                                        {this.state.respostas} respostas
                                                    </h1>
                                                </div>

                                                {/* <!--Price --> */}
                                                
                                                <p className="grey-text dash-padding">Quantidade total de respostas cadastradas na aplicação.</p>

                                            </div>
                                            {/* <!-- Content --> */}

                                        </div>
                                        {/* <!-- Card --> */}

                                    </div>
                                    {/* <!-- Grid column --> */}

                                    {/* <!-- Grid column --> */}
                                    <div className="col-md-4 animated jackInTheBox">

                                        {/* <!-- Card --> */}
                                        <div className="card rgba-grey-slight view overlay">
                                            <div className="mask rgba-white-light"></div>

                                            {/* <!-- Content --> */}
                                            <div className="card-body">

                                                {/* <!-- Price --> */}
                                                <div className="price header white-text purple-gradient rounded-top dash-padding">                                    
                                                    <h1 className="font-weight-bold">
                                                        <i className="fa fa-users" aria-hidden="true"/>
                                                        <br />
                                                        {this.state.jogadores} jogadores
                                                    </h1>
                                                </div>

                                                {/* <!--Price --> */}
                                                
                                                <p className="grey-text dash-padding">Quantidade total de jogadores cadastrados na aplicação.</p>

                                            </div>
                                            {/* <!-- Content --> */}

                                        </div>
                                        {/* <!-- Card --> */}

                                    </div>
                                    {/* <!-- Grid column --> */}

                                </div>
                                {/* <!-- Grid row --> */}

                            </section>
                            {/* <!-- Section: Pricing v.4 --> */}
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

BackDashboard.propTypes = {
    uiActions: PropTypes.object
};

function mapDispatchToProps(dispatch) {
    return {
        uiActions: bindActionCreators(uiActions, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(BackDashboard);