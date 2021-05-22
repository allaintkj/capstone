import { combineReducers } from 'redux';

import apiReducer from './apiReducer';
import authReducer from './authReducer';
import courseReducer from './courseReducer';
import messageReducer from './messageReducer';
import progressReducer from './progressReducer';
import studentReducer from './studentReducer';

export default combineReducers({
    api: apiReducer,
    auth: authReducer,
    course: courseReducer,
    msg: messageReducer,
    progress: progressReducer,
    student: studentReducer
});
