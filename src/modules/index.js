import { handleActions, createAction } from 'redux-actions';
import axios from 'axios'

const  getMiseDate = ( otp )=>{

    console.log(otp.addr.addrdetail);
    return axios.request({
        method: 'GET',
        url :`http://localhost:8080?zoomLevel=${otp.zoomLevel}&sidoName=${otp.sidoName}&stationName=${otp.stationName}`
    });
};

const converLatLngToAddr = (otp)=>{

    const {naver,_lat, _lng } = otp;

    return new Promise((resolve)=>{
        naver.maps.Service.reverseGeocode({location: new naver.maps.LatLng(_lat,_lng)}, (status, response) => {
            if (status === naver.maps.Service.Status.OK) {
                let addr = response.result.items[0];
                resolve(addr);
            }
        })
    })

}

// Action
const GET_MISE_DATA = 'GET_MISE_DATA';

// React에서 호출하는 부분
export const getData = createAction(GET_MISE_DATA);


export const getDataAsync = (otp) => dispatch => {


    //주소변환.
    converLatLngToAddr(otp).then( rtn => {
        return getMiseDate({...otp,addr:rtn});
    }).then(rtn=>{
        // 요청이 성공했을경우, 서버 응답내용을 payload 로 설정하여 GET_POST_SUCCESS 액션을 디스패치합니다.
        dispatch({
            type: GET_MISE_DATA,
            payload: {...rtn,...otp}
        })
    }).catch(error => {
        // 에러가 발생했을 경우, 에로 내용을 payload 로 설정하여 GET_POST_FAILURE 액션을 디스패치합니다.
        dispatch({
            type: GET_MISE_DATA,
            payload: {...error,...otp}
        });
    });
}

// 행정구역의 레벨. (줌 레벨)
// 중앙 : 충주.
const counterInitialState = {
  data: {},
  mapObj: {},
  zoomLevel : 2,
  lat : 36.9257913,
  lng : 127.87798
};

//리듀서.
export default handleActions({
    [GET_MISE_DATA] : (state, action) => 
    {
        const { data,_lat,_lng,map } = action.payload;
   

        return {
            ...state,
            'zoomLevel' :  state.zoomLevel ,
            'mapObj' :  map,
            'lat' :  _lat,
            'lng' :  _lng,
            'data' : data.list[0]
        };
    },
}, counterInitialState);
