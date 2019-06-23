import React, { Component } from 'react';
import loadScriptPromise from './loadNavermapsScript';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getDataAsync } from '../../modules';
import { resolve } from 'q';


class Map extends Component {
  state = {
    miseList: []
  }

  componentDidMount = ()=>{
    const {ncpClientId} = this.props;
    loadScriptPromise(ncpClientId).then((naver)=>{
      const { getDataAsync,lat,lng,zoomLevel, data } = this.props;

      //전국 : 2, 시군구 :4  읍면동 : 7
      const mapOptions = {
        center: new naver.maps.LatLng( lat,  lng),    //충주
        zoom: zoomLevel,
        maxZoom : 7,
        minZoom : 2,
        scrollWheel: false
      };
      let map = new naver.maps.Map('map', mapOptions);

      naver.maps.Event.addListener(map, 'click', (e) => {
        return getDataAsync({...e.latlng,zoomLevel,naver});
      });

    }).catch((ex)=>{
      console.error(ex);
    });
  
  }
  // componentDidMount = () => {
  //   let ncpClientId = "har461wdhc";
  //   let myLocation = {}

  //   loadScriptPromise(ncpClientId).then((_naverObj) => {
  //     let promise = new Promise(function(resolve, reject){
  //       navigator.geolocation.getCurrentPosition(function (position) {
  //         myLocation.lat = position.coords.latitude
  //         myLocation.log = position.coords.longitude

  //         let mapOptions = {
  //           center: new _naverObj.maps.LatLng(myLocation.lat, myLocation.log),
  //           zoom: 14,
  //           maxZoom: 15,
  //           minZoom: 2,
  //           scrollWheel: true
  //         };

  //         let map = new _naverObj.maps.Map('map', mapOptions);

  //         _naverObj.maps.Service.reverseGeocode({
  //           coords: new _naverObj.maps.LatLng(myLocation.lat, myLocation.log),
  //         }, function (status, response) {
  //           if (status !== _naverObj.maps.Service.Status.OK) {
  //             return alert('Something wrong!');
  //           }

  //           var result = response.v2, // 검색 결과의 컨테이너
  //             items = result.results; // 검색 결과의 배열
  //           console.log(items[0].region.area2.name)
  //           resolve(items)
  //         });
  //       });
  //     })
        
  //     promise.then((items) => {
  //       fetch(`http://localhost:8080?stationName=${items[0].region.area2.name}`)
  //         .then(res => res.json())
  //         .then(data => {
  //           this.setState((prev) => {
  //             return {
  //               miseList: data.list
  //             }
  //           })
  //         })
  //     })
  //   })
  // }

  render() {
    //console.log("네이버맵 왔쪄요~",this.props)
    //componentDidMount가 호출이 안 된다. 왜?
    //이 그러면 여기서 map 객체를 직접 수정하는식으로 구현해야할듯.
    // const { miseList } = this.state
    const {data} = this.props
    console.log(data)
    return (
      <>
        <div id="map" style={{ width: '100%', height: 600 + 'px' }} ref={element => this.map = element}></div>
        {/* {JSON.stringify(miseList)} */}
        {JSON.stringify(data)}
      </>
    );
  }
}


const mapStateToProps =   (state) => ({
  lat: state.lat,
  lng: state.lng,
  zoomLevel: state.zoomLevel,
  data : state.data
});

const maDispatchToPrope =  (dispatch) => ({
  getDataAsync: bindActionCreators(getDataAsync, dispatch)
})


export default connect(mapStateToProps,maDispatchToPrope)(Map);
