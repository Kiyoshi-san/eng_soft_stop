import React, { Component } from 'react';

import Menu from "./shared/Menu";
import MenuTop from "./shared/MenuTop";
import AppRoutes from "./App.Routes";

class App extends Component {
  render() {
    return (
      <div>
        <Menu />
        <MenuTop />
        <AppRoutes />
      </div>
    );
  }
}

export default App;
