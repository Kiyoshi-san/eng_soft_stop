import React, { Component } from 'react';
import './App.css';

import Menu from "./components/Menu";
import Home from "./components/Home";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Menu />
        </header>
        <Home />
      </div>
    );
  }
}

export default App;
