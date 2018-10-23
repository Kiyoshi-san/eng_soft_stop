import React, { Component } from 'react';

import MenuTop from "./shared/MenuTop";
import AppRoutes from "./App.Routes";

class App extends Component {
  render() {
    return (
      <div>
        <MenuTop />
        <AppRoutes />
      </div>
    );
  }
}

export default App;
