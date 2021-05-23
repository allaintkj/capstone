import {
    DEAUTH_USER,
    SET_TOKEN
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token')
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_TOKEN:
            return {
                ...state,
                token: localStorage.getItem('token')
            };
        case DEAUTH_USER:
            return {
                ...state,
                token: null
            };
        default:
            return {...state};
    }
}
