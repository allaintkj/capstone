import {
    CLEAR_COURSES,
    SET_COURSE,
    SET_COURSES
} from '../actions/types';

const initialState = {
    course_code: '',
    course_name: '',
    course_desc: '',
    number_units: 1,
    number_credits: 1,
    comment: '',
    list: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case CLEAR_COURSES:
            return {
                ...state,
                initialState
            };
        case SET_COURSE:
            return {
                ...state,
                ...action.payload
            };
        case SET_COURSES:
            return {
                ...state,
                list: action.payload
            };
        default:
            return {...state};
    }
}
