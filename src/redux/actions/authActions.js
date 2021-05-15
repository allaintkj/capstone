import axios from 'axios';
import * as jwt from 'jsonwebtoken';

import {
    AUTH_LOADED,
    AUTH_LOADING,
    CLEAR_MESSAGES,
    SET_MESSAGES,
    DEAUTH_USER
} from './types';

export const getPathFromToken = () => (dispatch, getState) => {
    let decoded = jwt.decode(getState().auth.token);

    if (decoded.password_reset) { return '/password'; }
    if (decoded.type === 'student') { return `/student/${decoded.nscc_id}`; }
    if (decoded.type === 'faculty') { return '/dashboard/student'; }
};

export const submitPasswordReset = fields => (dispatch, getState) => {
    // Set loading state to true
    dispatch({
        type: AUTH_LOADING
    });

    // Clear messages
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

            // build error msg object
            if (response.validation) {
                for (let field in response.validation) {
                    msgBlock = {
                        ...msgBlock,
                        [field]: response.validation[field]
                    };
                }
            }

            if (response.text) { msgBlock.text = response.text; }

            // Invalid token
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

            // Invalid token
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
            // Clear message block just in case
            let msgBlock = {};

            // Set a general message to notify the user
            msgBlock.text = 'Request aborted';

            // Set the message in redux state
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
    // Set loading state to true
    dispatch({
        type: AUTH_LOADING
    });

    // Clear messages
    dispatch({
        type: CLEAR_MESSAGES
    });

    // Clear token from localStorage just in case
    localStorage.removeItem('token');

    // Submit login to API
    axios({
        data: fields,
        method: 'POST',
        timeout: 10000,
        url: getState().api.url + '/login/student'
    }).then(response => {
        // Set token in localStorage for Redux store to find
        localStorage.setItem('token', response.headers.token);

        // Clear messages
        dispatch({
            type: CLEAR_MESSAGES
        });

        // Set loading flag
        dispatch({
            type: AUTH_LOADED
        });
    }).catch(error => {
        // Remove any possible tokens
        localStorage.removeItem('token');

        // Create a message object to store validation messages
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
