import { SET_CURRENT_CHANNEL, SET_PRIVATE_CHANNEL, SET_USER_POSTS } from "../actions/types";

const initialState = {
    userPosts: null,
    currentChannel: null,
    isPrivateChannel: false,
}

const channelReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: payload
            };

        case SET_PRIVATE_CHANNEL: 
            return {
                ...state,
                isPrivateChannel: payload
            };

        case SET_USER_POSTS: 
            return {
                ...state,
                userPosts: payload
            };
    
        default:
            return state;
    }
}

export default channelReducer;