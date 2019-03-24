import React, { Component } from 'react';
import Header from './component/header/Header';
import Side from './component/side/Side';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Side />
      </div>
    );
  }
}

export default App;
