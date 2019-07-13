import React, { Component } from 'react'
import loadScriptPromise from './loadNavermapsScript'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDataAsync } from '../../modules'
import { cloneObject } from '../../util/common'

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
      let zoomRange = [2, 4, 6]
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

      this.setState((prevState) => {
        return ({
          ...prevState,
          newMap: map,
          parentCd: []
        })
      })
      let that = this

      map.data.setStyle(function (feature) {
        var styleOptions = {
          fillColor: '#ff0000',
          fillOpacity: 0.0,
          strokeColor: '#ff0000',
          strokeWeight: 2,
          strokeOpacity: 0.8
        }

        if (feature.getProperty('focus')) {
          styleOptions.fillOpacity = 0.6
          styleOptions.fillColor = '#0f0'
          styleOptions.strokeColor = '#0f0'
          styleOptions.strokeWeight = 4
          styleOptions.strokeOpacity = 1
        }

        return styleOptions
      })

      map.data.addListener('mouseover', function (e) {
        map.data.overrideStyle(e.feature, {
          strokeWeight: 8
        })

        map.data.addListener('mouseout', function (e) {
          map.data.revertStyle()
        })
      })

      // zoom UP
      map.data.addListener('click', function (e) {
        let feature = e.feature
        // let isFocused = feature.getProperty('focus')
        // feature.setProperty('focus', !isFocused)

        let { x, y } = e.feature.bounds.getCenter()
        let _lat = y
        let _lng = x

        let currentZoom = map.getZoom()
        if (maxZoom > currentZoom) {
          let parentCd = currentZoom === 2 ? feature.property_CTPRVN_CD
            : currentZoom === 4 ? feature.property_SIG_CD
              : parentCd

          let tempArr = that.state.parentCd.slice()
          tempArr.push(parentCd)
          that.setState({ 'parentCd': tempArr })
          let zoomLevel = zoomRange[zoomRange.indexOf(currentZoom) + 1] || currentZoom
          map.setZoom(zoomLevel)
          map.setCenter(new naver.maps.LatLng(_lat, _lng))
          getDataAsync({ _lat, _lng, zoomLevel, naver, map, parentCd })
        }
      })

      // zoom Down
      map.data.addListener('rightclick', (e) => {
        // console.log('우클릭',e.latlng);
        let { x, y } = e.feature.bounds.getCenter()
        let _lat = y
        let _lng = x

        let currentZoom = map.getZoom()
        if (minZoom < currentZoom) {
          let nextIdx = zoomRange.indexOf(currentZoom) - 1
          let zoomLevel = zoomRange[nextIdx] || currentZoom
          map.setZoom(zoomLevel)
          map.setCenter(new naver.maps.LatLng(_lat, _lng))

          let parentCd = that.state.parentCd.shift()
          getDataAsync({ _lat, _lng, zoomLevel, naver, map, parentCd })
        }
      })

      return getDataAsync({ _lat, _lng, zoomLevel, naver, map })
    }).catch((ex) => {
      console.error(ex)
    })
  }

  render () {
    const { data } = this.props
    if (data.geoData) {
      // 데이터 초기화
      let allFeature = this.state.newMap.data.getAllFeature()

      if (allFeature.length > 0) {
        while (allFeature.length > 0) {
          let item = allFeature[0]
          this.state.newMap.data.removeFeature(item)
        }
      }
      data.geoData.forEach(element => {
        this.state.newMap.data.addGeoJson(element)
      })
    }
    return (
      <>
        <div id="map" style={{ width: '100%', height: 600 + 'px' }} ref={this.map}></div>
        {/* {JSON.stringify(data)} */}
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
