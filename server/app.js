
require ('dotenv').config();

const express = require('express');
const app = express();
const request =require("request");
const qs = require('querystring');

//const port = process.env.PORT;
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
  let sidoName = qs.escape(req.query.sidoName || "종로구");
  let umdName = qs.escape(req.query.umdName || "혜화동");
  let zoomLevel = req.query.zoomLevel || 2;
  let pageNo = 1;
  let Rows = 10;
  let uri = "http://openapi.airkorea.or.kr/openapi/services/rest";
  
  uri +=
    zoomLevel === "2"  //전국
        ? `/ArpltnInforInqireSvc/getCtprvnMesureLIst?itemCode=PM10&dataGubun=HOUR&searchCondition=WEEK`
    : zoomLevel === "4"  //군구
        ? `/ArpltnInforInqireSvc/getCtprvnMesureSidoLIst?sidoName=${sidoName}&searchCondition=HOUR`
    : zoomLevel === "7" //읍면동
        ? `MsrstnInfoInqireSvc/getTMStdrCrdnt?umdName=${umdName}` 
    : "";
    
    uri += `&pageNo=${pageNo}&numOfRows=${Rows}&ServiceKey=${SERVICE_KEY}&_returnType=json`;

    console.log('노드',uri);
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