import { combineReducers } from 'redux';

import apiReducer from './apiReducer';
import authReducer from './authReducer';
import arrays from './arrays';
import courseReducer from './courseReducer';
import messageReducer from './messageReducer';
import misc from './misc';
import studentReducer from './studentReducer';

export default combineReducers({
    api: apiReducer,
    auth: authReducer,
    arrays: arrays,
    course: courseReducer,
    msg: messageReducer,
    misc: misc,
    student: studentReducer
});
