import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';

//Component
//import Header from './component/header/Header'
import Map from './component/map/map'


class App extends Component {

  render() {

    return (
        <Map ncpClientId="har461wdhc"/>

      // <div className="App">
      //   <Header />
      // </div>
    );
  }
}



export default App;
