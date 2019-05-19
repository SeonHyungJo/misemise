import { combineReducers } from 'redux';
import { handleActions, createAction } from 'redux-actions';
import axios from 'axios'

const API_KEY = 'mglCHo09SQqHPVt1AyfuZymDTpMndPMH2ZR3ZrZFR0OdywtT6AlVRQF%2BE8wphx716aaU%2FxS6zLQ1USWLLAkMaQ%3D%3D'

function getMiseDate(){
    return axios.get(`http://dummy.restapiexample.com/api/v1/employees`, 
    {
        headers: {"Access-Control-Allow-Origin": "*"}, 
    }
    )
}

// Action
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
const GET_MISE_DATA = 'GET_MISE_DATA';
const SET_DIFF = 'SET_DIFF';
const GET_DATA = 'GET_DATA';


// React에서 호출하는 부분
export const increment = createAction(INCREMENT);
export const decrement = createAction(DECREMENT);
export const getData = createAction(GET_MISE_DATA);

export const incrementAsync = () => dispatch => {
    // 1초 뒤 액션 디스패치
    console.log('increment')
    setTimeout(
        () => { dispatch(increment()) },
        1000
    );
}

export const decrementAsync = () => dispatch => {
    // 1초 뒤 액션 디스패치
    setTimeout(
        () => { dispatch(decrement()) },
        1000
    );
}

export const getDataAsync = () => dispatch => {

    return getMiseDate().then(
        (response) => {
            // 요청이 성공했을경우, 서버 응답내용을 payload 로 설정하여 GET_POST_SUCCESS 액션을 디스패치합니다.
            dispatch({
                type: GET_MISE_DATA,
                payload: response
            })
        }
    )
    // ).catch(error => {
    //     // 에러가 발생했을 경우, 에로 내용을 payload 로 설정하여 GET_POST_FAILURE 액션을 디스패치합니다.
    //     dispatch({
    //         type: GET_MISE_DATA,
    //         payload: error
    //     });
    // })
}

// init Data
const counterInitialState = {
  value: 0,
  diff: 1,
  data: ''
};

export default handleActions({
    [INCREMENT]: (state, action) => {
        return {
            ...state, 
            'value': state.value + state.diff
        } 
    },
    [DECREMENT]: (state, action) => 
    {
        return {
            ...state, 
            'value': state.value - state.diff
        } 
    },
    [GET_MISE_DATA] : (state, action) => 
    {
        const { data } = action.payload;
        return {
            ...state,
            'data' : JSON.stringify(data)
        };
    },
}, counterInitialState);
