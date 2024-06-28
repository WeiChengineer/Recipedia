// frontend/src/store/session.js
import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

const removeUser = () => ({
    type: REMOVE_USER,
});

export const login = (credential, password) => async (dispatch) => {
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({
            credential,
            password,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(setUser(data.user));
    } else {
        console.error('Login failed:', data);
    }
    return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case REMOVE_USER:
            return { ...state, user: null };
        default:
            return state;
    }
};

export default sessionReducer;
