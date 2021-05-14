import { combineReducers } from 'redux';

import api from './apiReducer';
import auth from './authReducer';
import arrays from './arrays';
import msg from './messageReducer';
import misc from './misc';

export default combineReducers({
    api: api,
    auth: auth,
    arrays: arrays,
    msg,
    misc: misc
});
