import axios from 'axios';

import {
    SET_ARRAY,
    SET_CONFIRM_DEL,
    SET_FORM,
    SET_LOADING,
    SHOW_CONFIRM_DEL
} from './types';

export const saveItem = (url, params, successCb = null, errorCb = null) => {
    return dispatch => {
        dispatch({
            type: SET_LOADING,
            payload: true
        });

        if (params.active) { params.active = 1; }
        if (params.active === false) { params.active = 0; }

        axios({
            data: params,
            headers: { 'token': localStorage.getItem('token') },
            method: url.includes('add') ? 'PUT' : 'POST',
            url: url
        }).then(response => {
            if (successCb) {
                dispatch({
                    type: SET_LOADING,
                    payload: false
                });

                successCb(response);
            }
        }).catch(error => {
            if (errorCb) {
                dispatch({
                    type: SET_LOADING,
                    payload: false
                });

                errorCb(error);
            }
        });
    };
};

export const deleteItem = (url, params, successCb = null, errorCb = null) => {
    return dispatch => {
        dispatch({
            type: SET_LOADING,
            payload: true
        });

        let key = params.type === 'course' ? 'course_code' : 'nscc_id';
        let value = params.id;

        axios({
            data: { [key]: value },
            headers: { 'token': localStorage.getItem('token') },
            method: 'DELETE',
            url: url
        }).then(response => {
            if (successCb) {
                dispatch({
                    type: SET_LOADING,
                    payload: false
                });

                successCb(response);
            }
        }).catch(error => {
            if (errorCb) {
                dispatch({
                    type: SET_LOADING,
                    payload: false
                });

                errorCb(error);
            }
        });
    };
};

export const fetch = (url, params, successCb = null, errorCb = null) => {
    return dispatch => {
        let route = `${url}/${params.type}/get/all`;
        let req_type = 'GET';

        axios({
            headers: { 'token': localStorage.getItem('token') },
            method: req_type,
            url: route
        }).then(response => {
            let array = [];
            let data = response.data;
            let type = params.type === 'course' ? 'course' : 'users';

            for (let key in data) {
                if (key.includes(type)) {
                    array = data[key];
                }
            }

            localStorage.removeItem('token');
            localStorage.setItem('token', response.headers.token);

            dispatch({
                type: SET_ARRAY,
                payload: {
                    array: array,
                    type: params.type
                }
            });

            if (successCb) { successCb(array); }

            dispatch({
                type: SET_LOADING,
                payload: false
            });
        }).catch(error => {
            if (errorCb) { errorCb(error); }

            dispatch({
                type: SET_LOADING,
                payload: false
            });
        });
    };
};

export const setConfirmDelete = status => {
    return {
        type: SET_CONFIRM_DEL,
        payload: status
    };
};

export const setForm = formObject => {
    return {
        type: SET_FORM,
        payload: formObject
    };
};

export const setLoading = loading => {
    return {
        type: SET_LOADING,
        payload: loading
    };
};

export const showConfirmDelete = status => {
    return {
        type: SHOW_CONFIRM_DEL,
        payload: status
    };
};
