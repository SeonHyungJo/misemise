import React, { Component } from 'react';
import Header from './component/header/Header'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { incrementAsync, decrementAsync, getDataAsync } from './modules';

class App extends Component {

  componentDidMount() {
    const { getDataAsync } = this.props;
    
    getDataAsync()
  } 

  render() {
    const { incrementAsync, decrementAsync, getDataAsync, number, data } = this.props;

    
    return (
      <div>
        <h1>{number}</h1>
        <button onClick={incrementAsync}>+</button>
        <button onClick={decrementAsync}>-</button>
        <button onClick={getDataAsync}>Get Data</button>
        <div>{data}</div>
      </div>
      // <div className="App">
      //   <Header />
      // </div>
    );
  }
}

export default connect(
  (state) => ({
    number: state.value,
    data : state.data
  }),
  (dispatch) => ({
    incrementAsync: bindActionCreators(incrementAsync, dispatch),
    decrementAsync: bindActionCreators(decrementAsync, dispatch),
    getDataAsync: bindActionCreators(getDataAsync, dispatch)
  })
)(App);
