import {
    SET_CONFIRM_DEL, SET_FORM, SET_LOADING,
    SET_TAB, SHOW_CONFIRM_DEL
} from '../actions/types';

const initialState = {
    adding: false,
    api_url: 'http://localhost:5050/api',
    confirm_del: false,
    form: false,
    form_state: {},
    loading: false,
    show_confirm_del: false,
    tabs: {
        panel_array: ['Info', 'Edit'],
        list_array: ['Students', 'Faculty', 'Courses']
    }
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_CONFIRM_DEL:
            return {
                ...state,
                confirm_del: action.payload
            };
        case SET_FORM:
            return {
                ...state,
                form_state: action.payload
            };
        case SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case SET_TAB:
            return {
                ...state,
                tabs: {
                    ...state.tabs,
                    [action.payload.side]: action.payload.tab
                }
            };
        case SHOW_CONFIRM_DEL:
            return {
                ...state,
                show_confirm_del: action.payload
            };
        default:
            return {...state};
    }
}
