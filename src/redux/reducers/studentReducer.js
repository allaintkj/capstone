import {
    CLEAR_STUDENTS,
    SET_STUDENT,
    SET_STUDENTS
} from '../actions/types';

const initialState = {
    nscc_id: '',
    first_name: '',
    last_name: '',
    start_date: '',
    end_date: '',
    advisor: '',
    comment: '',
    active: 1,
    list: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case CLEAR_STUDENTS:
            return {
                ...state,
                ...initialState
            };
        case SET_STUDENT:
            return {
                ...state,
                ...action.payload
            };
        case SET_STUDENTS:
            return {
                ...state,
                list: action.payload
            };
        default:
            return {...state};
    }
}
