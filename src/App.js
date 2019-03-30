import React, { Component } from 'react';
import Header from './component/header/Header';
import Side from './component/side/Side';

let headerData = [
  {name:"아1",value:"/"},
  {name:"아2",value:"/2"}
]

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header name={"미세미세"} data={headerData}/>
        <Side />
      </div>
    );
  }
}

export default App;
