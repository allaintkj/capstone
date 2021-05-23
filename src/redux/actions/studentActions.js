import axios from 'axios';

import {
    CLEAR_COURSES,
    CLEAR_MESSAGES,
    CLEAR_STUDENTS,
    DEAUTH_USER,
    SET_LOAD_FLAG,
    SET_MESSAGES,
    SET_STUDENT,
    SET_STUDENTS
} from './types';

export const fetchAllStudents = (nscc_id = '') => (dispatch, getState) => {
    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });
    // Clear error/validation messages
    dispatch({ type: CLEAR_MESSAGES });
    // Clear student state
    dispatch({ type: CLEAR_STUDENTS });

    // Request all students
    axios({
        headers: { 'Authorization': `Bearer ${getState().auth.token}` },
        method: 'GET',
        timeout: 10000,
        url: `${getState().api.url}/students/all`
    }).then(response => {
        // Success
        // Update token
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);
        
        // Set the entire list of students in state
        dispatch({
            type: SET_STUDENTS,
            payload: response.data.students.map(student => {
                // Make sure dates are a valid format for the form to read
                student.start_date = student.start_date > 1 ? new Date(student.start_date).toJSON().substring(0, 10) : '';
                student.end_date = student.end_date > 1 ? new Date(student.end_date).toJSON().substring(0, 10) : '';

                return student;
            })
        });

        // Check for provided ID
        if (nscc_id.length > 1) {
            // If there's an ID provided, set the corresponding student in state
            let activeStudent = getState().student.list.filter(student => student.nscc_id == nscc_id)[0];

            dispatch({
                type: SET_STUDENT,
                payload: activeStudent
            });
        }

        // Disable load flag
        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        // Set message from server in state
        let msgBlock = {};
        msgBlock.text = error.response.data.text;

        try {
            // Remove old token
            localStorage.removeItem('token');

            // Set messages in state
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

            // Set fresh token in storage
            localStorage.setItem('token', error.response.headers['authorization'].split(' ')[1]);

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

export const fetchStudent = nscc_id => (dispatch, getState) => {
    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });
    // Clear error/validation messages
    dispatch({ type: CLEAR_MESSAGES });

    // Request student
    axios({
        headers: { 'Authorization': `Bearer ${getState().auth.token}` },
        method: 'GET',
        timeout: 10000,
        url: `${getState().api.url}/students/${nscc_id}`
    }).then(response => {
        // Success
        // Update token
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);

        // Make sure dates are good format
        let student = response.data.student;
        student.start_date = student.start_date > 1 ? new Date(student.start_date).toJSON().substring(0, 10) : '';
        student.end_date = student.end_date > 1 ? new Date(student.end_date).toJSON().substring(0, 10) : '';

        // Set response in state
        dispatch({
            type: SET_STUDENT,
            payload: student
        });
        // Disable load flag
        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        // Set message
        let msgBlock = {};
        msgBlock.text = error.response.data.text;

        try {
            // Remove old token
            localStorage.removeItem('token');

            // Set messages in state
            dispatch({
                type: SET_MESSAGES,
                payload: msgBlock
            });

            if (error.response.status === 401) {
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

export const setNewStudent = nscc_id => (dispatch, getState) => {
    // Filter list of students
    let newStudent = getState().student.list.filter(student => student.nscc_id == nscc_id)[0];

    // Set student in state
    dispatch({
        type: SET_STUDENT,
        payload: newStudent
    });
};

export const addStudent = form => (dispatch, getState) => {
    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });
    // Clear error/validation messages
    dispatch({ type: CLEAR_MESSAGES });

    // POST form data
    axios({
        data: {
            ...form,
            type: 'student',
            active: form.active == false ? 0 : 1
        },
        headers: { 'Authorization': `Bearer ${getState().auth.token}` },
        method: 'PUT',
        timeout: 10000,
        url: `${getState().api.url}/students/add`
    }).then(response => {
        // Remove old token and refresh
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);

        // Setup messages
        let msgBlock = {};
        msgBlock.text = response.data.text;

        // Set messages in state for rendering
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
        let msgBlock = {};

        try {
            // Remove old token
            localStorage.removeItem('token');

            // Set message
            msgBlock.text = error.response.data.text;

            if (error.response.status === 401) {
                // Set error in state
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

export const updateStudent = form => (dispatch, getState) => {
    /* FIXME: Scroll to top after update */

    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });
    // Clear error/validation messages
    dispatch({ type: CLEAR_MESSAGES });

    // Convert date entries to milliseconds since epoch
    form.start_date = form.start_date ? new Date(form.start_date).getTime() : 0;
    form.end_date = form.end_date ? new Date(form.end_date).getTime() : 0;
    form.password_reset_req  = form.password_reset_req ? 1 : 0;

    // POST form data
    axios({
        data: {
            ...form,
            type: 'student',
            active: form.active == false ? 0 : 1
        },
        headers: { 'Authorization': `Bearer ${getState().auth.token}` },
        method: 'POST',
        timeout: 10000,
        url: `${getState().api.url}/students/update`
    }).then(response => {
        // Success
        // Remove and refresh token
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);

        // Create message object and set server message
        let msgBlock = {};
        msgBlock.text = response.data.text;

        // Set messages in state for renderin
        dispatch({
            type: SET_MESSAGES,
            payload: msgBlock
        });
        // Fetch all students to update our list and set the selected student in state
        dispatch(fetchAllStudents(form.nscc_id));
        // Toggle loading state
        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        let msgBlock = {};

        try {
            // Remove old token
            localStorage.removeItem('token');

            // Set message
            msgBlock.text = error.response.data.text;

            // Authorization failed
            if (error.response.status === 401) {
                // Set messages in state
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

export const deleteStudent = nscc_id => (dispatch, getState) => {
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
        url: `${getState().api.url}/students/${nscc_id}`
    }).then(response => {
        // Success
        // Remove and refresh token
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers['authorization'].split(' ')[1]);

        // Set server message
        let msgBlock = {};
        msgBlock.text = response.data.text;

        // Add message to state
        dispatch({
            type: SET_MESSAGES,
            payload: msgBlock
        });
        // Fetch all students to update our list
        dispatch(fetchAllStudents());
        // Toggle loading state
        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        let msgBlock = {};

        try {
            // Remove old token
            localStorage.removeItem('token');

            // Set message
            msgBlock.text = error.response.data.text;

            // Authorization failed
            if (error.response.status === 401) {
                // Set error in state
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

            // Set fresh token in state
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

            // Set validation in state
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
            // Set generic error
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
