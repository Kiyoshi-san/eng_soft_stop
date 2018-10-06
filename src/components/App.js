import React, { Component } from 'react';
import '../css/App.css';

import Menu from "./shared/Menu";
import AppRoutes from "./App.Routes";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Menu />
        </header>
        <AppRoutes />
      </div>
    );
  }
}

export default App;
