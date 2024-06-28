// frontend/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './session';

export default configureStore({
    reducer: {
        session: sessionReducer
    },
});
