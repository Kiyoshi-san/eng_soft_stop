import React, { Component } from 'react';
import '../../css/backoffice.css';
import { ToastContainer, toast } from "mdbreact";
import { Chart } from 'react-chartjs-2';
import axios from "axios";

export default class BackDashboard extends Component {
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
        .get('https://es3-stop-prod.herokuapp.com/dashboard')
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
                var ctxD = document.getElementById("doughnutChart").getContext('2d');
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

            });
        })
        .catch(res => {
            toast.error('Erro ao carregar os dados do dashboard. Erro: ' + res.response.data.messages);
        });
    }

    componentDidMount() {
       this.popularGraficoPartidas();
    }

    //Renderização da tela
    render() {
        return (
            <div className="backContainer">
            
                {/* ALERTAS */}
                <ToastContainer 
                    newestOnTop={true}/>

                {/* Título da página */}
                <blockquote className="blockquote bq-purple">                        
                    <p className="bq-title purple-text"><i className="fa fa-dashboard" aria-hidden="true"/> Dashboard</p>
                </blockquote>

                <div className="backContainer row">
                    <div className="col">

                        {/* <!-- Section: Pricing v.4 --> */}
                        <section class="text-center my-5">

                            {/* <!-- Grid row --> */}
                            <div class="row">

                                {/* <!-- Grid column --> */}
                                <div class="col-md-12 animated jackInTheBox">

                                    {/* <!-- Card --> */}
                                    <div class="card rgba-grey-slight">
                                        {/* <div class="mask rgba-white-light"></div> */}
                                        
                                        {/* <!-- Content --> */}
                                        <div class="card-body">

                                            <div class="price header white-text purple-gradient rounded-top dash-padding" style={{marginBottom: 20}}>                                    
                                                <h4 className="option" style={{fontWeight: 500}}><i className="fa fa-gamepad" aria-hidden="true"/> Partidas</h4>
                                            </div>

                                            {/* <!-- Price --> */}
                                            <div class="price header white-text rounded-top dash-padding">  
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
                        <section class="text-center my-5">

                            {/* <!-- Grid row --> */}
                            <div class="row">

                                {/* <!-- Grid column --> */}
                                <div class="col-md-4 animated jackInTheBox">

                                    {/* <!-- Card --> */}
                                    <div class="card rgba-grey-slight view overlay">
                                        <div class="mask rgba-white-light"></div>

                                        {/* <!-- Content --> */}
                                        <div class="card-body">

                                            {/* <!-- Price --> */}
                                            <div class="price header white-text purple-gradient rounded-top dash-padding">                                    
                                                <h1 class="font-weight-bold"><i className="fa fa-graduation-cap" aria-hidden="true"/></h1>
                                                <h1 class="font-weight-bold">{this.state.categorias} categorias</h1>
                                            </div>

                                            {/* <!--Price --> */}
                                            
                                            <p class="grey-text dash-padding">Quantidade total de categorias cadastradas na aplicação.</p>

                                        </div>
                                        {/* <!-- Content --> */}

                                    </div>
                                    {/* <!-- Card --> */}

                                </div>
                                {/* <!-- Grid column --> */}

                                {/* <!-- Grid column --> */}
                                <div class="col-md-4 animated jackInTheBox">

                                    {/* <!-- Card --> */}
                                    <div class="card rgba-grey-slight view overlay">
                                        <div class="mask rgba-white-light"></div>

                                        {/* <!-- Content --> */}
                                        <div class="card-body">

                                            {/* <!-- Price --> */}
                                            <div class="price header white-text purple-gradient rounded-top dash-padding">                                    
                                                <h1 class="font-weight-bold"><i className="fa fa-commenting" aria-hidden="true"/></h1>
                                                <h1 class="font-weight-bold">{this.state.respostas} respostas</h1>
                                            </div>

                                            {/* <!--Price --> */}
                                            
                                            <p class="grey-text dash-padding">Quantidade total de respostas cadastradas na aplicação.</p>

                                        </div>
                                        {/* <!-- Content --> */}

                                    </div>
                                    {/* <!-- Card --> */}

                                </div>
                                {/* <!-- Grid column --> */}

                                {/* <!-- Grid column --> */}
                                <div class="col-md-4 animated jackInTheBox">

                                    {/* <!-- Card --> */}
                                    <div class="card rgba-grey-slight view overlay">
                                        <div class="mask rgba-white-light"></div>

                                        {/* <!-- Content --> */}
                                        <div class="card-body">

                                            {/* <!-- Price --> */}
                                            <div class="price header white-text purple-gradient rounded-top dash-padding">                                    
                                                <h1 class="font-weight-bold"><i className="fa fa-users" aria-hidden="true"/></h1>
                                                <h1 class="font-weight-bold">{this.state.jogadores} jogadores</h1>
                                            </div>

                                            {/* <!--Price --> */}
                                            
                                            <p class="grey-text dash-padding">Quantidade total de jogadores cadastrados na aplicação.</p>

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
        )
    }

}