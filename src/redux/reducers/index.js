import { combineReducers } from 'redux';

import apiReducer from './apiReducer';
import authReducer from './authReducer';
import courseReducer from './courseReducer';
import messageReducer from './messageReducer';
import studentReducer from './studentReducer';

export default combineReducers({
    api: apiReducer,
    auth: authReducer,
    course: courseReducer,
    msg: messageReducer,
    student: studentReducer
});
