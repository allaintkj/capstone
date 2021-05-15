import {
    AUTH_LOADED,
    AUTH_LOADING,
    DEAUTH_USER
} from '../actions/types';

const initialState = {
    isLoading: false,
    token: localStorage.getItem('token')
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
        case DEAUTH_USER:
            return {
                ...state,
                isLoading: false,
                token: null
            };
        default:
            return {...state};
    }
}
