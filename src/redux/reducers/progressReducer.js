import {
    SET_PROGRESS
} from '../actions/types';

const initialState = {
    data: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_PROGRESS:
            return {
                ...state,
                data: action.payload
            };
        default:
            return {...state};
    }
}
