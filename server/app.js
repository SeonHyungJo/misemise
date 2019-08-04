
require('dotenv').config()

const express = require('express')
const app = express()
const request = require('request')
const qs = require('querystring')
const fs = require('fs')
const path = require('path')
let adaptor = fs.readFileSync(path.join(__dirname, 'util/adaptor.json'))
adaptor = JSON.parse(adaptor)

// const path = require('path')

const port = process.env.PORT
const SERVICE_KEY = process.env.AIR_SERVICEKEY

// CORS 허용 미들웨어
app.all('/*', function (req, res, next) {
  // CORS(air_data)
  res.header('Accept-Charset', 'utf-8')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Content-Type', 'text/html; charset=utf-8')
  next()
})

// air API의 requset parameter로 변환하여 반환한다.
let nameConverter = (_lv, parentCd) => {
  let air_ko_nm = ''

  switch (_lv) {
    case '4': // 시군구
      air_ko_nm = adaptor.sig[parentCd].AIR_KO_NM
      break
    case '6': // 읍면동
      break
  }

  console.log('====이름변환', air_ko_nm)
  // escape 처리
  return qs.escape(air_ko_nm)
}

const getLevel = function (_num) {
  _num = parseInt(_num, 10)

  const container = [
    { min: 0, max: 15, level: '좋음' },
    { min: 16, max: 35, level: '보통' },
    { min: 36, max: 75, level: '나쁨' },
    { min: 76, max: 999, level: '매우나쁨' }
  ]

  return container.find(item => item.min <= _num && item.max >= _num).level
//  return container.reduce((acc, cur) => cur.min <= _num ? cur.level : acc, '')
}

app.get('/', function (req, res) {
  // let sidoName = qs.escape(req.query.sidoName || '서울')
  // let stationName = qs.escape(req.query.stationName || '종로구')
  let zoomLevel = req.query.zoomLevel || 2
  let parentCd = req.query.parentCd || 2
  let pageNo = 1
  let Rows = 100
  let uri = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc'
  let geoFileName = ''

  // 행정 구역별 구분 진행
  switch (zoomLevel) {
    case '2': // 시도 ( (5) 시도별 실시간 평균정보 조회 오퍼레이션 명세)
      uri += `/getCtprvnMesureLIst?itemCode=PM10&dataGubun=HOUR&searchCondition=WEEK`
      geoFileName = 'CTPRVN.json'
      break

    case '4': // 시군구 (6) 시군구별 실시간 평균정보 조회 오퍼레이션 명세
      sidoName = nameConverter(zoomLevel, parentCd)

      uri += `/getCtprvnMesureSidoLIst?sidoName=${sidoName}&searchCondition=HOUR`
      // uri += `/getCtprvnRltmMesureDnsty?sidoName=${sidoName}&ver=1.3`
      geoFileName = `sig/${parentCd}.json`
      break

    case '6': // 읍면동
      stationName = nameConverter(zoomLevel, parentCd)
      uri += `/getMsrstnAcctoRltmMesureDnsty?stationName=${stationName}&dataTerm=month&ver=1.3`
      geoFileName = `emd/${parentCd}.json`
      break
  }

  uri += `&pageNo=${pageNo}&numOfRows=${Rows}&ServiceKey=${SERVICE_KEY}&_returnType=json`

  console.log(uri)
  // 공공API 서버에 요청.
  request(uri.trim(),
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let geoJSON = require(`./geoJSON/${geoFileName}`)
        let airData = JSON.parse(body)

        if (zoomLevel == '2') {
          airData = airData.list[0]
        } else {
          // 데이터 포멧 가공 map
          debugger
          airData = airData.list
        }

        // 통합데이터
        // 컨버팅은 서버에서한다.
        // geoData에 미세먼지 데이터를 통합하여 추가한다.
        let result = {}
        // let fileFath = path.join(__dirname, '/util/adaptor_re.json')
        // let targetFile = fs.readFileSync(fileFath, 'utf8')
        // targetFile = JSON.parse(targetFile)

        result.geoData = geoJSON.features.map(item => {
          let airNm = ''
          let airLv = '999'

          switch (zoomLevel) {
            case '2':

              // 이름 통합.
              item.properties.LOC_CD = item.properties.CTPRVN_CD
              item.properties.LOC_ENG_NM = item.properties.CTP_ENG_NM
              item.properties.LOC_KOR_NM = item.properties.CTP_KOR_NM
              // delete item.properties.CTPRVN_CD;
              // delete item.properties.CTP_ENG_NM;
              // delete item.properties.CTP_KOR_NM;

              airNm = adaptor.sig[item.properties.LOC_CD].AIR_NM
              airLv = airData[airNm]

              break
            case '4':

              // 이름 통합.
              item.properties.LOC_CD = item.properties.SIG_CD
              item.properties.LOC_ENG_NM = item.properties.SIG_ENG_NM
              item.properties.LOC_KOR_NM = item.properties.SIG_KOR_NM
              // delete item.properties.SIG_CD;
              // delete item.properties.SIG_ENG_NM;
              // delete item.properties.SIG_KOR_NM;
              // /Users/byeonggyu/Desktop/etc/200.dev/10.project/misemise/server/util/adaptor.js

              airLv = adaptor.emd[item.properties.LOC_CD].AIR_NM
              airLv = airData[airNm]
              debugger

              /*
              for (let i = 0; i < airData.length; i++) {
                let obj = airData[i]

                // let condition = obj.cityNameEng.includes(item.properties.LOC_ENG_NM);
                let condition = item.properties.LOC_ENG_NM.includes(obj.cityNameEng)
                if (condition) {
                  airLv = obj.pm25Value || 999

                  targetFile.emd[item.properties.SIG_CD] = {
                    'SIG_ENG_NM': item.properties.SIG_ENG_NM,
                    'AIR_NM': obj.cityNameEng,
                    'AIR_KO_NM': obj.cityName
                  }
                  // adapter.js emd

                  // '50': {
                  //   'CTP_ENG_NM': 'Jeju-do',
                  //   'AIR_NM': 'jeju',
                  //   'AIR_KO_NM': '제주'
                  // }
                  // fs.writeFileSync(){

                  // }
                  break
                }
              }
*/
              // "SIG_CD":"47111","SIG_ENG_NM":"Nam-gu, Pohang-si","SIG_KOR_NM":"포항시 남구"

              break
            case '6':
              break
          }

          // let tempData = JSON.stringify(targetFile)
          // let tempPath = path.join(__dirname, '/util/adaptor_re.json')
          // fs.writeFileSync(tempPath, tempData)

          item.properties.AIR_LV = airLv
          item.properties.KOR_LV = getLevel(airLv)

          return item
        })

        res.send(result)
      } else {
        console.error(error)
      }
    }
  )
})// END_GET

app.listen(port, function () {
  console.log('Node Server is Run  listening on port ' + port + '!')
})
