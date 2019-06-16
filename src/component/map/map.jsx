import React, { Component } from 'react';
import loadScriptPromise from './loadNavermapsScript';


class Map extends Component {

  componentDidMount = ()=>{
    
    let ncpClientId = "har461wdhc";
    loadScriptPromise(ncpClientId).then((_naverObj)=>{

      var mapOptions = {
        center: new _naverObj.maps.LatLng(37.3595704, 127.105399),
        zoom: 6,
        maxZoom : 6,
        minZoom : 2,
        scrollWheel: false
      };
      var map = new _naverObj.maps.Map('map', mapOptions);

    });
  
  }



  render() {
    return (
      <>
        <div id="map" style={{width: '100%',height : 600+'px'}}  ref={element => this.map=element}></div>
      </>
    );
  }
}

export default Map;
