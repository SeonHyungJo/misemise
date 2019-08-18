const fs = require('fs')
const path = require('path')
/**
 *
 * @param {
 *
 * {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "EMD_CD": "11110101",
          "EMD_ENG_NM": "Cheongun-dong",
          "EMD_KOR_NM": "청운동"
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [ ]
          }
 */

/**
  *  산술 평균값을 구한다.
  *  MultiPolygon인 경우에는 가장 큰 곳을 기준으로 한다.
  * @param {*} obj
  */
const getGeoAvg = function (obj) {

}

/**
 *   해당 경로에 모든 GeoJSON에 중앙값을 추가한다.
 *  @param geoJSON {JSON}
 *  @return geoJSON {JSON}
 */
const getCenter = function (geoJSON) {
  if (typeof geoJSON === 'object') {
    let { features } = geoJSON

    features = features.map(feature => {
      // Polygon
      // MultiPolygon
      let _avg = getGeoAvg(feature.geometry)
      feature.properties.CENTER = _avg
      return feature
    })
  }
}

/**
 *  geoJSON파일에 중앙값을 계산해서 파일을 수정한다.
 */
const addCenterSpot = function (dirPath) {
  const fileList = fs.readdirSync(dirPath)

  fileList.forEach(item => {
    let isJSON = item.includes('.json')
    let _targetPath = dirPath + '/' + item

    console.error(_targetPath)

    if (isJSON) {
      let geoJSON = require(_targetPath)
      let afGeoJSON = getCenter(geoJSON)

      // fs.writeFileSync(_targetPath, afGeoJSON)
    } else {
      addCenterSpot(_targetPath)
    }
  })
}

addCenterSpot('../geoJSON')
