import React, { Component } from 'react';
import '../css/App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'
import { faPaste } from '@fortawesome/free-solid-svg-icons'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'


import Menu from "./shared/Menu";
import AppRoutes from "./App.Routes";

library.add(faStroopwafel)
library.add(faPaste)
library.add(faClipboardList)

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
            <Menu />
        </header>
        <AppRoutes />
      </div>
    );
  }
}

export default App;
