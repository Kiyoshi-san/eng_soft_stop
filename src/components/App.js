import React, { Component } from 'react';

import Menu from "./shared/Menu";
import AppRoutes from "./App.Routes";

class App extends Component {
  render() {
    return (
      <div>
        <Menu />
        <AppRoutes />
      </div>
    );
  }
}

export default App;
