import { combineReducers } from 'redux';

import arrays from './arrays';
import misc from './misc';

export default combineReducers({
    arrays: arrays,
    misc: misc
});
