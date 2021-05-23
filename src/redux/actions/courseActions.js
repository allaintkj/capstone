import axios from 'axios';

import {
    CLEAR_COURSES,
    CLEAR_MESSAGES,
    CLEAR_STUDENTS,
    DEAUTH_USER,
    SET_COURSE,
    SET_COURSES,
    SET_LOAD_FLAG,
    SET_MESSAGES
} from './types';

export const addCourse = form => (dispatch, getState) => {
    // Toggle loading state
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });
    // Empty error and validation messages
    dispatch({ type: CLEAR_MESSAGES });

    // POST form data
    axios({
        data: {
            ...form,
            type: 'course'
        },
        headers: { 'Authorization': `Bearer ${getState().auth.token}` },
        method: 'PUT',
        timeout: 10000,
        url: `${getState().api.url}/courses/add`
    }).then(response => {
        // Success
        // Remove old token and refresh
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);

        // Object to hold message from server
        let msgBlock = {};
        msgBlock.text = response.data.text;

        // Set object in state
        dispatch({
            type: SET_MESSAGES,
            payload: msgBlock
        });
        // Toggle loading state
        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        // Message object to hold error
        let msgBlock = {};

        try {
            // Remove old token
            localStorage.removeItem('token');

            // Authorization issue
            if (error.response.status === 401) {
                // Set message
                msgBlock.text = error.response.data.text;
                // Put it in state
                dispatch({
                    type: SET_MESSAGES,
                    payload: msgBlock
                });
                // Deauth user
                dispatch({ type: DEAUTH_USER });
                // Clear student state
                dispatch({ type: CLEAR_STUDENTS });
                // Clear course state
                dispatch({ type: CLEAR_COURSES });
                // Disable load flag
                dispatch({
                    type: SET_LOAD_FLAG,
                    payload: false
                });

                // Return to login form when dashboard detects no token
                return;
            }

            // Set refresh token
            localStorage.setItem('token', error.response.headers['authorization'].split(' ')[1]);

            // Check for validation messages
            if (error.response.data.validation) {
                for (let field in error.response.data.validation) {
                    msgBlock = {
                        ...msgBlock,
                        [field]: error.response.data.validation[field]
                    };
                }
            }

            // General message
            msgBlock.text = error.response.data.text;
            // Set messages in state
            dispatch({
                type: SET_MESSAGES,
                payload: msgBlock
            });
            // Toggle loading state
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
            });
        } catch (exception) {
            // Unplanned for error
            // Set generic error message
            msgBlock = {};
            msgBlock.text = 'Error';
            // Toggle loading state
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
            });
        }
    });
};

export const deleteCourse = course_code => (dispatch, getState) => {
    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });
    // Clear error/validation messages
    dispatch({ type: CLEAR_MESSAGES });

    // POST form data
    axios({
        headers: { 'Authorization': `Bearer ${getState().auth.token}` },
        method: 'DELETE',
        timeout: 10000,
        url: `${getState().api.url}/courses/${course_code}`
    }).then(response => {
        // Success
        // Remove token and refresh
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);

        // Create object to hold server message
        let msgBlock = {};
        msgBlock.text = response.data.text;

        // Set message from server
        dispatch({
            type: SET_MESSAGES,
            payload: msgBlock
        });
        // Fetch all courses to update our list in state
        dispatch(fetchAllCourses());
        // Toggle loading state
        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        // Prep object for error message
        let msgBlock = {};

        try {
            // Remove old token
            localStorage.removeItem('token');

            // Authorization issue
            if (error.response.status === 401) {
                // Set message
                msgBlock.text = error.response.data.text;

                // Set message in state
                dispatch({
                    type: SET_MESSAGES,
                    payload: msgBlock
                });
                // Deauth user
                dispatch({ type: DEAUTH_USER });
                // Clear student state
                dispatch({ type: CLEAR_STUDENTS });
                // Clear course state
                dispatch({ type: CLEAR_COURSES });
                // Disable load flag
                dispatch({
                    type: SET_LOAD_FLAG,
                    payload: false
                });

                return;
            }

            // Set new token
            localStorage.setItem('token', error.response.headers['authorization'].split(' ')[1]);

            // Check for validation messages
            if (error.response.data.validation) {
                for (let field in error.response.data.validation) {
                    msgBlock = {
                        ...msgBlock,
                        [field]: error.response.data.validation[field]
                    };
                }
            }

            // General message area
            msgBlock.text = error.response.data.text;

            // Set message object in state for rendering
            dispatch({
                type: SET_MESSAGES,
                payload: msgBlock
            });
            // Toggle loading state
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
            });
        } catch (exception) {
            // Set generic error message
            msgBlock = {};
            msgBlock.text = 'Error';
            // Toggle loading state
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
            });
        }
    });
};

export const fetchAllCourses = (course_code = '') => (dispatch, getState) => {
    // Toggle loading state
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });
    // Empty error and validation messages
    dispatch({ type: CLEAR_MESSAGES });
    // Empty course state to guarantee fresh list
    dispatch({ type: CLEAR_COURSES });

    // Request all courses
    axios({
        headers: { 'Authorization': `Bearer ${getState().auth.token}` },
        method: 'GET',
        timeout: 10000,
        url: `${getState().api.url}/courses/all`
    }).then(response => {
        // Success
        // Remove old token
        localStorage.removeItem('token');
        // Add refresh token
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);
        // Set the entire list of courses in state
        dispatch({
            type: SET_COURSES,
            payload: response.data.courses
        });

        // Check for provided course code
        if (course_code.length > 1) {
            // If there's a course code provided, set the corresponding course in state
            let activeCourse = getState().course.list.filter(course => course.course_code == course_code)[0];
            dispatch({
                type: SET_COURSE,
                payload: activeCourse
            });
        }

        // Toggle loading state
        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        try {
            // Remove old token
            localStorage.removeItem('token');

            // Check if old token verified properly
            if (error.response.status === 401) {
                // Token failed verification
                // Notify user
                let msgBlock = {};
                msgBlock.text = error.response.data.text;
                // Set messages in state
                dispatch({
                    type: SET_MESSAGES,
                    payload: msgBlock
                });
                // Clear current auth state
                dispatch({ type: DEAUTH_USER });
                // Clear student state
                dispatch({ type: CLEAR_STUDENTS });
                // Clear course state
                dispatch({ type: CLEAR_COURSES });
                // Toggle loading state
                dispatch({
                    type: SET_LOAD_FLAG,
                    payload: false
                });

                // Return for re-rendering
                // Dashboard will detect non-existent token and redirect user to login
                return;
            }

            // Set new token in the event of an error that's not auth-related
            localStorage.setItem('token', error.response.headers['authorization'].split(' ')[1]);
            // Toggle loading state
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
            });
        } catch (exception) {
            // Something wrong
            // Toggle loading state
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
            });
        }
    });
};

export const setNewCourse = course_code => (dispatch, getState) => {
    // Toggle loading state
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });

    // Filter list from state to get the course we want
    let newCourse = getState().course.list.filter(course => course.course_code == course_code)[0];
    // Set course in state
    dispatch({
        type: SET_COURSE,
        payload: newCourse
    });

    // Toggle laoding state
    dispatch({
        type: SET_LOAD_FLAG,
        payload: false
    });
};

export const updateCourse = form => (dispatch, getState) => {
    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });
    // Empty error and validation messages
    dispatch({ type: CLEAR_MESSAGES });

    // POST form data
    axios({
        data: {
            ...form,
            type: 'course'
        },
        headers: { 'Authorization': `Bearer ${getState().auth.token}` },
        method: 'POST',
        timeout: 10000,
        url: `${getState().api.url}/courses/update`
    }).then(response => {
        // Success
        // Remove and refresh token
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);

        // Prep message object
        let msgBlock = {};
        msgBlock.text = response.data.text;

        // Set messages in state
        dispatch({
            type: SET_MESSAGES,
            payload: msgBlock
        });
        // Fetch all our courses to fresh the list
        dispatch(fetchAllCourses(form.course_code));
        // Toggle loading state
        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        // Prep message object
        let msgBlock = {};

        try {
            // Remove old token
            localStorage.removeItem('token');

            // Authorization failed
            if (error.response.status === 401) {
                // Message from server
                msgBlock.text = error.response.data.text;

                // Set message in state
                dispatch({
                    type: SET_MESSAGES,
                    payload: msgBlock
                });
                // Deauth user
                dispatch({ type: DEAUTH_USER });
                // Clear student state
                dispatch({ type: CLEAR_STUDENTS });
                // Clear course state
                dispatch({ type: CLEAR_COURSES });
                // Disable load flag
                dispatch({
                    type: SET_LOAD_FLAG,
                    payload: false
                });

                return;
            }

            // Set fresh token
            localStorage.setItem('token', error.response.headers['authorization'].split(' ')[1]);

            // Check for validation messages
            if (error.response.data.validation) {
                for (let field in error.response.data.validation) {
                    msgBlock = {
                        ...msgBlock,
                        [field]: error.response.data.validation[field]
                    };
                }
            }

            // General message area
            msgBlock.text = error.response.data.text;

            // Set messages in state
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
            // Set generic error message
            msgBlock = {};
            msgBlock.text = 'Error';
            // Disable load flag
            dispatch({
                type: SET_LOAD_FLAG,
                payload: false
            });
        }
    });
};
