import {
    CLEAR_MESSAGES,
    SET_MESSAGES
} from '../actions/types';

const initialState = {
    data: {}
};

export default function(state = initialState, action) {
    switch (action.type) {
        case CLEAR_MESSAGES:
            return {
                ...state,
                data: {}
            };
        case SET_MESSAGES:
            return {
                ...state,
                data: action.payload
            };
        default:
            return {...state};
    }
}
