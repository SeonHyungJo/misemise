import React, { Component } from 'react';
import Header from './component/header/Header';
import Side from './component/side/Side';

//db조회.
let headerInfo = {
  name : "미세미세",
  elements :[
    {name:"아1",value:"/", key:"k2"},
    {name:"아2",value:"/2", key:"k1"}
  ]
};

class App extends Component {
  render() {
    return (
      <div className="App" >
        <Header name={headerInfo.name} data={headerInfo.elements} />
        <Side />
      </div>
    );
  }
}

export default App;
