import axios from 'axios';

import {
    DEAUTH_USER,
    CLEAR_COURSES,
    CLEAR_MESSAGES,
    CLEAR_STUDENTS,
    SET_LOAD_FLAG,
    SET_MESSAGES,
    SET_PROGRESS,
    SET_TOKEN
} from './types';

export const fetchStudentProgress = nscc_id => (dispatch, getState) => {
    // Can't fetch progess without an ID
    if (!nscc_id) { return; }

    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });
    // Clear error/validation messages
    dispatch({ type: CLEAR_MESSAGES });

    // Request progress
    axios({
        headers: { 'Authorization': `Bearer ${getState().auth.token}` },
        method: 'GET',
        timeout: 10000,
        url: `${getState().api.url}/progress/${nscc_id}`
    }).then(response => {
        // Success
        // Update token
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);

        // Set retrieved progress data in state
        dispatch({
            type: SET_PROGRESS,
            payload: response.data.progress
        });
        // Set token in state
        dispatch({ type: SET_TOKEN });
        // Disable load flag
        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        // Prepare message object
        let msgBlock = {};
        // Set message from server
        msgBlock.text = error.response.data.text;

        try {
            // Remove old token
            localStorage.removeItem('token');

            // Set error in state
            dispatch({
                type: SET_MESSAGES,
                payload: msgBlock
            });

            // Authorization failed
            if (error.response.status === 401) {
                // Deauth user
                dispatch({ type: DEAUTH_USER });
                // Blank student state
                dispatch({ type: CLEAR_STUDENTS });
                // Blank course state
                dispatch({ type: CLEAR_COURSES });
                // Disable load flag
                dispatch({
                    type: SET_LOAD_FLAG,
                    payload: false
                });

                return;
            }

            // Put new token in storage
            localStorage.setItem('token', error.response.headers['authorization'].split(' ')[1]);
            // Set token in state
            dispatch({ type: SET_TOKEN });
            // Disable load flag
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
            });
        } catch (exception) {
            // Disable load flag
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
            });
        }
    });
};
