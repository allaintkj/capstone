import {
    AUTH_LOADED,
    AUTH_LOADING,
    CLEAR_USER_TYPE,
    SET_USER_TYPE
} from '../actions/types';

const initialState = {
    isLoading: false,
    token: localStorage.getItem('token'),
    userType: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case AUTH_LOADED:
            return {
                ...state,
                isLoading: false,
                token: localStorage.getItem('token')
            };
        case AUTH_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case CLEAR_USER_TYPE:
            return {
                ...state,
                userType: null
            };
        case SET_USER_TYPE:
            return {
                ...state,
                userType: action.payload
            };
        default:
            return {...state};
    }
}
