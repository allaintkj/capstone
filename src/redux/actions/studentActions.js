import axios from 'axios';

import {
    SET_MESSAGES,
    CLEAR_MESSAGES,
    SET_LOAD_FLAG,
    SET_STUDENT,
    SET_STUDENTS,
    CLEAR_STUDENTS,
    DEAUTH_USER,
    CLEAR_COURSES
} from './types';

export const fetchAllStudents = (nscc_id = '') => (dispatch, getState) => {
    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });

    // Clear error/validation messages
    dispatch({
        type: CLEAR_MESSAGES
    });

    // Clear student state
    dispatch({
        type: CLEAR_STUDENTS
    });

    // Request all students
    axios({
        headers: { 'token': getState().auth.token },
        method: 'GET',
        timeout: 10000,
        url: `${getState().api.url}/students/all`
    }).then(response => {
        // Update token
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers.token);
        
        // Set the entire list of students in state
        dispatch({
            type: SET_STUDENTS,
            payload: response.data.students
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

            localStorage.setItem('token', error.response.headers.token);

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

export const fetchStudent = nscc_id => (dispatch, getState) => {
    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });

    // Clear error/validation messages
    dispatch({
        type: CLEAR_MESSAGES
    });

    // Request student
    axios({
        headers: { 'token': getState().auth.token },
        method: 'GET',
        timeout: 10000,
        url: `${getState().api.url}/students/${nscc_id}`
    }).then(response => {
        // Update token
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers.token);

        // Set response in state
        dispatch({
            type: SET_STUDENT,
            payload: response.data.student
        });

        // Disable load flag
        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
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

                // Clear student state
                dispatch({
                    type: CLEAR_STUDENTS
                });

                // Clear course state
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

            localStorage.setItem('token', error.response.headers.token);

            let msgBlock = {};
            msgBlock.text = error.response.data.text;

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
    dispatch({
        type: CLEAR_MESSAGES
    });

    // POST form data
    axios({
        data: {
            ...form,
            type: 'student',
            active: form.active == false ? 0 : 1
        },
        headers: { 'token': getState().auth.token },
        method: 'PUT',
        timeout: 10000,
        url: `${getState().api.url}/student/add`
    }).then(response => {
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers.token);

        let msgBlock = {};
        msgBlock.text = response.data.text;

        dispatch({
            type: SET_MESSAGES,
            payload: msgBlock
        });

        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        let msgBlock = {};

        try {
            localStorage.removeItem('token');
            localStorage.setItem('token', error.response.headers.token);

            if (error.response.status === 401) {
                // Set message
                msgBlock.text = error.response.data.text;

                dispatch({
                    type: SET_MESSAGES,
                    payload: msgBlock
                });

                // Deauth user
                dispatch({
                    type: DEAUTH_USER
                });

                // Clear student state
                dispatch({
                    type: CLEAR_STUDENTS
                });

                // Clear course state
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

            if (error.response.data.validation) {
                for (let field in error.response.data.validation) {
                    msgBlock = {
                        ...msgBlock,
                        [field]: error.response.data.validation[field]
                    };
                }
            }

            msgBlock.text = error.response.data.text;

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
    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });

    // Clear error/validation messages
    dispatch({
        type: CLEAR_MESSAGES
    });

    // POST form data
    axios({
        data: {
            ...form,
            type: 'student',
            active: form.active == false ? 0 : 1
        },
        headers: { 'token': getState().auth.token },
        method: 'POST',
        timeout: 10000,
        url: `${getState().api.url}/student/update`
    }).then(response => {
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers.token);

        let msgBlock = {};
        msgBlock.text = response.data.text;

        dispatch({
            type: SET_MESSAGES,
            payload: msgBlock
        });

        dispatch(fetchAllStudents(form.nscc_id));

        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        let msgBlock = {};

        try {
            localStorage.removeItem('token');
            localStorage.setItem('token', error.response.headers.token);

            if (error.response.status === 401) {
                // Set message
                msgBlock.text = error.response.data.text;

                dispatch({
                    type: SET_MESSAGES,
                    payload: msgBlock
                });

                // Deauth user
                dispatch({
                    type: DEAUTH_USER
                });

                // Clear student state
                dispatch({
                    type: CLEAR_STUDENTS
                });

                // Clear course state
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

            if (error.response.data.validation) {
                for (let field in error.response.data.validation) {
                    msgBlock = {
                        ...msgBlock,
                        [field]: error.response.data.validation[field]
                    };
                }
            }

            msgBlock.text = error.response.data.text;

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
    dispatch({
        type: CLEAR_MESSAGES
    });

    // POST form data
    axios({
        data: { nscc_id: nscc_id },
        headers: { 'token': getState().auth.token },
        method: 'DELETE',
        timeout: 10000,
        url: `${getState().api.url}/student/delete`
    }).then(response => {
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers.token);

        let msgBlock = {};
        msgBlock.text = response.data.text;

        dispatch({
            type: SET_MESSAGES,
            payload: msgBlock
        });

        dispatch(fetchAllStudents());

        dispatch({
            type: SET_LOAD_FLAG,
            payload: false
        });
    }).catch(error => {
        let msgBlock = {};

        try {
            localStorage.removeItem('token');
            localStorage.setItem('token', error.response.headers.token);

            if (error.response.status === 401) {
                // Set message
                msgBlock.text = error.response.data.text;

                dispatch({
                    type: SET_MESSAGES,
                    payload: msgBlock
                });

                // Deauth user
                dispatch({
                    type: DEAUTH_USER
                });

                // Clear student state
                dispatch({
                    type: CLEAR_STUDENTS
                });

                // Clear course state
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

            if (error.response.data.validation) {
                for (let field in error.response.data.validation) {
                    msgBlock = {
                        ...msgBlock,
                        [field]: error.response.data.validation[field]
                    };
                }
            }

            msgBlock.text = error.response.data.text;

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
