import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/auth";
import { errorReducer } from "./reducers/error";

const userData = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : {};

const INITIL_REDUCER = {
  auth: { user: userData },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
  },
  preloadedState: INITIL_REDUCER,
});
