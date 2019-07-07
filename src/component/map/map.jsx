import React, { Component } from 'react'
import loadScriptPromise from './loadNavermapsScript'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDataAsync } from '../../modules'

class Map extends Component {
  constructor () {
    super()
    this.map = React.createRef()

    // redux에서 관리할 값과 구분.
    this.state = {
      miseList: []
    }
  }

  componentDidMount () {
    const { ncpClientId, getDataAsync, _lat, _lng, zoomLevel } = this.props

    loadScriptPromise(ncpClientId).then((naver) => {
      let zoomRange = [2, 4, 7]
      let maxZoom = zoomRange[zoomRange.length - 1]
      let minZoom = zoomRange[0]

      // 전국 : 2, 시군구 :4  읍면동 : 7
      // naver.maps. PointBounds 경계 생성.
      // 인터렉션 옵션.
      const mapOptions = {
        logoControl: false,
        mapDataControl: false,
        scaleControl: false,
        center: new naver.maps.LatLng(_lat, _lng), // 충주
        draggable: false,
        scrollWheel: false,
        keyboardShortcuts: false,
        disableDoubleTapZoom: true,
        disableDoubleClickZoom: true,
        disableTwoFingerTapZoom: true,
        zoom: zoomLevel,
        // baseTileOpacity: 0.5,
        maxZoom: maxZoom,
        minZoom: minZoom
      }
      let map = new naver.maps.Map('map', mapOptions)

      naver.maps.Event.addListener(map, 'click', (e) => {
        // console.log('좌클릭',e.latlng);
        let currentZoom = map.getZoom()
        if (maxZoom > currentZoom) {
          let nextZoom = zoomRange[zoomRange.indexOf(currentZoom) + 1] || currentZoom
          map.setZoom(nextZoom)
          console.log(currentZoom, nextZoom)
          map.setCenter(new naver.maps.LatLng(e.latlng._lat, e.latlng._lng))
          getDataAsync({ ...e.latlng, nextZoom, naver, map })
        }
      })

      naver.maps.Event.addListener(map, 'rightclick', (e) => {
        // console.log('우클릭',e.latlng);
        let currentZoom = map.getZoom()
        if (minZoom < currentZoom) {
          let nextIdx = zoomRange.indexOf(currentZoom) - 1
          let nextZoom = zoomRange[nextIdx] || currentZoom
          console.log(nextZoom)
          map.setZoom(nextZoom)
          map.setCenter(new naver.maps.LatLng(e.latlng._lat, e.latlng._lng))
        }
      })

      return getDataAsync({ _lat, _lng, zoomLevel, naver, map })
    }).catch((ex) => {
      console.error(ex)
    })
  }

  render () {
    const { data } = this.props
    console.log(data)
    return (
      <>
        <div id="map" style={{ width: '100%', height: 600 + 'px' }} ref={this.map}></div>
        {JSON.stringify(data)}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  mapObj: state.mapObj,
  _lat: state.lat,
  _lng: state.lng,
  zoomLevel: state.zoomLevel,
  data: state.data
})

const maDispatchToPrope = (dispatch) => ({
  getDataAsync: bindActionCreators(getDataAsync, dispatch)
})

export default connect(mapStateToProps, maDispatchToPrope)(Map)
