import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getDataAsync } from './modules';

//Component
//import Header from './component/header/Header'
import Map from './component/map/map'


class App extends Component {

  componentDidMount() {
    const { getDataAsync } = this.props;
    
    getDataAsync();
  } 

  render() {
    const { getDataAsync, data } = this.props;
    return (
      <div>

        <Map/>
      </div>
     

      // <div className="App">
      //   <Header />
      // </div>
    );
  }
}

const mapStateToProps =   (state) => ({
  number: state.value,
  data : state.data
});

const maDispatchToPrope =  (dispatch) => ({
  getDataAsync: bindActionCreators(getDataAsync, dispatch)
})


export default connect(mapStateToProps,maDispatchToPrope)(App);
