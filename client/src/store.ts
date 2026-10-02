import { configureStore } from "@reduxjs/toolkit";
import mysteryReducer from "./features/mystery/mysterySlice";

export const store = configureStore({
  reducer: {
    mystery: mysteryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
