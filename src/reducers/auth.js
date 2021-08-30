import { CLEAR_USER, SET_USER } from "../actions/types";

const initialState = {
    loading: true,
    currentUser: null
}

const authReducer = ( state = initialState, { type, payload } ) => {

    switch (type) {
        case SET_USER:
            return {
                currentUser: payload,
                loading: false
            };

        case CLEAR_USER: 
            return {
                ...state,
                loading: false
            };
    
        default:
            return state;
    }
}

export default authReducer