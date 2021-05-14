import { SET_ARRAY } from '../actions/types';

const initialState = {
    student: [],
    faculty: [],
    course: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_ARRAY:
            return {
                ...state,
                [action.payload.type]: action.payload.array
            };
        default:
            return {...state};
    }
}
