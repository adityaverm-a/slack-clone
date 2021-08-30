import { SET_CURRENT_CHANNEL, SET_PRIVATE_CHANNEL, SET_USER_POSTS } from "./types";

export const setCurrentChannel = (channel) => ({ type: SET_CURRENT_CHANNEL, payload: channel });

export const setPrivateChannel = (isPrivateChannel) => ({ type: SET_PRIVATE_CHANNEL, payload: isPrivateChannel });

export const setUserPosts = (userPosts) => ({ type: SET_USER_POSTS, payload: userPosts });