import { combineReducers } from "redux";

import alert from "./alert";
import product from './product'
const sessionReducer = ( state = false, action ) => {
    switch ( action.type ) {
        case "INITIALIZE_SESSION":
            return true;
        default: return state;
    }
};

const appReducers = combineReducers({
    sessionReducer,
    alert,
    product
});

const rootReducer = (state, action) => {
    return appReducers(state, action);
}

export default rootReducer;