import React, { Component } from 'react';
import './App.css';

import Menu from "./components/Menu";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Stop App</h1>
          <Menu />
        </header>
      </div>
    );
  }
}

export default App;
