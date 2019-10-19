import React, {  useEffect,useCallback  }  from 'react'
import{  useStore,useDispatch,useSelector  } from 'react-redux'
import { getDataAsync  } from '../../store/modules'
import loadJs from 'load-js'

const styleOptions = {
  fillOpacity: 0.6,
  fillColor: '#ff0000',
  strokeColor: '#ff0000',
  strokeWeight: 2,
  strokeOpacity: 0.5
}


const loadScriptPromise  = (_ncpClientId) =>{
  const requestUrl = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${_ncpClientId}&submodules=geocoder`
  return loadJs(requestUrl).then(() =>
    new Promise(resolve => {
      window.naver.maps.onJSContentLoaded = () => {
        resolve(window.naver)
      }
    })
  )
}



const Map = (props) => {

  const {ncpClientId} = props;
  const { lat, lng, zoomLevel,data,mapObj} = useSelector(state=>({
    lat : state.lat,
    lng : state.lng,
    zoomLevel : state.zoomLevel,
    data : state.data,
    mapObj : state.mapObj
  }),[])

  const dispatch = useDispatch()


   const parentCdStack = [];
   let currentLocalCode = "";


  //초기 한번만 셋팅되어야한다.
  useEffect(() =>{

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
        center: new naver.maps.LatLng(lat, lng), // 충주
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
      const map = new naver.maps.Map('map', mapOptions)

      map.data.setStyle(function (feature) {
        const korLv = feature.property_KOR_LV

        switch (korLv) {
          case '좋음':
            styleOptions.fillColor = '#117cf6'
            break
          case '보통':
            styleOptions.fillColor = '#50af32'
            break
          case '나쁨':
            styleOptions.fillColor = '#c4b341'
            break
          case '매우나쁨':
            styleOptions.fillColor = '#d36f36'
            break
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
      map.data.addListener('click', (e) => {
        const feature = e.feature
        const { x: lng, y: lat } = e.feature.bounds.getCenter()
        const currentZoom = map.getZoom()

        if (maxZoom > currentZoom) {
          const targetCd = feature.property_LOC_CD
          const zoomLevel = zoomRange[zoomRange.indexOf(currentZoom) + 1] || currentZoom
          parentCdStack.push(currentLocalCode);
          currentLocalCode = targetCd;
          map.setZoom(zoomLevel)
          map.setCenter(new naver.maps.LatLng(lat, lng))
          dispatch( getDataAsync({ lat, lng, zoomLevel, naver, map, parentCd:targetCd, feature }))
        }
      })

      // zoom Down
      map.data.addListener('rightclick', (e) => {
        const { x: lng, y: lat } = e.feature.bounds.getCenter()
        const currentZoom = map.getZoom()

        if (minZoom < currentZoom) {
          const nextIdx = zoomRange.indexOf(currentZoom) - 1
          const zoomLevel = zoomRange[nextIdx] || currentZoom
          map.setZoom(zoomLevel)
          map.setCenter(new naver.maps.LatLng(lat, lng))

          console.log('before_rightClick::',parentCdStack);
          const targetCd = parentCdStack.pop()
          currentLocalCode = targetCd;
          dispatch(getDataAsync({ lat, lng, zoomLevel, naver, map, parentCd:targetCd }))
        }
      })

      dispatch(getDataAsync({ lat, lng, zoomLevel, naver, map }))
    }).catch((ex) => {
      console.error(ex)
    })// END _promise
  },[])
  

  /**
   * zoomLevel 변경시 geoJSON렌더링 
   * data.geoData 변화시점에만 렌더링되어야한다.
   */
  useEffect(()=> {

    console.log('==================geoDataRender')
    if (data && data.geoData) {
      let allFeature = mapObj.data.getAllFeature()

      if (allFeature.length > 0) {
        while (allFeature.length > 0) {
          let item = allFeature[0]
          mapObj.data.removeFeature(item)
        }
      }

      data.geoData.forEach(element => {
        mapObj.data.addGeoJson(element)
      })
    }

  },[data])

 

  return (
    <>
      <div id="map" style={{ width: '100%', height: 600 + 'px' }} ></div>
      {/* {JSON.stringify(data)} */}
    </>
  )
}



export default Map
