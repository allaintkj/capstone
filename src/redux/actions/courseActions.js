import axios from 'axios';

import {
    SET_MESSAGES,
    CLEAR_MESSAGES,
    SET_LOAD_FLAG,
    DEAUTH_USER,
    CLEAR_STUDENTS,
    SET_COURSE,
    SET_COURSES,
    CLEAR_COURSES
} from './types';

export const fetchAllCourses = (course_code = '') => (dispatch, getState) => {
    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });

    // Empty error and validation messages
    dispatch({
        type: CLEAR_MESSAGES
    });

    // Empty course state
    dispatch({
        type: CLEAR_COURSES
    });

    // Request all courses
    axios({
        headers: { 'Authorization': `Bearer ${getState().auth.token}` },
        method: 'GET',
        timeout: 10000,
        url: `${getState().api.url}/courses/all`
    }).then(response => {
        // Update token
        localStorage.removeItem('token');
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

                // Clear students
                dispatch({
                    type: CLEAR_STUDENTS
                });

                // Clear courses
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

export const setNewCourse = course_code => (dispatch, getState) => {
    // Filter list of students
    let newCourse = getState().course.list.filter(course => course.course_code == course_code)[0];

    // Set course in state
    dispatch({
        type: SET_COURSE,
        payload: newCourse
    });
};

export const addCourse = form => (dispatch, getState) => {
    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });

    // Empty error and validation messages
    dispatch({
        type: CLEAR_MESSAGES
    });

    // POST form data
    axios({
        data: {
            ...form,
            type: 'course'
        },
        headers: { 'token': getState().auth.token },
        method: 'PUT',
        timeout: 10000,
        url: `${getState().api.url}/course/add`
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

export const updateCourse = form => (dispatch, getState) => {
    // Enable load flag
    dispatch({
        type: SET_LOAD_FLAG,
        payload: true
    });

    // Empty error and validation messages
    dispatch({
        type: CLEAR_MESSAGES
    });

    // POST form data
    axios({
        data: {
            ...form,
            type: 'course'
        },
        headers: { 'token': getState().auth.token },
        method: 'POST',
        timeout: 10000,
        url: `${getState().api.url}/course/update`
    }).then(response => {
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers.token);

        let msgBlock = {};
        msgBlock.text = response.data.text;

        dispatch({
            type: SET_MESSAGES,
            payload: msgBlock
        });

        dispatch(fetchAllCourses(form.course_code));

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

export const deleteCourse = course_code => (dispatch, getState) => {
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
        data: { course_code: course_code },
        headers: { 'token': getState().auth.token },
        method: 'DELETE',
        timeout: 10000,
        url: `${getState().api.url}/course/delete`
    }).then(response => {
        localStorage.removeItem('token');
        localStorage.setItem('token', response.headers.token);

        let msgBlock = {};
        msgBlock.text = response.data.text;

        dispatch({
            type: SET_MESSAGES,
            payload: msgBlock
        });

        dispatch(fetchAllCourses());

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
