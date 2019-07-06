import React, { Component } from 'react'
import Map from './component/map/map'

class App extends Component {
  render () {
    return (
      <Map ncpClientId={process.env.REACT_APP_SERVICEKEY}/>
    )
  }
}

export default App
