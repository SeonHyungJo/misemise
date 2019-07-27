
require('dotenv').config()

const express = require('express')
const app = express()
const request = require('request')
const qs = require('querystring')
const adaptor = require(`./resource/adaptor.json`)
const port = process.env.PORT
const SERVICE_KEY = process.env.AIR_SERVICEKEY

// CORS 허용 미들웨어
app.all('/*', function (req, res, next) {
  res.header('Accept-Charset', 'utf-8')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Content-Type', 'text/html; charset=utf-8')
  next()
})

// air API에 맞는 변수로 변환한다.
let nameConverter = (_lv, asisNm) => {
  if (_lv === '6') {
    return
  }
  let type =
    _lv === '2' ? 'sidoName'
      : _lv === '4' ? 'sidoName'
        : ''
  let result = adaptor[type].filter((item) => item.asis === asisNm)

  return result[0].tobe
}

app.get('/', function (req, res) {
  let sidoName = req.query.sidoName || '서울'
  console.log('req.query.sidoName', req.query.sidoName)
  let stationName = qs.escape(req.query.stationName || '종로구')
  let zoomLevel = req.query.zoomLevel || 2
  let parentCd = req.query.parentCd || 2
  let pageNo = 1
  let Rows = 1
  let uri = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc'
  let geoFileName = ''
  // console.log('server_Enter',zoomLevel,sidoName,stationName);

  // 행정 구역별 구분 진행
  switch (zoomLevel) {
    case '2': // 시도
      uri += `/getCtprvnMesureLIst?itemCode=PM10&dataGubun=HOUR&searchCondition=WEEK`
      geoFileName = 'CTPRVN.json'
      break
    case '4': // 시군구
      console.log('sidoName', sidoName)
      sidoName = nameConverter(zoomLevel, sidoName)
      uri += `/getCtprvnMesureSidoLIst?sidoName=${sidoName}&searchCondition=HOUR`
      geoFileName = `/sig/${parentCd}.json`

      break
    case '6': // 읍면동
      stationName = nameConverter(zoomLevel, stationName)
      uri += `/getMsrstnAcctoRltmMesureDnsty?stationName=${stationName}&dataTerm=month&ver=1.3`
      geoFileName = `/emd/${parentCd}.json`
      break
  }

  uri += `&pageNo=${pageNo}&numOfRows=${Rows}&ServiceKey=${SERVICE_KEY}&_returnType=json`
  console.log('server_uri', uri)
  // 공공 API 서버에 요청.
  request(uri.trim(),
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let geoJSON = require(`./geoJSON/${geoFileName}`)
        let airData = JSON.parse(body)

        console.log('body', body)

        let result = {
          airData: airData.list[0],
          geoData: geoJSON.features
        }
        res.send(result)
      } else {
        console.error(error)
      }
    }
  )
})

app.listen(port, function () {
  console.log('Node Server is Run  listening on port ' + port + '!')
})
