import { configureStore } from "@reduxjs/toolkit";

import homeSlice from "./homeSlice";
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        home: homeSlice,
        auth: authReducer,
    },
});
