import React, { Component } from 'react';
import loadScriptPromise from './loadNavermapsScript';
import { resolve } from 'q';


class Map extends Component {
  state = {
    miseList: []
  }

  componentDidMount = () => {
    let ncpClientId = "har461wdhc";
    let myLocation = {}

    loadScriptPromise(ncpClientId).then((_naverObj) => {
      let promise = new Promise(function(resolve, reject){
        navigator.geolocation.getCurrentPosition(function (position) {
          myLocation.lat = position.coords.latitude
          myLocation.log = position.coords.longitude

          let mapOptions = {
            center: new _naverObj.maps.LatLng(myLocation.lat, myLocation.log),
            zoom: 14,
            maxZoom: 15,
            minZoom: 2,
            scrollWheel: true
          };

          let map = new _naverObj.maps.Map('map', mapOptions);

          _naverObj.maps.Service.reverseGeocode({
            coords: new _naverObj.maps.LatLng(myLocation.lat, myLocation.log),
          }, function (status, response) {
            if (status !== _naverObj.maps.Service.Status.OK) {
              return alert('Something wrong!');
            }

            var result = response.v2, // 검색 결과의 컨테이너
              items = result.results; // 검색 결과의 배열
            console.log(items[0].region.area2.name)
            resolve(items)
          });
        });
      })
        
      promise.then((items) => {
        fetch(`http://localhost:8080?stationName=${items[0].region.area2.name}`)
          .then(res => res.json())
          .then(data => {
            this.setState((prev) => {
              return {
                miseList: data.list
              }
            })
          })
      })
    })
  }

  render() {
    const { miseList } = this.state
    return (
      <>
        <div id="map" style={{ width: '100%', height: 600 + 'px' }} ref={element => this.map = element}></div>
        {JSON.stringify(miseList)}
      </>
    );
  }
}

export default Map;
