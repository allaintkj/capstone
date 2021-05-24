import axios from 'axios';

import {
    CLEAR_COURSES,
    CLEAR_MESSAGES,
    CLEAR_STUDENTS,
    DEAUTH_USER,
    SET_LOAD_FLAG,
    SET_MESSAGES,
    SET_TOKEN
} from './types';

export const getPathFromToken = () => (dispatch, getState) => {
    let token = getState().auth.token;
    // Decode payload and check for 'admin' flag
    let payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    // Reset flag encountered, direct user to password reset form
    if (payload.password_reset) { return '/password'; }
    // User is a student, direct them to their own page
    if (!payload.admin) { return `/student/${payload.nscc_id}`; }
    // User is admin, send to dashboard
    if (payload.admin) { return '/admin/student'; }
};

export const login = fields => (dispatch, getState) => {
    // Toggle loading state
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });
    // Clear any possible validation or error messages
    dispatch({ type: CLEAR_MESSAGES });
    // Clear token from local storage just in case
    localStorage.removeItem('token');

    // Post form data to API
    axios({
        // Form fields from LoginForm
        data: fields,
        method: 'POST',
        timeout: 10000,
        url: getState().api.url + '/auth/login'
    }).then(response => {
        // Successful login and response code 200
        // Set received token in local storage
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);
        // Clear messages from state again just in case
        dispatch({ type: CLEAR_MESSAGES });
        // Add token to state
        dispatch({ type: SET_TOKEN });
        // Toggle loading state
        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        // Any error with the login request should mean the user remains unauthorized
        // Remove any potential token from storage
        localStorage.removeItem('token');

        // Create object to hold potential error/validation messages
        let msgBlock = {};

        // Attempt to assign data returned from server
        // If this fails, request has probably timed out and we should abort (see catch)
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
                // Set new token for password reset
                localStorage.setItem('token', error.response.headers['authorization'].split(' ')[1]);
                // Add token to state
                dispatch({ type: SET_TOKEN });
            }

            // Toggle loading state
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
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
            // Toggle loading state
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
            });
        }
    });
};

export const logout = () => dispatch => {
    /* FIXME: Scroll user back to top after logout */

    // Clear message block just in case
    let msgBlock = {};
    // Set a general message to notify the user
    msgBlock.text = 'You have been logged out';

    // Remove token
    localStorage.removeItem('token');
    // Clear student state
    dispatch({ type: CLEAR_STUDENTS });
    // Clear course state
    dispatch({ type: CLEAR_COURSES });
    // Clear auth state from redux
    dispatch({ type: DEAUTH_USER });
    // Set message in state to be rendered
    dispatch({
        type: SET_MESSAGES,
        payload: msgBlock
    });
};

export const submitPasswordReset = fields => (dispatch, getState) => {
    // Toggle loading state
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });
    // Clear message state
    dispatch({ type: CLEAR_MESSAGES });

    // Check payload of token for API url
    let token = getState().auth.token;
    let payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    axios({
        // Password form
        data: fields,
        // Token received from login request
        headers: { 'Authorization': `Bearer ${getState().auth.token}` },
        method: 'POST',
        timeout: 10000,
        url: `${getState().api.url}/auth/reset/${payload.nscc_id}`
    }).then(response => {
        // Remove old token
        localStorage.removeItem('token');
        // Set refresh token
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);
        // Add token to state
        dispatch({ type: SET_TOKEN });
        // Toggle loading state
        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        try {
            // Remove token first, in case user should be de-authed
            localStorage.removeItem('token');

            // Setup message object
            let msgBlock = {};
            let response = error.response.data;

            // Check for validation messages
            if (response.validation) {
                for (let field in response.validation) {
                    msgBlock = {
                        ...msgBlock,
                        [field]: response.validation[field]
                    };
                }
            }

            if (response.text) { msgBlock.text = response.text; }

            // Token failed verification server-side
            if (error.response.status === 401) {
                // Notify the user by setting message in state
                dispatch({
                    type: SET_MESSAGES,
                    payload: msgBlock
                });
                // Remove token from state
                dispatch({ type: DEAUTH_USER });
                return;
            }

            if (error.response.status === 400) {
                // Something malformed about our request
                // Notify the user
                dispatch({
                    type: SET_MESSAGES,
                    payload: msgBlock
                });
            }

            // Set token if returned from request
            localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);
            // Add token to state
            dispatch({ type: SET_TOKEN });
            // Toggle loading state
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
            });
        } catch (exception) {
            // Something wrong here
            let msgBlock = {};
            msgBlock.text = 'Request aborted';

            // Notify user if we have any messages
            dispatch({
                type: SET_MESSAGES,
                payload: msgBlock
            });
            // Toggle loading state
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
            });
        }
    });
};
