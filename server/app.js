
require ('dotenv').config();

const express = require('express');
const app = express();
const request = require("request");
const qs = require('querystring');

const port = process.env.PORT;
const SERVICE_KEY = process.env.AIR_SERVICEKEY;

app.all('/*', function(req, res, next) {
  res.header("Accept-Charset", "utf-8");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
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
  let geoFileName = "";
  //console.log('server_Enter',zoomLevel,sidoName,stationName);
  

  switch(zoomLevel){
      case "2": //시도
        uri+=`/getCtprvnMesureLIst?itemCode=PM10&dataGubun=HOUR&searchCondition=WEEK`;
        geoFileName = "CTPRVN.json";
        break;
      case "4": //시군구
        uri+=`/getCtprvnMesureSidoLIst?sidoName=${sidoName}&searchCondition=HOUR`;
        geoFileName = "SIG.json";
        break;
      case "7": //읍면동
        uri+=`/getMsrstnAcctoRltmMesureDnsty?stationName=${stationName}&dataTerm=month&ver=1.3`;
        geoFileName = "EMD.json";
        break;
  }
  // uri +=
  //   zoomLevel === "2"  //전국
  //       ? `/getCtprvnMesureLIst?itemCode=PM10&dataGubun=HOUR&searchCondition=WEEK`
  //   : zoomLevel === "4"  //군구
  //       ? `/getCtprvnMesureSidoLIst?sidoName=${sidoName}&searchCondition=HOUR`
  //   : zoomLevel === "7" //읍면동
  //       ? `/getMsrstnAcctoRltmMesureDnsty?stationName=${stationName}&dataTerm=month&ver=1.3` 
  //   : "";

  uri += `&pageNo=${pageNo}&numOfRows=${Rows}&ServiceKey=${SERVICE_KEY}&_returnType=json`;
  
//공공API 서버에 요청.
  request(uri.trim(), 
     (error, response, body) => {
      if ( !error  && response.statusCode == 200) {
        //console.log('response header', response.headers);
        
        let geoJSON = require(`./geoJSON/${geoFileName}`);
        let airData = JSON.parse(body);

        console.log(zoomLevel,sidoName,  stationName, airData.list.length)
        let result = {
          airData : airData.list[0],
          geoData : geoJSON.features
        };
        res.send(result);
        
      }else{
        console.error(error);
      }
    }
  );
  
});



app.listen(port, function () {
  console.log('Node Server is Run  listening on port '+port+'!');
});