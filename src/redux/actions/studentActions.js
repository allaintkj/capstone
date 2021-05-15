import axios from 'axios';

import {
    SET_MESSAGES,
    CLEAR_MESSAGES,
    SET_LOAD_FLAG,
    SET_STUDENT,
    CLEAR_STUDENT,
    DEAUTH_USER
} from './types';

export const fetchStudent = nscc_id => (dispatch, getState) => {
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });

    dispatch({
        type: CLEAR_MESSAGES
    });

    axios({
        headers: { 'token': getState().auth.token },
        method: 'GET',
        timeout: 10000,
        url: `${getState().api.url}/student/get/${nscc_id}`
    }).then(response => {
        dispatch({
            type: SET_STUDENT,
            payload: response.data.users
        });
    }).catch(error => {
        try {
            localStorage.removeItem('token');

            if (error.response.status === 401) {
                // Set message
                let msgBlock = {};
                msgBlock.text = error.response.data.text;

                dispatch({
                    type: SET_MESSAGES,
                    payload: msgBlock
                });

                // Deauth user
                dispatch({
                    type: DEAUTH_USER
                });

                // Blank student in Redux state
                dispatch({
                    type: CLEAR_STUDENT
                });

                // Disable load flag
                dispatch({
                    type: SET_LOAD_FLAG,
                    payload: false
                });

                return;
            }

            localStorage.setItem('token', error.response.headers.token);

            // Disable load flag
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
            });
        } catch (exception) {
            console.log(exception);
        }
    });
};
