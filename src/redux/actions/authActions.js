import axios from 'axios';
import * as jwt from 'jsonwebtoken';

import {
    AUTH_LOADED,
    AUTH_LOADING,
    CLEAR_MESSAGES,
    SET_MESSAGES,
    DEAUTH_USER,
    CLEAR_STUDENTS,
    CLEAR_COURSES
} from './types';

export const getPathFromToken = () => (dispatch, getState) => {
    let decoded = jwt.decode(getState().auth.token);

    if (decoded.password_reset) { return '/password'; }
    if (decoded.type === 'student') { return `/student/${decoded.nscc_id}`; }
    if (decoded.type === 'faculty') { return '/admin/student'; }
};

export const submitPasswordReset = fields => (dispatch, getState) => {
    dispatch({
        type: AUTH_LOADING
    });

    dispatch({
        type: CLEAR_MESSAGES
    });

    axios({
        data: fields,
        headers: { 'token': getState().auth.token },
        method: 'POST',
        timeout: 10000,
        url: `${getState().api.url}/password/reset`
    }).then(response => {
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers.token);

        dispatch({
            type: AUTH_LOADED
        });
    }).catch(error => {
        try {
            localStorage.removeItem('token');

            let msgBlock = {};
            let response = error.response.data;

            if (response.validation) {
                for (let field in response.validation) {
                    msgBlock = {
                        ...msgBlock,
                        [field]: response.validation[field]
                    };
                }
            }

            if (response.text) { msgBlock.text = response.text; }

            if (error.response.status === 401) {
                dispatch({
                    type: SET_MESSAGES,
                    payload: msgBlock
                });

                dispatch({
                    type: DEAUTH_USER
                });

                return;
            }

            if (error.response.status === 400) {
                dispatch({
                    type: SET_MESSAGES,
                    payload: msgBlock
                });

                return;
            }

            localStorage.setItem('token', error.response.headers.token);

            dispatch({
                type: AUTH_LOADED
            });
        } catch (exception) {
            let msgBlock = {};
            msgBlock.text = 'Request aborted';

            dispatch({
                type: SET_MESSAGES,
                payload: msgBlock
            });

            dispatch({
                type: AUTH_LOADED
            });
        }
    });
};

export const login = fields => (dispatch, getState) => {
    dispatch({
        type: AUTH_LOADING
    });

    dispatch({
        type: CLEAR_MESSAGES
    });

    localStorage.removeItem('token');

    axios({
        data: fields,
        method: 'POST',
        timeout: 10000,
        url: getState().api.url + '/login/student'
    }).then(response => {
        localStorage.setItem('token', response.headers.token);

        dispatch({
            type: CLEAR_MESSAGES
        });

        dispatch({
            type: AUTH_LOADED
        });
    }).catch(error => {
        localStorage.removeItem('token');

        let msgBlock = {};

        // Attempt to assign data returned from server
        // If this fails, request has probably timed out and we should abort
        try {
            // Data object composed by API
            let response = error.response.data;

            // Build object from response if there are validation messages
            if (response.validation) {
                for (let field in response.validation) {
                    msgBlock = {
                        ...msgBlock,
                        [field]: response.validation[field]
                    };
                }
            }

            // A spot for general error messages
            // i.e. not validation for a form input
            if (response.text) { msgBlock.text = response.text; }

            // Set message block in redux state to be rendered
            dispatch({
                type: SET_MESSAGES,
                payload: msgBlock
            });

            // HTTP 300 means the account has been flagged for password reset
            if (error.response.status === 300) {
                localStorage.removeItem('token');
                localStorage.setItem('token', error.response.headers.token);
            }

            // Set loading state false
            dispatch({
                type: AUTH_LOADED
            });
        } catch (exception) {
            // Clear message block just in case
            msgBlock = {};

            // Set a general message to notify the user
            msgBlock.text = 'Request aborted';

            // Set the message in redux state
            dispatch({
                type: SET_MESSAGES,
                payload: msgBlock
            });

            // Set loading state to false
            dispatch({
                type: AUTH_LOADED
            });
        }
    });
};

export const logout = () => dispatch => {
    // Clear student state
    dispatch({
        type: CLEAR_STUDENTS
    });

    // Clear course state
    dispatch({
        type: CLEAR_COURSES
    });

    // Remove token
    localStorage.removeItem('token');

    // Clear message block just in case
    let msgBlock = {};
    // Set a general message to notify the user
    msgBlock.text = 'You have been logged out';

    // Clear auth state from redux
    dispatch({
        type: DEAUTH_USER
    });

    // Set message in state to be rendered
    dispatch({
        type: SET_MESSAGES,
        payload: msgBlock
    });
};
