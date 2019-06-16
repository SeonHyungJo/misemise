import { combineReducers } from 'redux';
import { handleActions, createAction } from 'redux-actions';
import axios from 'axios'

function getMiseDate(){
    //노드 서버
    return axios.get(`http://localhost:8080`)
}

// Action
const GET_MISE_DATA = 'GET_MISE_DATA';


// React에서 호출하는 부분
export const getData = createAction(GET_MISE_DATA);


export const getDataAsync = () => dispatch => {

    return getMiseDate().then(
        (response) => {

            // 요청이 성공했을경우, 서버 응답내용을 payload 로 설정하여 GET_POST_SUCCESS 액션을 디스패치합니다.
            dispatch({
                type: GET_MISE_DATA,
                payload: response
            })
        }
    ).catch(error => {
        // 에러가 발생했을 경우, 에로 내용을 payload 로 설정하여 GET_POST_FAILURE 액션을 디스패치합니다.
        dispatch({
            type: GET_MISE_DATA,
            payload: error
        });
    })
}

// init Data
// 행정구역의 레벨. (줌 레벨)
// 센터위 좌표값.
const counterInitialState = {
  value: 0,
  diff: 1,
  data: {}
};

export default handleActions({
    [GET_MISE_DATA] : (state, action) => 
    {
        const { data } = action.payload;
        return {
            ...state,
            'data' : data
        };
    },
}, counterInitialState);
