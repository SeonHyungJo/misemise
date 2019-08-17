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
 *   해당 경로에 모든 GeoJSON에 중앙값을 추가한다.
 *  @param geoJSON {JSON}
 *  @return geoJSON {JSON}
 */
const getCenter = function (geoJSON) {
  debugger
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

      fs.writeFileSync(_targetPath, afGeoJSON)
    } else {
      addCenterSpot(_targetPath)
    }
  })
}

// addCenterSpot(path.join(__dirname, '/geoJSON'))
addCenterSpot('../geoJSON')
