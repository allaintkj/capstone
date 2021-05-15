import {
    CLEAR_STUDENT,
    SET_STUDENT
} from '../actions/types';

const initialState = {
    'nscc_id': '',
    'first_name': '',
    'last_name': '',
    'start_date': '',
    'end_date': '',
    'advisor': '',
    'comment': '',
    'active': 1
};

export default function(state = initialState, action) {
    switch (action.type) {
        case CLEAR_STUDENT:
            return {
                ...state,
                initialState
            };
        case SET_STUDENT:
            return {
                ...state,
                ...action.payload
            };
        default:
            return {...state};
    }
}
