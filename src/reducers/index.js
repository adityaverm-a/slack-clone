import { combineReducers } from "redux";
import auth from './auth';
import channel from './channel';

export default combineReducers({
    auth,
    channel,
});