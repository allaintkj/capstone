import {
    SET_PROGRESS
} from '../actions/types';

const initialState = {
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_PROGRESS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return {...state};
    }
}
