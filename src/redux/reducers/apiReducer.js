import {
    SET_LOAD_FLAG
} from '../actions/types';

const initialState = {
    isLoading: false,
    url: 'http://localhost:8080/api'
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_LOAD_FLAG:
            return {
                ...state,
                isLoading: action.payload
            };
        default:
            return {
                ...state
            };
    }
}
