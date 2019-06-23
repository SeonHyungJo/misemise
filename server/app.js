
require ('dotenv').config();

const express = require('express');
const app = express();
const request =require("request");
const qs = require('querystring');

const port = process.env.PORT;
const SERVICE_KEY = process.env.AIR_SERVICEKEY;

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Accept-Charset", "utf-8");
  res.header("Content-Type", "text/html; charset=utf-8");
  
  next();
});


app.get('/', function (req, res) {
  let sidoName = qs.escape(req.query.sidoName || "서울");
  let stationName = qs.escape(req.query.stationName || "종로구");
  let zoomLevel = req.query.zoomLevel || 2;
  let pageNo = 1;
  let Rows = 1;
  let uri = "http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc";
  
  uri +=
    zoomLevel === "2"  //전국
        ? `/getCtprvnMesureLIst?itemCode=PM10&dataGubun=HOUR&searchCondition=WEEK`
    : zoomLevel === "4"  //군구
        ? `/getCtprvnMesureSidoLIst?sidoName=${sidoName}&searchCondition=HOUR`
    : zoomLevel === "7" //읍면동
        ? `/getMsrstnAcctoRltmMesureDnsty?stationName=${stationName}&dataTerm=month&ver=1.3` 
    : "";

  uri += `&pageNo=${pageNo}&numOfRows=${Rows}&ServiceKey=${SERVICE_KEY}&_returnType=json`;

//공공API 서버에 요청.
  request(uri.trim(), 
     (error, response, body) => {
      if ( !error  && response.statusCode == 200) {
        console.log('response header', response.headers);
        let JS_body = JSON.parse(body);
        res.send(JS_body);
      }else{
        console.error(error);
      }
    }
  );
  
});



app.listen(port, function () {
  console.log('Node Server is Run  listening on port '+port+'!');
});