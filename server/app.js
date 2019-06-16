const express = require('express');
const app = express();
const request =require("request");
const qs = require('querystring');
const port = 8080;
const SERVICE_KEY = "mglCHo09SQqHPVt1AyfuZymDTpMndPMH2ZR3ZrZFR0OdywtT6AlVRQF%2BE8wphx716aaU%2FxS6zLQ1USWLLAkMaQ%3D%3D";


app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Accept-Charset", "utf-8");
  res.header("Content-Type", "text/html; charset=utf-8");
  
  next();
});


app.get('/', function (req, res) {

  let addr = qs.escape(req.query.addr || "서울");
  let stationName = qs.escape(req.query.stationName || "종로구");
  let uri = `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=${stationName}&dataTerm=month&pageNo=1&numOfRows=10&ServiceKey=${SERVICE_KEY}&ver=1.3&_returnType=json`;
    //uri: `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?dataTerm=month&pageNo=1&numOfRows=10&ServiceKey=${SERVICE_KEY}&ver=1.3`,
    //uri:`http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getMsrstnList?addr=${addr}&stationName=${stationName}&pageNo=1&numOfRows=10&ServiceKey=${SERVICE_KEY}`,
    //uri: `http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?ServiceKey=${SERVICE_KEY}`,
    //uri: `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?sidoName=서울&pageNo=1&numOfRows=1&ServiceKey=${SERVICE_KEY}&ver=1.3`,
  

//공공API 서버에 요청.
  request(uri.trim(), 
    function (error, response, body) {
      if ( !error  && response.statusCode == 200) {
        console.log('response header', response.headers);
        let JS_body = JSON.parse(body);
        res.send(JS_body);
      }else{
        console.error(error.stack);
      }
    }
  );
  
});



app.listen(port, function () {
  console.log('Node Server is Run  listening on port '+port+'!');
});