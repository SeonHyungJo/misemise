import React, { Component } from 'react';
import loadScriptPromise from './loadNavermapsScript';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getDataAsync } from '../../modules';


class Map extends Component {

  
  

  componentDidMount = ()=>{
    
    const {ncpClientId} = this.props;
    loadScriptPromise(ncpClientId).then((naver)=>{

      const { getDataAsync,lat,lng,zoomLevel,data } = this.props;


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



  render() {
    //console.log("네이버맵 왔쪄요~",this.props)
    //componentDidMount가 호출이 안 된다. 왜?
    //이 그러면 여기서 map 객체를 직접 수정하는식으로 구현해야할듯.
    return (
      <>
        <div id="map" style={{width: '100%',height : 600+'px'}}  ref={element => this.map=element}></div>
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
