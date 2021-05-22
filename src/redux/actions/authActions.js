import axios from 'axios';

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
    let token = getState().auth.token;
    // Decode payload and check for 'admin' flag
    let payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    if (payload.password_reset) { return '/password'; }
    if (!payload.admin) { return `/student/${payload.nscc_id}`; }
    if (payload.admin) { return '/admin/student'; }
};

export const submitPasswordReset = fields => (dispatch, getState) => {
    dispatch({
        type: AUTH_LOADING
    });

    dispatch({
        type: CLEAR_MESSAGES
    });

    let token = getState().auth.token;
    let payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    axios({
        data: fields,
        headers: { 'Authorization': `Bearer ${getState().auth.token}` },
        method: 'POST',
        timeout: 10000,
        url: `${getState().api.url}/auth/reset/${payload.nscc_id}`
    }).then(response => {
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);

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

            localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);

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
        url: getState().api.url + '/auth/login'
    }).then(response => {
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);

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
                localStorage.setItem('token', error.response.headers['authorization'].split(' ')[1]);
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
    /* FIXME: Scroll user back to top after logout */

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
