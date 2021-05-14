import axios from 'axios';

import {
    AUTH_LOADED,
    AUTH_LOADING,
    CLEAR_MESSAGES,
    SET_MESSAGES,
    CLEAR_USER_TYPE,
    SET_USER_TYPE
} from './types';

export const clearUserType = () => dispatch => {
    dispatch({
        type: CLEAR_USER_TYPE,
        payload: null
    })
}

export const setUserType = userType => dispatch => {
    dispatch({
        type: SET_USER_TYPE,
        payload: userType
    });
}

export const login = (fields, userType = 'student') => (dispatch, getState) => {
    // Set loading state to true
    dispatch({
        type: AUTH_LOADING
    });

    // Set userType in case it isn't already
    dispatch({
        type: SET_USER_TYPE,
        payload: userType
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
        url: getState().api.url + '/login/' + getState().auth.userType
    }).then(response => {
        console.log(response);

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
            // FIXME
            // HTTP 300 means the account has been flagged for password reset
            
            // let requiresReset = error.response.status === 300;
            // let token = error.response.headers.token;

            // if (requiresReset) {
            //     localStorage.removeItem('token');
            //     localStorage.setItem('token', token);

            //     this.setState({
            //         fields: this.state.fields,
            //         msg: this.props.msg
            //     }, () => {
            //         this.props.setLoading(false);
            //         this.props.history.push('/password');
            //     });

            //     return;
            // }

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