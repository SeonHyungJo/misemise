var express = require('express');
var app = express();
var request =require("request");

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

var SERVICE_KEY = "mglCHo09SQqHPVt1AyfuZymDTpMndPMH2ZR3ZrZFR0OdywtT6AlVRQF%2BE8wphx716aaU%2FxS6zLQ1USWLLAkMaQ%3D%3D";

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

const options = {
  uri: `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=종로구&dataTerm=month&pageNo=1&numOfRows=10&ServiceKey=${SERVICE_KEY}&ver=1.3`,
  // uri: `http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?tmX=244148.546388&tmY=412423.75772&ServiceKey=${SERVICE_KEY}`,
  //uri: `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?sidoName=서울&pageNo=1&numOfRows=1&ServiceKey=${SERVICE_KEY}&ver=1.3`,
  method: 'GET'
};

// `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=종로구&dataTerm=month&pageNo=1&numOfRows=10&ServiceKey=${SERVICE_KEY}&ver=1.3`
//`http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?tmX=244148.546388&tmY=412423.75772&ServiceKey=${SERVICE_KEY}`

app.get('/', function (req, res) {
  // request(options, 
  // function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     // console.log('response header', response.headers)
  //     // console.log(body) 
  //     res.send(JSON.stringify(body));
  //   }
  // });
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 
  'Content-Type, Authorization, Content-Length, X-Requested-With');

  request('http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=%EC%A2%85%EB%A1%9C%EA%B5%AC&dataTerm=month&pageNo=1&numOfRows=10&ServiceKey=mglCHo09SQqHPVt1AyfuZymDTpMndPMH2ZR3ZrZFR0OdywtT6AlVRQF%2BE8wphx716aaU%2FxS6zLQ1USWLLAkMaQ%3D%3D&ver=1.3', 
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('response header', response.headers)
        console.log(body) 
        res.send(body);
      }
    }
  );
  
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});