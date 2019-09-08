
require('dotenv').config()

const express = require('express')
const app = express()
const request = require('request')
const qs = require('querystring')
const fs = require('fs')
const path = require('path')
const adapterString = fs.readFileSync(path.join(__dirname, 'util/adaptor.json'))
const adaptorJSON = JSON.parse(adapterString)

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
let nameConverter = (adaptorJSON, parentCd) => {
  let air_ko_nm = adaptorJSON[parentCd].AIR_KO_NM

  console.log('nameConverter', air_ko_nm)
  // escape 처리
  return qs.escape(air_ko_nm)
}

const getLevel = function (_num) {

  if (typeof _num === 'string') {
    _num = parseInt(_num, 10)
  }

  if (typeof _num !== 'number' || isNaN(_num)) {
    console.log(_num);
    return 'undefind';
  }


  const container = [
    { min: 0, max: 15, level: '좋음' },
    { min: 16, max: 35, level: '보통' },
    { min: 36, max: 75, level: '나쁨' },
    { min: 76, max: 999, level: '매우나쁨' }
  ]

  let re = container.find(item => item.min <= _num && item.max >= _num)

  if (!re) {
    console.log(_num);
    return 'undefind';
  }

  return re.level
}

const getGeoData = function (zoomLevel = 2, parentCd) {

  let geoFileName;

  if (zoomLevel === '2')
    geoFileName = 'CTPRVN.json';
  else if (zoomLevel === '4')
    geoFileName = `sig/${parentCd}.json`;
  else if (zoomLevel === '6')
    geoFileName = `emd/${parentCd}.json`;


  return require(`./geoJSON/${geoFileName}`)
}


const getAirKoreaUrl = function (zoomLevel = 2, parentCd, geoData) {
  const pageNo = 1
  const Rows = 100;
  let uri = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc'

  // 행정 구역별 구분 진행
  switch (zoomLevel) {
    case '2': // 시도 ( (5) 시도별 실시간 평균정보 조회 오퍼레이션 명세)
      uri += `/getCtprvnMesureLIst?itemCode=PM10&dataGubun=HOUR&searchCondition=WEEK`
      break

    case '4': // 시군구 (6) 시군구별 실시간 평균정보 조회 오퍼레이션 명세
      sidoName = nameConverter(adaptorJSON, parentCd)

      uri += `/getCtprvnMesureSidoLIst?sidoName=${sidoName}&searchCondition=HOUR`
      break

    case '6': // 읍면동
      umdName = nameConverter(adaptorJSON, parentCd)
      uri += `/getMsrstnAcctoRltmMesureDnsty?stationName=${stationName}&dataTerm=month&ver=1.3`
      break
  }

  uri += `&pageNo=${pageNo}&numOfRows=${Rows}&ServiceKey=${SERVICE_KEY}&_returnType=json`

  return uri;
}





const promiseFactory = function (fn) {

  return new Promise((resolve, reject) => {

     fn(resolve, reject)
  })
}




/**
 * geoJSON 데이터 가공을 위한 전처리 작업.
 * @param {*} geoJSON 
 * @param {*} zoomLevel 
 */
const preprocessing = function (geoJSON, zoomLevel, adaptorJSON, parentCd) {

  if (zoomLevel !== '6')
    return Promise.resolve(geoJSON);

  return geoJSON.features.reduce((pre, feature, idx, arr) => {

    //TM 기준좌표 조회 오퍼레이션 등록
    return pre.then((_geoJSON) => promiseFactory((resolve,reject)=>{

      let _feature = _geoJSON.features[idx];

      let LOC_KOR_NM = _feature.properties.LOC_KOR_NM;
      let umdName = qs.escape(_feature.properties.LOC_KOR_NM);
      console.log(LOC_KOR_NM)

      let URL = `http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getTMStdrCrdnt?umdName=${umdName}&pageNo=1&numOfRows=10&ServiceKey=${SERVICE_KEY}&_returnType=json`;


      request(URL, (error, response, body) => {
        if (response.statusCode === 200) {

          try {
            let airData = JSON.parse(body)

            _feature.properties.STATION_INFO = {};
            _feature.properties.STATION_INFO.tmX = airData.list[0].tmX
            _feature.properties.STATION_INFO.tmY = airData.list[0].tmY
            _feature.properties.STATION_INFO.umdName = airData.list[0].umdName
          } catch (e) {
            console.error(`${LOC_KOR_NM} TM 기준좌표 조회 정보가 없습니다.`)
          }

          resolve(_geoJSON);
        } else {
          console.error(error);
        }
      })
     // 근접 측정소 목록 조회.
    })).then((_geoJSON)=>promiseFactory((resolve,reject)=>{

      let _feature = _geoJSON.features[idx];
       // 근접 측정소 목록 조회.
       let tmX = _feature.properties.STATION_INFO.tmX;
       let tmY = _feature.properties.STATION_INFO.tmY;

       if (tmX && tmY) {
         let URL = `http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?tmX=${tmX}&tmY=${tmY}&ServiceKey=${SERVICE_KEY}&_returnType=json`;
         request(URL, (error, response, body) => {

           try{
            if (response.statusCode === 200) {

              let airData = JSON.parse(body);
              if (_feature.properties.STATION_INFO) {
                //가장 가까운 곳
                _feature.properties.STATION_INFO.stationName = airData.list[0].stationName
                //TODO: 파일쓰기. memorization.
              }
 
            } else {
              console.error(error);
            }
            resolve(_geoJSON);
           }catch(e){
            resolve(_geoJSON);
           }
           
         })


       } else {
        resolve(_geoJSON);
       }
    }))


  },Promise.resolve(geoJSON))//endReduce


}//preProcessing



app.get('/country', (req, res) => {
  const parentCd = req.query.parentCd || 2
  let zoomLevel = req.query.zoomLevel || '2'
  let geoJSON = getGeoData(zoomLevel, parentCd);
  let uri = getAirKoreaUrl(zoomLevel, parentCd, geoJSON);


  let result;

  //전처리 작업. preprocessing
  preprocessing(geoJSON, zoomLevel, adaptorJSON, parentCd)
    .then((_geoJSON) => {

      return new Promise(reslove => {
        // 공공API 서버에 요청.
        request(uri.trim(),
          (error, response, body) => {
            if (!error && response.statusCode === 200) {

              let airData = JSON.parse(body)

              if (zoomLevel == '2') {
                airData = airData.list[0]
              } else if (zoomLevel == '4') {
                airData = airData.list.reduce((pre, cur) => {
                  pre[cur.cityNameEng] = cur.pm25Value
                  return pre
                }, {})
              } else if (zoomLevel == '6') {
                // 데이터 포멧에 맞춰서 수정.
              }

              // 통합데이터
              // 컨버팅은 서버에서한다.
              // geoData에 미세먼지 데이터를 통합하여 추가한다.
              _geoJSON = _geoJSON.features.map(item => {
                let LOC_CD = item.properties.LOC_CD
                let airLv = 999;

                if (!adaptorJSON[LOC_CD]) {
                  console.log("어뎁터에 해당 지역의 정보가 없습니다.", item.properties.LOC_KOR_NM)
                } else {
                  let AIR_NM = adaptorJSON[LOC_CD].AIR_NM
                  if (!airData[AIR_NM]) {
                    console.log(AIR_NM);
                  }
                  airLv = airData[AIR_NM]
                }


                item.properties.AIR_LV = airLv
                item.properties.KOR_LV = getLevel(airLv)

                return item
              })
              result = { geoData: _geoJSON }

              reslove(result)
            } else {
              throw new Error(error)
            }
          }
        )


      })



    }).then((rtn) => {
      console.log(rtn);
      res.send(rtn)
    }).catch((e) => {
      console.log(e);
    });

})// END_GET




app.get('/sig', (req, res) => {
  const parentCd = req.query.parentCd || 2
  let zoomLevel = req.query.zoomLevel || '2'
  let geoJSON = getGeoData(zoomLevel, parentCd);
  let uri = getAirKoreaUrl(zoomLevel, parentCd, geoJSON);


  let result;

  //전처리 작업. preprocessing
  preprocessing(geoJSON, zoomLevel, adaptorJSON, parentCd)
    .then((_geoJSON) => {

      return new Promise(reslove => {
        // 공공API 서버에 요청.
        request(uri.trim(),
          (error, response, body) => {
            if (!error && response.statusCode === 200) {

              let airData = JSON.parse(body)

              if (zoomLevel == '2') {
                airData = airData.list[0]
              } else if (zoomLevel == '4') {
                airData = airData.list.reduce((pre, cur) => {
                  pre[cur.cityNameEng] = cur.pm25Value
                  return pre
                }, {})
              } else if (zoomLevel == '6') {
                // 데이터 포멧에 맞춰서 수정.
              }

              // 통합데이터
              // 컨버팅은 서버에서한다.
              // geoData에 미세먼지 데이터를 통합하여 추가한다.
              _geoJSON = _geoJSON.features.map(item => {
                let LOC_CD = item.properties.LOC_CD
                let airLv = 999;

                if (!adaptorJSON[LOC_CD]) {
                  console.log("어뎁터에 해당 지역의 정보가 없습니다.", item.properties.LOC_KOR_NM)
                } else {
                  let AIR_NM = adaptorJSON[LOC_CD].AIR_NM
                  if (!airData[AIR_NM]) {
                    console.log(AIR_NM);
                  }
                  airLv = airData[AIR_NM]
                }


                item.properties.AIR_LV = airLv
                item.properties.KOR_LV = getLevel(airLv)

                return item
              })
              result = { geoData: _geoJSON }

              reslove(result)
            } else {
              throw new Error(error)
            }
          }
        )


      })



    }).then((rtn) => {
      console.log(rtn);
      res.send(rtn)
    }).catch((e) => {
      console.log(e);
    });

})// END_GET



app.get('/emd', (req, res) => {
  const parentCd = req.query.parentCd || 2
  let zoomLevel = req.query.zoomLevel || '2'
  let geoJSON = getGeoData(zoomLevel, parentCd);







  let result;

  //전처리 작업. preprocessing
  preprocessing(geoJSON, zoomLevel, adaptorJSON, parentCd)
    .then((_geoJSON) => {


      return _geoJSON.features.reduce((pre, feature, idx, arr) => {

        return pre.then(() => promiseFactory((reslove, reject) => {
          let stationName = feature.properties.STATION_INFO.stationName

          if (!stationName) {
            resolve(resolve)
          }
          let uri = getAirKoreaUrl(zoomLevel, parentCd, geoJSON);
          request(uri.trim(), (error, response, body) => {


            //item.properties.AIR_LV = airLv
            //  item.properties.KOR_LV = getLevel(airLv)
            resolve(resolve);
          })
        }))

      }, Promise.resolve());


    }).then((rtn) => {
      console.log(rtn);
      res.send(rtn)
    }).catch((e) => {
      console.log(e);
    });

})// END_GET






app.listen(port, function () {
  console.log('Node Server is Run  listening on port ' + port + '!')
})
