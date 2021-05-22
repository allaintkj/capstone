import axios from 'axios';

import {
    SET_LOAD_FLAG,
    SET_MESSAGES,
    CLEAR_MESSAGES,
    SET_PROGRESS,
    CLEAR_STUDENTS,
    CLEAR_COURSES,
    DEAUTH_USER
} from './types';

export const fetchStudentProgress = nscc_id => (dispatch, getState) => {
    if (!nscc_id) { return; }

    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });

    // Clear error/validation messages
    dispatch({
        type: CLEAR_MESSAGES
    });

    axios({
        headers: { 'Authorization': `Bearer ${getState().auth.token}` },
        method: 'GET',
        timeout: 10000,
        url: `${getState().api.url}/progress/${nscc_id}`
    }).then(response => {
        // Update token
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);

        dispatch({
            type: SET_PROGRESS,
            payload: response.data.progress
        });

        // Disable load flag
        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        let msgBlock = {};
        msgBlock.text = error.response.data.text;

        try {
            localStorage.removeItem('token');

            if (error.response.status === 401) {
                dispatch({
                    type: SET_MESSAGES,
                    payload: msgBlock
                });

                // Deauth user
                dispatch({
                    type: DEAUTH_USER
                });

                // Blank student state
                dispatch({
                    type: CLEAR_STUDENTS
                });

                // Blank course state
                dispatch({
                    type: CLEAR_COURSES
                });

                // Disable load flag
                dispatch({
                    type: SET_LOAD_FLAG,
                    payload: false
                });

                return;
            }

            localStorage.setItem('token', error.response.headers['authorization'].split(' ')[1]);
            
            dispatch({
                type: SET_MESSAGES,
                payload: msgBlock
            });

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
