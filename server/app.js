
require('dotenv').config()

const express = require('express')
const app = express()
const request = require('request')
//const qs = require('querystring')
const adaptor = require(`./util/adaptor`)


const SERVICE_KEY = "mglCHo09SQqHPVt1AyfuZymDTpMndPMH2ZR3ZrZFR0OdywtT6AlVRQF%2BE8wphx716aaU%2FxS6zLQ1USWLLAkMaQ%3D%3D"

const port = 8080
// const port = process.env.PORT
// const SERVICE_KEY = process.env.AIR_SERVICEKEY

app.all('/*', function (req, res, next) {
  //CORS(air_data)
  res.header('Accept-Charset', 'utf-8')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Content-Type', 'text/html; charset=utf-8')
  next()
})

// air API의 requset parameter로 변환하여 반환한다.
let nameConverter = (_lv, parentCd) => {

  let air_ko_nm = "";

  switch(_lv){
    case "4": //시군구
    air_ko_nm  = adaptor.sig[parentCd].AIR_KO_NM
      break
    case "6": //읍면동
      break

  }

  console.log("====이름변환",air_ko_nm)
  
  return air_ko_nm
}

app.get('/', function (req, res) {
  // let sidoName = qs.escape(req.query.sidoName || '서울')
  // let stationName = qs.escape(req.query.stationName || '종로구')
  let zoomLevel = req.query.zoomLevel || 2
  let parentCd = req.query.parentCd || 2
  let pageNo = 1
  let Rows = 1
  let uri = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc'
  let geoFileName = ''
  // console.log('server_Enter',zoomLevel,sidoName,stationName);

  switch (zoomLevel) {
    case '2': // 시도
      uri += `/getCtprvnMesureLIst?itemCode=PM10&dataGubun=HOUR&searchCondition=WEEK`
      geoFileName = 'CTPRVN.json'
      break
      case '4': // (3)시도별 실시간 측정정보 조회 &ver=1.
      sidoName = nameConverter(zoomLevel, parentCd)
  
      //uri += `/getCtprvnMesureSidoLIst?sidoName=${sidoName}&searchCondition=HOUR`
      uri += `/getCtprvnRltmMesureDnsty?sidoName=${sidoName}&ver=1.3`
      geoFileName = `sig/${parentCd}.json`


      break
    case '6': // 읍면동
      stationName = nameConverter(zoomLevel, parentCd)
      uri += `/getMsrstnAcctoRltmMesureDnsty?stationName=${stationName}&dataTerm=month&ver=1.3`
      geoFileName = `emd/${parentCd}.json`
      break
  }

  uri += `&pageNo=${pageNo}&numOfRows=${Rows}&ServiceKey=${SERVICE_KEY}&_returnType=json`

  console.log(url);
  // 공공API 서버에 요청.
  request(uri.trim(),
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let geoJSON = require(`./geoJSON/${geoFileName}`)
        let airData = JSON.parse(body)
        airData = airData.list[0]


        // 통합데이터
        // 컨버팅은 서버에서한다.
        //geoData에 미세먼지 데이터를 통합하여 추가한다.
        let result = {}
        result.geoData = geoJSON.features.map(item=>{

          let airNm =""

          switch(zoomLevel){
            case"2":
              airNm = adaptor.sig[item.properties.CTPRVN_CD].AIR_NM
              item.properties.AIR_LV = airData[airNm]

              break
            case"4":
              break
            case"6":
             break
          }
       

          return item;
        })

        // let result = {
        //   airData: airData.list[0],
        //   geoData: geoJSON.features
        // }
        //res.send(result)
  

        res.send(result)
      } else {
        console.error(error)
      }
    }
  )
})//END_GET

app.listen(port, function () {
  console.log('Node Server is Run  listening on port ' + port + '!')
})
