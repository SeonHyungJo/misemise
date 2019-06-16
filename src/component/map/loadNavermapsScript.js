import loadJs from 'load-js';


const loadScriptPromise = (_ncpClientId) =>{ 
    let requestUrl = "https://openapi.map.naver.com/openapi/v3/maps.js";
    requestUrl +=`?ncpClientId=${_ncpClientId}`;
    return loadJs(requestUrl).then(() => {
      const navermaps = window.naver;

      return new Promise(resolve => {
        //onJSContentLoaded JS가 로드됐을 때 실행되는 이벤트 핸들러.
        navermaps.maps.onJSContentLoaded = () => {
          resolve(navermaps);
        };
      })
    })
}

export default loadScriptPromise;